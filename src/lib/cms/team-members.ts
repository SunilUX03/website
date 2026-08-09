import { getPayloadClient } from "@/lib/payload-client";
import type { TeamMember, Media } from "@/payload-types";
import { type CmsTeamMember } from "@/lib/cms/team-member-types";

export type { CmsTeamMember } from "@/lib/cms/team-member-types";

function toCmsTeamMember(doc: TeamMember): CmsTeamMember {
  const photo = typeof doc.photo === "object" && doc.photo !== null ? (doc.photo as Media).url ?? undefined : undefined;
  return {
    id: doc.id,
    name: doc.name,
    designation: doc.designation,
    subject: doc.subject ?? undefined,
    photo,
  };
}

/** Published team members, CEO first (see `order` in the collection). */
export async function getTeamMembers(): Promise<CmsTeamMember[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "team-members",
    depth: 1,
    sort: "order",
    limit: 100,
    overrideAccess: false,
  });
  return result.docs.map(toCmsTeamMember);
}
