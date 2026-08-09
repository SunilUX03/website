"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";
import { logActivity } from "@/lib/portal/activity-log";
import { uploadFile } from "@/lib/portal/upload";
import { parseRepeatable, str, optionalStr } from "@/lib/portal/form-utils";

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
  const keyFeatures = parseRepeatable(formData, "keyFeatures", ["value"]).map((r) => r.value);
  const eligibility = parseRepeatable(formData, "eligibility", ["value"]).map((r) => r.value);
  const whatYoullNeed = parseRepeatable(formData, "whatYoullNeed", ["value"]).map((r) => r.value);
  const faqs = parseRepeatable(formData, "faqs", ["q", "a"]) as { q: string; a: string }[];

  const hasRealContent =
    statistics.length > 0 || keyFeatures.length > 0 || eligibility.length > 0 || whatYoullNeed.length > 0 || faqs.length > 0;

  const contactEmail = optionalStr(formData, "contactEmail");
  const contactPhone = optionalStr(formData, "contactPhone");

  return {
    name,
    slug: "",
    description: str(formData, "description"),
    stats: str(formData, "stats"),
    accessPortalHref: optionalStr(formData, "accessPortalHref"),
    sections,
    ...(imageId ? { image: imageId } : {}),
    real: hasRealContent
      ? {
          tagline: optionalStr(formData, "tagline"),
          aboutSecondParagraph: optionalStr(formData, "aboutSecondParagraph"),
          calloutText: optionalStr(formData, "calloutText"),
          statistics: statistics.map((value) => ({ value })),
          keyFeatures: keyFeatures.map((value) => ({ value })),
          eligibility: eligibility.map((value) => ({ value })),
          whatYoullNeed: whatYoullNeed.map((value) => ({ value })),
          faqs,
          comingSoon: formData.get("comingSoon") === "on",
          gatedAccess: formData.get("gatedAccess") === "on",
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

  const doc = publish
    ? await payload.create({ collection: "services", data: { ...rest, image, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "services", data: { ...rest, image, _status: "draft" }, draft: true, overrideAccess: true });

  await logActivity(user, publish ? "published" : "created", "Services", `Created "${data.name}"`);
  revalidatePath("/", "layout");
  redirect(`/cms/services/${doc.id}/edit`);
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
  redirect(`/cms/services/${id}/edit`);
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
