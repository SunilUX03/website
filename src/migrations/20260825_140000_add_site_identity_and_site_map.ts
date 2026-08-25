import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Two new globals:
//  - site_identity: the government emblem, TNeGA mark, and bilingual
//    organisation name shown in the header and footer — previously
//    static image imports and hardcoded JSX text with no CMS control at
//    all (see MainNav.tsx / FooterClient.tsx). No localized fields (the
//    Tamil/English name lines always render together regardless of site
//    locale, so both are plain columns, not `_locales` rows) and no
//    array fields, so no locales tables at all. It still gets a
//    `published_locale` column on its `_v` table, though — confirmed by
//    a runtime "column does not exist" error on first attempt — Payload
//    adds that column to every versioned entity's `_v` table once
//    `localization` is configured anywhere in payload.config, regardless
//    of whether this particular global declares any localized fields.
//  - site_map_content: the /sitemap page's link groups, previously a
//    hardcoded array in the page component. A single flat `links` array
//    (each row carries its own group heading; the page groups rows by
//    that heading at render time) rather than nested group/link arrays,
//    since RepeatableRows (the admin's array-editor component) only
//    understands one flat level of rows.
//
// `links` uses a custom dbName ("sitemap_links") for the same reason as
// services-to-government-content's departmentContacts array: the
// default derived name for the versions-side locales table's unique
// index ("_site_map_content_v_version_links_locales_locale_parent_id_
// unique", 68 chars) exceeds Postgres's 63-char identifier limit, which
// Payload enforces at boot (throws, does not truncate) — see that
// migration's comment for the full naming breakdown. With the custom
// dbName, Payload's naming algorithm resolves to:
//   live array table:            sitemap_links
//   live array locales table:    sitemap_links_locales
//   version array table:         _sitemap_links_v
//   version array locales table: _sitemap_links_v_locales
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_identity_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__site_identity_v_version_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__site_identity_v_published_locale" AS ENUM('en', 'ta');
    CREATE TYPE "public"."enum_site_map_content_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__site_map_content_v_version_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__site_map_content_v_published_locale" AS ENUM('en', 'ta');

    CREATE TABLE "site_identity" (
      "id" serial PRIMARY KEY NOT NULL,
      "emblem_image_id" integer,
      "mark_image_id" integer,
      "name_tamil" varchar,
      "name_english" varchar,
      "_status" "enum_site_identity_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    ALTER TABLE "site_identity" ADD CONSTRAINT "site_identity_emblem_image_id_media_id_fk" FOREIGN KEY ("emblem_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_identity" ADD CONSTRAINT "site_identity_mark_image_id_media_id_fk" FOREIGN KEY ("mark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "site_identity_emblem_image_idx" ON "site_identity" USING btree ("emblem_image_id");
    CREATE INDEX "site_identity_mark_image_idx" ON "site_identity" USING btree ("mark_image_id");
    CREATE INDEX "site_identity__status_idx" ON "site_identity" USING btree ("_status");

    CREATE TABLE "_site_identity_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_emblem_image_id" integer,
      "version_mark_image_id" integer,
      "version_name_tamil" varchar,
      "version_name_english" varchar,
      "version__status" "enum__site_identity_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "snapshot" boolean,
      "published_locale" "enum__site_identity_v_published_locale"
    );
    ALTER TABLE "_site_identity_v" ADD CONSTRAINT "_site_identity_v_version_emblem_image_id_media_id_fk" FOREIGN KEY ("version_emblem_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_site_identity_v" ADD CONSTRAINT "_site_identity_v_version_mark_image_id_media_id_fk" FOREIGN KEY ("version_mark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "_site_identity_v_version_version_emblem_image_idx" ON "_site_identity_v" USING btree ("version_emblem_image_id");
    CREATE INDEX "_site_identity_v_version_version_mark_image_idx" ON "_site_identity_v" USING btree ("version_mark_image_id");
    CREATE INDEX "_site_identity_v_version_version__status_idx" ON "_site_identity_v" USING btree ("version__status");
    CREATE INDEX "_site_identity_v_created_at_idx" ON "_site_identity_v" USING btree ("created_at");
    CREATE INDEX "_site_identity_v_updated_at_idx" ON "_site_identity_v" USING btree ("updated_at");
    CREATE INDEX "_site_identity_v_latest_idx" ON "_site_identity_v" USING btree ("latest");
    CREATE INDEX "_site_identity_v_snapshot_idx" ON "_site_identity_v" USING btree ("snapshot");
    CREATE INDEX "_site_identity_v_published_locale_idx" ON "_site_identity_v" USING btree ("published_locale");

    CREATE TABLE "site_map_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "_status" "enum_site_map_content_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE INDEX "site_map_content__status_idx" ON "site_map_content" USING btree ("_status");

    CREATE TABLE "sitemap_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "href" varchar
    );
    ALTER TABLE "sitemap_links" ADD CONSTRAINT "sitemap_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_map_content"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "sitemap_links_order_idx" ON "sitemap_links" USING btree ("_order");
    CREATE INDEX "sitemap_links_parent_id_idx" ON "sitemap_links" USING btree ("_parent_id");

    CREATE TABLE "sitemap_links_locales" (
      "group_heading" varchar,
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    ALTER TABLE "sitemap_links_locales" ADD CONSTRAINT "sitemap_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sitemap_links"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "sitemap_links_locales_locale_parent_id_unique" ON "sitemap_links_locales" USING btree ("_locale","_parent_id");

    CREATE TABLE "_site_map_content_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version__status" "enum__site_map_content_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "snapshot" boolean,
      "published_locale" "enum__site_map_content_v_published_locale"
    );
    CREATE INDEX "_site_map_content_v_version_version__status_idx" ON "_site_map_content_v" USING btree ("version__status");
    CREATE INDEX "_site_map_content_v_created_at_idx" ON "_site_map_content_v" USING btree ("created_at");
    CREATE INDEX "_site_map_content_v_updated_at_idx" ON "_site_map_content_v" USING btree ("updated_at");
    CREATE INDEX "_site_map_content_v_latest_idx" ON "_site_map_content_v" USING btree ("latest");
    CREATE INDEX "_site_map_content_v_snapshot_idx" ON "_site_map_content_v" USING btree ("snapshot");
    CREATE INDEX "_site_map_content_v_published_locale_idx" ON "_site_map_content_v" USING btree ("published_locale");

    CREATE TABLE "_sitemap_links_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "href" varchar,
      "_uuid" varchar
    );
    ALTER TABLE "_sitemap_links_v" ADD CONSTRAINT "_sitemap_links_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_map_content_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "_sitemap_links_v_order_idx" ON "_sitemap_links_v" USING btree ("_order");
    CREATE INDEX "_sitemap_links_v_parent_id_idx" ON "_sitemap_links_v" USING btree ("_parent_id");

    CREATE TABLE "_sitemap_links_v_locales" (
      "group_heading" varchar,
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "_sitemap_links_v_locales" ADD CONSTRAINT "_sitemap_links_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sitemap_links_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "_sitemap_links_v_locales_locale_parent_id_unique" ON "_sitemap_links_v_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "_sitemap_links_v_locales" CASCADE;
    DROP TABLE "_sitemap_links_v" CASCADE;
    DROP TABLE "_site_map_content_v" CASCADE;
    DROP TABLE "sitemap_links_locales" CASCADE;
    DROP TABLE "sitemap_links" CASCADE;
    DROP TABLE "site_map_content" CASCADE;
    DROP TABLE "_site_identity_v" CASCADE;
    DROP TABLE "site_identity" CASCADE;
    DROP TYPE "public"."enum__site_map_content_v_published_locale";
    DROP TYPE "public"."enum__site_map_content_v_version_status";
    DROP TYPE "public"."enum_site_map_content_status";
    DROP TYPE "public"."enum__site_identity_v_version_status";
    DROP TYPE "public"."enum__site_identity_v_published_locale";
    DROP TYPE "public"."enum_site_identity_status";
  `)
}
