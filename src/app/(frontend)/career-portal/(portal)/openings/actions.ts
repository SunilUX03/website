"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireAdminSession } from "@/lib/admin-session";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildData(formData: FormData, existing: { jdId?: number }) {
  const role = str(formData, "role");
  const jdFile = formData.get("jd") as File | null;
  const jdId = await uploadFile("documents", jdFile, `${role} — Job Description`);
  // Required field: a new upload always wins, otherwise fall back to
  // whatever was already attached (undefined on create) — Payload's
  // update() is a partial update, so leaving this key out on an edit
  // with no new file would preserve the existing JD anyway, but being
  // explicit here is what lets the caller check "is it actually missing"
  // before ever reaching Payload.
  const resolvedJdId = jdId ?? existing.jdId;

  return {
    data: {
      role,
      type: str(formData, "type") || "Contract",
      department: str(formData, "department"),
      deadline: str(formData, "deadline"),
      ...(resolvedJdId ? { jd: resolvedJdId } : {}),
    },
    jdId: resolvedJdId,
  };
}

export async function createJobOpening(formData: FormData) {
  await requireAdminSession();
  const payload = await getPayloadClient();
  const { data, jdId } = await buildData(formData, {});
  const publish = formData.get("intent") === "publish";

  if (!jdId) {
    redirect(`/career-portal/openings/new?error=${encodeURIComponent("Job description PDF is required.")}`);
  }
  const finalData = { ...data, jd: jdId };

  const doc = publish
    ? await payload.create({ collection: "job-openings", data: { ...finalData, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "job-openings", data: { ...finalData, _status: "draft" }, draft: true, overrideAccess: true });

  revalidatePath("/", "layout");
  redirect(`/career-portal/openings/${doc.id}/edit?saved=1`);
}

export async function updateJobOpening(id: number, formData: FormData) {
  await requireAdminSession();
  const payload = await getPayloadClient();
  const current = await payload.findByID({ collection: "job-openings", id, depth: 0, overrideAccess: true });
  const currentJdId = typeof current.jd === "number" ? current.jd : current.jd?.id;
  const { data, jdId } = await buildData(formData, { jdId: currentJdId });
  const intent = formData.get("intent");

  if (!jdId) {
    redirect(`/career-portal/openings/${id}/edit?error=${encodeURIComponent("Job description PDF is required.")}`);
  }
  const finalData = { ...data, jd: jdId };

  if (intent === "publish") {
    await payload.update({ collection: "job-openings", id, data: { ...finalData, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    // draft: true here would create a new pending VERSION and leave the
    // live/published row untouched — writing straight to the base row
    // (draft: false) is what actually flips the live doc's status, so it
    // disappears from the public site immediately.
    await payload.update({ collection: "job-openings", id, data: { ...finalData, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "job-openings", id, data: finalData, draft: true, overrideAccess: true });
  }

  revalidatePath("/", "layout");
  redirect(`/career-portal/openings/${id}/edit?saved=1`);
}

export async function deleteJobOpening(id: number) {
  await requireAdminSession();
  const payload = await getPayloadClient();
  await payload.delete({ collection: "job-openings", id, overrideAccess: true });
  revalidatePath("/", "layout");
  redirect("/career-portal/openings");
}
