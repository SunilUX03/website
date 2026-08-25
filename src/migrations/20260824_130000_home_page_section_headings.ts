import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Three changes bundled together for the Home page CMS pass:
// 1. Leadership Band, Metrics, and Pillars sections gain their own
//    section-level heading (Pillars also an eyebrow) — previously
//    hardcoded in AboutLeadership.tsx / Metrics.tsx / PillarCards.tsx.
// 2. Metrics' per-card value/decimals/prefix/suffix (feeding an animated
//    count-up) collapses into one plain "metric" text field.
// 3. Pillars' per-card `description` is dropped — never rendered by
//    PillarCard.tsx (heading + item list only).
// No copy-forward for the two brand-new locales tables (metrics_content,
// pillars_content never had a top-level localized field before) — seeded
// separately via script with the site's current hardcoded text so
// nothing visibly changes. Metrics' new `metric` column is backfilled
// below from the old value/decimals/prefix/suffix columns it replaces,
// so existing numbers aren't lost.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leadership_band_content_locales" ADD COLUMN "heading" varchar;
    ALTER TABLE "_leadership_band_content_v_locales" ADD COLUMN "version_heading" varchar;

    CREATE TABLE "metrics_content_locales" (
      "heading" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "metrics_content_locales" ADD CONSTRAINT "metrics_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics_content"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "metrics_content_locales_locale_parent_id_unique" ON "metrics_content_locales" USING btree ("_locale","_parent_id");

    CREATE TABLE "_metrics_content_v_locales" (
      "version_heading" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "_metrics_content_v_locales" ADD CONSTRAINT "_metrics_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_metrics_content_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "_metrics_content_v_locales_locale_parent_id_unique" ON "_metrics_content_v_locales" USING btree ("_locale","_parent_id");

    ALTER TABLE "metrics_content_metrics" ADD COLUMN "metric" varchar;
    UPDATE "metrics_content_metrics" SET "metric" =
      COALESCE("prefix", '') ||
      CASE WHEN "decimals" IS NOT NULL THEN trim_scale(round("value", "decimals"::int))::text ELSE trim_scale("value")::text END ||
      COALESCE("suffix", '');
    ALTER TABLE "metrics_content_metrics" DROP COLUMN "value";
    ALTER TABLE "metrics_content_metrics" DROP COLUMN "decimals";
    ALTER TABLE "metrics_content_metrics" DROP COLUMN "prefix";
    ALTER TABLE "metrics_content_metrics" DROP COLUMN "suffix";

    ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "metric" varchar;
    UPDATE "_metrics_content_v_version_metrics" SET "metric" =
      COALESCE("prefix", '') ||
      CASE WHEN "decimals" IS NOT NULL THEN trim_scale(round("value", "decimals"::int))::text ELSE trim_scale("value")::text END ||
      COALESCE("suffix", '');
    ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "value";
    ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "decimals";
    ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "prefix";
    ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "suffix";

    CREATE TABLE "pillars_content_locales" (
      "eyebrow" varchar,
      "heading" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "pillars_content_locales" ADD CONSTRAINT "pillars_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillars_content"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "pillars_content_locales_locale_parent_id_unique" ON "pillars_content_locales" USING btree ("_locale","_parent_id");

    CREATE TABLE "_pillars_content_v_locales" (
      "version_eyebrow" varchar,
      "version_heading" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "_pillars_content_v_locales" ADD CONSTRAINT "_pillars_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pillars_content_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "_pillars_content_v_locales_locale_parent_id_unique" ON "_pillars_content_v_locales" USING btree ("_locale","_parent_id");

    ALTER TABLE "pillars_content_pillars_locales" DROP COLUMN "description";
    ALTER TABLE "_pillars_content_v_version_pillars_locales" DROP COLUMN "description";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pillars_content_pillars_locales" ADD COLUMN "description" varchar;
    ALTER TABLE "_pillars_content_v_version_pillars_locales" ADD COLUMN "description" varchar;

    DROP TABLE "pillars_content_locales" CASCADE;
    DROP TABLE "_pillars_content_v_locales" CASCADE;

    ALTER TABLE "metrics_content_metrics" ADD COLUMN "value" numeric;
    ALTER TABLE "metrics_content_metrics" ADD COLUMN "decimals" numeric;
    ALTER TABLE "metrics_content_metrics" ADD COLUMN "prefix" varchar;
    ALTER TABLE "metrics_content_metrics" ADD COLUMN "suffix" varchar;
    ALTER TABLE "metrics_content_metrics" DROP COLUMN "metric";

    ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "value" numeric;
    ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "decimals" numeric;
    ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "prefix" varchar;
    ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "suffix" varchar;
    ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "metric";

    DROP TABLE "metrics_content_locales" CASCADE;
    DROP TABLE "_metrics_content_v_locales" CASCADE;

    ALTER TABLE "leadership_band_content_locales" DROP COLUMN "heading";
    ALTER TABLE "_leadership_band_content_v_locales" DROP COLUMN "version_heading";
  `)
}
