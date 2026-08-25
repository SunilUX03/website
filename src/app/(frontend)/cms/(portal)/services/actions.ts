"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile, resolveUploadValue } from "@/lib/portal/upload";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";
import { isStale, STALE_CONTENT_MESSAGE } from "@/lib/portal/staleness";

const PRODUCT_TOUR_SLOTS = [0, 1, 2, 3];

async function buildProductTour(formData: FormData, fallbackAlt: string) {
  const slots = await Promise.all(
    PRODUCT_TOUR_SLOTS.map(async (i) => {
      const file = formData.get(`productTour.${i}.photo`) as File | null;
      const existingId = optionalStr(formData, `productTour.${i}.photoId`);
      const removed = formData.get(`productTour.${i}.photoRemoved`) === "1";
      const alt = str(formData, `productTour.${i}.alt`);
      // The array row's own id (preserves this row's Tamil `alt` across a
      // save) — distinct from `photoId` above, which is the *uploaded
      // media asset's* id, a different Payload doc entirely.
      const rowId = optionalStr(formData, `productTour.${i}.id`);
      const newId = await uploadFile("media", file, alt || fallbackAlt);
      const photoId = newId ?? (removed ? undefined : existingId ? Number(existingId) : undefined);
      if (!photoId) return null;
      return { ...(rowId ? { id: rowId } : {}), photo: photoId, alt: alt || fallbackAlt };
    })
  );
  return slots.filter((s): s is { id?: string; photo: number; alt: string } => s !== null);
}

