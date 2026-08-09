import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roleOptions } from "@/lib/careers-content";

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
  const roleValue = String(form.get("role") ?? "");
  const coverNote = String(form.get("coverLetter") ?? "").trim();
  const resume = form.get("resume");

  const role = roleOptions.find((r) => r.value === roleValue)?.label;

  if (!fullName || !EMAIL_RE.test(email) || !phone || !role) {
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

  await db.jobApplication.create({
    data: {
      role,
      fullName,
      email,
      phone,
      coverNote: coverNote || null,
      resumeName: resume.name,
      resumeType: resume.type,
      resumeData,
    },
  });

  return NextResponse.json({ ok: true });
}
