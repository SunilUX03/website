import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_department_contacts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__department_contacts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_to_government_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_to_government_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "department_contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"department" varchar,
  	"contact" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_department_contacts_status" DEFAULT 'draft'
  );

  CREATE TABLE "_department_contacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_department" varchar,
  	"version_contact" varchar,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__department_contacts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );

  CREATE TABLE "services_to_government_content_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );

  CREATE TABLE "services_to_government_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"table_intro_eyebrow" varchar,
  	"table_intro_heading" varchar,
  	"table_intro_body" varchar,
  	"raise_ticket_label" varchar DEFAULT 'Raise a Ticket',
  	"raise_ticket_href" varchar DEFAULT '#',
  	"_status" "enum_services_to_government_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_services_to_government_content_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_services_to_government_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_table_intro_eyebrow" varchar,
  	"version_table_intro_heading" varchar,
  	"version_table_intro_body" varchar,
  	"version_raise_ticket_label" varchar DEFAULT 'Raise a Ticket',
  	"version_raise_ticket_href" varchar DEFAULT '#',
  	"version__status" "enum__services_to_government_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "department_contacts_id" integer;
  ALTER TABLE "_department_contacts_v" ADD CONSTRAINT "_department_contacts_v_parent_id_department_contacts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."department_contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_to_government_content_services" ADD CONSTRAINT "services_to_government_content_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_to_government_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_to_government_content_v_version_services" ADD CONSTRAINT "_services_to_government_content_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_to_government_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "department_contacts_updated_at_idx" ON "department_contacts" USING btree ("updated_at");
  CREATE INDEX "department_contacts_created_at_idx" ON "department_contacts" USING btree ("created_at");
  CREATE INDEX "department_contacts__status_idx" ON "department_contacts" USING btree ("_status");
  CREATE INDEX "_department_contacts_v_parent_idx" ON "_department_contacts_v" USING btree ("parent_id");
  CREATE INDEX "_department_contacts_v_version_version_updated_at_idx" ON "_department_contacts_v" USING btree ("version_updated_at");
  CREATE INDEX "_department_contacts_v_version_version_created_at_idx" ON "_department_contacts_v" USING btree ("version_created_at");
  CREATE INDEX "_department_contacts_v_version_version__status_idx" ON "_department_contacts_v" USING btree ("version__status");
  CREATE INDEX "_department_contacts_v_created_at_idx" ON "_department_contacts_v" USING btree ("created_at");
  CREATE INDEX "_department_contacts_v_updated_at_idx" ON "_department_contacts_v" USING btree ("updated_at");
  CREATE INDEX "_department_contacts_v_latest_idx" ON "_department_contacts_v" USING btree ("latest");
  CREATE INDEX "services_to_government_content_services_order_idx" ON "services_to_government_content_services" USING btree ("_order");
  CREATE INDEX "services_to_government_content_services_parent_id_idx" ON "services_to_government_content_services" USING btree ("_parent_id");
  CREATE INDEX "services_to_government_content__status_idx" ON "services_to_government_content" USING btree ("_status");
  CREATE INDEX "_services_to_government_content_v_version_services_order_idx" ON "_services_to_government_content_v_version_services" USING btree ("_order");
  CREATE INDEX "_services_to_government_content_v_version_services_parent_id_idx" ON "_services_to_government_content_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_services_to_government_content_v_version_version__status_idx" ON "_services_to_government_content_v" USING btree ("version__status");
  CREATE INDEX "_services_to_government_content_v_created_at_idx" ON "_services_to_government_content_v" USING btree ("created_at");
  CREATE INDEX "_services_to_government_content_v_updated_at_idx" ON "_services_to_government_content_v" USING btree ("updated_at");
  CREATE INDEX "_services_to_government_content_v_latest_idx" ON "_services_to_government_content_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_department_contacts_fk" FOREIGN KEY ("department_contacts_id") REFERENCES "public"."department_contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_department_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("department_contacts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_department_contacts_fk";
  DROP INDEX "payload_locked_documents_rels_department_contacts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "department_contacts_id";
  DROP TABLE "department_contacts" CASCADE;
  DROP TABLE "_department_contacts_v" CASCADE;
  DROP TABLE "services_to_government_content_services" CASCADE;
  DROP TABLE "services_to_government_content" CASCADE;
  DROP TABLE "_services_to_government_content_v_version_services" CASCADE;
  DROP TABLE "_services_to_government_content_v" CASCADE;
  DROP TYPE "public"."enum_department_contacts_status";
  DROP TYPE "public"."enum__department_contacts_v_version_status";
  DROP TYPE "public"."enum_services_to_government_content_status";
  DROP TYPE "public"."enum__services_to_government_content_v_version_status";`)
}
