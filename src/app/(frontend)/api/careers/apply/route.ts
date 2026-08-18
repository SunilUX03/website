import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPayloadClient } from "@/lib/payload-client";

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
  const phone = String(form.get("phone") ?? "").trim();
  const roleId = String(form.get("role") ?? "");
  const coverNote = String(form.get("coverLetter") ?? "").trim();
  const resume = form.get("resume");

  const jobRole = roleId ? await db.jobRole.findUnique({ where: { id: roleId } }) : null;

  if (!fullName || !EMAIL_RE.test(email) || !phone || !jobRole) {
    return NextResponse.json({ error: "Missing or invalid required field." }, { status: 400 });
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
