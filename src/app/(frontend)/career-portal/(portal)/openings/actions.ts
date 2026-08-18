"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";
import { requireAdminSession } from "@/lib/admin-session";
import { uploadFile } from "@/lib/portal/upload";
import { str } from "@/lib/portal/form-utils";

async function buildData(formData: FormData) {
  const role = str(formData, "role");
  const jdFile = formData.get("jd") as File | null;
  const jdId = await uploadFile("documents", jdFile, `${role} — Job Description`);

  return {
    role,
    type: str(formData, "type") || "Contract",
    department: str(formData, "department"),
    deadline: str(formData, "deadline"),
    // Omitted (not set to null) when no new file was picked — Payload's
    // update() is a partial update, so leaving this key out preserves
    // whatever JD was already attached instead of clearing it.
    ...(jdId ? { jd: jdId } : {}),
  };
}

export async function createJobOpening(formData: FormData) {
  await requireAdminSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const publish = formData.get("intent") === "publish";

  const doc = publish
    ? await payload.create({ collection: "job-openings", data: { ...data, _status: "published" }, draft: false, overrideAccess: true })
    : await payload.create({ collection: "job-openings", data: { ...data, _status: "draft" }, draft: true, overrideAccess: true });

  revalidatePath("/", "layout");
  redirect(`/career-portal/openings/${doc.id}/edit?saved=1`);
}

export async function updateJobOpening(id: number, formData: FormData) {
  await requireAdminSession();
  const payload = await getPayloadClient();
  const data = await buildData(formData);
  const intent = formData.get("intent");

  if (intent === "publish") {
    await payload.update({ collection: "job-openings", id, data: { ...data, _status: "published" }, overrideAccess: true });
  } else if (intent === "unpublish") {
    // draft: true here would create a new pending VERSION and leave the
    // live/published row untouched — writing straight to the base row
    // (draft: false) is what actually flips the live doc's status, so it
    // disappears from the public site immediately.
    await payload.update({ collection: "job-openings", id, data: { ...data, _status: "draft" }, draft: false, overrideAccess: true });
  } else {
    await payload.update({ collection: "job-openings", id, data, draft: true, overrideAccess: true });
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
