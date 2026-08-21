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

function buildHeroTa(formData: FormData, key: string) {
  return {
    eyebrow: str(formData, `${key}EyebrowTa`),
    heading: str(formData, `${key}HeadingTa`),
    body: str(formData, `${key}BodyTa`),
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

// `enPanels` is Payload's just-saved EN result — reachUsPanels rows share
// one id across locales, so a Tamil-locale array update without that id
// makes Payload treat every row as brand new, silently deleting the
// English locale data on the old row. Always save EN first, then pass its
// resulting reachUsPanels in here before saving TA.
function buildTaData(formData: FormData, enPanels: { id?: string | null }[]) {
  const data: Record<string, unknown> = {};
  for (const key of HERO_KEYS) {
    data[key] = buildHeroTa(formData, key);
  }
  data.reachUsPanels = [0, 1].map((i) => {
    const row = {
      eyebrow: str(formData, `panel${i}EyebrowTa`),
      title: str(formData, `panel${i}TitleTa`),
      description: str(formData, `panel${i}DescriptionTa`),
      ctaLabel: str(formData, `panel${i}CtaLabelTa`),
    };
    const id = enPanels[i]?.id;
    return id ? { id, ...row } : row;
  });
  return data;
}

export async function updateSiteCopy(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = buildData(formData);
  const intent = formData.get("intent");

  let enResult;
  if (intent === "publish") {
    enResult = await payload.updateGlobal({ slug: "site-copy-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    enResult = await payload.updateGlobal({ slug: "site-copy-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    enResult = await payload.updateGlobal({ slug: "site-copy-content", data, draft: true, overrideAccess: true });
  }

  const taData = buildTaData(formData, enResult.reachUsPanels ?? []);
  if (intent === "publish") {
    await payload.updateGlobal({ slug: "site-copy-content", locale: "ta", data: taData, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "site-copy-content", locale: "ta", data: taData, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "site-copy-content", locale: "ta", data: taData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Other Page Copy", `${action} the Notifications/Services hero copy and homepage panels`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/site-copy?saved=1");
}
