import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_posts_platform" AS ENUM('facebook', 'instagram', 'x', 'youtube', 'linkedin');
  CREATE TYPE "public"."enum_social_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_posts_v_version_platform" AS ENUM('facebook', 'instagram', 'x', 'youtube', 'linkedin');
  CREATE TYPE "public"."enum__social_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "social_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_social_posts_platform",
  	"text" varchar,
  	"date" timestamp(3) with time zone,
  	"image_id" integer,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_social_posts_status" DEFAULT 'draft'
  );

  CREATE TABLE "_social_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_platform" "enum__social_posts_v_version_platform",
  	"version_text" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_link" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__social_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_posts_id" integer;
  ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_posts_v" ADD CONSTRAINT "_social_posts_v_parent_id_social_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_posts_v" ADD CONSTRAINT "_social_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "social_posts_image_idx" ON "social_posts" USING btree ("image_id");
  CREATE INDEX "social_posts_updated_at_idx" ON "social_posts" USING btree ("updated_at");
  CREATE INDEX "social_posts_created_at_idx" ON "social_posts" USING btree ("created_at");
  CREATE INDEX "social_posts__status_idx" ON "social_posts" USING btree ("_status");
  CREATE INDEX "_social_posts_v_parent_idx" ON "_social_posts_v" USING btree ("parent_id");
  CREATE INDEX "_social_posts_v_version_version_image_idx" ON "_social_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_social_posts_v_version_version_updated_at_idx" ON "_social_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_social_posts_v_version_version_created_at_idx" ON "_social_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_social_posts_v_version_version__status_idx" ON "_social_posts_v" USING btree ("version__status");
  CREATE INDEX "_social_posts_v_created_at_idx" ON "_social_posts_v" USING btree ("created_at");
  CREATE INDEX "_social_posts_v_updated_at_idx" ON "_social_posts_v" USING btree ("updated_at");
  CREATE INDEX "_social_posts_v_latest_idx" ON "_social_posts_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_posts_fk" FOREIGN KEY ("social_posts_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_social_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_posts_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "social_posts" CASCADE;
  DROP TABLE "_social_posts_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_posts_fk";

  DROP INDEX "payload_locked_documents_rels_social_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_posts_id";
  DROP TYPE "public"."enum_social_posts_platform";
  DROP TYPE "public"."enum_social_posts_status";
  DROP TYPE "public"."enum__social_posts_v_version_platform";
  DROP TYPE "public"."enum__social_posts_v_version_status";`)
}
