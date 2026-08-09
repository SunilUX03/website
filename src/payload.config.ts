import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

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
  plugins: [
    // Local disk (Media collection's own `staticDir`) doesn't persist on
    // Vercel's serverless filesystem — an upload would vanish the moment
    // that function instance recycled. Vercel Blob is a real, persistent
    // store that works identically once self-hosted later too (it's just
    // a network API, not tied to Vercel's compute).
    vercelBlobStorage({
      collections: { [Media.slug]: true, [Documents.slug]: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
