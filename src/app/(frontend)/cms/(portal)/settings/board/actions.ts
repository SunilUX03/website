"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// Every row's own `id` is a Payload internal detail worth noting: the
// members array's `name`/`title` are localized, keyed off each row's own
// database id, not its position — a row resubmitted without that id gets
// treated as brand new, and Payload replaces the array wholesale, silently
// deleting the *other* locale's translation for every row. BoardContentForm
// and RepeatableRows round-trip it via a hidden input. `isPlaceholder`
// isn't localized, but BoardContentForm keeps it visible and editable on
// both the English and Tamil tabs (a shared checkbox, not a separate Tamil
// value), so it's always present in the submitted FormData.
function buildData(formData: FormData) {
  const members = parseRepeatable(formData, "members", ["name", "title", "isPlaceholder"]).map((row) => ({
    ...(row.id ? { id: row.id } : {}),
    name: row.name,
    title: row.title,
    isPlaceholder: row.isPlaceholder === "on",
  }));

  return {
    chairman: {
      role: str(formData, "chairmanRole"),
      name: str(formData, "chairmanName"),
      title: str(formData, "chairmanTitle"),
    },
    memberSecretary: {
      role: str(formData, "memberSecretaryRole"),
      name: str(formData, "memberSecretaryName"),
      title: str(formData, "memberSecretaryTitle"),
    },
    members,
  };
}

export async function updateBoardContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "board-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/board?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "board-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "board-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "board-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Governing Board", `${action} the Governing Board`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/board?locale=${locale}&saved=1`);
}
