import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Two small additions for the Initiatives & Projects rework:
// 1. "Initiative" as a third typeLabel option (Project/Service already
//    existed) — Postgres enums can't drop a value, so `down` is a no-op
//    for that part; adding a value is safe and non-destructive.
// 2. The "View All Initiatives & Projects" button shown on every service
//    detail page — previously hardcoded text + a hardcoded href
//    (ServiceDetailContent.tsx), now editable via SiteCopyContent.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_services_real_type_label" ADD VALUE IF NOT EXISTS 'Initiative';
    ALTER TYPE "public"."enum__services_v_version_real_type_label" ADD VALUE IF NOT EXISTS 'Initiative';

    ALTER TABLE "site_copy_content" ADD COLUMN "view_all_initiatives_button_href" varchar;
    ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_view_all_initiatives_button_href" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "view_all_initiatives_button_label" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_view_all_initiatives_button_label" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_copy_content" DROP COLUMN "view_all_initiatives_button_href";
    ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_view_all_initiatives_button_href";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "view_all_initiatives_button_label";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_view_all_initiatives_button_label";
  `)
  // Postgres has no DROP VALUE for enums — the added 'Initiative' option
  // is left in place on rollback (harmless: an unused enum value).
}
