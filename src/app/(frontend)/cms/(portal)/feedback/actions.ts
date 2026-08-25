"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import { requireSession } from "@/lib/portal/auth";

export async function markFeedbackRead(id: number, read: boolean) {
  await requireSession();
  const payload = await getPayloadClient();
  await payload.update({ collection: "feedback-submissions", id, data: { read }, overrideAccess: true });
  revalidatePath("/cms/feedback");
}

export async function deleteFeedback(id: number) {
  const user = await requireSession();
  if (user.role !== "admin") throw new Error("Only an admin can delete.");
  const payload = await getPayloadClient();
  await payload.delete({ collection: "feedback-submissions", id, overrideAccess: true });
  revalidatePath("/cms/feedback");
}
