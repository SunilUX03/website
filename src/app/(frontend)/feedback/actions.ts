"use server";

import { getPayloadClient } from "@/lib/payload-client";

export type SubmitFeedbackResult = { ok: true } | { ok: false; error: string };

/** Public endpoint (no session required) called from FeedbackForm.tsx —
 * this is the only write this collection needs, so it isn't routed
 * through the CMS actions.ts pattern the rest of the portal uses. Server-
 * side validation mirrors the client's, since a client check alone can
 * always be bypassed. */
export async function submitFeedback(data: {
  name: string;
  email: string;
  subject: string;
  comments: string;
  locale: string;
}): Promise<SubmitFeedbackResult> {
  const name = data.name.trim();
  const email = data.email.trim();
  const comments = data.comments.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!comments) return { ok: false, error: "Please share your feedback." };

  const payload = await getPayloadClient();
  await payload.create({
    collection: "feedback-submissions",
    data: {
      name,
      email,
      subject: data.subject.trim() || "Other",
      comments,
      locale: data.locale,
      submittedAt: new Date().toISOString(),
      read: false,
    },
    overrideAccess: true,
  });

  return { ok: true };
}
