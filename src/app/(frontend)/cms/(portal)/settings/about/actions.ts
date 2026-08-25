"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { parseRepeatable, str } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

// `id: string` on hierarchy/visionMission rows below is a Payload internal
// detail: those array fields' `label`/`title`/`description` subfields are
// localized, keyed off each row's own database id, not its position — a
// row resubmitted without that id gets treated as brand new, and Payload
// replaces the array wholesale, silently deleting the *other* locale's
// translation for every row. AboutPageForm/RepeatableRows round-trip it
// via a hidden input.
function buildData(formData: FormData, locale: "en" | "ta") {
  const hierarchyRows = parseRepeatable(formData, "hierarchy", ["label", "emphasized"]);
  const visionMissionRows = parseRepeatable(formData, "visionMission", ["label", "title", "description"]);

  const data: Record<string, unknown> = {
    hero: {
      eyebrow: str(formData, "heroEyebrow"),
      headline: str(formData, "heroHeadline"),
      description: str(formData, "heroDescription"),
    },
    whoWeAre: {
      heading: str(formData, "whoWeAreHeading"),
      paragraph: str(formData, "whoWeAreParagraph"),
    },
    // `emphasized` isn't localized, but it's a sibling of a localized field
    // (`label`) within the same array row — AboutPageForm keeps it visible
    // and editable on both the English and Tamil tabs (a shared checkbox,
    // not a separate Tamil value), so it's always present in the submitted
    // FormData and safe to include unconditionally here.
    hierarchy: hierarchyRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), label: r.label, emphasized: r.emphasized === "true" })),
    visionMission: visionMissionRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), label: r.label, title: r.title, description: r.description })),
    orgChartSection: { eyebrow: str(formData, "orgChartEyebrow"), heading: str(formData, "orgChartHeading") },
    leadershipSection: { eyebrow: str(formData, "leadershipEyebrow"), heading: str(formData, "leadershipHeading") },
    boardSection: { eyebrow: str(formData, "boardEyebrow"), heading: str(formData, "boardHeading") },
    awardsSection: { eyebrow: str(formData, "awardsEyebrow"), heading: str(formData, "awardsHeading") },
    rollOfHonourSection: { eyebrow: str(formData, "rollOfHonourEyebrow"), heading: str(formData, "rollOfHonourHeading") },
  };

  // connectWithUs (email + social links) is entirely non-localized — the
  // form only renders it, and only submits its fields, on the English tab.
  // On a Tamil save it's omitted from `data` entirely (rather than sent as
  // blank) so the single shared value already saved under English is left
  // untouched — same reasoning as footer's phone/email/socialLinks.
  if (locale === "en") {
    const socialRows = parseRepeatable(formData, "connectSocial", ["label", "href"]);
    data.connectWithUs = {
      email: str(formData, "connectEmail"),
      social: socialRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), label: r.label, href: r.href })),
    };
  }

  return data;
}

export async function updateAboutPageContent(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const locale = formData.get("locale") === "ta" ? "ta" : "en";
  const data = buildData(formData, locale);
  const intent = formData.get("intent");

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findGlobal({ slug: "about-page-content", depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/settings/about?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.updateGlobal({ slug: "about-page-content", locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.updateGlobal({ slug: "about-page-content", locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.updateGlobal({ slug: "about-page-content", locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "About Page", `${action} the About page content`);
  revalidatePath("/", "layout");
  redirect(`/cms/settings/about?locale=${locale}&saved=1`);
}
