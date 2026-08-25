import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the three remaining hardcoded section headings on the Careers page
// (How to Apply, Current Openings, Apply Now) as CMS-editable fields —
// hero and the openings note already had theirs. Current Openings has no
// sub-line in JobOpenings.tsx, so `openingsSection` gets only `heading`;
// How to Apply and Apply Now both render a heading + sub via SectionHead,
// but neither shows an eyebrow, so no eyebrow column here.
// No copy-forward: these columns are brand new, seeded separately via
// script with the site's current hardcoded text so nothing visibly
// changes.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "careers_content_locales" ADD COLUMN "how_to_apply_section_heading" varchar;
    ALTER TABLE "careers_content_locales" ADD COLUMN "how_to_apply_section_sub" varchar;
    ALTER TABLE "careers_content_locales" ADD COLUMN "openings_section_heading" varchar;
    ALTER TABLE "careers_content_locales" ADD COLUMN "apply_section_heading" varchar;
    ALTER TABLE "careers_content_locales" ADD COLUMN "apply_section_sub" varchar;

    ALTER TABLE "_careers_content_v_locales" ADD COLUMN "version_how_to_apply_section_heading" varchar;
    ALTER TABLE "_careers_content_v_locales" ADD COLUMN "version_how_to_apply_section_sub" varchar;
    ALTER TABLE "_careers_content_v_locales" ADD COLUMN "version_openings_section_heading" varchar;
    ALTER TABLE "_careers_content_v_locales" ADD COLUMN "version_apply_section_heading" varchar;
    ALTER TABLE "_careers_content_v_locales" ADD COLUMN "version_apply_section_sub" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "careers_content_locales" DROP COLUMN "how_to_apply_section_heading";
    ALTER TABLE "careers_content_locales" DROP COLUMN "how_to_apply_section_sub";
    ALTER TABLE "careers_content_locales" DROP COLUMN "openings_section_heading";
    ALTER TABLE "careers_content_locales" DROP COLUMN "apply_section_heading";
    ALTER TABLE "careers_content_locales" DROP COLUMN "apply_section_sub";

    ALTER TABLE "_careers_content_v_locales" DROP COLUMN "version_how_to_apply_section_heading";
    ALTER TABLE "_careers_content_v_locales" DROP COLUMN "version_how_to_apply_section_sub";
    ALTER TABLE "_careers_content_v_locales" DROP COLUMN "version_openings_section_heading";
    ALTER TABLE "_careers_content_v_locales" DROP COLUMN "version_apply_section_heading";
    ALTER TABLE "_careers_content_v_locales" DROP COLUMN "version_apply_section_sub";
  `)
}
