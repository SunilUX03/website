import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_copy_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_copy_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "site_copy_content_reach_us_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "site_copy_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"announcements_hero_eyebrow" varchar,
  	"announcements_hero_heading" varchar,
  	"announcements_hero_body" varchar,
  	"government_orders_hero_eyebrow" varchar,
  	"government_orders_hero_heading" varchar,
  	"government_orders_hero_body" varchar,
  	"policies_hero_eyebrow" varchar,
  	"policies_hero_heading" varchar,
  	"policies_hero_body" varchar,
  	"media_hero_eyebrow" varchar,
  	"media_hero_heading" varchar,
  	"media_hero_body" varchar,
  	"services_hero_eyebrow" varchar,
  	"services_hero_heading" varchar,
  	"services_hero_body" varchar,
  	"_status" "enum_site_copy_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_copy_content_v_version_reach_us_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_copy_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_announcements_hero_eyebrow" varchar,
  	"version_announcements_hero_heading" varchar,
  	"version_announcements_hero_body" varchar,
  	"version_government_orders_hero_eyebrow" varchar,
  	"version_government_orders_hero_heading" varchar,
  	"version_government_orders_hero_body" varchar,
  	"version_policies_hero_eyebrow" varchar,
  	"version_policies_hero_heading" varchar,
  	"version_policies_hero_body" varchar,
  	"version_media_hero_eyebrow" varchar,
  	"version_media_hero_heading" varchar,
  	"version_media_hero_body" varchar,
  	"version_services_hero_eyebrow" varchar,
  	"version_services_hero_heading" varchar,
  	"version_services_hero_body" varchar,
  	"version__status" "enum__site_copy_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "site_copy_content_reach_us_panels" ADD CONSTRAINT "site_copy_content_reach_us_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_copy_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" ADD CONSTRAINT "_site_copy_content_v_version_reach_us_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_copy_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_copy_content_reach_us_panels_order_idx" ON "site_copy_content_reach_us_panels" USING btree ("_order");
  CREATE INDEX "site_copy_content_reach_us_panels_parent_id_idx" ON "site_copy_content_reach_us_panels" USING btree ("_parent_id");
  CREATE INDEX "site_copy_content__status_idx" ON "site_copy_content" USING btree ("_status");
  CREATE INDEX "_site_copy_content_v_version_reach_us_panels_order_idx" ON "_site_copy_content_v_version_reach_us_panels" USING btree ("_order");
  CREATE INDEX "_site_copy_content_v_version_reach_us_panels_parent_id_idx" ON "_site_copy_content_v_version_reach_us_panels" USING btree ("_parent_id");
  CREATE INDEX "_site_copy_content_v_version_version__status_idx" ON "_site_copy_content_v" USING btree ("version__status");
  CREATE INDEX "_site_copy_content_v_created_at_idx" ON "_site_copy_content_v" USING btree ("created_at");
  CREATE INDEX "_site_copy_content_v_updated_at_idx" ON "_site_copy_content_v" USING btree ("updated_at");
  CREATE INDEX "_site_copy_content_v_latest_idx" ON "_site_copy_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_copy_content_reach_us_panels" CASCADE;
  DROP TABLE "site_copy_content" CASCADE;
  DROP TABLE "_site_copy_content_v_version_reach_us_panels" CASCADE;
  DROP TABLE "_site_copy_content_v" CASCADE;
  DROP TYPE "public"."enum_site_copy_content_status";
  DROP TYPE "public"."enum__site_copy_content_v_version_status";`)
}
