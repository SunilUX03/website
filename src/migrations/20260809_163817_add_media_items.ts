import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_items_type" AS ENUM('photo', 'video');
  CREATE TYPE "public"."enum_media_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_items_v_version_type" AS ENUM('photo', 'video');
  CREATE TYPE "public"."enum__media_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "media_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_media_items_type" DEFAULT 'photo',
  	"caption" varchar,
  	"alt_text" varchar,
  	"date" timestamp(3) with time zone,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_media_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__media_items_v_version_type" DEFAULT 'photo',
  	"version_caption" varchar,
  	"version_alt_text" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_items_id" integer;
  ALTER TABLE "media_items" ADD CONSTRAINT "media_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_items_v" ADD CONSTRAINT "_media_items_v_parent_id_media_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_items_v" ADD CONSTRAINT "_media_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_items_image_idx" ON "media_items" USING btree ("image_id");
  CREATE INDEX "media_items_updated_at_idx" ON "media_items" USING btree ("updated_at");
  CREATE INDEX "media_items_created_at_idx" ON "media_items" USING btree ("created_at");
  CREATE INDEX "media_items__status_idx" ON "media_items" USING btree ("_status");
  CREATE INDEX "_media_items_v_parent_idx" ON "_media_items_v" USING btree ("parent_id");
  CREATE INDEX "_media_items_v_version_version_image_idx" ON "_media_items_v" USING btree ("version_image_id");
  CREATE INDEX "_media_items_v_version_version_updated_at_idx" ON "_media_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_items_v_version_version_created_at_idx" ON "_media_items_v" USING btree ("version_created_at");
  CREATE INDEX "_media_items_v_version_version__status_idx" ON "_media_items_v" USING btree ("version__status");
  CREATE INDEX "_media_items_v_created_at_idx" ON "_media_items_v" USING btree ("created_at");
  CREATE INDEX "_media_items_v_updated_at_idx" ON "_media_items_v" USING btree ("updated_at");
  CREATE INDEX "_media_items_v_latest_idx" ON "_media_items_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_items_fk" FOREIGN KEY ("media_items_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_media_items_id_idx" ON "payload_locked_documents_rels" USING btree ("media_items_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_items_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_items" CASCADE;
  DROP TABLE "_media_items_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_items_fk";
  
  DROP INDEX "payload_locked_documents_rels_media_items_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_items_id";
  DROP TYPE "public"."enum_media_items_type";
  DROP TYPE "public"."enum_media_items_status";
  DROP TYPE "public"."enum__media_items_v_version_type";
  DROP TYPE "public"."enum__media_items_v_version_status";`)
}
