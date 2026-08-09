import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_careers_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "careers_content_application_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "careers_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"hero_cta_label" varchar,
  	"openings_note" varchar,
  	"_status" "enum_careers_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_careers_content_v_version_application_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_hero_cta_label" varchar,
  	"version_openings_note" varchar,
  	"version__status" "enum__careers_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "careers_content_application_steps" ADD CONSTRAINT "careers_content_application_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_application_steps" ADD CONSTRAINT "_careers_content_v_version_application_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "careers_content_application_steps_order_idx" ON "careers_content_application_steps" USING btree ("_order");
  CREATE INDEX "careers_content_application_steps_parent_id_idx" ON "careers_content_application_steps" USING btree ("_parent_id");
  CREATE INDEX "careers_content__status_idx" ON "careers_content" USING btree ("_status");
  CREATE INDEX "_careers_content_v_version_application_steps_order_idx" ON "_careers_content_v_version_application_steps" USING btree ("_order");
  CREATE INDEX "_careers_content_v_version_application_steps_parent_id_idx" ON "_careers_content_v_version_application_steps" USING btree ("_parent_id");
  CREATE INDEX "_careers_content_v_version_version__status_idx" ON "_careers_content_v" USING btree ("version__status");
  CREATE INDEX "_careers_content_v_created_at_idx" ON "_careers_content_v" USING btree ("created_at");
  CREATE INDEX "_careers_content_v_updated_at_idx" ON "_careers_content_v" USING btree ("updated_at");
  CREATE INDEX "_careers_content_v_latest_idx" ON "_careers_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "careers_content_application_steps" CASCADE;
  DROP TABLE "careers_content" CASCADE;
  DROP TABLE "_careers_content_v_version_application_steps" CASCADE;
  DROP TABLE "_careers_content_v" CASCADE;
  DROP TYPE "public"."enum_careers_content_status";
  DROP TYPE "public"."enum__careers_content_v_version_status";`)
}
