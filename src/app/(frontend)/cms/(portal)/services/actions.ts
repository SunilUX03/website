"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";

const PRODUCT_TOUR_SLOTS = [0, 1, 2, 3];

async function buildProductTour(formData: FormData, fallbackAlt: string) {
  const slots = await Promise.all(
    PRODUCT_TOUR_SLOTS.map(async (i) => {
      const file = formData.get(`productTour.${i}.photo`) as File | null;
      const existingId = optionalStr(formData, `productTour.${i}.photoId`);
      const alt = str(formData, `productTour.${i}.alt`);
      const newId = await uploadFile("media", file, alt || fallbackAlt);
      const photoId = newId ?? (existingId ? Number(existingId) : undefined);
      if (!photoId) return null;
      return { photo: photoId, alt: alt || fallbackAlt };
    })
  );
  return slots.filter((s): s is { photo: number; alt: string } => s !== null);
}

async function buildData(formData: FormData) {
  const name = str(formData, "name");
  const imageFile = formData.get("image") as File | null;
  const imageId = await uploadFile("media", imageFile, name);
  const sections = formData.getAll("sections").map(String) as (
    | "citizen-services"
    | "e-governance-projects"
    | "services"
  )[];

  const statistics = parseRepeatable(formData, "statistics", ["value"]).map((r) => r.value);
  const keyFeatureRows = parseRepeatable(formData, "keyFeatures", ["value", "description"]);
  const keyFeatures = keyFeatureRows.map((r) => r.value);
  const keyFeatureDescriptions = keyFeatureRows.map((r) => r.description ?? "");
  const eligibility = parseRepeatable(formData, "eligibility", ["value"]).map((r) => r.value);
  const whatYoullNeed = parseRepeatable(formData, "whatYoullNeed", ["value"]).map((r) => r.value);
  const faqs = parseRepeatable(formData, "faqs", ["q", "a"]) as { q: string; a: string }[];
  const faqsMore = parseRepeatable(formData, "faqsMore", ["q", "a"]) as { q: string; a: string }[];
  const getStartedSteps = parseRepeatable(formData, "getStartedSteps", ["title", "description"]) as {
    title: string;
    description: string;
  }[];
  const aboutLinkModalItems = parseRepeatable(formData, "aboutLinkModalItems", ["value"]).map((r) => r.value);
  const productTour = await buildProductTour(formData, name);

  const tagline = optionalStr(formData, "tagline");
  const aboutSecondParagraph = optionalStr(formData, "aboutSecondParagraph");
  const calloutText = optionalStr(formData, "calloutText");
  const productTourCaption = optionalStr(formData, "productTourCaption");
  const getStartedIntro = optionalStr(formData, "getStartedIntro");
  const getStartedOutro = optionalStr(formData, "getStartedOutro");
  const directLinkLabel = optionalStr(formData, "directLinkLabel");
  const ctaLabel = optionalStr(formData, "ctaLabel");
  const ctaHref = optionalStr(formData, "ctaHref");
  const relatedCardStats = optionalStr(formData, "relatedCardStats");
  const aboutLinkModalLabel = optionalStr(formData, "aboutLinkModalLabel");
  const aboutLinkModalTitle = optionalStr(formData, "aboutLinkModalTitle");
  const contactEmail = optionalStr(formData, "contactEmail");
  const contactPhone = optionalStr(formData, "contactPhone");

  // Broader than the original 5-field check (which missed e.g. a doc
  // where only Get Started or Product Tour had been filled in) — any
  // touched real.* field means this item has real submitted content and
  // service-detail-generator.ts's generated-fallback branch should NOT
  // kick in for it.
  const hasRealContent =
    Boolean(tagline || aboutSecondParagraph || calloutText || productTourCaption || getStartedIntro || getStartedOutro || directLinkLabel || ctaLabel || ctaHref || relatedCardStats || aboutLinkModalLabel) ||
    statistics.length > 0 ||
    keyFeatures.length > 0 ||
    eligibility.length > 0 ||
    whatYoullNeed.length > 0 ||
    faqs.length > 0 ||
    faqsMore.length > 0 ||
    getStartedSteps.length > 0 ||
    productTour.length > 0 ||
    aboutLinkModalItems.length > 0 ||
    formData.get("hideStatFeatureCards") === "on" ||
    formData.get("hideAboutSecondParagraph") === "on" ||
    formData.get("suppressGetStartedSteps") === "on" ||
    formData.get("comingSoon") === "on" ||
    formData.get("gatedAccess") === "on" ||
    Boolean(optionalStr(formData, "typeLabel")) ||
    Boolean(contactEmail || contactPhone);

  return {
    name,
    slug: "",
    description: str(formData, "description"),
    stats: str(formData, "stats"),
    accessPortalHref: optionalStr(formData, "accessPortalHref"),
    sections,
    ...(imageId ? { image: imageId } : {}),
    // `real` is a single Payload field — every save replaces it wholesale,
    // so every sub-field the form knows about must be included here every
    // time, not just the ones that happen to be non-empty this round.
    // Omitting any of them (as the previous version of this function did
    // for Get Started, Product Tour, aboutLinkModal, etc.) would silently
    // delete that content from any doc that already had it.
    real: hasRealContent
      ? {
          tagline,
          aboutSecondParagraph,
          hideAboutSecondParagraph: formData.get("hideAboutSecondParagraph") === "on",
          calloutText,
          statistics: statistics.map((value) => ({ value })),
          keyFeatures: keyFeatures.map((value) => ({ value })),
          keyFeatureDescriptions: keyFeatureDescriptions.map((value) => ({ value })),
          hideStatFeatureCards: formData.get("hideStatFeatureCards") === "on",
          aboutLinkModal:
            aboutLinkModalLabel || aboutLinkModalTitle || aboutLinkModalItems.length > 0
              ? { label: aboutLinkModalLabel, title: aboutLinkModalTitle, items: aboutLinkModalItems.map((value) => ({ value })) }
              : undefined,
          productTour,
          productTourCaption,
          eligibility: eligibility.map((value) => ({ value })),
          whatYoullNeed: whatYoullNeed.map((value) => ({ value })),
          getStartedIntro,
          getStartedSteps,
          suppressGetStartedSteps: formData.get("suppressGetStartedSteps") === "on",
          getStartedOutro,
          directLinkLabel,
          faqs,
          faqsMore,
          comingSoon: formData.get("comingSoon") === "on",
          gatedAccess: formData.get("gatedAccess") === "on",
          ctaLabel,
          ctaHref,
          relatedCardStats,
          typeLabel: (optionalStr(formData, "typeLabel") as "Project" | "Service" | undefined) || undefined,
          contact: contactEmail || contactPhone ? { email: contactEmail, phone: contactPhone } : undefined,
        }
      : undefined,
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
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "services", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    await payload.update({ collection: "services", id, data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });
  } else {
    await payload.update({ collection: "services", id, data, draft: true, overrideAccess: true });
  }

  const action = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "updated";
  await logActivity(user, action, "Services", `${action} "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/services/${id}/edit?saved=1`);
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

export async function moveService(id: number, direction: "up" | "down") {
  await requireSession();
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "services",
    sort: "order",
    limit: 200,
    depth: 0,
    select: { order: true, _status: true },
    draft: true,
    overrideAccess: true,
  });

  const index = docs.findIndex((d) => d.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= docs.length) {
    revalidatePath("/", "layout");
    redirect("/cms/services");
  }

  const current = docs[index];
  const neighbor = docs[swapIndex];

  await Promise.all(
    [
      [current, neighbor.order] as const,
      [neighbor, current.order] as const,
    ].map(([doc, order]) =>
      doc._status === "draft"
        ? payload.update({ collection: "services", id: doc.id, data: { order }, draft: true, overrideAccess: true })
        : payload.update({ collection: "services", id: doc.id, data: { order }, overrideAccess: true })
    )
  );

  revalidatePath("/", "layout");
  redirect("/cms/services");
}
