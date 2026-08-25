import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Folds the "department-contacts" collection's row shape into a new
// `departmentContacts` array field on services-to-government-content, so
// the whole Services to Government page (hero, services, department
// contacts) is one CMS screen with drag-to-reorder rows instead of a
// separate collection with a numeric `order` field. The old
// "department-contacts" collection/tables are left untouched as a backup
// — see scripts/migrate-department-contacts-to-global.ts (run once, then
// deleted) for the one-off data copy.
//
// The array field carries a custom `dbName` ("svcgov_dept_contacts") —
// the default derived name for the versions-side locales table
// ("_services_to_government_content_v_version_department_contacts_locales",
// 69 chars) exceeds Postgres's 63-char identifier limit, which Payload
// enforces at boot (throws, does not truncate). With the custom dbName,
// Payload's naming algorithm (parent table name + "_v" for the versions
// table, "_locales" suffix for the locales table — see
// createTableName.js/build.js in @payloadcms/drizzle) resolves to:
//   live array table:            svcgov_dept_contacts
//   live array locales table:    svcgov_dept_contacts_locales
//   version array table:         _svcgov_dept_contacts_v
//   version array locales table: _svcgov_dept_contacts_v_locales
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "svcgov_dept_contacts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "contact" varchar,
      "email" varchar,
      "phone" varchar
    );
    ALTER TABLE "svcgov_dept_contacts" ADD CONSTRAINT "svcgov_dept_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_to_government_content"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "svcgov_dept_contacts_order_idx" ON "svcgov_dept_contacts" USING btree ("_order");
    CREATE INDEX "svcgov_dept_contacts_parent_id_idx" ON "svcgov_dept_contacts" USING btree ("_parent_id");

    CREATE TABLE "svcgov_dept_contacts_locales" (
      "department" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    ALTER TABLE "svcgov_dept_contacts_locales" ADD CONSTRAINT "svcgov_dept_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."svcgov_dept_contacts"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "svcgov_dept_contacts_locales_locale_parent_id_unique" ON "svcgov_dept_contacts_locales" USING btree ("_locale","_parent_id");

    CREATE TABLE "_svcgov_dept_contacts_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "contact" varchar,
      "email" varchar,
      "phone" varchar,
      "_uuid" varchar
    );
    ALTER TABLE "_svcgov_dept_contacts_v" ADD CONSTRAINT "_svcgov_dept_contacts_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_to_government_content_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "_svcgov_dept_contacts_v_order_idx" ON "_svcgov_dept_contacts_v" USING btree ("_order");
    CREATE INDEX "_svcgov_dept_contacts_v_parent_id_idx" ON "_svcgov_dept_contacts_v" USING btree ("_parent_id");

    CREATE TABLE "_svcgov_dept_contacts_v_locales" (
      "department" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    ALTER TABLE "_svcgov_dept_contacts_v_locales" ADD CONSTRAINT "_svcgov_dept_contacts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_svcgov_dept_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE UNIQUE INDEX "_svcgov_dept_contacts_v_locales_locale_parent_id_unique" ON "_svcgov_dept_contacts_v_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "svcgov_dept_contacts_locales" CASCADE;
    DROP TABLE "svcgov_dept_contacts" CASCADE;
    DROP TABLE "_svcgov_dept_contacts_v_locales" CASCADE;
    DROP TABLE "_svcgov_dept_contacts_v" CASCADE;
  `)
}
