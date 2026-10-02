import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds an optional "documents" array to Announcements — one or more
// labeled PDF attachments shown in a "Documents" section on the
// announcement's own page, alongside the existing "Related" links box.
// Same shape as Services' real_product_tour (array row holding both a
// plain field and an upload relation).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "announcements_documents" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"label" varchar,
    	"file_id" integer
    );

    CREATE TABLE "_announcements_v_version_documents" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"label" varchar,
    	"file_id" integer,
    	"_uuid" varchar
    );

    ALTER TABLE "announcements_documents" ADD CONSTRAINT "announcements_documents_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "announcements_documents" ADD CONSTRAINT "announcements_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_announcements_v_version_documents" ADD CONSTRAINT "_announcements_v_version_documents_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_announcements_v_version_documents" ADD CONSTRAINT "_announcements_v_version_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "announcements_documents_order_idx" ON "announcements_documents" USING btree ("_order");
    CREATE INDEX "announcements_documents_parent_id_idx" ON "announcements_documents" USING btree ("_parent_id");
    CREATE INDEX "announcements_documents_file_idx" ON "announcements_documents" USING btree ("file_id");
    CREATE INDEX "_announcements_v_version_documents_order_idx" ON "_announcements_v_version_documents" USING btree ("_order");
    CREATE INDEX "_announcements_v_version_documents_parent_id_idx" ON "_announcements_v_version_documents" USING btree ("_parent_id");
    CREATE INDEX "_announcements_v_version_documents_file_idx" ON "_announcements_v_version_documents" USING btree ("file_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "announcements_documents" CASCADE;
    DROP TABLE "_announcements_v_version_documents" CASCADE;
  `)
}