async function buildData(formData: FormData) {
  const name = str(formData, "name");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, name);
  const imageValue = resolveUploadValue(formData, "image", imageId);
  // No longer an admin-facing choice ("Shown under" was removed from the
  // form — every item in this collection is an Initiatives & Projects
  // entry now that Citizen Services and Services to Government have
  // their own dedicated collections/fields). Still written on every save
  // since service-detail-generator.ts's stock-photo/label fallback keys
  // off it when `real` content is empty — a fixed value keeps that
  // fallback working without exposing a meaningless choice to admins.
  const sections: ("citizen-services" | "e-governance-projects" | "services")[] = ["e-governance-projects"];

  // Kept as full row objects (not collapsed to plain strings) all the way
  // through so each row's `id` — and, for keyFeatureRows, its paired
  // `descId` — survives into the Payload data below. See RepeatableRows.tsx
  // for why: losing a row's id makes Payload treat it as brand new and
  // wipes that field's Tamil translation on save.
  const statisticsRows = parseRepeatable(formData, "statistics", ["value"]);
  const keyFeatureRows = parseRepeatable(formData, "keyFeatures", ["value", "description", "descId"]);
  const eligibilityRows = parseRepeatable(formData, "eligibility", ["value"]);
  const whatYoullNeedRows = parseRepeatable(formData, "whatYoullNeed", ["value"]);
  const faqs = parseRepeatable(formData, "faqs", ["q", "a"]) as { id?: string; q: string; a: string }[];
  const faqsMore = parseRepeatable(formData, "faqsMore", ["q", "a"]) as { id?: string; q: string; a: string }[];
  const getStartedSteps = parseRepeatable(formData, "getStartedSteps", ["title", "description"]) as {
    id?: string;
    title: string;
    description: string;
  }[];
  const aboutLinkModalItemRows = parseRepeatable(formData, "aboutLinkModalItems", ["value"]);
  const productTour = await buildProductTour(formData, name);

  const tagline = optionalStr(formData, "tagline");
  const aboutSecondParagraph = optionalStr(formData, "aboutSecondParagraph");
  const calloutText = optionalStr(formData, "calloutText");
  const getStartedIntro = optionalStr(formData, "getStartedIntro");
  const getStartedOutro = optionalStr(formData, "getStartedOutro");
  const directLinkLabel = optionalStr(formData, "directLinkLabel");
  const directLinkPortalLabel = optionalStr(formData, "directLinkPortalLabel");
  const ctaLabel = optionalStr(formData, "ctaLabel");
  const aboutLinkModalLabel = optionalStr(formData, "aboutLinkModalLabel");
  const aboutLinkModalTitle = optionalStr(formData, "aboutLinkModalTitle");
  const contactEmail = optionalStr(formData, "contactEmail");
  const contactPhone = optionalStr(formData, "contactPhone");
  const aboutEyebrow = optionalStr(formData, "aboutEyebrow");
  const aboutHeading = optionalStr(formData, "aboutHeading");
  const featuresEyebrow = optionalStr(formData, "featuresEyebrow");
  const featuresHeading = optionalStr(formData, "featuresHeading");
  const productTourHeading = optionalStr(formData, "productTourHeading");
  const eligibilityEyebrow = optionalStr(formData, "eligibilityEyebrow");
  const eligibilityHeading = optionalStr(formData, "eligibilityHeading");
  const eligibilityWhoHeading = optionalStr(formData, "eligibilityWhoHeading");
  const eligibilityDocsHeading = optionalStr(formData, "eligibilityDocsHeading");
  const getStartedEyebrow = optionalStr(formData, "getStartedEyebrow");
  const getStartedHeading = optionalStr(formData, "getStartedHeading");
  const faqEyebrow = optionalStr(formData, "faqEyebrow");
  const faqHeading = optionalStr(formData, "faqHeading");

  return {
    name,
    slug: "",
    description: str(formData, "description"),
    stats: str(formData, "stats"),
    accessPortalHref: optionalStr(formData, "accessPortalHref"),
    sections,
    ...(imageValue !== undefined ? { image: imageValue } : {}),
    // `real` is a single Payload field — every save replaces it wholesale,
    // so every sub-field the form knows about must be included here every
    // time, not just the ones that happen to be non-empty this round.
    // Omitting any of them (as the previous version of this function did
    // for Get Started, Product Tour, aboutLinkModal, etc.) would silently
    // delete that content from any doc that already had it. Always
    // included now (not conditional on hasRealContent) since typeLabel
    // inside it is a required field on every save.
    real: {
      tagline,
      aboutEyebrow,
      aboutHeading,
      aboutSecondParagraph,
      hideAboutSecondParagraph: formData.get("hideAboutSecondParagraph") === "on",
      calloutText,
      statistics: statisticsRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: r.value })),
      keyFeatures: keyFeatureRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: r.value })),
      keyFeatureDescriptions: keyFeatureRows.map((r) => ({ ...(r.descId ? { id: r.descId } : {}), value: r.description ?? "" })),
      featuresEyebrow,
      featuresHeading,
      hideFeaturesSection: formData.get("hideFeaturesSection") === "on",
      aboutLinkModal:
        aboutLinkModalLabel || aboutLinkModalTitle || aboutLinkModalItemRows.length > 0
          ? {
              label: aboutLinkModalLabel,
              title: aboutLinkModalTitle,
              items: aboutLinkModalItemRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: r.value })),
            }
          : undefined,
      productTour,
      productTourHeading,
      hideProductTourSection: formData.get("hideProductTourSection") === "on",
      eligibility: eligibilityRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: r.value })),
      whatYoullNeed: whatYoullNeedRows.map((r) => ({ ...(r.id ? { id: r.id } : {}), value: r.value })),
      eligibilityEyebrow,
      eligibilityHeading,
      eligibilityWhoHeading,
      eligibilityDocsHeading,
      hideEligibilitySection: formData.get("hideEligibilitySection") === "on",
      getStartedIntro,
      getStartedSteps,
      suppressGetStartedSteps: formData.get("suppressGetStartedSteps") === "on",
      getStartedOutro,
      directLinkLabel,
      directLinkPortalLabel,
      getStartedEyebrow,
      getStartedHeading,
      hideGetStartedSection: formData.get("hideGetStartedSection") === "on",
      faqs,
      faqsMore,
      faqEyebrow,
      faqHeading,
      hideFaqSection: formData.get("hideFaqSection") === "on",
      comingSoon: formData.get("comingSoon") === "on",
      gatedAccess: formData.get("gatedAccess") === "on",
      ctaLabel,
      // The <select> is HTML `required`, so a normal browser submit
      // always carries a value here; Payload's own required-field
      // validation is the final backstop if it somehow doesn't.
      typeLabel: str(formData, "typeLabel") as "Project" | "Initiative",
      contact: contactEmail || contactPhone ? { email: contactEmail, phone: contactPhone } : undefined,
    },
  };
}

