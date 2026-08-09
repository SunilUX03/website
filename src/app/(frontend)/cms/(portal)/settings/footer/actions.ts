"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    description: str(formData, "description"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    socialLinks: parseRepeatable(formData, "socialLinks", ["label", "href"]) as {
      label: "Facebook" | "X" | "YouTube" | "Instagram" | "LinkedIn";
      href: string;
    }[],
    quickLinks: parseRepeatable(formData, "quickLinks", ["label", "href"]) as { label: string; href: string }[],
    citizenServices: parseRepeatable(formData, "citizenServices", ["label", "href"]) as { label: string; href: string }[],
    helpSupport: parseRepeatable(formData, "helpSupport", ["label", "href"]) as { label: string; href: string }[],
  };
}

export async function updateFooterContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "footer-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "footer-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "footer-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Footer", `${action} the site footer`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/footer");
}
