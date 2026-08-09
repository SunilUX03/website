import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Gated by session, not just an unguessable id — resumes are personal
// data (name, contact details, sometimes more), so this must not be a
// plain public file URL even if the id itself is hard to guess.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const application = await db.jobApplication.findUnique({ where: { id } });
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(new Uint8Array(application.resumeData), {
    headers: {
      "Content-Type": application.resumeType,
      "Content-Disposition": `inline; filename="${application.resumeName}"`,
    },
  });
}
