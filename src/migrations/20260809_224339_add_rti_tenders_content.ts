import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rti_content_contacts_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_rti_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__rti_content_v_version_contacts_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__rti_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tenders_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tenders_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "rti_content_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"tone" "enum_rti_content_contacts_tone" DEFAULT 'light',
  	"name" varchar,
  	"designation" varchar,
  	"details_text" varchar
  );
  
  CREATE TABLE "rti_content_disclosures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sno" varchar,
  	"item" varchar,
  	"rows_text" varchar
  );
  
  CREATE TABLE "rti_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"how_to_file_heading" varchar,
  	"how_to_file_sub" varchar,
  	"how_to_file_body" varchar,
  	"how_to_file_cta_label" varchar,
  	"how_to_file_cta_href" varchar,
  	"how_to_file_redirect_note" varchar,
  	"how_to_file_email" varchar,
  	"how_to_file_phone" varchar,
  	"how_to_file_phone_href" varchar,
  	"_status" "enum_rti_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_rti_content_v_version_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"tone" "enum__rti_content_v_version_contacts_tone" DEFAULT 'light',
  	"name" varchar,
  	"designation" varchar,
  	"details_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rti_content_v_version_disclosures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sno" varchar,
  	"item" varchar,
  	"rows_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rti_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_how_to_file_heading" varchar,
  	"version_how_to_file_sub" varchar,
  	"version_how_to_file_body" varchar,
  	"version_how_to_file_cta_label" varchar,
  	"version_how_to_file_cta_href" varchar,
  	"version_how_to_file_redirect_note" varchar,
  	"version_how_to_file_email" varchar,
  	"version_how_to_file_phone" varchar,
  	"version_how_to_file_phone_href" varchar,
  	"version__status" "enum__rti_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "tenders_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"tender_portal_heading" varchar,
  	"tender_portal_sub" varchar,
  	"tender_portal_body" varchar,
  	"tender_portal_cta_label" varchar,
  	"tender_portal_cta_href" varchar,
  	"tender_portal_redirect_note" varchar,
  	"_status" "enum_tenders_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_tenders_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_tender_portal_heading" varchar,
  	"version_tender_portal_sub" varchar,
  	"version_tender_portal_body" varchar,
  	"version_tender_portal_cta_label" varchar,
  	"version_tender_portal_cta_href" varchar,
  	"version_tender_portal_redirect_note" varchar,
  	"version__status" "enum__tenders_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "rti_content_contacts" ADD CONSTRAINT "rti_content_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rti_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rti_content_disclosures" ADD CONSTRAINT "rti_content_disclosures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rti_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rti_content_v_version_contacts" ADD CONSTRAINT "_rti_content_v_version_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rti_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rti_content_v_version_disclosures" ADD CONSTRAINT "_rti_content_v_version_disclosures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rti_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rti_content_contacts_order_idx" ON "rti_content_contacts" USING btree ("_order");
  CREATE INDEX "rti_content_contacts_parent_id_idx" ON "rti_content_contacts" USING btree ("_parent_id");
  CREATE INDEX "rti_content_disclosures_order_idx" ON "rti_content_disclosures" USING btree ("_order");
  CREATE INDEX "rti_content_disclosures_parent_id_idx" ON "rti_content_disclosures" USING btree ("_parent_id");
  CREATE INDEX "rti_content__status_idx" ON "rti_content" USING btree ("_status");
  CREATE INDEX "_rti_content_v_version_contacts_order_idx" ON "_rti_content_v_version_contacts" USING btree ("_order");
  CREATE INDEX "_rti_content_v_version_contacts_parent_id_idx" ON "_rti_content_v_version_contacts" USING btree ("_parent_id");
  CREATE INDEX "_rti_content_v_version_disclosures_order_idx" ON "_rti_content_v_version_disclosures" USING btree ("_order");
  CREATE INDEX "_rti_content_v_version_disclosures_parent_id_idx" ON "_rti_content_v_version_disclosures" USING btree ("_parent_id");
  CREATE INDEX "_rti_content_v_version_version__status_idx" ON "_rti_content_v" USING btree ("version__status");
  CREATE INDEX "_rti_content_v_created_at_idx" ON "_rti_content_v" USING btree ("created_at");
  CREATE INDEX "_rti_content_v_updated_at_idx" ON "_rti_content_v" USING btree ("updated_at");
  CREATE INDEX "_rti_content_v_latest_idx" ON "_rti_content_v" USING btree ("latest");
  CREATE INDEX "tenders_content__status_idx" ON "tenders_content" USING btree ("_status");
  CREATE INDEX "_tenders_content_v_version_version__status_idx" ON "_tenders_content_v" USING btree ("version__status");
  CREATE INDEX "_tenders_content_v_created_at_idx" ON "_tenders_content_v" USING btree ("created_at");
  CREATE INDEX "_tenders_content_v_updated_at_idx" ON "_tenders_content_v" USING btree ("updated_at");
  CREATE INDEX "_tenders_content_v_latest_idx" ON "_tenders_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "rti_content_contacts" CASCADE;
  DROP TABLE "rti_content_disclosures" CASCADE;
  DROP TABLE "rti_content" CASCADE;
  DROP TABLE "_rti_content_v_version_contacts" CASCADE;
  DROP TABLE "_rti_content_v_version_disclosures" CASCADE;
  DROP TABLE "_rti_content_v" CASCADE;
  DROP TABLE "tenders_content" CASCADE;
  DROP TABLE "_tenders_content_v" CASCADE;
  DROP TYPE "public"."enum_rti_content_contacts_tone";
  DROP TYPE "public"."enum_rti_content_status";
  DROP TYPE "public"."enum__rti_content_v_version_contacts_tone";
  DROP TYPE "public"."enum__rti_content_v_version_status";
  DROP TYPE "public"."enum_tenders_content_status";
  DROP TYPE "public"."enum__tenders_content_v_version_status";`)
}
