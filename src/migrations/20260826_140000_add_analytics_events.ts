import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// A plain table, not a Payload collection — analytics events are pure
// append-only log data (pageviews, clicks, conversions, accessibility-
// setting usage) written at high frequency from a public API route (see
// src/app/(frontend)/api/analytics/track/route.ts) via Prisma raw SQL,
// not the Payload Local API. No versions/drafts/publish workflow
// applies to a log row, so skipping Payload's document machinery here
// is a deliberate simplification, not an oversight — reads for the CMS
// Analytics dashboard also go through Prisma directly (see
// src/app/(frontend)/cms/(portal)/analytics/page.tsx).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "analytics_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "type" varchar NOT NULL,
      "path" varchar,
      "label" varchar,
      "visitor_id" varchar NOT NULL,
      "locale" varchar,
      "device" varchar,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX "analytics_events_type_idx" ON "analytics_events" USING btree ("type");
    CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
    CREATE INDEX "analytics_events_visitor_id_idx" ON "analytics_events" USING btree ("visitor_id");
    CREATE INDEX "analytics_events_path_idx" ON "analytics_events" USING btree ("path");
    CREATE INDEX "analytics_events_label_idx" ON "analytics_events" USING btree ("label");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "analytics_events" CASCADE;
  `)
}
