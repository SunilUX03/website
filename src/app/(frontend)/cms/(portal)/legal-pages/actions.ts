"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    slug: str(formData, "slug") as
      | "privacy-policy"
      | "terms-conditions"
      | "terms-of-use"
      | "disclaimer"
      | "help"
      | "feedback",
    title: str(formData, "title"),
    eyebrow: str(formData, "eyebrow") || "Legal",
    intro: optionalStr(formData, "intro"),
    sections: parseRepeatable(formData, "sections", ["heading", "body"]) as { heading: string; body: string }[],
  };
}

export async function updateLegalPage(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "legal-pages", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "legal-pages", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "legal-pages", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Legal Pages", `${action} "${data.title}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/legal-pages/${id}/edit?saved=1`);
}
