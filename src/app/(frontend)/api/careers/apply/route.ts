import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPayloadClient } from "@/lib/payload-client";
import { verifyPhoneVerifiedToken, phoneFromVerifiedToken } from "@/lib/otp";
import { normalizeIndianMobile } from "@/lib/phone";

// Kept under Vercel's ~4.5MB serverless request-body ceiling — see the
// matching note in ApplicationForm.tsx.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Re-validates everything the client already checks — the client form
// only stops an honest browser from submitting bad data, not a direct
// POST to this endpoint.
export async function POST(request: Request) {
  const form = await request.formData();

  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phoneVerifiedToken = String(form.get("phoneVerifiedToken") ?? "");
  // Normally the form sends the number; if a browser leaves it out (a locked
  // field is not submitted), the verified token names the number it was issued
  // for. The token's signature is still checked below.
  const phone = normalizeIndianMobile(String(form.get("phone") ?? "")) ?? phoneFromVerifiedToken(phoneVerifiedToken);
  const roleId = String(form.get("role") ?? "");
  const coverNote = String(form.get("coverLetter") ?? "").trim();
  const resume = form.get("resume");

  const jobRole = roleId ? await db.jobRole.findUnique({ where: { id: roleId } }) : null;

  // Say exactly which field is the problem, so a visitor can fix it.
  if (!fullName) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Phone number is missing. Please verify your phone number with the OTP again." }, { status: 400 });
  if (!jobRole) return NextResponse.json({ error: "Please select a role from the list." }, { status: 400 });

  // The OTP step only stops an honest browser from submitting without
  // verifying — re-checking the token here (not just trusting the client
  // completed it) is what actually stops a direct POST from skipping
  // phone verification entirely.
  if (!phoneVerifiedToken || !verifyPhoneVerifiedToken(phone, phoneVerifiedToken)) {
    return NextResponse.json({ error: "Phone number is not verified. Please verify it with the OTP sent to it." }, { status: 400 });
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }
  if (resume.type !== "application/pdf") {
    return NextResponse.json({ error: "Resume must be a PDF file." }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ error: "Resume must be 4MB or smaller." }, { status: 400 });
  }

  const resumeData = Buffer.from(await resume.arrayBuffer());

  // Only counts as a targeted application for a specific job card if a
  // currently-published opening's role matches (case-insensitively)
  // what the applicant picked — otherwise it's a general resume with no
  // matching vacancy, and the Career Portal files it under Resume
  // Submitted instead of grouping it under a job.
  const payload = await getPayloadClient();
  const { docs: publishedOpenings } = await payload.find({
    collection: "job-openings",
    limit: 200,
    depth: 0,
    overrideAccess: true,
    where: { _status: { equals: "published" } },
  });
  const matchedOpening = publishedOpenings.find(
    (o) => o.role.trim().toLowerCase() === jobRole.label.trim().toLowerCase()
  );

  await db.jobApplication.create({
    data: {
      role: jobRole.label,
      fullName,
      email,
      phone,
      coverNote: coverNote || null,
      resumeName: resume.name,
      resumeType: resume.type,
      resumeData,
      matchedJobOpeningId: matchedOpening?.id ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
