import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "announcements_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "announcements_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_announcements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_announcements_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_announcements_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_announcements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_heading" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_category" varchar,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__announcements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "cms_users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "announcements_facts" ADD CONSTRAINT "announcements_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_links" ADD CONSTRAINT "announcements_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v_version_facts" ADD CONSTRAINT "_announcements_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_version_links" ADD CONSTRAINT "_announcements_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "announcements_facts_order_idx" ON "announcements_facts" USING btree ("_order");
  CREATE INDEX "announcements_facts_parent_id_idx" ON "announcements_facts" USING btree ("_parent_id");
  CREATE INDEX "announcements_links_order_idx" ON "announcements_links" USING btree ("_order");
  CREATE INDEX "announcements_links_parent_id_idx" ON "announcements_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "announcements_slug_idx" ON "announcements" USING btree ("slug");
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_version_facts_order_idx" ON "_announcements_v_version_facts" USING btree ("_order");
  CREATE INDEX "_announcements_v_version_facts_parent_id_idx" ON "_announcements_v_version_facts" USING btree ("_parent_id");
  CREATE INDEX "_announcements_v_version_links_order_idx" ON "_announcements_v_version_links" USING btree ("_order");
  CREATE INDEX "_announcements_v_version_links_parent_id_idx" ON "_announcements_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_announcements_v_parent_idx" ON "_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_slug_idx" ON "_announcements_v" USING btree ("version_slug");
  CREATE INDEX "_announcements_v_version_version_image_idx" ON "_announcements_v" USING btree ("version_image_id");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "_announcements_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_version_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements_facts" CASCADE;
  DROP TABLE "announcements_links" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "_announcements_v_version_facts" CASCADE;
  DROP TABLE "_announcements_v_version_links" CASCADE;
  DROP TABLE "_announcements_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "cms_users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  DROP TYPE "public"."enum_announcements_status";
  DROP TYPE "public"."enum__announcements_v_version_status";`)
}
