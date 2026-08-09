"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  const hierarchyRows = parseRepeatable(formData, "hierarchy", ["label", "emphasized"]);
  const visionMissionRows = parseRepeatable(formData, "visionMission", ["label", "title", "description"]);
  const socialRows = parseRepeatable(formData, "connectSocial", ["label", "href"]);

  return {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      headline: str(formData, "heroHeadline"),
      description: str(formData, "heroDescription"),
    },
    whoWeAre: {
      heading: str(formData, "whoWeAreHeading"),
      paragraph: str(formData, "whoWeAreParagraph"),
    },
    hierarchy: hierarchyRows.map((r) => ({ label: r.label, emphasized: r.emphasized === "true" })),
    visionMission: visionMissionRows.map((r) => ({ label: r.label, title: r.title, description: r.description })),
    connectWithUs: {
      email: str(formData, "connectEmail"),
      social: socialRows.map((r) => ({ label: r.label, href: r.href })),
    },
  };
}

export async function updateAboutPageContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "about-page-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "about-page-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "about-page-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "About Page", `${action} the About page content`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/about");
}
