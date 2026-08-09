import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_legal_pages_slug" AS ENUM('privacy-policy', 'terms-conditions', 'terms-of-use', 'disclaimer', 'help', 'feedback');
  CREATE TYPE "public"."enum_legal_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_pages_v_version_slug" AS ENUM('privacy-policy', 'terms-conditions', 'terms-of-use', 'disclaimer', 'help', 'feedback');
  CREATE TYPE "public"."enum__legal_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_content_social_links_label" AS ENUM('Facebook', 'X', 'YouTube', 'Instagram', 'LinkedIn');
  CREATE TYPE "public"."enum_footer_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_content_v_version_social_links_label" AS ENUM('Facebook', 'X', 'YouTube', 'Instagram', 'LinkedIn');
  CREATE TYPE "public"."enum__footer_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "legal_pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_legal_pages_slug",
  	"title" varchar,
  	"eyebrow" varchar DEFAULT 'Legal',
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_legal_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" "enum__legal_pages_v_version_slug",
  	"version_title" varchar,
  	"version_eyebrow" varchar DEFAULT 'Legal',
  	"version_intro" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "footer_content_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" "enum_footer_content_social_links_label",
  	"href" varchar
  );
  
  CREATE TABLE "footer_content_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_content_citizen_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_content_help_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"_status" "enum_footer_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_content_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" "enum__footer_content_v_version_social_links_label",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_content_v_version_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_content_v_version_citizen_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_content_v_version_help_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_description" varchar,
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version__status" "enum__footer_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_pages_id" integer;
  ALTER TABLE "legal_pages_sections" ADD CONSTRAINT "legal_pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_version_sections" ADD CONSTRAINT "_legal_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v" ADD CONSTRAINT "_legal_pages_v_parent_id_legal_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_content_social_links" ADD CONSTRAINT "footer_content_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_quick_links" ADD CONSTRAINT "footer_content_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_citizen_services" ADD CONSTRAINT "footer_content_citizen_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_help_support" ADD CONSTRAINT "footer_content_help_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_social_links" ADD CONSTRAINT "_footer_content_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_quick_links" ADD CONSTRAINT "_footer_content_v_version_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_citizen_services" ADD CONSTRAINT "_footer_content_v_version_citizen_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_help_support" ADD CONSTRAINT "_footer_content_v_version_help_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "legal_pages_sections_order_idx" ON "legal_pages_sections" USING btree ("_order");
  CREATE INDEX "legal_pages_sections_parent_id_idx" ON "legal_pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_pages_slug_idx" ON "legal_pages" USING btree ("slug");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "legal_pages__status_idx" ON "legal_pages" USING btree ("_status");
  CREATE INDEX "_legal_pages_v_version_sections_order_idx" ON "_legal_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_legal_pages_v_version_sections_parent_id_idx" ON "_legal_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_legal_pages_v_parent_idx" ON "_legal_pages_v" USING btree ("parent_id");
  CREATE INDEX "_legal_pages_v_version_version_slug_idx" ON "_legal_pages_v" USING btree ("version_slug");
  CREATE INDEX "_legal_pages_v_version_version_updated_at_idx" ON "_legal_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_pages_v_version_version_created_at_idx" ON "_legal_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_pages_v_version_version__status_idx" ON "_legal_pages_v" USING btree ("version__status");
  CREATE INDEX "_legal_pages_v_created_at_idx" ON "_legal_pages_v" USING btree ("created_at");
  CREATE INDEX "_legal_pages_v_updated_at_idx" ON "_legal_pages_v" USING btree ("updated_at");
  CREATE INDEX "_legal_pages_v_latest_idx" ON "_legal_pages_v" USING btree ("latest");
  CREATE INDEX "footer_content_social_links_order_idx" ON "footer_content_social_links" USING btree ("_order");
  CREATE INDEX "footer_content_social_links_parent_id_idx" ON "footer_content_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_content_quick_links_order_idx" ON "footer_content_quick_links" USING btree ("_order");
  CREATE INDEX "footer_content_quick_links_parent_id_idx" ON "footer_content_quick_links" USING btree ("_parent_id");
  CREATE INDEX "footer_content_citizen_services_order_idx" ON "footer_content_citizen_services" USING btree ("_order");
  CREATE INDEX "footer_content_citizen_services_parent_id_idx" ON "footer_content_citizen_services" USING btree ("_parent_id");
  CREATE INDEX "footer_content_help_support_order_idx" ON "footer_content_help_support" USING btree ("_order");
  CREATE INDEX "footer_content_help_support_parent_id_idx" ON "footer_content_help_support" USING btree ("_parent_id");
  CREATE INDEX "footer_content__status_idx" ON "footer_content" USING btree ("_status");
  CREATE INDEX "_footer_content_v_version_social_links_order_idx" ON "_footer_content_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_footer_content_v_version_social_links_parent_id_idx" ON "_footer_content_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_content_v_version_quick_links_order_idx" ON "_footer_content_v_version_quick_links" USING btree ("_order");
  CREATE INDEX "_footer_content_v_version_quick_links_parent_id_idx" ON "_footer_content_v_version_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_content_v_version_citizen_services_order_idx" ON "_footer_content_v_version_citizen_services" USING btree ("_order");
  CREATE INDEX "_footer_content_v_version_citizen_services_parent_id_idx" ON "_footer_content_v_version_citizen_services" USING btree ("_parent_id");
  CREATE INDEX "_footer_content_v_version_help_support_order_idx" ON "_footer_content_v_version_help_support" USING btree ("_order");
  CREATE INDEX "_footer_content_v_version_help_support_parent_id_idx" ON "_footer_content_v_version_help_support" USING btree ("_parent_id");
  CREATE INDEX "_footer_content_v_version_version__status_idx" ON "_footer_content_v" USING btree ("version__status");
  CREATE INDEX "_footer_content_v_created_at_idx" ON "_footer_content_v" USING btree ("created_at");
  CREATE INDEX "_footer_content_v_updated_at_idx" ON "_footer_content_v" USING btree ("updated_at");
  CREATE INDEX "_footer_content_v_latest_idx" ON "_footer_content_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "legal_pages_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_pages_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_quick_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_citizen_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_help_support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_quick_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_citizen_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_help_support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "legal_pages_sections" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "_legal_pages_v_version_sections" CASCADE;
  DROP TABLE "_legal_pages_v" CASCADE;
  DROP TABLE "footer_content_social_links" CASCADE;
  DROP TABLE "footer_content_quick_links" CASCADE;
  DROP TABLE "footer_content_citizen_services" CASCADE;
  DROP TABLE "footer_content_help_support" CASCADE;
  DROP TABLE "footer_content" CASCADE;
  DROP TABLE "_footer_content_v_version_social_links" CASCADE;
  DROP TABLE "_footer_content_v_version_quick_links" CASCADE;
  DROP TABLE "_footer_content_v_version_citizen_services" CASCADE;
  DROP TABLE "_footer_content_v_version_help_support" CASCADE;
  DROP TABLE "_footer_content_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_legal_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_legal_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_pages_id";
  DROP TYPE "public"."enum_legal_pages_slug";
  DROP TYPE "public"."enum_legal_pages_status";
  DROP TYPE "public"."enum__legal_pages_v_version_slug";
  DROP TYPE "public"."enum__legal_pages_v_version_status";
  DROP TYPE "public"."enum_footer_content_social_links_label";
  DROP TYPE "public"."enum_footer_content_status";
  DROP TYPE "public"."enum__footer_content_v_version_social_links_label";
  DROP TYPE "public"."enum__footer_content_v_version_status";`)
}
