"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { str } from "@/lib/portal/form-utils";

const HERO_KEYS = ["announcementsHero", "governmentOrdersHero", "policiesHero", "mediaHero", "servicesHero"] as const;

function buildHero(formData: FormData, key: string) {
  return {
    eyebrow: str(formData, `${key}Eyebrow`),
    heading: str(formData, `${key}Heading`),
    body: str(formData, `${key}Body`),
  };
}

function buildData(formData: FormData) {
  const data: Record<string, unknown> = {};
  for (const key of HERO_KEYS) {
    data[key] = buildHero(formData, key);
  }
  data.reachUsPanels = [0, 1].map((i) => ({
    eyebrow: str(formData, `panel${i}Eyebrow`),
    title: str(formData, `panel${i}Title`),
    description: str(formData, `panel${i}Description`),
    ctaLabel: str(formData, `panel${i}CtaLabel`),
  }));
  return data;
}

export async function updateSiteCopy(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "site-copy-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "site-copy-content", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "site-copy-content", data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Other Page Copy", `${action} the Notifications/Services hero copy and homepage panels`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/site-copy");
}
