import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// New collection backing /citizen-services' cards — previously a
// hardcoded 2-item array (lib/content.ts) merged with a slug lookup into
// the Services collection, not manageable from the CMS at all. This is a
// real, freely add/remove/reorder list, same shape as Awards/Team
// Members (localized name/description, an upload, an order number).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_citizen_services_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__citizen_services_v_version_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__citizen_services_v_published_locale" AS ENUM('en', 'ta');

    CREATE TABLE "citizen_services" (
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "button_href" varchar,
      "external_link" boolean DEFAULT true,
      "order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_citizen_services_status" DEFAULT 'draft'
    );
    ALTER TABLE "citizen_services" ADD CONSTRAINT "citizen_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE TABLE "citizen_services_locales" (
      "name" varchar,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "citizen_services_locales" ADD CONSTRAINT "citizen_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."citizen_services"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "citizen_services_locales_locale_parent_id_unique" ON "citizen_services_locales" USING btree ("_locale","_parent_id");

    CREATE TABLE "_citizen_services_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_image_id" integer,
      "version_button_href" varchar,
      "version_external_link" boolean DEFAULT true,
      "version_order" numeric DEFAULT 0,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__citizen_services_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "snapshot" boolean,
      "published_locale" "enum__citizen_services_v_published_locale"
    );
    ALTER TABLE "_citizen_services_v" ADD CONSTRAINT "_citizen_services_v_parent_id_citizen_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."citizen_services"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_citizen_services_v" ADD CONSTRAINT "_citizen_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE TABLE "_citizen_services_v_locales" (
      "version_name" varchar,
      "version_description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "_citizen_services_v_locales" ADD CONSTRAINT "_citizen_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_citizen_services_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "_citizen_services_v_locales_locale_parent_id_unique" ON "_citizen_services_v_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX "citizen_services_image_idx" ON "citizen_services" USING btree ("image_id");
    CREATE INDEX "citizen_services_updated_at_idx" ON "citizen_services" USING btree ("updated_at");
    CREATE INDEX "citizen_services_created_at_idx" ON "citizen_services" USING btree ("created_at");
    CREATE INDEX "citizen_services__status_idx" ON "citizen_services" USING btree ("_status");
    CREATE INDEX "_citizen_services_v_parent_idx" ON "_citizen_services_v" USING btree ("parent_id");
    CREATE INDEX "_citizen_services_v_version_version_image_idx" ON "_citizen_services_v" USING btree ("version_image_id");
    CREATE INDEX "_citizen_services_v_version_version_updated_at_idx" ON "_citizen_services_v" USING btree ("version_updated_at");
    CREATE INDEX "_citizen_services_v_version_version_created_at_idx" ON "_citizen_services_v" USING btree ("version_created_at");
    CREATE INDEX "_citizen_services_v_version_version__status_idx" ON "_citizen_services_v" USING btree ("version__status");
    CREATE INDEX "_citizen_services_v_created_at_idx" ON "_citizen_services_v" USING btree ("created_at");
    CREATE INDEX "_citizen_services_v_updated_at_idx" ON "_citizen_services_v" USING btree ("updated_at");
    CREATE INDEX "_citizen_services_v_latest_idx" ON "_citizen_services_v" USING btree ("latest");
    CREATE INDEX "_citizen_services_v_snapshot_idx" ON "_citizen_services_v" USING btree ("snapshot");
    CREATE INDEX "_citizen_services_v_published_locale_idx" ON "_citizen_services_v" USING btree ("published_locale");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "citizen_services_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_citizen_services_fk" FOREIGN KEY ("citizen_services_id") REFERENCES "public"."citizen_services"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_citizen_services_id_idx" ON "payload_locked_documents_rels" USING btree ("citizen_services_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_citizen_services_fk";
    DROP INDEX "payload_locked_documents_rels_citizen_services_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "citizen_services_id";
    DROP TABLE "_citizen_services_v_locales" CASCADE;
    DROP TABLE "_citizen_services_v" CASCADE;
    DROP TABLE "citizen_services_locales" CASCADE;
    DROP TABLE "citizen_services" CASCADE;
    DROP TYPE "public"."enum_citizen_services_status";
    DROP TYPE "public"."enum__citizen_services_v_version_status";
    DROP TYPE "public"."enum__citizen_services_v_published_locale";
  `)
}
