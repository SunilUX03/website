"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";

function buildData(formData: FormData) {
  return {
    agencyLabelCycle: parseRepeatable(formData, "agencyLabelCycle", ["text"]) as { text: string }[],
    headlineTemplate: str(formData, "headlineTemplate"),
    headlineCycleWords: parseRepeatable(formData, "headlineCycleWords", ["word"]) as { word: string }[],
    tagline: str(formData, "tagline"),
  };
}

export async function updateHeroContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (!data.headlineTemplate.includes("{word}")) {
    redirect(`/cms/settings/hero?error=${encodeURIComponent('The headline must contain the placeholder "{word}" exactly once.')}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "hero-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "hero-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "hero-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Homepage Hero", `${action} the homepage Hero`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/hero");
}
