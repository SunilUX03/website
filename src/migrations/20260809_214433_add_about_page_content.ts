import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_awards_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__awards_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_roll_of_honour_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__roll_of_honour_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_page_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_org_chart_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__org_chart_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"year" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_awards_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_awards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_year" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__awards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "roll_of_honour" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"designation" varchar,
  	"name" varchar,
  	"range" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_roll_of_honour_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_roll_of_honour_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_designation" varchar,
  	"version_name" varchar,
  	"version_range" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__roll_of_honour_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "about_page_content_hierarchy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"emphasized" boolean DEFAULT false
  );
  
  CREATE TABLE "about_page_content_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "about_page_content_connect_with_us_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "about_page_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_description" varchar,
  	"who_we_are_heading" varchar,
  	"who_we_are_paragraph" varchar,
  	"connect_with_us_email" varchar,
  	"_status" "enum_about_page_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_page_content_v_version_hierarchy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"emphasized" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_content_v_version_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_content_v_version_connect_with_us_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_description" varchar,
  	"version_who_we_are_heading" varchar,
  	"version_who_we_are_paragraph" varchar,
  	"version_connect_with_us_email" varchar,
  	"version__status" "enum__about_page_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "org_chart_content_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"director" varchar,
  	"engineer" varchar,
  	"manager" varchar,
  	"base" varchar
  );
  
  CREATE TABLE "org_chart_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"top_primary" varchar DEFAULT 'CEO',
  	"top_secondary" varchar DEFAULT 'JCEO',
  	"_status" "enum_org_chart_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_org_chart_content_v_version_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"director" varchar,
  	"engineer" varchar,
  	"manager" varchar,
  	"base" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_org_chart_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_top_primary" varchar DEFAULT 'CEO',
  	"version_top_secondary" varchar DEFAULT 'JCEO',
  	"version__status" "enum__org_chart_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "awards_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "roll_of_honour_id" integer;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_parent_id_awards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."awards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_awards_v" ADD CONSTRAINT "_awards_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_roll_of_honour_v" ADD CONSTRAINT "_roll_of_honour_v_parent_id_roll_of_honour_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."roll_of_honour"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_content_hierarchy" ADD CONSTRAINT "about_page_content_hierarchy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_content_vision_mission" ADD CONSTRAINT "about_page_content_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_content_connect_with_us_social" ADD CONSTRAINT "about_page_content_connect_with_us_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_version_hierarchy" ADD CONSTRAINT "_about_page_content_v_version_hierarchy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_version_vision_mission" ADD CONSTRAINT "_about_page_content_v_version_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_version_connect_with_us_social" ADD CONSTRAINT "_about_page_content_v_version_connect_with_us_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "org_chart_content_branches" ADD CONSTRAINT "org_chart_content_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."org_chart_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD CONSTRAINT "_org_chart_content_v_version_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_org_chart_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "awards__status_idx" ON "awards" USING btree ("_status");
  CREATE INDEX "_awards_v_parent_idx" ON "_awards_v" USING btree ("parent_id");
  CREATE INDEX "_awards_v_version_version_image_idx" ON "_awards_v" USING btree ("version_image_id");
  CREATE INDEX "_awards_v_version_version_updated_at_idx" ON "_awards_v" USING btree ("version_updated_at");
  CREATE INDEX "_awards_v_version_version_created_at_idx" ON "_awards_v" USING btree ("version_created_at");
  CREATE INDEX "_awards_v_version_version__status_idx" ON "_awards_v" USING btree ("version__status");
  CREATE INDEX "_awards_v_created_at_idx" ON "_awards_v" USING btree ("created_at");
  CREATE INDEX "_awards_v_updated_at_idx" ON "_awards_v" USING btree ("updated_at");
  CREATE INDEX "_awards_v_latest_idx" ON "_awards_v" USING btree ("latest");
  CREATE INDEX "roll_of_honour_updated_at_idx" ON "roll_of_honour" USING btree ("updated_at");
  CREATE INDEX "roll_of_honour_created_at_idx" ON "roll_of_honour" USING btree ("created_at");
  CREATE INDEX "roll_of_honour__status_idx" ON "roll_of_honour" USING btree ("_status");
  CREATE INDEX "_roll_of_honour_v_parent_idx" ON "_roll_of_honour_v" USING btree ("parent_id");
  CREATE INDEX "_roll_of_honour_v_version_version_updated_at_idx" ON "_roll_of_honour_v" USING btree ("version_updated_at");
  CREATE INDEX "_roll_of_honour_v_version_version_created_at_idx" ON "_roll_of_honour_v" USING btree ("version_created_at");
  CREATE INDEX "_roll_of_honour_v_version_version__status_idx" ON "_roll_of_honour_v" USING btree ("version__status");
  CREATE INDEX "_roll_of_honour_v_created_at_idx" ON "_roll_of_honour_v" USING btree ("created_at");
  CREATE INDEX "_roll_of_honour_v_updated_at_idx" ON "_roll_of_honour_v" USING btree ("updated_at");
  CREATE INDEX "_roll_of_honour_v_latest_idx" ON "_roll_of_honour_v" USING btree ("latest");
  CREATE INDEX "about_page_content_hierarchy_order_idx" ON "about_page_content_hierarchy" USING btree ("_order");
  CREATE INDEX "about_page_content_hierarchy_parent_id_idx" ON "about_page_content_hierarchy" USING btree ("_parent_id");
  CREATE INDEX "about_page_content_vision_mission_order_idx" ON "about_page_content_vision_mission" USING btree ("_order");
  CREATE INDEX "about_page_content_vision_mission_parent_id_idx" ON "about_page_content_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "about_page_content_connect_with_us_social_order_idx" ON "about_page_content_connect_with_us_social" USING btree ("_order");
  CREATE INDEX "about_page_content_connect_with_us_social_parent_id_idx" ON "about_page_content_connect_with_us_social" USING btree ("_parent_id");
  CREATE INDEX "about_page_content__status_idx" ON "about_page_content" USING btree ("_status");
  CREATE INDEX "_about_page_content_v_version_hierarchy_order_idx" ON "_about_page_content_v_version_hierarchy" USING btree ("_order");
  CREATE INDEX "_about_page_content_v_version_hierarchy_parent_id_idx" ON "_about_page_content_v_version_hierarchy" USING btree ("_parent_id");
  CREATE INDEX "_about_page_content_v_version_vision_mission_order_idx" ON "_about_page_content_v_version_vision_mission" USING btree ("_order");
  CREATE INDEX "_about_page_content_v_version_vision_mission_parent_id_idx" ON "_about_page_content_v_version_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "_about_page_content_v_version_connect_with_us_social_order_idx" ON "_about_page_content_v_version_connect_with_us_social" USING btree ("_order");
  CREATE INDEX "_about_page_content_v_version_connect_with_us_social_parent_id_idx" ON "_about_page_content_v_version_connect_with_us_social" USING btree ("_parent_id");
  CREATE INDEX "_about_page_content_v_version_version__status_idx" ON "_about_page_content_v" USING btree ("version__status");
  CREATE INDEX "_about_page_content_v_created_at_idx" ON "_about_page_content_v" USING btree ("created_at");
  CREATE INDEX "_about_page_content_v_updated_at_idx" ON "_about_page_content_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_content_v_latest_idx" ON "_about_page_content_v" USING btree ("latest");
  CREATE INDEX "org_chart_content_branches_order_idx" ON "org_chart_content_branches" USING btree ("_order");
  CREATE INDEX "org_chart_content_branches_parent_id_idx" ON "org_chart_content_branches" USING btree ("_parent_id");
  CREATE INDEX "org_chart_content__status_idx" ON "org_chart_content" USING btree ("_status");
  CREATE INDEX "_org_chart_content_v_version_branches_order_idx" ON "_org_chart_content_v_version_branches" USING btree ("_order");
  CREATE INDEX "_org_chart_content_v_version_branches_parent_id_idx" ON "_org_chart_content_v_version_branches" USING btree ("_parent_id");
  CREATE INDEX "_org_chart_content_v_version_version__status_idx" ON "_org_chart_content_v" USING btree ("version__status");
  CREATE INDEX "_org_chart_content_v_created_at_idx" ON "_org_chart_content_v" USING btree ("created_at");
  CREATE INDEX "_org_chart_content_v_updated_at_idx" ON "_org_chart_content_v" USING btree ("updated_at");
  CREATE INDEX "_org_chart_content_v_latest_idx" ON "_org_chart_content_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roll_of_honour_fk" FOREIGN KEY ("roll_of_honour_id") REFERENCES "public"."roll_of_honour"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_roll_of_honour_id_idx" ON "payload_locked_documents_rels" USING btree ("roll_of_honour_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_awards_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "roll_of_honour" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_roll_of_honour_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_content_hierarchy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_content_vision_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_content_connect_with_us_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_content_v_version_hierarchy" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_content_v_version_vision_mission" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_content_v_version_connect_with_us_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_content_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "org_chart_content_branches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "org_chart_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_org_chart_content_v_version_branches" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_org_chart_content_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "_awards_v" CASCADE;
  DROP TABLE "roll_of_honour" CASCADE;
  DROP TABLE "_roll_of_honour_v" CASCADE;
  DROP TABLE "about_page_content_hierarchy" CASCADE;
  DROP TABLE "about_page_content_vision_mission" CASCADE;
  DROP TABLE "about_page_content_connect_with_us_social" CASCADE;
  DROP TABLE "about_page_content" CASCADE;
  DROP TABLE "_about_page_content_v_version_hierarchy" CASCADE;
  DROP TABLE "_about_page_content_v_version_vision_mission" CASCADE;
  DROP TABLE "_about_page_content_v_version_connect_with_us_social" CASCADE;
  DROP TABLE "_about_page_content_v" CASCADE;
  DROP TABLE "org_chart_content_branches" CASCADE;
  DROP TABLE "org_chart_content" CASCADE;
  DROP TABLE "_org_chart_content_v_version_branches" CASCADE;
  DROP TABLE "_org_chart_content_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_awards_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_roll_of_honour_fk";
  
  DROP INDEX "payload_locked_documents_rels_awards_id_idx";
  DROP INDEX "payload_locked_documents_rels_roll_of_honour_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "awards_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "roll_of_honour_id";
  DROP TYPE "public"."enum_awards_status";
  DROP TYPE "public"."enum__awards_v_version_status";
  DROP TYPE "public"."enum_roll_of_honour_status";
  DROP TYPE "public"."enum__roll_of_honour_v_version_status";
  DROP TYPE "public"."enum_about_page_content_status";
  DROP TYPE "public"."enum__about_page_content_v_version_status";
  DROP TYPE "public"."enum_org_chart_content_status";
  DROP TYPE "public"."enum__org_chart_content_v_version_status";`)
}
