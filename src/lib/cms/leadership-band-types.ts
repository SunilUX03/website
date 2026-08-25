export type CmsLeader = {
  name: string;
  title: string;
  photo: string;
  photoPosition: string;
  quote: string | null;
};

export type CmsLeadershipBand = {
  heading: string;
  description: string;
  leaders: CmsLeader[];
};