export async function createService(formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  if (!data.image) {
    redirect(`/cms/services/new?error=${encodeURIComponent("A photo is required.")}`);
  }
  const { image, ...rest } = data;

  // New services land at the end of the list — reorder with the arrows
  // on /cms/services afterward if it should appear earlier.
  const { docs: existing } = await payload.find({
    collection: "services",
    sort: "-order",
    limit: 1,
    depth: 0,
    select: { order: true },
    overrideAccess: true,
  });
  const order = (existing[0]?.order ?? -1) + 1;

  const doc = publish
    ? await payload.create({ collection: "services", data: { ...rest, image, order, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "services", data: { ...rest, image, order, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Services", `Created "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/services/${doc.id}/edit?saved=1`);
}

export async function updateService(id: number, formData: FormData) {
  const user = await requireSession();
  const payload = await getPayloadClient();
  // buildData() sets slug: "" — correct for createService (empty slug
  // falls through to name-derivation for a brand-new item), but here it
  // silently re-derived the slug from the current name on every save, in
  // a form with no slug field the admin can see or control. That broke a
  // published item's URL (and everywhere else on the site that links to
  // it by that slug) just from an unrelated edit like swapping a photo —
  // `slug` is excluded from the update so it only ever changes when an
  // admin explicitly retypes it (not available in this form today).
  const { slug: _slug, ...data } = await buildData(formData);
  const intent = formData.get("intent");
  const locale = formData.get("locale") === "ta" ? "ta" : "en";

  // Catches a save built from a stale page load (e.g. a locale tab left
  // open since before someone else's edit) before it can silently
  // overwrite whatever changed in the meantime — see staleness.ts.
  const current = await payload.findByID({ collection: "services", id, depth: 0, draft: true, overrideAccess: true });
  if (isStale(current.updatedAt, formData.get("_loadedUpdatedAt") as string | null)) {
    redirect(`/cms/services/${id}/edit?locale=${locale}&error=${encodeURIComponent(STALE_CONTENT_MESSAGE)}`);
  }

  if (intent === "publish") {
    await payload.update({ collection: "services", id, locale, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "services", id, locale, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "services", id, locale, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Services", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/services/${id}/edit?locale=${locale}&saved=1`);
}

export async function deleteService(id: number, name: string) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "services", id, overrideAccess: true });
  await logActivity(user, "deleted", "Services", `Deleted "${name}"`);
  revalidatePath("/", "layout");
  redirect("/cms/services");
}

// `orderedIds` is the full list's ids in the admin's new drag order — every
// doc gets its `order` set to its index in that list, mirroring the
// per-doc draft/published branch `moveService` used to need for a single
// swap (a doc's own status decides which version this write lands on).
export async function reorderServices(orderedIds: number[]) {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "services",
    limit: 200,
    depth: 0,
    select: { _status: true },
    draft: true,
    overrideAccess: true,
  });
  const statusById = new Map(docs.map((d) => [d.id, d._status]));

  await Promise.all(
    orderedIds.map((id, order) =>
      statusById.get(id) === "draft"
        ? payload.update({ collection: "services", id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "services", id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/cms/services");
}
