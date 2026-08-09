import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hero_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leadership_band_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__leadership_band_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "hero_content_agency_label_cycle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "hero_content_headline_cycle_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  
  CREATE TABLE "hero_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline_template" varchar,
  	"tagline" varchar,
  	"_status" "enum_hero_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_hero_content_v_version_agency_label_cycle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hero_content_v_version_headline_cycle_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hero_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_headline_template" varchar,
  	"version_tagline" varchar,
  	"version__status" "enum__hero_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "leadership_band_content_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"photo_id" integer,
  	"photo_position" varchar DEFAULT '50% 50%',
  	"quote" varchar
  );
  
  CREATE TABLE "leadership_band_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"_status" "enum_leadership_band_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_leadership_band_content_v_version_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"photo_id" integer,
  	"photo_position" varchar DEFAULT '50% 50%',
  	"quote" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_leadership_band_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_description" varchar,
  	"version__status" "enum__leadership_band_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "hero_content_agency_label_cycle" ADD CONSTRAINT "hero_content_agency_label_cycle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_content_headline_cycle_words" ADD CONSTRAINT "hero_content_headline_cycle_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_content_v_version_agency_label_cycle" ADD CONSTRAINT "_hero_content_v_version_agency_label_cycle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_content_v_version_headline_cycle_words" ADD CONSTRAINT "_hero_content_v_version_headline_cycle_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leadership_band_content_leaders" ADD CONSTRAINT "leadership_band_content_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leadership_band_content_leaders" ADD CONSTRAINT "leadership_band_content_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leadership_band_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leadership_band_content_v_version_leaders" ADD CONSTRAINT "_leadership_band_content_v_version_leaders_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_band_content_v_version_leaders" ADD CONSTRAINT "_leadership_band_content_v_version_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leadership_band_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hero_content_agency_label_cycle_order_idx" ON "hero_content_agency_label_cycle" USING btree ("_order");
  CREATE INDEX "hero_content_agency_label_cycle_parent_id_idx" ON "hero_content_agency_label_cycle" USING btree ("_parent_id");
  CREATE INDEX "hero_content_headline_cycle_words_order_idx" ON "hero_content_headline_cycle_words" USING btree ("_order");
  CREATE INDEX "hero_content_headline_cycle_words_parent_id_idx" ON "hero_content_headline_cycle_words" USING btree ("_parent_id");
  CREATE INDEX "hero_content__status_idx" ON "hero_content" USING btree ("_status");
  CREATE INDEX "_hero_content_v_version_agency_label_cycle_order_idx" ON "_hero_content_v_version_agency_label_cycle" USING btree ("_order");
  CREATE INDEX "_hero_content_v_version_agency_label_cycle_parent_id_idx" ON "_hero_content_v_version_agency_label_cycle" USING btree ("_parent_id");
  CREATE INDEX "_hero_content_v_version_headline_cycle_words_order_idx" ON "_hero_content_v_version_headline_cycle_words" USING btree ("_order");
  CREATE INDEX "_hero_content_v_version_headline_cycle_words_parent_id_idx" ON "_hero_content_v_version_headline_cycle_words" USING btree ("_parent_id");
  CREATE INDEX "_hero_content_v_version_version__status_idx" ON "_hero_content_v" USING btree ("version__status");
  CREATE INDEX "_hero_content_v_created_at_idx" ON "_hero_content_v" USING btree ("created_at");
  CREATE INDEX "_hero_content_v_updated_at_idx" ON "_hero_content_v" USING btree ("updated_at");
  CREATE INDEX "_hero_content_v_latest_idx" ON "_hero_content_v" USING btree ("latest");
  CREATE INDEX "leadership_band_content_leaders_order_idx" ON "leadership_band_content_leaders" USING btree ("_order");
  CREATE INDEX "leadership_band_content_leaders_parent_id_idx" ON "leadership_band_content_leaders" USING btree ("_parent_id");
  CREATE INDEX "leadership_band_content_leaders_photo_idx" ON "leadership_band_content_leaders" USING btree ("photo_id");
  CREATE INDEX "leadership_band_content__status_idx" ON "leadership_band_content" USING btree ("_status");
  CREATE INDEX "_leadership_band_content_v_version_leaders_order_idx" ON "_leadership_band_content_v_version_leaders" USING btree ("_order");
  CREATE INDEX "_leadership_band_content_v_version_leaders_parent_id_idx" ON "_leadership_band_content_v_version_leaders" USING btree ("_parent_id");
  CREATE INDEX "_leadership_band_content_v_version_leaders_photo_idx" ON "_leadership_band_content_v_version_leaders" USING btree ("photo_id");
  CREATE INDEX "_leadership_band_content_v_version_version__status_idx" ON "_leadership_band_content_v" USING btree ("version__status");
  CREATE INDEX "_leadership_band_content_v_created_at_idx" ON "_leadership_band_content_v" USING btree ("created_at");
  CREATE INDEX "_leadership_band_content_v_updated_at_idx" ON "_leadership_band_content_v" USING btree ("updated_at");
  CREATE INDEX "_leadership_band_content_v_latest_idx" ON "_leadership_band_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hero_content_agency_label_cycle" CASCADE;
  DROP TABLE "hero_content_headline_cycle_words" CASCADE;
  DROP TABLE "hero_content" CASCADE;
  DROP TABLE "_hero_content_v_version_agency_label_cycle" CASCADE;
  DROP TABLE "_hero_content_v_version_headline_cycle_words" CASCADE;
  DROP TABLE "_hero_content_v" CASCADE;
  DROP TABLE "leadership_band_content_leaders" CASCADE;
  DROP TABLE "leadership_band_content" CASCADE;
  DROP TABLE "_leadership_band_content_v_version_leaders" CASCADE;
  DROP TABLE "_leadership_band_content_v" CASCADE;
  DROP TYPE "public"."enum_hero_content_status";
  DROP TYPE "public"."enum__hero_content_v_version_status";
  DROP TYPE "public"."enum_leadership_band_content_status";
  DROP TYPE "public"."enum__leadership_band_content_v_version_status";`)
}
