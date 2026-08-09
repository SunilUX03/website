import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_spotlight_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_spotlight_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_metrics_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__metrics_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pillars_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pillars_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_spotlight_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "projects_spotlight_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "projects_spotlight" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"badge" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_spotlight_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_projects_spotlight_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_spotlight_v_version_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_spotlight_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_badge" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_spotlight_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "metrics_content_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"decimals" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "metrics_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_metrics_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_metrics_content_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"decimals" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_metrics_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__metrics_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pillars_content_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"banner_image_id" integer
  );
  
  CREATE TABLE "pillars_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_pillars_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pillars_content_v_version_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"banner_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pillars_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__pillars_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_spotlight_id" integer;
  ALTER TABLE "projects_spotlight_stats" ADD CONSTRAINT "projects_spotlight_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_spotlight_ctas" ADD CONSTRAINT "projects_spotlight_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_spotlight" ADD CONSTRAINT "projects_spotlight_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v_version_stats" ADD CONSTRAINT "_projects_spotlight_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_spotlight_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v_version_ctas" ADD CONSTRAINT "_projects_spotlight_v_version_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_spotlight_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v" ADD CONSTRAINT "_projects_spotlight_v_parent_id_projects_spotlight_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects_spotlight"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v" ADD CONSTRAINT "_projects_spotlight_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "metrics_content_metrics" ADD CONSTRAINT "metrics_content_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_metrics_content_v_version_metrics" ADD CONSTRAINT "_metrics_content_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_metrics_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillars_content_pillars" ADD CONSTRAINT "pillars_content_pillars_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pillars_content_pillars" ADD CONSTRAINT "pillars_content_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillars_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pillars_content_v_version_pillars" ADD CONSTRAINT "_pillars_content_v_version_pillars_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pillars_content_v_version_pillars" ADD CONSTRAINT "_pillars_content_v_version_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pillars_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_spotlight_stats_order_idx" ON "projects_spotlight_stats" USING btree ("_order");
  CREATE INDEX "projects_spotlight_stats_parent_id_idx" ON "projects_spotlight_stats" USING btree ("_parent_id");
  CREATE INDEX "projects_spotlight_ctas_order_idx" ON "projects_spotlight_ctas" USING btree ("_order");
  CREATE INDEX "projects_spotlight_ctas_parent_id_idx" ON "projects_spotlight_ctas" USING btree ("_parent_id");
  CREATE INDEX "projects_spotlight_image_idx" ON "projects_spotlight" USING btree ("image_id");
  CREATE INDEX "projects_spotlight_updated_at_idx" ON "projects_spotlight" USING btree ("updated_at");
  CREATE INDEX "projects_spotlight_created_at_idx" ON "projects_spotlight" USING btree ("created_at");
  CREATE INDEX "projects_spotlight__status_idx" ON "projects_spotlight" USING btree ("_status");
  CREATE INDEX "_projects_spotlight_v_version_stats_order_idx" ON "_projects_spotlight_v_version_stats" USING btree ("_order");
  CREATE INDEX "_projects_spotlight_v_version_stats_parent_id_idx" ON "_projects_spotlight_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_projects_spotlight_v_version_ctas_order_idx" ON "_projects_spotlight_v_version_ctas" USING btree ("_order");
  CREATE INDEX "_projects_spotlight_v_version_ctas_parent_id_idx" ON "_projects_spotlight_v_version_ctas" USING btree ("_parent_id");
  CREATE INDEX "_projects_spotlight_v_parent_idx" ON "_projects_spotlight_v" USING btree ("parent_id");
  CREATE INDEX "_projects_spotlight_v_version_version_image_idx" ON "_projects_spotlight_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_spotlight_v_version_version_updated_at_idx" ON "_projects_spotlight_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_spotlight_v_version_version_created_at_idx" ON "_projects_spotlight_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_spotlight_v_version_version__status_idx" ON "_projects_spotlight_v" USING btree ("version__status");
  CREATE INDEX "_projects_spotlight_v_created_at_idx" ON "_projects_spotlight_v" USING btree ("created_at");
  CREATE INDEX "_projects_spotlight_v_updated_at_idx" ON "_projects_spotlight_v" USING btree ("updated_at");
  CREATE INDEX "_projects_spotlight_v_latest_idx" ON "_projects_spotlight_v" USING btree ("latest");
  CREATE INDEX "metrics_content_metrics_order_idx" ON "metrics_content_metrics" USING btree ("_order");
  CREATE INDEX "metrics_content_metrics_parent_id_idx" ON "metrics_content_metrics" USING btree ("_parent_id");
  CREATE INDEX "metrics_content__status_idx" ON "metrics_content" USING btree ("_status");
  CREATE INDEX "_metrics_content_v_version_metrics_order_idx" ON "_metrics_content_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_metrics_content_v_version_metrics_parent_id_idx" ON "_metrics_content_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_metrics_content_v_version_version__status_idx" ON "_metrics_content_v" USING btree ("version__status");
  CREATE INDEX "_metrics_content_v_created_at_idx" ON "_metrics_content_v" USING btree ("created_at");
  CREATE INDEX "_metrics_content_v_updated_at_idx" ON "_metrics_content_v" USING btree ("updated_at");
  CREATE INDEX "_metrics_content_v_latest_idx" ON "_metrics_content_v" USING btree ("latest");
  CREATE INDEX "pillars_content_pillars_order_idx" ON "pillars_content_pillars" USING btree ("_order");
  CREATE INDEX "pillars_content_pillars_parent_id_idx" ON "pillars_content_pillars" USING btree ("_parent_id");
  CREATE INDEX "pillars_content_pillars_banner_image_idx" ON "pillars_content_pillars" USING btree ("banner_image_id");
  CREATE INDEX "pillars_content__status_idx" ON "pillars_content" USING btree ("_status");
  CREATE INDEX "_pillars_content_v_version_pillars_order_idx" ON "_pillars_content_v_version_pillars" USING btree ("_order");
  CREATE INDEX "_pillars_content_v_version_pillars_parent_id_idx" ON "_pillars_content_v_version_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pillars_content_v_version_pillars_banner_image_idx" ON "_pillars_content_v_version_pillars" USING btree ("banner_image_id");
  CREATE INDEX "_pillars_content_v_version_version__status_idx" ON "_pillars_content_v" USING btree ("version__status");
  CREATE INDEX "_pillars_content_v_created_at_idx" ON "_pillars_content_v" USING btree ("created_at");
  CREATE INDEX "_pillars_content_v_updated_at_idx" ON "_pillars_content_v" USING btree ("updated_at");
  CREATE INDEX "_pillars_content_v_latest_idx" ON "_pillars_content_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_spotlight_fk" FOREIGN KEY ("projects_spotlight_id") REFERENCES "public"."projects_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_spotlight_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_spotlight_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_spotlight_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_spotlight_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_spotlight" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_spotlight_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_spotlight_v_version_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_spotlight_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "metrics_content_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "metrics_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_metrics_content_v_version_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_metrics_content_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pillars_content_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pillars_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pillars_content_v_version_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pillars_content_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_spotlight_stats" CASCADE;
  DROP TABLE "projects_spotlight_ctas" CASCADE;
  DROP TABLE "projects_spotlight" CASCADE;
  DROP TABLE "_projects_spotlight_v_version_stats" CASCADE;
  DROP TABLE "_projects_spotlight_v_version_ctas" CASCADE;
  DROP TABLE "_projects_spotlight_v" CASCADE;
  DROP TABLE "metrics_content_metrics" CASCADE;
  DROP TABLE "metrics_content" CASCADE;
  DROP TABLE "_metrics_content_v_version_metrics" CASCADE;
  DROP TABLE "_metrics_content_v" CASCADE;
  DROP TABLE "pillars_content_pillars" CASCADE;
  DROP TABLE "pillars_content" CASCADE;
  DROP TABLE "_pillars_content_v_version_pillars" CASCADE;
  DROP TABLE "_pillars_content_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_spotlight_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_spotlight_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_spotlight_id";
  DROP TYPE "public"."enum_projects_spotlight_status";
  DROP TYPE "public"."enum__projects_spotlight_v_version_status";
  DROP TYPE "public"."enum_metrics_content_status";
  DROP TYPE "public"."enum__metrics_content_v_version_status";
  DROP TYPE "public"."enum_pillars_content_status";
  DROP TYPE "public"."enum__pillars_content_v_version_status";`)
}
