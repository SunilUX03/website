import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds per-item editable eyebrow/heading overrides and section hide-toggles
// to Services (real.*), a button-text override to Citizen Services, and
// shared Explore-More/Support heading overrides to Site Copy (used on
// every service/project detail page, so they live once on the global
// rather than duplicated per item). Drops two fields the admin form no
// longer needs: real.hideStatFeatureCards (Key Features never mixes in
// Statistics cards any more — always shown independently) and
// real.productTourCaption (the caption line under the gallery is removed).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_stat_feature_cards";
    ALTER TABLE "services" ADD COLUMN "real_hide_features_section" boolean DEFAULT false;
    ALTER TABLE "services" ADD COLUMN "real_hide_eligibility_section" boolean DEFAULT false;
    ALTER TABLE "services" ADD COLUMN "real_hide_faq_section" boolean DEFAULT false;
    ALTER TABLE "services" ADD COLUMN "real_hide_product_tour_section" boolean DEFAULT false;
    ALTER TABLE "services" ADD COLUMN "real_hide_get_started_section" boolean DEFAULT false;

    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_stat_feature_cards";
    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_features_section" boolean DEFAULT false;
    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_eligibility_section" boolean DEFAULT false;
    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_faq_section" boolean DEFAULT false;
    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_product_tour_section" boolean DEFAULT false;
    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_get_started_section" boolean DEFAULT false;

    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_product_tour_caption";
    ALTER TABLE "services_locales" ADD COLUMN "real_about_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_about_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_features_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_features_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_eligibility_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_eligibility_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_eligibility_who_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_eligibility_docs_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_faq_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_faq_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_product_tour_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_product_tour_heading" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_direct_link_portal_label" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_get_started_eyebrow" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_get_started_heading" varchar;

    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_product_tour_caption";
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_about_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_about_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_features_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_features_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_eligibility_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_eligibility_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_eligibility_who_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_eligibility_docs_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_faq_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_faq_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_product_tour_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_product_tour_heading" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_direct_link_portal_label" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_get_started_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_get_started_heading" varchar;

    ALTER TABLE "citizen_services_locales" ADD COLUMN "button_label" varchar;
    ALTER TABLE "_citizen_services_v_locales" ADD COLUMN "version_button_label" varchar;

    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_explore_more_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_explore_more_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_support_eyebrow" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_support_heading" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_helpline_label" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_email_label" varchar;
    ALTER TABLE "site_copy_content_locales" ADD COLUMN "service_detail_footer_headings_office_label" varchar;

    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_explore_more_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_explore_more_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_support_eyebrow" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_support_heading" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_helpline_label" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_email_label" varchar;
    ALTER TABLE "_site_copy_content_v_locales" ADD COLUMN "version_service_detail_footer_headings_office_label" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN "real_hide_stat_feature_cards" boolean DEFAULT false;
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_features_section";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_eligibility_section";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_faq_section";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_product_tour_section";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_hide_get_started_section";

    ALTER TABLE "_services_v" ADD COLUMN "version_real_hide_stat_feature_cards" boolean DEFAULT false;
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_features_section";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_eligibility_section";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_faq_section";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_product_tour_section";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_hide_get_started_section";

    ALTER TABLE "services_locales" ADD COLUMN "real_product_tour_caption" varchar;
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_about_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_about_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_features_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_features_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_eligibility_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_eligibility_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_eligibility_who_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_eligibility_docs_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_faq_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_faq_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_product_tour_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_product_tour_heading";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_direct_link_portal_label";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_get_started_eyebrow";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_get_started_heading";

    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_product_tour_caption" varchar;
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_about_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_about_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_features_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_features_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_eligibility_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_eligibility_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_eligibility_who_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_eligibility_docs_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_faq_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_faq_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_product_tour_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_product_tour_heading";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_direct_link_portal_label";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_get_started_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_get_started_heading";

    ALTER TABLE "citizen_services_locales" DROP COLUMN IF EXISTS "button_label";
    ALTER TABLE "_citizen_services_v_locales" DROP COLUMN IF EXISTS "version_button_label";

    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_explore_more_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_explore_more_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_support_eyebrow";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_support_heading";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_helpline_label";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_email_label";
    ALTER TABLE "site_copy_content_locales" DROP COLUMN IF EXISTS "service_detail_footer_headings_office_label";

    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_explore_more_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_explore_more_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_support_eyebrow";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_support_heading";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_helpline_label";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_email_label";
    ALTER TABLE "_site_copy_content_v_locales" DROP COLUMN IF EXISTS "version_service_detail_footer_headings_office_label";
  `)
}
