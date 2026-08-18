import { getPayloadClient } from "@/lib/payload-client";
import type { JobOpening, Document } from "@/payload-types";

/** JobOpenings.tsx is a plain server component (no "use client"), so —
 * unlike announcements/media-items — there's no client-bundle reason to
 * split this type into its own file; nothing here imports Payload's
 * Local API into browser code. */
export type CmsJobOpening = {
  id: number;
  role: string;
  type: string;
  department: string;
  deadline: string;
  jdHref?: string;
};

function formatDeadline(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function toCmsJobOpening(doc: JobOpening): CmsJobOpening {
  const jd = typeof doc.jd === "object" ? (doc.jd as Document) : undefined;
  return {
    id: doc.id,
    role: doc.role,
    type: doc.type,
    department: doc.department,
    deadline: formatDeadline(doc.deadline),
    jdHref: jd?.url ?? undefined,
  };
}

/** Published openings, soonest deadline first. */
export async function getJobOpenings(): Promise<CmsJobOpening[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "job-openings",
    depth: 1,
    sort: "deadline",
    limit: 100,
    overrideAccess: false,
  });
  return result.docs.map(toCmsJobOpening);
}
