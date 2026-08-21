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
    headlineCycleWords: parseRepeatable(formData, "headlineCycleWords", ["word", "taWord"]) as { word: string; taWord: string }[],
    tagline: str(formData, "tagline"),
  };
}

// `withId` re-attaches the row id Payload just assigned on the EN write
// (enWords, same order) to each Tamil row. Array rows share one id across
// locales — submitting a Tamil-locale array update WITHOUT that id makes
// Payload treat every row as brand new, silently deleting the English
// locale data that lived on the old row. Always save EN first, then pass
// its resulting headlineCycleWords in here before saving TA.
function buildTaData(formData: FormData, words: { word: string; taWord: string }[], enWords: { id?: string | null }[]) {
  return {
    headlineTemplate: str(formData, "headlineTemplateTa"),
    headlineCycleWords: words.map((w, i) => {
      const id = enWords[i]?.id;
      return id ? { id, word: w.taWord } : { word: w.taWord };
    }),
    tagline: str(formData, "taglineTa"),
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

  let enResult;
  if (intent === "publish") {
    enResult = await payload.updateGlobal({ slug: "hero-content", data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    enResult = await payload.updateGlobal({ slug: "hero-content", data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    enResult = await payload.updateGlobal({ slug: "hero-content", data, draft: true, overrideAccess: true });
  }

  const taData = buildTaData(formData, data.headlineCycleWords, enResult.headlineCycleWords ?? []);
  if (intent === "publish") {
    await payload.updateGlobal({ slug: "hero-content", locale: "ta", data: taData, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "hero-content", locale: "ta", data: taData, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "hero-content", locale: "ta", data: taData, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Homepage Hero", `${action} the homepage Hero`);
  revalidatePath("/", "layout");
  redirect("/cms/settings/hero?saved=1");
}
