import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { CmsUsers } from "./collections/CmsUsers";
import { Media } from "./collections/Media";

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
  collections: [CmsUsers, Media],
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
});
