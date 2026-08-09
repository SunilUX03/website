/** Kept separate from team-members.ts for the same reason as
 * announcement-types.ts / media-item-types.ts — LeadershipTeam.tsx is a
 * client component and can't import the Payload Local API module. */
export type CmsTeamMember = {
  id: number;
  name: string;
  designation: string;
  subject?: string;
  photo?: string;
};
