import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import "./lib/patch-shared-array-buffer-fetch";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { CmsUsers } from "./collections/CmsUsers";
import { Media } from "./collections/Media";
import { Announcements } from "./collections/Announcements";
import { MediaItems } from "./collections/MediaItems";
import { JobOpenings } from "./collections/JobOpenings";
import { TeamMembers } from "./collections/TeamMembers";
import { Services } from "./collections/Services";
import { Documents } from "./collections/Documents";
import { GovernmentOrders } from "./collections/GovernmentOrders";
import { Policies } from "./collections/Policies";
import { ActivityLog } from "./collections/ActivityLog";
import { LegalPages } from "./collections/LegalPages";
import { Awards } from "./collections/Awards";
import { RollOfHonour } from "./collections/RollOfHonour";
import { ProjectsSpotlight } from "./collections/ProjectsSpotlight";
import { SocialPosts } from "./collections/SocialPosts";
import { DepartmentContacts } from "./collections/DepartmentContacts";
import { NavContent } from "./globals/NavContent";
import { BoardContent } from "./globals/BoardContent";
import { HeroContent } from "./globals/HeroContent";
import { LeadershipBandContent } from "./globals/LeadershipBandContent";
import { FooterContent } from "./globals/FooterContent";
import { AboutPageContent } from "./globals/AboutPageContent";
import { OrgChartContent } from "./globals/OrgChartContent";
import { MetricsContent } from "./globals/MetricsContent";
import { PillarsContent } from "./globals/PillarsContent";
import { CareersContent } from "./globals/CareersContent";
import { RtiContent } from "./globals/RtiContent";
import { TendersContent } from "./globals/TendersContent";
import { SiteCopyContent } from "./globals/SiteCopyContent";
import { ServicesToGovernmentContent } from "./globals/ServicesToGovernmentContent";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Mounted at /cms, not /admin — the Careers HR login already owns
  // /admin/* (NextAuth + Prisma, a separate system). Two different
  // logins both called "admin" in the same app would be confusing.
  admin: {
    user: CmsUsers.slug,
  },
  routes: {
    admin: "/cms",
    api: "/api/payload",
  },
  collections: [
    CmsUsers,
    Media,
    Announcements,
    MediaItems,
    JobOpenings,
    TeamMembers,
    Services,
    Documents,
    GovernmentOrders,
    Policies,
    ActivityLog,
    LegalPages,
    Awards,
    RollOfHonour,
    ProjectsSpotlight,
    SocialPosts,
    DepartmentContacts,
  ],
  globals: [
    NavContent,
    BoardContent,
    HeroContent,
    LeadershipBandContent,
    FooterContent,
    AboutPageContent,
    OrgChartContent,
    MetricsContent,
    PillarsContent,
    CareersContent,
    RtiContent,
    TendersContent,
    SiteCopyContent,
    ServicesToGovernmentContent,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // This database is shared with Prisma's own tables (AdminUser,
    // JobApplication, for the separate Careers backend). Payload's
    // default dev-mode auto-push uses drizzle-kit's heuristic schema
    // diff, which at one point genuinely prompted to RENAME an existing
    // Prisma table into a new Payload one rather than create it fresh —
    // never safe to run unattended against a database with other
    // systems' tables in it. Explicit, reviewable migrations only.
    push: false,
  }),
  sharp,
  // No storage plugin — Media/Documents fall back to Payload's own local-
  // disk storage (their `staticDir` config, under /public). Only correct
  // on a persistent server with its own disk; this would silently lose
  // every upload on Vercel's serverless filesystem, which recycles
  // between invocations. Do not deploy this to the Vercel environment.
});
