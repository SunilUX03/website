"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    govLabel: str(formData, "govLabel"),
    about: parseRepeatable(formData, "about", ["label", "href"]) as { label: string; href: string }[],
    services: parseRepeatable(formData, "services", ["label", "href"]) as { label: string; href: string }[],
    notificationsUpdates: parseRepeatable(formData, "notificationsUpdates", ["label", "href"]) as { label: string; href: string }[],
    notificationsDocuments: parseRepeatable(formData, "notificationsDocuments", ["label", "href"]) as { label: string; href: string }[],
  };
}

export async function updateNavContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "nav-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "nav-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "nav-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Site Navigation", `${action} the header navigation`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/nav");
}
