import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds editable column-heading labels (S.No / Department / Contact /
// Email / Phone) for the department-contacts table on the Services to
// Government page — previously hardcoded strings in the component.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_to_government_content_locales" ADD COLUMN "table_column_headers_serial_number" varchar;
    ALTER TABLE "services_to_government_content_locales" ADD COLUMN "table_column_headers_department" varchar;
    ALTER TABLE "services_to_government_content_locales" ADD COLUMN "table_column_headers_contact" varchar;
    ALTER TABLE "services_to_government_content_locales" ADD COLUMN "table_column_headers_email" varchar;
    ALTER TABLE "services_to_government_content_locales" ADD COLUMN "table_column_headers_phone" varchar;

    ALTER TABLE "_services_to_government_content_v_locales" ADD COLUMN "version_table_column_headers_serial_number" varchar;
    ALTER TABLE "_services_to_government_content_v_locales" ADD COLUMN "version_table_column_headers_department" varchar;
    ALTER TABLE "_services_to_government_content_v_locales" ADD COLUMN "version_table_column_headers_contact" varchar;
    ALTER TABLE "_services_to_government_content_v_locales" ADD COLUMN "version_table_column_headers_email" varchar;
    ALTER TABLE "_services_to_government_content_v_locales" ADD COLUMN "version_table_column_headers_phone" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_to_government_content_locales" DROP COLUMN IF EXISTS "table_column_headers_serial_number";
    ALTER TABLE "services_to_government_content_locales" DROP COLUMN IF EXISTS "table_column_headers_department";
    ALTER TABLE "services_to_government_content_locales" DROP COLUMN IF EXISTS "table_column_headers_contact";
    ALTER TABLE "services_to_government_content_locales" DROP COLUMN IF EXISTS "table_column_headers_email";
    ALTER TABLE "services_to_government_content_locales" DROP COLUMN IF EXISTS "table_column_headers_phone";

    ALTER TABLE "_services_to_government_content_v_locales" DROP COLUMN IF EXISTS "version_table_column_headers_serial_number";
    ALTER TABLE "_services_to_government_content_v_locales" DROP COLUMN IF EXISTS "version_table_column_headers_department";
    ALTER TABLE "_services_to_government_content_v_locales" DROP COLUMN IF EXISTS "version_table_column_headers_contact";
    ALTER TABLE "_services_to_government_content_v_locales" DROP COLUMN IF EXISTS "version_table_column_headers_email";
    ALTER TABLE "_services_to_government_content_v_locales" DROP COLUMN IF EXISTS "version_table_column_headers_phone";
  `)
}
