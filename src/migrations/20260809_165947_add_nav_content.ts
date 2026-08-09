import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_nav_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__nav_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "nav_content_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "nav_content_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "nav_content_notifications_updates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "nav_content_notifications_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "nav_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gov_label" varchar,
  	"_status" "enum_nav_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_nav_content_v_version_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_nav_content_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_nav_content_v_version_notifications_updates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_nav_content_v_version_notifications_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_nav_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_gov_label" varchar,
  	"version__status" "enum__nav_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "nav_content_about" ADD CONSTRAINT "nav_content_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_services" ADD CONSTRAINT "nav_content_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_notifications_updates" ADD CONSTRAINT "nav_content_notifications_updates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_notifications_documents" ADD CONSTRAINT "nav_content_notifications_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_about" ADD CONSTRAINT "_nav_content_v_version_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_services" ADD CONSTRAINT "_nav_content_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_notifications_updates" ADD CONSTRAINT "_nav_content_v_version_notifications_updates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_notifications_documents" ADD CONSTRAINT "_nav_content_v_version_notifications_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "nav_content_about_order_idx" ON "nav_content_about" USING btree ("_order");
  CREATE INDEX "nav_content_about_parent_id_idx" ON "nav_content_about" USING btree ("_parent_id");
  CREATE INDEX "nav_content_services_order_idx" ON "nav_content_services" USING btree ("_order");
  CREATE INDEX "nav_content_services_parent_id_idx" ON "nav_content_services" USING btree ("_parent_id");
  CREATE INDEX "nav_content_notifications_updates_order_idx" ON "nav_content_notifications_updates" USING btree ("_order");
  CREATE INDEX "nav_content_notifications_updates_parent_id_idx" ON "nav_content_notifications_updates" USING btree ("_parent_id");
  CREATE INDEX "nav_content_notifications_documents_order_idx" ON "nav_content_notifications_documents" USING btree ("_order");
  CREATE INDEX "nav_content_notifications_documents_parent_id_idx" ON "nav_content_notifications_documents" USING btree ("_parent_id");
  CREATE INDEX "nav_content__status_idx" ON "nav_content" USING btree ("_status");
  CREATE INDEX "_nav_content_v_version_about_order_idx" ON "_nav_content_v_version_about" USING btree ("_order");
  CREATE INDEX "_nav_content_v_version_about_parent_id_idx" ON "_nav_content_v_version_about" USING btree ("_parent_id");
  CREATE INDEX "_nav_content_v_version_services_order_idx" ON "_nav_content_v_version_services" USING btree ("_order");
  CREATE INDEX "_nav_content_v_version_services_parent_id_idx" ON "_nav_content_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_nav_content_v_version_notifications_updates_order_idx" ON "_nav_content_v_version_notifications_updates" USING btree ("_order");
  CREATE INDEX "_nav_content_v_version_notifications_updates_parent_id_idx" ON "_nav_content_v_version_notifications_updates" USING btree ("_parent_id");
  CREATE INDEX "_nav_content_v_version_notifications_documents_order_idx" ON "_nav_content_v_version_notifications_documents" USING btree ("_order");
  CREATE INDEX "_nav_content_v_version_notifications_documents_parent_id_idx" ON "_nav_content_v_version_notifications_documents" USING btree ("_parent_id");
  CREATE INDEX "_nav_content_v_version_version__status_idx" ON "_nav_content_v" USING btree ("version__status");
  CREATE INDEX "_nav_content_v_created_at_idx" ON "_nav_content_v" USING btree ("created_at");
  CREATE INDEX "_nav_content_v_updated_at_idx" ON "_nav_content_v" USING btree ("updated_at");
  CREATE INDEX "_nav_content_v_latest_idx" ON "_nav_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "nav_content_about" CASCADE;
  DROP TABLE "nav_content_services" CASCADE;
  DROP TABLE "nav_content_notifications_updates" CASCADE;
  DROP TABLE "nav_content_notifications_documents" CASCADE;
  DROP TABLE "nav_content" CASCADE;
  DROP TABLE "_nav_content_v_version_about" CASCADE;
  DROP TABLE "_nav_content_v_version_services" CASCADE;
  DROP TABLE "_nav_content_v_version_notifications_updates" CASCADE;
  DROP TABLE "_nav_content_v_version_notifications_documents" CASCADE;
  DROP TABLE "_nav_content_v" CASCADE;
  DROP TYPE "public"."enum_nav_content_status";
  DROP TYPE "public"."enum__nav_content_v_version_status";`)
}
