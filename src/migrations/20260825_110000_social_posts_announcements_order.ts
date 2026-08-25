import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a drag-reorderable `order` number to Social Posts and
// Announcements (both previously date-sorted only, with no manual order
// control). Existing rows are backfilled in up() to match their current
// -date display order, so nothing visibly reorders until an admin
// actually drags something.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "social_posts" ADD COLUMN "order" numeric DEFAULT 0 NOT NULL;
    ALTER TABLE "_social_posts_v" ADD COLUMN "version_order" numeric DEFAULT 0;

    ALTER TABLE "announcements" ADD COLUMN "order" numeric DEFAULT 0 NOT NULL;
    ALTER TABLE "_announcements_v" ADD COLUMN "version_order" numeric DEFAULT 0;

    WITH ranked AS (
      SELECT id, row_number() OVER (ORDER BY date DESC) - 1 AS rn FROM "social_posts"
    )
    UPDATE "social_posts" SET "order" = ranked.rn FROM ranked WHERE "social_posts".id = ranked.id;

    WITH ranked AS (
      SELECT id, row_number() OVER (ORDER BY date DESC) - 1 AS rn FROM "announcements"
    )
    UPDATE "announcements" SET "order" = ranked.rn FROM ranked WHERE "announcements".id = ranked.id;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "social_posts" DROP COLUMN IF EXISTS "order";
    ALTER TABLE "_social_posts_v" DROP COLUMN IF EXISTS "version_order";
    ALTER TABLE "announcements" DROP COLUMN IF EXISTS "order";
    ALTER TABLE "_announcements_v" DROP COLUMN IF EXISTS "version_order";
  `)
}
