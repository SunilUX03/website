"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  const members = parseRepeatable(formData, "members", ["name", "title", "isPlaceholder"]).map((row) => ({
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

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "board-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "board-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "board-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Governing Board", `${action} the Governing Board`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/board");
}
