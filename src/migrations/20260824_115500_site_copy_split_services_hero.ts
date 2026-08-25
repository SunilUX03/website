import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// `servicesHero` (singular) was the leftover hero for the old /services
// page, which has since split into three standalone pages
// (/citizen-services, /services-to-government, /initiatives-projects).
// None of them read servicesHero any more — services-to-government has
// its own dedicated hero field on a different global, so this migration
// replaces servicesHero with one hero each for the two pages that were
// still hardcoding their hero copy in JSX, plus a new hero for /reach-us
// (which never had CMS-backed hero copy at all). No copy-forward: these
// are genuinely new fields, seeded separately with the site's current
// hardcoded text via a follow-up script so nothing visibly changes.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "citizen_services_hero_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "citizen_services_hero_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "citizen_services_hero_body" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "initiatives_projects_hero_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "initiatives_projects_hero_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "initiatives_projects_hero_body" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "reach_us_hero_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "reach_us_hero_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "reach_us_hero_body" varchar;
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "services_hero_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "services_hero_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "services_hero_body";

    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_citizen_services_hero_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_citizen_services_hero_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_citizen_services_hero_body" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_initiatives_projects_hero_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_initiatives_projects_hero_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_initiatives_projects_hero_body" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_reach_us_hero_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_reach_us_hero_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_reach_us_hero_body" varchar;
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_services_hero_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_services_hero_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_services_hero_body";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "services_hero_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "services_hero_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "services_hero_body" varchar;
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "citizen_services_hero_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "citizen_services_hero_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "citizen_services_hero_body";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "initiatives_projects_hero_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "initiatives_projects_hero_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "initiatives_projects_hero_body";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "reach_us_hero_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "reach_us_hero_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN "reach_us_hero_body";

    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_services_hero_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_services_hero_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_services_hero_body" varchar;
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_citizen_services_hero_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_citizen_services_hero_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_citizen_services_hero_body";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_initiatives_projects_hero_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_initiatives_projects_hero_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_initiatives_projects_hero_body";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_reach_us_hero_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_reach_us_hero_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN "version_reach_us_hero_body";
  `)
}
