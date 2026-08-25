import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a section-level eyebrow/heading pair for each of the About page's
// remaining hardcoded section headings (Organisation Structure,
// Leadership & Team, Governing Board, Awards & Recognition, Roll of
// Honour) — Hero, Who We Are, and Vision & Mission already had theirs.
// No copy-forward: these columns are brand new, seeded separately via
// script with the site's current hardcoded text so nothing visibly
// changes.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_page_content_locales" ADD COLUMN "org_chart_section_eyebrow" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "org_chart_section_heading" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "leadership_section_eyebrow" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "leadership_section_heading" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "board_section_eyebrow" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "board_section_heading" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "awards_section_eyebrow" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "awards_section_heading" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "roll_of_honour_section_eyebrow" varchar;
    ALTER TABLE "about_page_content_locales" ADD COLUMN "roll_of_honour_section_heading" varchar;

    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_org_chart_section_eyebrow" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_org_chart_section_heading" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_leadership_section_eyebrow" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_leadership_section_heading" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_board_section_eyebrow" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_board_section_heading" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_awards_section_eyebrow" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_awards_section_heading" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_roll_of_honour_section_eyebrow" varchar;
    ALTER TABLE "_about_page_content_v_locales" ADD COLUMN "version_roll_of_honour_section_heading" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_page_content_locales" DROP COLUMN "org_chart_section_eyebrow";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "org_chart_section_heading";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "leadership_section_eyebrow";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "leadership_section_heading";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "board_section_eyebrow";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "board_section_heading";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "awards_section_eyebrow";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "awards_section_heading";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "roll_of_honour_section_eyebrow";
    ALTER TABLE "about_page_content_locales" DROP COLUMN "roll_of_honour_section_heading";

    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_org_chart_section_eyebrow";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_org_chart_section_heading";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_leadership_section_eyebrow";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_leadership_section_heading";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_board_section_eyebrow";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_board_section_heading";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_awards_section_eyebrow";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_awards_section_heading";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_roll_of_honour_section_eyebrow";
    ALTER TABLE "_about_page_content_v_locales" DROP COLUMN "version_roll_of_honour_section_heading";
  `)
}
