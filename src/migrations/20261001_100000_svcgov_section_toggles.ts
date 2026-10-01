import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Lets an admin independently hide the 3 non-hero sections of the
// Services to Government page — Services, the department-contact table's
// intro copy, and the department-contact table itself — same
// hide{X}Section convention as Services.ts (real_hide_features_section
// etc.), just not localized since visibility isn't translatable.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_to_government_content" ADD COLUMN "hide_services_section" boolean DEFAULT false;
    ALTER TABLE "services_to_government_content" ADD COLUMN "hide_table_intro_section" boolean DEFAULT false;
    ALTER TABLE "services_to_government_content" ADD COLUMN "hide_department_contacts_section" boolean DEFAULT false;

    ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hide_services_section" boolean DEFAULT false;
    ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hide_table_intro_section" boolean DEFAULT false;
    ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hide_department_contacts_section" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_to_government_content" DROP COLUMN IF EXISTS "hide_services_section";
    ALTER TABLE "services_to_government_content" DROP COLUMN IF EXISTS "hide_table_intro_section";
    ALTER TABLE "services_to_government_content" DROP COLUMN IF EXISTS "hide_department_contacts_section";

    ALTER TABLE "_services_to_government_content_v" DROP COLUMN IF EXISTS "version_hide_services_section";
    ALTER TABLE "_services_to_government_content_v" DROP COLUMN IF EXISTS "version_hide_table_intro_section";
    ALTER TABLE "_services_to_government_content_v" DROP COLUMN IF EXISTS "version_hide_department_contacts_section";
  `)
}
