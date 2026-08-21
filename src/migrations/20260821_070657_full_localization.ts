import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "announcements_facts_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "announcements_locales" (
  	"heading" varchar,
  	"description" varchar,
  	"category" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_announcements_v_version_facts_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_announcements_v_locales" (
  	"version_heading" varchar,
  	"version_description" varchar,
  	"version_category" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_items_locales" (
  	"caption" varchar,
  	"alt_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_media_items_v_locales" (
  	"version_caption" varchar,
  	"version_alt_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_openings_locales" (
  	"role" varchar,
  	"type" varchar DEFAULT 'Contract',
  	"department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_openings_v_locales" (
  	"version_role" varchar,
  	"version_type" varchar DEFAULT 'Contract',
  	"version_department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"designation" varchar,
  	"subject" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_team_members_v_locales" (
  	"version_designation" varchar,
  	"version_subject" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_real_statistics_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_key_features_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_key_feature_descriptions_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_eligibility_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_what_youll_need_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_faqs_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_faqs_more_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_about_link_modal_items_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_product_tour_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_real_get_started_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"name" varchar,
  	"description" varchar,
  	"stats" varchar,
  	"real_tagline" varchar,
  	"real_about_second_paragraph" varchar,
  	"real_callout_text" varchar,
  	"real_about_link_modal_label" varchar,
  	"real_about_link_modal_title" varchar,
  	"real_product_tour_caption" varchar,
  	"real_get_started_intro" varchar,
  	"real_get_started_outro" varchar,
  	"real_direct_link_label" varchar,
  	"real_cta_label" varchar,
  	"real_related_card_stats" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_statistics_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_key_features_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_key_feature_descriptions_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_eligibility_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_what_youll_need_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_faqs_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_faqs_more_locales" (
  	"q" varchar,
  	"a" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_about_link_modal_items_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_product_tour_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_get_started_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_stats" varchar,
  	"version_real_tagline" varchar,
  	"version_real_about_second_paragraph" varchar,
  	"version_real_callout_text" varchar,
  	"version_real_about_link_modal_label" varchar,
  	"version_real_about_link_modal_title" varchar,
  	"version_real_product_tour_caption" varchar,
  	"version_real_get_started_intro" varchar,
  	"version_real_get_started_outro" varchar,
  	"version_real_direct_link_label" varchar,
  	"version_real_cta_label" varchar,
  	"version_real_related_card_stats" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "government_orders_locales" (
  	"department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_government_orders_v_locales" (
  	"version_department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "policies_locales" (
  	"category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_policies_v_locales" (
  	"version_category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "legal_pages_sections_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "legal_pages_locales" (
  	"title" varchar,
  	"eyebrow" varchar DEFAULT 'Legal',
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_legal_pages_v_version_sections_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_legal_pages_v_locales" (
  	"version_title" varchar,
  	"version_eyebrow" varchar DEFAULT 'Legal',
  	"version_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "awards_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_awards_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "roll_of_honour_locales" (
  	"designation" varchar,
  	"range" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_roll_of_honour_v_locales" (
  	"version_designation" varchar,
  	"version_range" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_spotlight_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_spotlight_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_spotlight_locales" (
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_spotlight_v_version_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_spotlight_v_version_ctas_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_spotlight_v_locales" (
  	"version_badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "department_contacts_locales" (
  	"department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_department_contacts_v_locales" (
  	"version_department" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "board_content_members_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "board_content_locales" (
  	"chairman_role" varchar DEFAULT 'Chairman',
  	"chairman_title" varchar,
  	"member_secretary_role" varchar DEFAULT 'Member Secretary',
  	"member_secretary_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_board_content_v_version_members_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_board_content_v_locales" (
  	"version_chairman_role" varchar DEFAULT 'Chairman',
  	"version_chairman_title" varchar,
  	"version_member_secretary_role" varchar DEFAULT 'Member Secretary',
  	"version_member_secretary_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leadership_band_content_leaders_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "leadership_band_content_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_leadership_band_content_v_version_leaders_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_leadership_band_content_v_locales" (
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_content_hierarchy_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_content_vision_mission_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_description" varchar,
  	"who_we_are_heading" varchar,
  	"who_we_are_paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_content_v_version_hierarchy_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_content_v_version_vision_mission_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_description" varchar,
  	"version_who_we_are_heading" varchar,
  	"version_who_we_are_paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "org_chart_content_branches_locales" (
  	"director" varchar,
  	"engineer" varchar,
  	"manager" varchar,
  	"base" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_org_chart_content_v_version_branches_locales" (
  	"director" varchar,
  	"engineer" varchar,
  	"manager" varchar,
  	"base" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "metrics_content_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_metrics_content_v_version_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pillars_content_pillars_locales" (
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pillars_content_v_version_pillars_locales" (
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "careers_content_application_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "careers_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"hero_cta_label" varchar,
  	"openings_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_careers_content_v_version_application_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_careers_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_hero_cta_label" varchar,
  	"version_openings_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "rti_content_contacts_locales" (
  	"badge" varchar,
  	"designation" varchar,
  	"details_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "rti_content_disclosures_locales" (
  	"item" varchar,
  	"rows_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "rti_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"how_to_file_heading" varchar,
  	"how_to_file_sub" varchar,
  	"how_to_file_body" varchar,
  	"how_to_file_cta_label" varchar,
  	"how_to_file_redirect_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_rti_content_v_version_contacts_locales" (
  	"badge" varchar,
  	"designation" varchar,
  	"details_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_rti_content_v_version_disclosures_locales" (
  	"item" varchar,
  	"rows_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_rti_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_how_to_file_heading" varchar,
  	"version_how_to_file_sub" varchar,
  	"version_how_to_file_body" varchar,
  	"version_how_to_file_cta_label" varchar,
  	"version_how_to_file_redirect_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tenders_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"tender_portal_heading" varchar,
  	"tender_portal_sub" varchar,
  	"tender_portal_body" varchar,
  	"tender_portal_cta_label" varchar,
  	"tender_portal_redirect_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_tenders_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_tender_portal_heading" varchar,
  	"version_tender_portal_sub" varchar,
  	"version_tender_portal_body" varchar,
  	"version_tender_portal_cta_label" varchar,
  	"version_tender_portal_redirect_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_to_government_content_services_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_to_government_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"table_intro_eyebrow" varchar,
  	"table_intro_heading" varchar,
  	"table_intro_body" varchar,
  	"raise_ticket_label" varchar DEFAULT 'Raise a Ticket',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_to_government_content_v_version_services_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_to_government_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_table_intro_eyebrow" varchar,
  	"version_table_intro_heading" varchar,
  	"version_table_intro_body" varchar,
  	"version_raise_ticket_label" varchar DEFAULT 'Raise a Ticket',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "announcements_facts_locales" ADD CONSTRAINT "announcements_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_locales" ADD CONSTRAINT "announcements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_version_facts_locales" ADD CONSTRAINT "_announcements_v_version_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v_version_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_locales" ADD CONSTRAINT "_announcements_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_items_locales" ADD CONSTRAINT "media_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_items_v_locales" ADD CONSTRAINT "_media_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_locales" ADD CONSTRAINT "job_openings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_locales" ADD CONSTRAINT "_job_openings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v_locales" ADD CONSTRAINT "_team_members_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_statistics_locales" ADD CONSTRAINT "services_real_statistics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_key_features_locales" ADD CONSTRAINT "services_real_key_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_key_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_key_feature_descriptions_locales" ADD CONSTRAINT "services_real_key_feature_descriptions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_key_feature_descriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_eligibility_locales" ADD CONSTRAINT "services_real_eligibility_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_eligibility"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_what_youll_need_locales" ADD CONSTRAINT "services_real_what_youll_need_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_what_youll_need"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_faqs_locales" ADD CONSTRAINT "services_real_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_faqs_more_locales" ADD CONSTRAINT "services_real_faqs_more_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_faqs_more"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_about_link_modal_items_locales" ADD CONSTRAINT "services_real_about_link_modal_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_about_link_modal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_product_tour_locales" ADD CONSTRAINT "services_real_product_tour_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_product_tour"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_get_started_steps_locales" ADD CONSTRAINT "services_real_get_started_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_real_get_started_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_statistics_locales" ADD CONSTRAINT "_services_v_version_real_statistics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_key_features_locales" ADD CONSTRAINT "_services_v_version_real_key_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_key_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_key_feature_descriptions_locales" ADD CONSTRAINT "_services_v_version_real_key_feature_descriptions_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_key_feature_descriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_eligibility_locales" ADD CONSTRAINT "_services_v_version_real_eligibility_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_eligibility"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_what_youll_need_locales" ADD CONSTRAINT "_services_v_version_real_what_youll_need_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_what_youll_need"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_faqs_locales" ADD CONSTRAINT "_services_v_version_real_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_faqs_more_locales" ADD CONSTRAINT "_services_v_version_real_faqs_more_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_faqs_more"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_about_link_modal_items_locales" ADD CONSTRAINT "_services_v_version_real_about_link_modal_items_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_about_link_modal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_product_tour_locales" ADD CONSTRAINT "_services_v_version_real_product_tour_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_product_tour"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_get_started_steps_locales" ADD CONSTRAINT "_services_v_version_real_get_started_steps_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_real_get_started_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "government_orders_locales" ADD CONSTRAINT "government_orders_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."government_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_government_orders_v_locales" ADD CONSTRAINT "_government_orders_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_government_orders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_locales" ADD CONSTRAINT "policies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_policies_v_locales" ADD CONSTRAINT "_policies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_policies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_sections_locales" ADD CONSTRAINT "legal_pages_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_locales" ADD CONSTRAINT "legal_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_version_sections_locales" ADD CONSTRAINT "_legal_pages_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_pages_v_locales" ADD CONSTRAINT "_legal_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_awards_v_locales" ADD CONSTRAINT "_awards_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_awards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roll_of_honour_locales" ADD CONSTRAINT "roll_of_honour_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roll_of_honour"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roll_of_honour_v_locales" ADD CONSTRAINT "_roll_of_honour_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_roll_of_honour_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_spotlight_stats_locales" ADD CONSTRAINT "projects_spotlight_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_spotlight_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_spotlight_ctas_locales" ADD CONSTRAINT "projects_spotlight_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_spotlight_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_spotlight_locales" ADD CONSTRAINT "projects_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v_version_stats_locales" ADD CONSTRAINT "_projects_spotlight_v_version_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_spotlight_v_version_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v_version_ctas_locales" ADD CONSTRAINT "_projects_spotlight_v_version_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_spotlight_v_version_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v_locales" ADD CONSTRAINT "_projects_spotlight_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_spotlight_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "department_contacts_locales" ADD CONSTRAINT "department_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."department_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_department_contacts_v_locales" ADD CONSTRAINT "_department_contacts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_department_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "board_content_members_locales" ADD CONSTRAINT "board_content_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."board_content_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "board_content_locales" ADD CONSTRAINT "board_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."board_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_board_content_v_version_members_locales" ADD CONSTRAINT "_board_content_v_version_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_board_content_v_version_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_board_content_v_locales" ADD CONSTRAINT "_board_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_board_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leadership_band_content_leaders_locales" ADD CONSTRAINT "leadership_band_content_leaders_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leadership_band_content_leaders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leadership_band_content_locales" ADD CONSTRAINT "leadership_band_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leadership_band_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leadership_band_content_v_version_leaders_locales" ADD CONSTRAINT "_leadership_band_content_v_version_leaders_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leadership_band_content_v_version_leaders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leadership_band_content_v_locales" ADD CONSTRAINT "_leadership_band_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leadership_band_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_content_hierarchy_locales" ADD CONSTRAINT "about_page_content_hierarchy_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content_hierarchy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_content_vision_mission_locales" ADD CONSTRAINT "about_page_content_vision_mission_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content_vision_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_content_locales" ADD CONSTRAINT "about_page_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_version_hierarchy_locales" ADD CONSTRAINT "_about_page_content_v_version_hierarchy_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v_version_hierarchy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_version_vision_mission_locales" ADD CONSTRAINT "_about_page_content_v_version_vision_mission_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v_version_vision_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_content_v_locales" ADD CONSTRAINT "_about_page_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "org_chart_content_branches_locales" ADD CONSTRAINT "org_chart_content_branches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."org_chart_content_branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_org_chart_content_v_version_branches_locales" ADD CONSTRAINT "_org_chart_content_v_version_branches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_org_chart_content_v_version_branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metrics_content_metrics_locales" ADD CONSTRAINT "metrics_content_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics_content_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_metrics_content_v_version_metrics_locales" ADD CONSTRAINT "_metrics_content_v_version_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_metrics_content_v_version_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillars_content_pillars_locales" ADD CONSTRAINT "pillars_content_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillars_content_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pillars_content_v_version_pillars_locales" ADD CONSTRAINT "_pillars_content_v_version_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pillars_content_v_version_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_application_steps_locales" ADD CONSTRAINT "careers_content_application_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content_application_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content_locales" ADD CONSTRAINT "careers_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_version_application_steps_locales" ADD CONSTRAINT "_careers_content_v_version_application_steps_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v_version_application_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_content_v_locales" ADD CONSTRAINT "_careers_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rti_content_contacts_locales" ADD CONSTRAINT "rti_content_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rti_content_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rti_content_disclosures_locales" ADD CONSTRAINT "rti_content_disclosures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rti_content_disclosures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rti_content_locales" ADD CONSTRAINT "rti_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rti_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rti_content_v_version_contacts_locales" ADD CONSTRAINT "_rti_content_v_version_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rti_content_v_version_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rti_content_v_version_disclosures_locales" ADD CONSTRAINT "_rti_content_v_version_disclosures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rti_content_v_version_disclosures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rti_content_v_locales" ADD CONSTRAINT "_rti_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rti_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenders_content_locales" ADD CONSTRAINT "tenders_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenders_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenders_content_v_locales" ADD CONSTRAINT "_tenders_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenders_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_to_government_content_services_locales" ADD CONSTRAINT "services_to_government_content_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_to_government_content_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_to_government_content_locales" ADD CONSTRAINT "services_to_government_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_to_government_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_to_government_content_v_version_services_locales" ADD CONSTRAINT "_services_to_government_content_v_version_services_locale_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_to_government_content_v_version_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_to_government_content_v_locales" ADD CONSTRAINT "_services_to_government_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_to_government_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "announcements_facts_locales_locale_parent_id_unique" ON "announcements_facts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "announcements_locales_locale_parent_id_unique" ON "announcements_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_announcements_v_version_facts_locales_locale_parent_id_uniq" ON "_announcements_v_version_facts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_announcements_v_locales_locale_parent_id_unique" ON "_announcements_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_items_locales_locale_parent_id_unique" ON "media_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_media_items_v_locales_locale_parent_id_unique" ON "_media_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "job_openings_locales_locale_parent_id_unique" ON "job_openings_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_job_openings_v_locales_locale_parent_id_unique" ON "_job_openings_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_team_members_v_locales_locale_parent_id_unique" ON "_team_members_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_statistics_locales_locale_parent_id_unique" ON "services_real_statistics_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_key_features_locales_locale_parent_id_unique" ON "services_real_key_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_key_feature_descriptions_locales_locale_parent" ON "services_real_key_feature_descriptions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_eligibility_locales_locale_parent_id_unique" ON "services_real_eligibility_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_what_youll_need_locales_locale_parent_id_uniqu" ON "services_real_what_youll_need_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_faqs_locales_locale_parent_id_unique" ON "services_real_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_faqs_more_locales_locale_parent_id_unique" ON "services_real_faqs_more_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_about_link_modal_items_locales_locale_parent_i" ON "services_real_about_link_modal_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_product_tour_locales_locale_parent_id_unique" ON "services_real_product_tour_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_real_get_started_steps_locales_locale_parent_id_uni" ON "services_real_get_started_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_statistics_locales_locale_parent_id" ON "_services_v_version_real_statistics_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_key_features_locales_locale_parent_" ON "_services_v_version_real_key_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_key_feature_descriptions_locales_lo" ON "_services_v_version_real_key_feature_descriptions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_eligibility_locales_locale_parent_i" ON "_services_v_version_real_eligibility_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_what_youll_need_locales_locale_pare" ON "_services_v_version_real_what_youll_need_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_faqs_locales_locale_parent_id_uniqu" ON "_services_v_version_real_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_faqs_more_locales_locale_parent_id_" ON "_services_v_version_real_faqs_more_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_about_link_modal_items_locales_loca" ON "_services_v_version_real_about_link_modal_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_product_tour_locales_locale_parent_" ON "_services_v_version_real_product_tour_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_real_get_started_steps_locales_locale_pa" ON "_services_v_version_real_get_started_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "government_orders_locales_locale_parent_id_unique" ON "government_orders_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_government_orders_v_locales_locale_parent_id_unique" ON "_government_orders_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "policies_locales_locale_parent_id_unique" ON "policies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_policies_v_locales_locale_parent_id_unique" ON "_policies_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "legal_pages_sections_locales_locale_parent_id_unique" ON "legal_pages_sections_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "legal_pages_locales_locale_parent_id_unique" ON "legal_pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_legal_pages_v_version_sections_locales_locale_parent_id_uni" ON "_legal_pages_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_legal_pages_v_locales_locale_parent_id_unique" ON "_legal_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_awards_v_locales_locale_parent_id_unique" ON "_awards_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "roll_of_honour_locales_locale_parent_id_unique" ON "roll_of_honour_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_roll_of_honour_v_locales_locale_parent_id_unique" ON "_roll_of_honour_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_spotlight_stats_locales_locale_parent_id_unique" ON "projects_spotlight_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_spotlight_ctas_locales_locale_parent_id_unique" ON "projects_spotlight_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_spotlight_locales_locale_parent_id_unique" ON "projects_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_spotlight_v_version_stats_locales_locale_parent_id" ON "_projects_spotlight_v_version_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_spotlight_v_version_ctas_locales_locale_parent_id_" ON "_projects_spotlight_v_version_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_spotlight_v_locales_locale_parent_id_unique" ON "_projects_spotlight_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "department_contacts_locales_locale_parent_id_unique" ON "department_contacts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_department_contacts_v_locales_locale_parent_id_unique" ON "_department_contacts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "board_content_members_locales_locale_parent_id_unique" ON "board_content_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "board_content_locales_locale_parent_id_unique" ON "board_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_board_content_v_version_members_locales_locale_parent_id_un" ON "_board_content_v_version_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_board_content_v_locales_locale_parent_id_unique" ON "_board_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "leadership_band_content_leaders_locales_locale_parent_id_uni" ON "leadership_band_content_leaders_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "leadership_band_content_locales_locale_parent_id_unique" ON "leadership_band_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_leadership_band_content_v_version_leaders_locales_locale_pa" ON "_leadership_band_content_v_version_leaders_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_leadership_band_content_v_locales_locale_parent_id_unique" ON "_leadership_band_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_content_hierarchy_locales_locale_parent_id_unique" ON "about_page_content_hierarchy_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_content_vision_mission_locales_locale_parent_id_u" ON "about_page_content_vision_mission_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_content_locales_locale_parent_id_unique" ON "about_page_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_about_page_content_v_version_hierarchy_locales_locale_paren" ON "_about_page_content_v_version_hierarchy_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_about_page_content_v_version_vision_mission_locales_locale_" ON "_about_page_content_v_version_vision_mission_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_about_page_content_v_locales_locale_parent_id_unique" ON "_about_page_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "org_chart_content_branches_locales_locale_parent_id_unique" ON "org_chart_content_branches_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_org_chart_content_v_version_branches_locales_locale_parent_" ON "_org_chart_content_v_version_branches_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "metrics_content_metrics_locales_locale_parent_id_unique" ON "metrics_content_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_metrics_content_v_version_metrics_locales_locale_parent_id_" ON "_metrics_content_v_version_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pillars_content_pillars_locales_locale_parent_id_unique" ON "pillars_content_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pillars_content_v_version_pillars_locales_locale_parent_id_" ON "_pillars_content_v_version_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "careers_content_application_steps_locales_locale_parent_id_u" ON "careers_content_application_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "careers_content_locales_locale_parent_id_unique" ON "careers_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_careers_content_v_version_application_steps_locales_locale_" ON "_careers_content_v_version_application_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_careers_content_v_locales_locale_parent_id_unique" ON "_careers_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "rti_content_contacts_locales_locale_parent_id_unique" ON "rti_content_contacts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "rti_content_disclosures_locales_locale_parent_id_unique" ON "rti_content_disclosures_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "rti_content_locales_locale_parent_id_unique" ON "rti_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_rti_content_v_version_contacts_locales_locale_parent_id_uni" ON "_rti_content_v_version_contacts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_rti_content_v_version_disclosures_locales_locale_parent_id_" ON "_rti_content_v_version_disclosures_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_rti_content_v_locales_locale_parent_id_unique" ON "_rti_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "tenders_content_locales_locale_parent_id_unique" ON "tenders_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_tenders_content_v_locales_locale_parent_id_unique" ON "_tenders_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_to_government_content_services_locales_locale_paren" ON "services_to_government_content_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_to_government_content_locales_locale_parent_id_uniq" ON "services_to_government_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_to_government_content_v_version_services_locales_l" ON "_services_to_government_content_v_version_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_to_government_content_v_locales_locale_parent_id_u" ON "_services_to_government_content_v_locales" USING btree ("_locale","_parent_id");
  -- Data-copy: preserve existing English content into the new
  -- locale-scoped columns before they're dropped from the base tables.
  INSERT INTO "announcements_facts_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "announcements_facts" WHERE "label" IS NOT NULL;
  INSERT INTO "announcements_locales" ("_locale", "_parent_id", "heading", "description", "category", "body") SELECT 'en', "id", "heading", "description", "category", "body" FROM "announcements" WHERE "heading" IS NOT NULL OR "description" IS NOT NULL OR "category" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "_announcements_v_version_facts_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_announcements_v_version_facts" WHERE "label" IS NOT NULL;
  INSERT INTO "_announcements_v_locales" ("_locale", "_parent_id", "version_heading", "version_description", "version_category", "version_body") SELECT 'en', "id", "version_heading", "version_description", "version_category", "version_body" FROM "_announcements_v" WHERE "version_heading" IS NOT NULL OR "version_description" IS NOT NULL OR "version_category" IS NOT NULL OR "version_body" IS NOT NULL;
  INSERT INTO "media_items_locales" ("_locale", "_parent_id", "caption", "alt_text") SELECT 'en', "id", "caption", "alt_text" FROM "media_items" WHERE "caption" IS NOT NULL OR "alt_text" IS NOT NULL;
  INSERT INTO "_media_items_v_locales" ("_locale", "_parent_id", "version_caption", "version_alt_text") SELECT 'en', "id", "version_caption", "version_alt_text" FROM "_media_items_v" WHERE "version_caption" IS NOT NULL OR "version_alt_text" IS NOT NULL;
  INSERT INTO "job_openings_locales" ("_locale", "_parent_id", "role", "type", "department") SELECT 'en', "id", "role", "type", "department" FROM "job_openings" WHERE "role" IS NOT NULL OR "type" IS NOT NULL OR "department" IS NOT NULL;
  INSERT INTO "_job_openings_v_locales" ("_locale", "_parent_id", "version_role", "version_type", "version_department") SELECT 'en', "id", "version_role", "version_type", "version_department" FROM "_job_openings_v" WHERE "version_role" IS NOT NULL OR "version_type" IS NOT NULL OR "version_department" IS NOT NULL;
  INSERT INTO "team_members_locales" ("_locale", "_parent_id", "designation", "subject") SELECT 'en', "id", "designation", "subject" FROM "team_members" WHERE "designation" IS NOT NULL OR "subject" IS NOT NULL;
  INSERT INTO "_team_members_v_locales" ("_locale", "_parent_id", "version_designation", "version_subject") SELECT 'en', "id", "version_designation", "version_subject" FROM "_team_members_v" WHERE "version_designation" IS NOT NULL OR "version_subject" IS NOT NULL;
  INSERT INTO "services_real_statistics_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_statistics" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_key_features_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_key_features" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_key_feature_descriptions_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_key_feature_descriptions" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_eligibility_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_eligibility" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_what_youll_need_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_what_youll_need" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_faqs_locales" ("_locale", "_parent_id", "q", "a") SELECT 'en', "id", "q", "a" FROM "services_real_faqs" WHERE "q" IS NOT NULL OR "a" IS NOT NULL;
  INSERT INTO "services_real_faqs_more_locales" ("_locale", "_parent_id", "q", "a") SELECT 'en', "id", "q", "a" FROM "services_real_faqs_more" WHERE "q" IS NOT NULL OR "a" IS NOT NULL;
  INSERT INTO "services_real_about_link_modal_items_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "services_real_about_link_modal_items" WHERE "value" IS NOT NULL;
  INSERT INTO "services_real_product_tour_locales" ("_locale", "_parent_id", "alt") SELECT 'en', "id", "alt" FROM "services_real_product_tour" WHERE "alt" IS NOT NULL;
  INSERT INTO "services_real_get_started_steps_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "services_real_get_started_steps" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "services_locales" ("_locale", "_parent_id", "name", "description", "stats", "real_tagline", "real_about_second_paragraph", "real_callout_text", "real_about_link_modal_label", "real_about_link_modal_title", "real_product_tour_caption", "real_get_started_intro", "real_get_started_outro", "real_direct_link_label", "real_cta_label", "real_related_card_stats") SELECT 'en', "id", "name", "description", "stats", "real_tagline", "real_about_second_paragraph", "real_callout_text", "real_about_link_modal_label", "real_about_link_modal_title", "real_product_tour_caption", "real_get_started_intro", "real_get_started_outro", "real_direct_link_label", "real_cta_label", "real_related_card_stats" FROM "services" WHERE "name" IS NOT NULL OR "description" IS NOT NULL OR "stats" IS NOT NULL OR "real_tagline" IS NOT NULL OR "real_about_second_paragraph" IS NOT NULL OR "real_callout_text" IS NOT NULL OR "real_about_link_modal_label" IS NOT NULL OR "real_about_link_modal_title" IS NOT NULL OR "real_product_tour_caption" IS NOT NULL OR "real_get_started_intro" IS NOT NULL OR "real_get_started_outro" IS NOT NULL OR "real_direct_link_label" IS NOT NULL OR "real_cta_label" IS NOT NULL OR "real_related_card_stats" IS NOT NULL;
  INSERT INTO "_services_v_version_real_statistics_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_statistics" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_key_features_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_key_features" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_key_feature_descriptions_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_key_feature_descriptions" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_eligibility_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_eligibility" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_what_youll_need_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_what_youll_need" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_faqs_locales" ("_locale", "_parent_id", "q", "a") SELECT 'en', "id", "q", "a" FROM "_services_v_version_real_faqs" WHERE "q" IS NOT NULL OR "a" IS NOT NULL;
  INSERT INTO "_services_v_version_real_faqs_more_locales" ("_locale", "_parent_id", "q", "a") SELECT 'en', "id", "q", "a" FROM "_services_v_version_real_faqs_more" WHERE "q" IS NOT NULL OR "a" IS NOT NULL;
  INSERT INTO "_services_v_version_real_about_link_modal_items_locales" ("_locale", "_parent_id", "value") SELECT 'en', "id", "value" FROM "_services_v_version_real_about_link_modal_items" WHERE "value" IS NOT NULL;
  INSERT INTO "_services_v_version_real_product_tour_locales" ("_locale", "_parent_id", "alt") SELECT 'en', "id", "alt" FROM "_services_v_version_real_product_tour" WHERE "alt" IS NOT NULL;
  INSERT INTO "_services_v_version_real_get_started_steps_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "_services_v_version_real_get_started_steps" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "_services_v_locales" ("_locale", "_parent_id", "version_name", "version_description", "version_stats", "version_real_tagline", "version_real_about_second_paragraph", "version_real_callout_text", "version_real_about_link_modal_label", "version_real_about_link_modal_title", "version_real_product_tour_caption", "version_real_get_started_intro", "version_real_get_started_outro", "version_real_direct_link_label", "version_real_cta_label", "version_real_related_card_stats") SELECT 'en', "id", "version_name", "version_description", "version_stats", "version_real_tagline", "version_real_about_second_paragraph", "version_real_callout_text", "version_real_about_link_modal_label", "version_real_about_link_modal_title", "version_real_product_tour_caption", "version_real_get_started_intro", "version_real_get_started_outro", "version_real_direct_link_label", "version_real_cta_label", "version_real_related_card_stats" FROM "_services_v" WHERE "version_name" IS NOT NULL OR "version_description" IS NOT NULL OR "version_stats" IS NOT NULL OR "version_real_tagline" IS NOT NULL OR "version_real_about_second_paragraph" IS NOT NULL OR "version_real_callout_text" IS NOT NULL OR "version_real_about_link_modal_label" IS NOT NULL OR "version_real_about_link_modal_title" IS NOT NULL OR "version_real_product_tour_caption" IS NOT NULL OR "version_real_get_started_intro" IS NOT NULL OR "version_real_get_started_outro" IS NOT NULL OR "version_real_direct_link_label" IS NOT NULL OR "version_real_cta_label" IS NOT NULL OR "version_real_related_card_stats" IS NOT NULL;
  INSERT INTO "government_orders_locales" ("_locale", "_parent_id", "department") SELECT 'en', "id", "department" FROM "government_orders" WHERE "department" IS NOT NULL;
  INSERT INTO "_government_orders_v_locales" ("_locale", "_parent_id", "version_department") SELECT 'en', "id", "version_department" FROM "_government_orders_v" WHERE "version_department" IS NOT NULL;
  INSERT INTO "policies_locales" ("_locale", "_parent_id", "category") SELECT 'en', "id", "category" FROM "policies" WHERE "category" IS NOT NULL;
  INSERT INTO "_policies_v_locales" ("_locale", "_parent_id", "version_category") SELECT 'en', "id", "version_category" FROM "_policies_v" WHERE "version_category" IS NOT NULL;
  INSERT INTO "legal_pages_sections_locales" ("_locale", "_parent_id", "heading", "body") SELECT 'en', "id", "heading", "body" FROM "legal_pages_sections" WHERE "heading" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "legal_pages_locales" ("_locale", "_parent_id", "title", "eyebrow", "intro") SELECT 'en', "id", "title", "eyebrow", "intro" FROM "legal_pages" WHERE "title" IS NOT NULL OR "eyebrow" IS NOT NULL OR "intro" IS NOT NULL;
  INSERT INTO "_legal_pages_v_version_sections_locales" ("_locale", "_parent_id", "heading", "body") SELECT 'en', "id", "heading", "body" FROM "_legal_pages_v_version_sections" WHERE "heading" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "_legal_pages_v_locales" ("_locale", "_parent_id", "version_title", "version_eyebrow", "version_intro") SELECT 'en', "id", "version_title", "version_eyebrow", "version_intro" FROM "_legal_pages_v" WHERE "version_title" IS NOT NULL OR "version_eyebrow" IS NOT NULL OR "version_intro" IS NOT NULL;
  INSERT INTO "awards_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "awards" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "_awards_v_locales" ("_locale", "_parent_id", "version_title", "version_description") SELECT 'en', "id", "version_title", "version_description" FROM "_awards_v" WHERE "version_title" IS NOT NULL OR "version_description" IS NOT NULL;
  INSERT INTO "roll_of_honour_locales" ("_locale", "_parent_id", "designation", "range") SELECT 'en', "id", "designation", "range" FROM "roll_of_honour" WHERE "designation" IS NOT NULL OR "range" IS NOT NULL;
  INSERT INTO "_roll_of_honour_v_locales" ("_locale", "_parent_id", "version_designation", "version_range") SELECT 'en', "id", "version_designation", "version_range" FROM "_roll_of_honour_v" WHERE "version_designation" IS NOT NULL OR "version_range" IS NOT NULL;
  INSERT INTO "projects_spotlight_stats_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "projects_spotlight_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "projects_spotlight_ctas_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "projects_spotlight_ctas" WHERE "label" IS NOT NULL;
  INSERT INTO "projects_spotlight_locales" ("_locale", "_parent_id", "badge") SELECT 'en', "id", "badge" FROM "projects_spotlight" WHERE "badge" IS NOT NULL;
  INSERT INTO "_projects_spotlight_v_version_stats_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_projects_spotlight_v_version_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "_projects_spotlight_v_version_ctas_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_projects_spotlight_v_version_ctas" WHERE "label" IS NOT NULL;
  INSERT INTO "_projects_spotlight_v_locales" ("_locale", "_parent_id", "version_badge") SELECT 'en', "id", "version_badge" FROM "_projects_spotlight_v" WHERE "version_badge" IS NOT NULL;
  INSERT INTO "department_contacts_locales" ("_locale", "_parent_id", "department") SELECT 'en', "id", "department" FROM "department_contacts" WHERE "department" IS NOT NULL;
  INSERT INTO "_department_contacts_v_locales" ("_locale", "_parent_id", "version_department") SELECT 'en', "id", "version_department" FROM "_department_contacts_v" WHERE "version_department" IS NOT NULL;
  INSERT INTO "board_content_members_locales" ("_locale", "_parent_id", "title") SELECT 'en', "id", "title" FROM "board_content_members" WHERE "title" IS NOT NULL;
  INSERT INTO "board_content_locales" ("_locale", "_parent_id", "chairman_role", "chairman_title", "member_secretary_role", "member_secretary_title") SELECT 'en', "id", "chairman_role", "chairman_title", "member_secretary_role", "member_secretary_title" FROM "board_content" WHERE "chairman_role" IS NOT NULL OR "chairman_title" IS NOT NULL OR "member_secretary_role" IS NOT NULL OR "member_secretary_title" IS NOT NULL;
  INSERT INTO "_board_content_v_version_members_locales" ("_locale", "_parent_id", "title") SELECT 'en', "id", "title" FROM "_board_content_v_version_members" WHERE "title" IS NOT NULL;
  INSERT INTO "_board_content_v_locales" ("_locale", "_parent_id", "version_chairman_role", "version_chairman_title", "version_member_secretary_role", "version_member_secretary_title") SELECT 'en', "id", "version_chairman_role", "version_chairman_title", "version_member_secretary_role", "version_member_secretary_title" FROM "_board_content_v" WHERE "version_chairman_role" IS NOT NULL OR "version_chairman_title" IS NOT NULL OR "version_member_secretary_role" IS NOT NULL OR "version_member_secretary_title" IS NOT NULL;
  INSERT INTO "leadership_band_content_leaders_locales" ("_locale", "_parent_id", "title") SELECT 'en', "id", "title" FROM "leadership_band_content_leaders" WHERE "title" IS NOT NULL;
  INSERT INTO "leadership_band_content_locales" ("_locale", "_parent_id", "description") SELECT 'en', "id", "description" FROM "leadership_band_content" WHERE "description" IS NOT NULL;
  INSERT INTO "_leadership_band_content_v_version_leaders_locales" ("_locale", "_parent_id", "title") SELECT 'en', "id", "title" FROM "_leadership_band_content_v_version_leaders" WHERE "title" IS NOT NULL;
  INSERT INTO "_leadership_band_content_v_locales" ("_locale", "_parent_id", "version_description") SELECT 'en', "id", "version_description" FROM "_leadership_band_content_v" WHERE "version_description" IS NOT NULL;
  INSERT INTO "about_page_content_hierarchy_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "about_page_content_hierarchy" WHERE "label" IS NOT NULL;
  INSERT INTO "about_page_content_vision_mission_locales" ("_locale", "_parent_id", "label", "title", "description") SELECT 'en', "id", "label", "title", "description" FROM "about_page_content_vision_mission" WHERE "label" IS NOT NULL OR "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "about_page_content_locales" ("_locale", "_parent_id", "hero_eyebrow", "hero_headline", "hero_description", "who_we_are_heading", "who_we_are_paragraph") SELECT 'en', "id", "hero_eyebrow", "hero_headline", "hero_description", "who_we_are_heading", "who_we_are_paragraph" FROM "about_page_content" WHERE "hero_eyebrow" IS NOT NULL OR "hero_headline" IS NOT NULL OR "hero_description" IS NOT NULL OR "who_we_are_heading" IS NOT NULL OR "who_we_are_paragraph" IS NOT NULL;
  INSERT INTO "_about_page_content_v_version_hierarchy_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_about_page_content_v_version_hierarchy" WHERE "label" IS NOT NULL;
  INSERT INTO "_about_page_content_v_version_vision_mission_locales" ("_locale", "_parent_id", "label", "title", "description") SELECT 'en', "id", "label", "title", "description" FROM "_about_page_content_v_version_vision_mission" WHERE "label" IS NOT NULL OR "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "_about_page_content_v_locales" ("_locale", "_parent_id", "version_hero_eyebrow", "version_hero_headline", "version_hero_description", "version_who_we_are_heading", "version_who_we_are_paragraph") SELECT 'en', "id", "version_hero_eyebrow", "version_hero_headline", "version_hero_description", "version_who_we_are_heading", "version_who_we_are_paragraph" FROM "_about_page_content_v" WHERE "version_hero_eyebrow" IS NOT NULL OR "version_hero_headline" IS NOT NULL OR "version_hero_description" IS NOT NULL OR "version_who_we_are_heading" IS NOT NULL OR "version_who_we_are_paragraph" IS NOT NULL;
  INSERT INTO "org_chart_content_branches_locales" ("_locale", "_parent_id", "director", "engineer", "manager", "base") SELECT 'en', "id", "director", "engineer", "manager", "base" FROM "org_chart_content_branches" WHERE "director" IS NOT NULL OR "engineer" IS NOT NULL OR "manager" IS NOT NULL OR "base" IS NOT NULL;
  INSERT INTO "_org_chart_content_v_version_branches_locales" ("_locale", "_parent_id", "director", "engineer", "manager", "base") SELECT 'en', "id", "director", "engineer", "manager", "base" FROM "_org_chart_content_v_version_branches" WHERE "director" IS NOT NULL OR "engineer" IS NOT NULL OR "manager" IS NOT NULL OR "base" IS NOT NULL;
  INSERT INTO "metrics_content_metrics_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "metrics_content_metrics" WHERE "label" IS NOT NULL;
  INSERT INTO "_metrics_content_v_version_metrics_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_metrics_content_v_version_metrics" WHERE "label" IS NOT NULL;
  INSERT INTO "pillars_content_pillars_locales" ("_locale", "_parent_id", "title", "description", "link_label") SELECT 'en', "id", "title", "description", "link_label" FROM "pillars_content_pillars" WHERE "title" IS NOT NULL OR "description" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "_pillars_content_v_version_pillars_locales" ("_locale", "_parent_id", "title", "description", "link_label") SELECT 'en', "id", "title", "description", "link_label" FROM "_pillars_content_v_version_pillars" WHERE "title" IS NOT NULL OR "description" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "careers_content_application_steps_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "careers_content_application_steps" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "careers_content_locales" ("_locale", "_parent_id", "hero_eyebrow", "hero_heading", "hero_body", "hero_cta_label", "openings_note") SELECT 'en', "id", "hero_eyebrow", "hero_heading", "hero_body", "hero_cta_label", "openings_note" FROM "careers_content" WHERE "hero_eyebrow" IS NOT NULL OR "hero_heading" IS NOT NULL OR "hero_body" IS NOT NULL OR "hero_cta_label" IS NOT NULL OR "openings_note" IS NOT NULL;
  INSERT INTO "_careers_content_v_version_application_steps_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "_careers_content_v_version_application_steps" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "_careers_content_v_locales" ("_locale", "_parent_id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_hero_cta_label", "version_openings_note") SELECT 'en', "id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_hero_cta_label", "version_openings_note" FROM "_careers_content_v" WHERE "version_hero_eyebrow" IS NOT NULL OR "version_hero_heading" IS NOT NULL OR "version_hero_body" IS NOT NULL OR "version_hero_cta_label" IS NOT NULL OR "version_openings_note" IS NOT NULL;
  INSERT INTO "rti_content_contacts_locales" ("_locale", "_parent_id", "badge", "designation", "details_text") SELECT 'en', "id", "badge", "designation", "details_text" FROM "rti_content_contacts" WHERE "badge" IS NOT NULL OR "designation" IS NOT NULL OR "details_text" IS NOT NULL;
  INSERT INTO "rti_content_disclosures_locales" ("_locale", "_parent_id", "item", "rows_text") SELECT 'en', "id", "item", "rows_text" FROM "rti_content_disclosures" WHERE "item" IS NOT NULL OR "rows_text" IS NOT NULL;
  INSERT INTO "rti_content_locales" ("_locale", "_parent_id", "hero_eyebrow", "hero_heading", "hero_body", "how_to_file_heading", "how_to_file_sub", "how_to_file_body", "how_to_file_cta_label", "how_to_file_redirect_note") SELECT 'en', "id", "hero_eyebrow", "hero_heading", "hero_body", "how_to_file_heading", "how_to_file_sub", "how_to_file_body", "how_to_file_cta_label", "how_to_file_redirect_note" FROM "rti_content" WHERE "hero_eyebrow" IS NOT NULL OR "hero_heading" IS NOT NULL OR "hero_body" IS NOT NULL OR "how_to_file_heading" IS NOT NULL OR "how_to_file_sub" IS NOT NULL OR "how_to_file_body" IS NOT NULL OR "how_to_file_cta_label" IS NOT NULL OR "how_to_file_redirect_note" IS NOT NULL;
  INSERT INTO "_rti_content_v_version_contacts_locales" ("_locale", "_parent_id", "badge", "designation", "details_text") SELECT 'en', "id", "badge", "designation", "details_text" FROM "_rti_content_v_version_contacts" WHERE "badge" IS NOT NULL OR "designation" IS NOT NULL OR "details_text" IS NOT NULL;
  INSERT INTO "_rti_content_v_version_disclosures_locales" ("_locale", "_parent_id", "item", "rows_text") SELECT 'en', "id", "item", "rows_text" FROM "_rti_content_v_version_disclosures" WHERE "item" IS NOT NULL OR "rows_text" IS NOT NULL;
  INSERT INTO "_rti_content_v_locales" ("_locale", "_parent_id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_how_to_file_heading", "version_how_to_file_sub", "version_how_to_file_body", "version_how_to_file_cta_label", "version_how_to_file_redirect_note") SELECT 'en', "id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_how_to_file_heading", "version_how_to_file_sub", "version_how_to_file_body", "version_how_to_file_cta_label", "version_how_to_file_redirect_note" FROM "_rti_content_v" WHERE "version_hero_eyebrow" IS NOT NULL OR "version_hero_heading" IS NOT NULL OR "version_hero_body" IS NOT NULL OR "version_how_to_file_heading" IS NOT NULL OR "version_how_to_file_sub" IS NOT NULL OR "version_how_to_file_body" IS NOT NULL OR "version_how_to_file_cta_label" IS NOT NULL OR "version_how_to_file_redirect_note" IS NOT NULL;
  INSERT INTO "tenders_content_locales" ("_locale", "_parent_id", "hero_eyebrow", "hero_heading", "hero_body", "tender_portal_heading", "tender_portal_sub", "tender_portal_body", "tender_portal_cta_label", "tender_portal_redirect_note") SELECT 'en', "id", "hero_eyebrow", "hero_heading", "hero_body", "tender_portal_heading", "tender_portal_sub", "tender_portal_body", "tender_portal_cta_label", "tender_portal_redirect_note" FROM "tenders_content" WHERE "hero_eyebrow" IS NOT NULL OR "hero_heading" IS NOT NULL OR "hero_body" IS NOT NULL OR "tender_portal_heading" IS NOT NULL OR "tender_portal_sub" IS NOT NULL OR "tender_portal_body" IS NOT NULL OR "tender_portal_cta_label" IS NOT NULL OR "tender_portal_redirect_note" IS NOT NULL;
  INSERT INTO "_tenders_content_v_locales" ("_locale", "_parent_id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_tender_portal_heading", "version_tender_portal_sub", "version_tender_portal_body", "version_tender_portal_cta_label", "version_tender_portal_redirect_note") SELECT 'en', "id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_tender_portal_heading", "version_tender_portal_sub", "version_tender_portal_body", "version_tender_portal_cta_label", "version_tender_portal_redirect_note" FROM "_tenders_content_v" WHERE "version_hero_eyebrow" IS NOT NULL OR "version_hero_heading" IS NOT NULL OR "version_hero_body" IS NOT NULL OR "version_tender_portal_heading" IS NOT NULL OR "version_tender_portal_sub" IS NOT NULL OR "version_tender_portal_body" IS NOT NULL OR "version_tender_portal_cta_label" IS NOT NULL OR "version_tender_portal_redirect_note" IS NOT NULL;
  INSERT INTO "services_to_government_content_services_locales" ("_locale", "_parent_id", "name", "description") SELECT 'en', "id", "name", "description" FROM "services_to_government_content_services" WHERE "name" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "services_to_government_content_locales" ("_locale", "_parent_id", "hero_eyebrow", "hero_heading", "hero_body", "table_intro_eyebrow", "table_intro_heading", "table_intro_body", "raise_ticket_label") SELECT 'en', "id", "hero_eyebrow", "hero_heading", "hero_body", "table_intro_eyebrow", "table_intro_heading", "table_intro_body", "raise_ticket_label" FROM "services_to_government_content" WHERE "hero_eyebrow" IS NOT NULL OR "hero_heading" IS NOT NULL OR "hero_body" IS NOT NULL OR "table_intro_eyebrow" IS NOT NULL OR "table_intro_heading" IS NOT NULL OR "table_intro_body" IS NOT NULL OR "raise_ticket_label" IS NOT NULL;
  INSERT INTO "_services_to_government_content_v_version_services_locales" ("_locale", "_parent_id", "name", "description") SELECT 'en', "id", "name", "description" FROM "_services_to_government_content_v_version_services" WHERE "name" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "_services_to_government_content_v_locales" ("_locale", "_parent_id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_table_intro_eyebrow", "version_table_intro_heading", "version_table_intro_body", "version_raise_ticket_label") SELECT 'en', "id", "version_hero_eyebrow", "version_hero_heading", "version_hero_body", "version_table_intro_eyebrow", "version_table_intro_heading", "version_table_intro_body", "version_raise_ticket_label" FROM "_services_to_government_content_v" WHERE "version_hero_eyebrow" IS NOT NULL OR "version_hero_heading" IS NOT NULL OR "version_hero_body" IS NOT NULL OR "version_table_intro_eyebrow" IS NOT NULL OR "version_table_intro_heading" IS NOT NULL OR "version_table_intro_body" IS NOT NULL OR "version_raise_ticket_label" IS NOT NULL;

  ALTER TABLE "announcements_facts" DROP COLUMN "label";
  ALTER TABLE "announcements" DROP COLUMN "heading";
  ALTER TABLE "announcements" DROP COLUMN "description";
  ALTER TABLE "announcements" DROP COLUMN "category";
  ALTER TABLE "announcements" DROP COLUMN "body";
  ALTER TABLE "_announcements_v_version_facts" DROP COLUMN "label";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_heading";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_description";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_category";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_body";
  ALTER TABLE "media_items" DROP COLUMN "caption";
  ALTER TABLE "media_items" DROP COLUMN "alt_text";
  ALTER TABLE "_media_items_v" DROP COLUMN "version_caption";
  ALTER TABLE "_media_items_v" DROP COLUMN "version_alt_text";
  ALTER TABLE "job_openings" DROP COLUMN "role";
  ALTER TABLE "job_openings" DROP COLUMN "type";
  ALTER TABLE "job_openings" DROP COLUMN "department";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_role";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_type";
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_department";
  ALTER TABLE "team_members" DROP COLUMN "designation";
  ALTER TABLE "team_members" DROP COLUMN "subject";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_designation";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_subject";
  ALTER TABLE "services_real_statistics" DROP COLUMN "value";
  ALTER TABLE "services_real_key_features" DROP COLUMN "value";
  ALTER TABLE "services_real_key_feature_descriptions" DROP COLUMN "value";
  ALTER TABLE "services_real_eligibility" DROP COLUMN "value";
  ALTER TABLE "services_real_what_youll_need" DROP COLUMN "value";
  ALTER TABLE "services_real_faqs" DROP COLUMN "q";
  ALTER TABLE "services_real_faqs" DROP COLUMN "a";
  ALTER TABLE "services_real_faqs_more" DROP COLUMN "q";
  ALTER TABLE "services_real_faqs_more" DROP COLUMN "a";
  ALTER TABLE "services_real_about_link_modal_items" DROP COLUMN "value";
  ALTER TABLE "services_real_product_tour" DROP COLUMN "alt";
  ALTER TABLE "services_real_get_started_steps" DROP COLUMN "title";
  ALTER TABLE "services_real_get_started_steps" DROP COLUMN "description";
  ALTER TABLE "services" DROP COLUMN "name";
  ALTER TABLE "services" DROP COLUMN "description";
  ALTER TABLE "services" DROP COLUMN "stats";
  ALTER TABLE "services" DROP COLUMN "real_tagline";
  ALTER TABLE "services" DROP COLUMN "real_about_second_paragraph";
  ALTER TABLE "services" DROP COLUMN "real_callout_text";
  ALTER TABLE "services" DROP COLUMN "real_about_link_modal_label";
  ALTER TABLE "services" DROP COLUMN "real_about_link_modal_title";
  ALTER TABLE "services" DROP COLUMN "real_product_tour_caption";
  ALTER TABLE "services" DROP COLUMN "real_get_started_intro";
  ALTER TABLE "services" DROP COLUMN "real_get_started_outro";
  ALTER TABLE "services" DROP COLUMN "real_direct_link_label";
  ALTER TABLE "services" DROP COLUMN "real_cta_label";
  ALTER TABLE "services" DROP COLUMN "real_related_card_stats";
  ALTER TABLE "_services_v_version_real_statistics" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_key_features" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_key_feature_descriptions" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_eligibility" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_what_youll_need" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_faqs" DROP COLUMN "q";
  ALTER TABLE "_services_v_version_real_faqs" DROP COLUMN "a";
  ALTER TABLE "_services_v_version_real_faqs_more" DROP COLUMN "q";
  ALTER TABLE "_services_v_version_real_faqs_more" DROP COLUMN "a";
  ALTER TABLE "_services_v_version_real_about_link_modal_items" DROP COLUMN "value";
  ALTER TABLE "_services_v_version_real_product_tour" DROP COLUMN "alt";
  ALTER TABLE "_services_v_version_real_get_started_steps" DROP COLUMN "title";
  ALTER TABLE "_services_v_version_real_get_started_steps" DROP COLUMN "description";
  ALTER TABLE "_services_v" DROP COLUMN "version_name";
  ALTER TABLE "_services_v" DROP COLUMN "version_description";
  ALTER TABLE "_services_v" DROP COLUMN "version_stats";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_tagline";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_about_second_paragraph";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_callout_text";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_about_link_modal_label";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_about_link_modal_title";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_product_tour_caption";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_get_started_intro";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_get_started_outro";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_direct_link_label";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_cta_label";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_related_card_stats";
  ALTER TABLE "government_orders" DROP COLUMN "department";
  ALTER TABLE "_government_orders_v" DROP COLUMN "version_department";
  ALTER TABLE "policies" DROP COLUMN "category";
  ALTER TABLE "_policies_v" DROP COLUMN "version_category";
  ALTER TABLE "legal_pages_sections" DROP COLUMN "heading";
  ALTER TABLE "legal_pages_sections" DROP COLUMN "body";
  ALTER TABLE "legal_pages" DROP COLUMN "title";
  ALTER TABLE "legal_pages" DROP COLUMN "eyebrow";
  ALTER TABLE "legal_pages" DROP COLUMN "intro";
  ALTER TABLE "_legal_pages_v_version_sections" DROP COLUMN "heading";
  ALTER TABLE "_legal_pages_v_version_sections" DROP COLUMN "body";
  ALTER TABLE "_legal_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_legal_pages_v" DROP COLUMN "version_eyebrow";
  ALTER TABLE "_legal_pages_v" DROP COLUMN "version_intro";
  ALTER TABLE "awards" DROP COLUMN "title";
  ALTER TABLE "awards" DROP COLUMN "description";
  ALTER TABLE "_awards_v" DROP COLUMN "version_title";
  ALTER TABLE "_awards_v" DROP COLUMN "version_description";
  ALTER TABLE "roll_of_honour" DROP COLUMN "designation";
  ALTER TABLE "roll_of_honour" DROP COLUMN "range";
  ALTER TABLE "_roll_of_honour_v" DROP COLUMN "version_designation";
  ALTER TABLE "_roll_of_honour_v" DROP COLUMN "version_range";
  ALTER TABLE "projects_spotlight_stats" DROP COLUMN "label";
  ALTER TABLE "projects_spotlight_ctas" DROP COLUMN "label";
  ALTER TABLE "projects_spotlight" DROP COLUMN "badge";
  ALTER TABLE "_projects_spotlight_v_version_stats" DROP COLUMN "label";
  ALTER TABLE "_projects_spotlight_v_version_ctas" DROP COLUMN "label";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "version_badge";
  ALTER TABLE "department_contacts" DROP COLUMN "department";
  ALTER TABLE "_department_contacts_v" DROP COLUMN "version_department";
  ALTER TABLE "board_content_members" DROP COLUMN "title";
  ALTER TABLE "board_content" DROP COLUMN "chairman_role";
  ALTER TABLE "board_content" DROP COLUMN "chairman_title";
  ALTER TABLE "board_content" DROP COLUMN "member_secretary_role";
  ALTER TABLE "board_content" DROP COLUMN "member_secretary_title";
  ALTER TABLE "_board_content_v_version_members" DROP COLUMN "title";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_chairman_role";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_chairman_title";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_member_secretary_role";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_member_secretary_title";
  ALTER TABLE "leadership_band_content_leaders" DROP COLUMN "title";
  ALTER TABLE "leadership_band_content" DROP COLUMN "description";
  ALTER TABLE "_leadership_band_content_v_version_leaders" DROP COLUMN "title";
  ALTER TABLE "_leadership_band_content_v" DROP COLUMN "version_description";
  ALTER TABLE "about_page_content_hierarchy" DROP COLUMN "label";
  ALTER TABLE "about_page_content_vision_mission" DROP COLUMN "label";
  ALTER TABLE "about_page_content_vision_mission" DROP COLUMN "title";
  ALTER TABLE "about_page_content_vision_mission" DROP COLUMN "description";
  ALTER TABLE "about_page_content" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "about_page_content" DROP COLUMN "hero_headline";
  ALTER TABLE "about_page_content" DROP COLUMN "hero_description";
  ALTER TABLE "about_page_content" DROP COLUMN "who_we_are_heading";
  ALTER TABLE "about_page_content" DROP COLUMN "who_we_are_paragraph";
  ALTER TABLE "_about_page_content_v_version_hierarchy" DROP COLUMN "label";
  ALTER TABLE "_about_page_content_v_version_vision_mission" DROP COLUMN "label";
  ALTER TABLE "_about_page_content_v_version_vision_mission" DROP COLUMN "title";
  ALTER TABLE "_about_page_content_v_version_vision_mission" DROP COLUMN "description";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "version_hero_headline";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "version_who_we_are_heading";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "version_who_we_are_paragraph";
  ALTER TABLE "org_chart_content_branches" DROP COLUMN "director";
  ALTER TABLE "org_chart_content_branches" DROP COLUMN "engineer";
  ALTER TABLE "org_chart_content_branches" DROP COLUMN "manager";
  ALTER TABLE "org_chart_content_branches" DROP COLUMN "base";
  ALTER TABLE "_org_chart_content_v_version_branches" DROP COLUMN "director";
  ALTER TABLE "_org_chart_content_v_version_branches" DROP COLUMN "engineer";
  ALTER TABLE "_org_chart_content_v_version_branches" DROP COLUMN "manager";
  ALTER TABLE "_org_chart_content_v_version_branches" DROP COLUMN "base";
  ALTER TABLE "metrics_content_metrics" DROP COLUMN "label";
  ALTER TABLE "_metrics_content_v_version_metrics" DROP COLUMN "label";
  ALTER TABLE "pillars_content_pillars" DROP COLUMN "title";
  ALTER TABLE "pillars_content_pillars" DROP COLUMN "description";
  ALTER TABLE "pillars_content_pillars" DROP COLUMN "link_label";
  ALTER TABLE "_pillars_content_v_version_pillars" DROP COLUMN "title";
  ALTER TABLE "_pillars_content_v_version_pillars" DROP COLUMN "description";
  ALTER TABLE "_pillars_content_v_version_pillars" DROP COLUMN "link_label";
  ALTER TABLE "careers_content_application_steps" DROP COLUMN "title";
  ALTER TABLE "careers_content_application_steps" DROP COLUMN "description";
  ALTER TABLE "careers_content" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "careers_content" DROP COLUMN "hero_heading";
  ALTER TABLE "careers_content" DROP COLUMN "hero_body";
  ALTER TABLE "careers_content" DROP COLUMN "hero_cta_label";
  ALTER TABLE "careers_content" DROP COLUMN "openings_note";
  ALTER TABLE "_careers_content_v_version_application_steps" DROP COLUMN "title";
  ALTER TABLE "_careers_content_v_version_application_steps" DROP COLUMN "description";
  ALTER TABLE "_careers_content_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_careers_content_v" DROP COLUMN "version_hero_heading";
  ALTER TABLE "_careers_content_v" DROP COLUMN "version_hero_body";
  ALTER TABLE "_careers_content_v" DROP COLUMN "version_hero_cta_label";
  ALTER TABLE "_careers_content_v" DROP COLUMN "version_openings_note";
  ALTER TABLE "rti_content_contacts" DROP COLUMN "badge";
  ALTER TABLE "rti_content_contacts" DROP COLUMN "designation";
  ALTER TABLE "rti_content_contacts" DROP COLUMN "details_text";
  ALTER TABLE "rti_content_disclosures" DROP COLUMN "item";
  ALTER TABLE "rti_content_disclosures" DROP COLUMN "rows_text";
  ALTER TABLE "rti_content" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "rti_content" DROP COLUMN "hero_heading";
  ALTER TABLE "rti_content" DROP COLUMN "hero_body";
  ALTER TABLE "rti_content" DROP COLUMN "how_to_file_heading";
  ALTER TABLE "rti_content" DROP COLUMN "how_to_file_sub";
  ALTER TABLE "rti_content" DROP COLUMN "how_to_file_body";
  ALTER TABLE "rti_content" DROP COLUMN "how_to_file_cta_label";
  ALTER TABLE "rti_content" DROP COLUMN "how_to_file_redirect_note";
  ALTER TABLE "_rti_content_v_version_contacts" DROP COLUMN "badge";
  ALTER TABLE "_rti_content_v_version_contacts" DROP COLUMN "designation";
  ALTER TABLE "_rti_content_v_version_contacts" DROP COLUMN "details_text";
  ALTER TABLE "_rti_content_v_version_disclosures" DROP COLUMN "item";
  ALTER TABLE "_rti_content_v_version_disclosures" DROP COLUMN "rows_text";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_hero_heading";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_hero_body";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_how_to_file_heading";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_how_to_file_sub";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_how_to_file_body";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_how_to_file_cta_label";
  ALTER TABLE "_rti_content_v" DROP COLUMN "version_how_to_file_redirect_note";
  ALTER TABLE "tenders_content" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "tenders_content" DROP COLUMN "hero_heading";
  ALTER TABLE "tenders_content" DROP COLUMN "hero_body";
  ALTER TABLE "tenders_content" DROP COLUMN "tender_portal_heading";
  ALTER TABLE "tenders_content" DROP COLUMN "tender_portal_sub";
  ALTER TABLE "tenders_content" DROP COLUMN "tender_portal_body";
  ALTER TABLE "tenders_content" DROP COLUMN "tender_portal_cta_label";
  ALTER TABLE "tenders_content" DROP COLUMN "tender_portal_redirect_note";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_hero_heading";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_hero_body";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_tender_portal_heading";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_tender_portal_sub";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_tender_portal_body";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_tender_portal_cta_label";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "version_tender_portal_redirect_note";
  ALTER TABLE "services_to_government_content_services" DROP COLUMN "name";
  ALTER TABLE "services_to_government_content_services" DROP COLUMN "description";
  ALTER TABLE "services_to_government_content" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "services_to_government_content" DROP COLUMN "hero_heading";
  ALTER TABLE "services_to_government_content" DROP COLUMN "hero_body";
  ALTER TABLE "services_to_government_content" DROP COLUMN "table_intro_eyebrow";
  ALTER TABLE "services_to_government_content" DROP COLUMN "table_intro_heading";
  ALTER TABLE "services_to_government_content" DROP COLUMN "table_intro_body";
  ALTER TABLE "services_to_government_content" DROP COLUMN "raise_ticket_label";
  ALTER TABLE "_services_to_government_content_v_version_services" DROP COLUMN "name";
  ALTER TABLE "_services_to_government_content_v_version_services" DROP COLUMN "description";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_hero_heading";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_hero_body";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_table_intro_eyebrow";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_table_intro_heading";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_table_intro_body";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "version_raise_ticket_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "announcements_facts_locales" CASCADE;
  DROP TABLE "announcements_locales" CASCADE;
  DROP TABLE "_announcements_v_version_facts_locales" CASCADE;
  DROP TABLE "_announcements_v_locales" CASCADE;
  DROP TABLE "media_items_locales" CASCADE;
  DROP TABLE "_media_items_v_locales" CASCADE;
  DROP TABLE "job_openings_locales" CASCADE;
  DROP TABLE "_job_openings_v_locales" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "_team_members_v_locales" CASCADE;
  DROP TABLE "services_real_statistics_locales" CASCADE;
  DROP TABLE "services_real_key_features_locales" CASCADE;
  DROP TABLE "services_real_key_feature_descriptions_locales" CASCADE;
  DROP TABLE "services_real_eligibility_locales" CASCADE;
  DROP TABLE "services_real_what_youll_need_locales" CASCADE;
  DROP TABLE "services_real_faqs_locales" CASCADE;
  DROP TABLE "services_real_faqs_more_locales" CASCADE;
  DROP TABLE "services_real_about_link_modal_items_locales" CASCADE;
  DROP TABLE "services_real_product_tour_locales" CASCADE;
  DROP TABLE "services_real_get_started_steps_locales" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v_version_real_statistics_locales" CASCADE;
  DROP TABLE "_services_v_version_real_key_features_locales" CASCADE;
  DROP TABLE "_services_v_version_real_key_feature_descriptions_locales" CASCADE;
  DROP TABLE "_services_v_version_real_eligibility_locales" CASCADE;
  DROP TABLE "_services_v_version_real_what_youll_need_locales" CASCADE;
  DROP TABLE "_services_v_version_real_faqs_locales" CASCADE;
  DROP TABLE "_services_v_version_real_faqs_more_locales" CASCADE;
  DROP TABLE "_services_v_version_real_about_link_modal_items_locales" CASCADE;
  DROP TABLE "_services_v_version_real_product_tour_locales" CASCADE;
  DROP TABLE "_services_v_version_real_get_started_steps_locales" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "government_orders_locales" CASCADE;
  DROP TABLE "_government_orders_v_locales" CASCADE;
  DROP TABLE "policies_locales" CASCADE;
  DROP TABLE "_policies_v_locales" CASCADE;
  DROP TABLE "legal_pages_sections_locales" CASCADE;
  DROP TABLE "legal_pages_locales" CASCADE;
  DROP TABLE "_legal_pages_v_version_sections_locales" CASCADE;
  DROP TABLE "_legal_pages_v_locales" CASCADE;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "_awards_v_locales" CASCADE;
  DROP TABLE "roll_of_honour_locales" CASCADE;
  DROP TABLE "_roll_of_honour_v_locales" CASCADE;
  DROP TABLE "projects_spotlight_stats_locales" CASCADE;
  DROP TABLE "projects_spotlight_ctas_locales" CASCADE;
  DROP TABLE "projects_spotlight_locales" CASCADE;
  DROP TABLE "_projects_spotlight_v_version_stats_locales" CASCADE;
  DROP TABLE "_projects_spotlight_v_version_ctas_locales" CASCADE;
  DROP TABLE "_projects_spotlight_v_locales" CASCADE;
  DROP TABLE "department_contacts_locales" CASCADE;
  DROP TABLE "_department_contacts_v_locales" CASCADE;
  DROP TABLE "board_content_members_locales" CASCADE;
  DROP TABLE "board_content_locales" CASCADE;
  DROP TABLE "_board_content_v_version_members_locales" CASCADE;
  DROP TABLE "_board_content_v_locales" CASCADE;
  DROP TABLE "leadership_band_content_leaders_locales" CASCADE;
  DROP TABLE "leadership_band_content_locales" CASCADE;
  DROP TABLE "_leadership_band_content_v_version_leaders_locales" CASCADE;
  DROP TABLE "_leadership_band_content_v_locales" CASCADE;
  DROP TABLE "about_page_content_hierarchy_locales" CASCADE;
  DROP TABLE "about_page_content_vision_mission_locales" CASCADE;
  DROP TABLE "about_page_content_locales" CASCADE;
  DROP TABLE "_about_page_content_v_version_hierarchy_locales" CASCADE;
  DROP TABLE "_about_page_content_v_version_vision_mission_locales" CASCADE;
  DROP TABLE "_about_page_content_v_locales" CASCADE;
  DROP TABLE "org_chart_content_branches_locales" CASCADE;
  DROP TABLE "_org_chart_content_v_version_branches_locales" CASCADE;
  DROP TABLE "metrics_content_metrics_locales" CASCADE;
  DROP TABLE "_metrics_content_v_version_metrics_locales" CASCADE;
  DROP TABLE "pillars_content_pillars_locales" CASCADE;
  DROP TABLE "_pillars_content_v_version_pillars_locales" CASCADE;
  DROP TABLE "careers_content_application_steps_locales" CASCADE;
  DROP TABLE "careers_content_locales" CASCADE;
  DROP TABLE "_careers_content_v_version_application_steps_locales" CASCADE;
  DROP TABLE "_careers_content_v_locales" CASCADE;
  DROP TABLE "rti_content_contacts_locales" CASCADE;
  DROP TABLE "rti_content_disclosures_locales" CASCADE;
  DROP TABLE "rti_content_locales" CASCADE;
  DROP TABLE "_rti_content_v_version_contacts_locales" CASCADE;
  DROP TABLE "_rti_content_v_version_disclosures_locales" CASCADE;
  DROP TABLE "_rti_content_v_locales" CASCADE;
  DROP TABLE "tenders_content_locales" CASCADE;
  DROP TABLE "_tenders_content_v_locales" CASCADE;
  DROP TABLE "services_to_government_content_services_locales" CASCADE;
  DROP TABLE "services_to_government_content_locales" CASCADE;
  DROP TABLE "_services_to_government_content_v_version_services_locales" CASCADE;
  DROP TABLE "_services_to_government_content_v_locales" CASCADE;
  ALTER TABLE "announcements_facts" ADD COLUMN "label" varchar;
  ALTER TABLE "announcements" ADD COLUMN "heading" varchar;
  ALTER TABLE "announcements" ADD COLUMN "description" varchar;
  ALTER TABLE "announcements" ADD COLUMN "category" varchar;
  ALTER TABLE "announcements" ADD COLUMN "body" jsonb;
  ALTER TABLE "_announcements_v_version_facts" ADD COLUMN "label" varchar;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_heading" varchar;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_category" varchar;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "media_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "media_items" ADD COLUMN "alt_text" varchar;
  ALTER TABLE "_media_items_v" ADD COLUMN "version_caption" varchar;
  ALTER TABLE "_media_items_v" ADD COLUMN "version_alt_text" varchar;
  ALTER TABLE "job_openings" ADD COLUMN "role" varchar;
  ALTER TABLE "job_openings" ADD COLUMN "type" varchar DEFAULT 'Contract';
  ALTER TABLE "job_openings" ADD COLUMN "department" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_role" varchar;
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_type" varchar DEFAULT 'Contract';
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_department" varchar;
  ALTER TABLE "team_members" ADD COLUMN "designation" varchar;
  ALTER TABLE "team_members" ADD COLUMN "subject" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_designation" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_subject" varchar;
  ALTER TABLE "services_real_statistics" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_key_features" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_key_feature_descriptions" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_eligibility" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_what_youll_need" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_faqs" ADD COLUMN "q" varchar;
  ALTER TABLE "services_real_faqs" ADD COLUMN "a" varchar;
  ALTER TABLE "services_real_faqs_more" ADD COLUMN "q" varchar;
  ALTER TABLE "services_real_faqs_more" ADD COLUMN "a" varchar;
  ALTER TABLE "services_real_about_link_modal_items" ADD COLUMN "value" varchar;
  ALTER TABLE "services_real_product_tour" ADD COLUMN "alt" varchar;
  ALTER TABLE "services_real_get_started_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "services_real_get_started_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "services" ADD COLUMN "name" varchar;
  ALTER TABLE "services" ADD COLUMN "description" varchar;
  ALTER TABLE "services" ADD COLUMN "stats" varchar;
  ALTER TABLE "services" ADD COLUMN "real_tagline" varchar;
  ALTER TABLE "services" ADD COLUMN "real_about_second_paragraph" varchar;
  ALTER TABLE "services" ADD COLUMN "real_callout_text" varchar;
  ALTER TABLE "services" ADD COLUMN "real_about_link_modal_label" varchar;
  ALTER TABLE "services" ADD COLUMN "real_about_link_modal_title" varchar;
  ALTER TABLE "services" ADD COLUMN "real_product_tour_caption" varchar;
  ALTER TABLE "services" ADD COLUMN "real_get_started_intro" varchar;
  ALTER TABLE "services" ADD COLUMN "real_get_started_outro" varchar;
  ALTER TABLE "services" ADD COLUMN "real_direct_link_label" varchar;
  ALTER TABLE "services" ADD COLUMN "real_cta_label" varchar;
  ALTER TABLE "services" ADD COLUMN "real_related_card_stats" varchar;
  ALTER TABLE "_services_v_version_real_statistics" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_key_features" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_key_feature_descriptions" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_eligibility" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_what_youll_need" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_faqs" ADD COLUMN "q" varchar;
  ALTER TABLE "_services_v_version_real_faqs" ADD COLUMN "a" varchar;
  ALTER TABLE "_services_v_version_real_faqs_more" ADD COLUMN "q" varchar;
  ALTER TABLE "_services_v_version_real_faqs_more" ADD COLUMN "a" varchar;
  ALTER TABLE "_services_v_version_real_about_link_modal_items" ADD COLUMN "value" varchar;
  ALTER TABLE "_services_v_version_real_product_tour" ADD COLUMN "alt" varchar;
  ALTER TABLE "_services_v_version_real_get_started_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "_services_v_version_real_get_started_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_stats" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_tagline" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_about_second_paragraph" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_callout_text" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_about_link_modal_label" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_about_link_modal_title" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_product_tour_caption" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_get_started_intro" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_get_started_outro" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_direct_link_label" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_cta_label" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_related_card_stats" varchar;
  ALTER TABLE "government_orders" ADD COLUMN "department" varchar;
  ALTER TABLE "_government_orders_v" ADD COLUMN "version_department" varchar;
  ALTER TABLE "policies" ADD COLUMN "category" varchar;
  ALTER TABLE "_policies_v" ADD COLUMN "version_category" varchar;
  ALTER TABLE "legal_pages_sections" ADD COLUMN "heading" varchar;
  ALTER TABLE "legal_pages_sections" ADD COLUMN "body" varchar;
  ALTER TABLE "legal_pages" ADD COLUMN "title" varchar;
  ALTER TABLE "legal_pages" ADD COLUMN "eyebrow" varchar DEFAULT 'Legal';
  ALTER TABLE "legal_pages" ADD COLUMN "intro" varchar;
  ALTER TABLE "_legal_pages_v_version_sections" ADD COLUMN "heading" varchar;
  ALTER TABLE "_legal_pages_v_version_sections" ADD COLUMN "body" varchar;
  ALTER TABLE "_legal_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_legal_pages_v" ADD COLUMN "version_eyebrow" varchar DEFAULT 'Legal';
  ALTER TABLE "_legal_pages_v" ADD COLUMN "version_intro" varchar;
  ALTER TABLE "awards" ADD COLUMN "title" varchar;
  ALTER TABLE "awards" ADD COLUMN "description" varchar;
  ALTER TABLE "_awards_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_awards_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "roll_of_honour" ADD COLUMN "designation" varchar;
  ALTER TABLE "roll_of_honour" ADD COLUMN "range" varchar;
  ALTER TABLE "_roll_of_honour_v" ADD COLUMN "version_designation" varchar;
  ALTER TABLE "_roll_of_honour_v" ADD COLUMN "version_range" varchar;
  ALTER TABLE "projects_spotlight_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "projects_spotlight_ctas" ADD COLUMN "label" varchar;
  ALTER TABLE "projects_spotlight" ADD COLUMN "badge" varchar;
  ALTER TABLE "_projects_spotlight_v_version_stats" ADD COLUMN "label" varchar;
  ALTER TABLE "_projects_spotlight_v_version_ctas" ADD COLUMN "label" varchar;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "version_badge" varchar;
  ALTER TABLE "department_contacts" ADD COLUMN "department" varchar;
  ALTER TABLE "_department_contacts_v" ADD COLUMN "version_department" varchar;
  ALTER TABLE "board_content_members" ADD COLUMN "title" varchar;
  ALTER TABLE "board_content" ADD COLUMN "chairman_role" varchar DEFAULT 'Chairman';
  ALTER TABLE "board_content" ADD COLUMN "chairman_title" varchar;
  ALTER TABLE "board_content" ADD COLUMN "member_secretary_role" varchar DEFAULT 'Member Secretary';
  ALTER TABLE "board_content" ADD COLUMN "member_secretary_title" varchar;
  ALTER TABLE "_board_content_v_version_members" ADD COLUMN "title" varchar;
  ALTER TABLE "_board_content_v" ADD COLUMN "version_chairman_role" varchar DEFAULT 'Chairman';
  ALTER TABLE "_board_content_v" ADD COLUMN "version_chairman_title" varchar;
  ALTER TABLE "_board_content_v" ADD COLUMN "version_member_secretary_role" varchar DEFAULT 'Member Secretary';
  ALTER TABLE "_board_content_v" ADD COLUMN "version_member_secretary_title" varchar;
  ALTER TABLE "leadership_band_content_leaders" ADD COLUMN "title" varchar;
  ALTER TABLE "leadership_band_content" ADD COLUMN "description" varchar;
  ALTER TABLE "_leadership_band_content_v_version_leaders" ADD COLUMN "title" varchar;
  ALTER TABLE "_leadership_band_content_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "about_page_content_hierarchy" ADD COLUMN "label" varchar;
  ALTER TABLE "about_page_content_vision_mission" ADD COLUMN "label" varchar;
  ALTER TABLE "about_page_content_vision_mission" ADD COLUMN "title" varchar;
  ALTER TABLE "about_page_content_vision_mission" ADD COLUMN "description" varchar;
  ALTER TABLE "about_page_content" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "about_page_content" ADD COLUMN "hero_headline" varchar;
  ALTER TABLE "about_page_content" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "about_page_content" ADD COLUMN "who_we_are_heading" varchar;
  ALTER TABLE "about_page_content" ADD COLUMN "who_we_are_paragraph" varchar;
  ALTER TABLE "_about_page_content_v_version_hierarchy" ADD COLUMN "label" varchar;
  ALTER TABLE "_about_page_content_v_version_vision_mission" ADD COLUMN "label" varchar;
  ALTER TABLE "_about_page_content_v_version_vision_mission" ADD COLUMN "title" varchar;
  ALTER TABLE "_about_page_content_v_version_vision_mission" ADD COLUMN "description" varchar;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "version_hero_headline" varchar;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "version_hero_description" varchar;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "version_who_we_are_heading" varchar;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "version_who_we_are_paragraph" varchar;
  ALTER TABLE "org_chart_content_branches" ADD COLUMN "director" varchar;
  ALTER TABLE "org_chart_content_branches" ADD COLUMN "engineer" varchar;
  ALTER TABLE "org_chart_content_branches" ADD COLUMN "manager" varchar;
  ALTER TABLE "org_chart_content_branches" ADD COLUMN "base" varchar;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD COLUMN "director" varchar;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD COLUMN "engineer" varchar;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD COLUMN "manager" varchar;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD COLUMN "base" varchar;
  ALTER TABLE "metrics_content_metrics" ADD COLUMN "label" varchar;
  ALTER TABLE "_metrics_content_v_version_metrics" ADD COLUMN "label" varchar;
  ALTER TABLE "pillars_content_pillars" ADD COLUMN "title" varchar;
  ALTER TABLE "pillars_content_pillars" ADD COLUMN "description" varchar;
  ALTER TABLE "pillars_content_pillars" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pillars_content_v_version_pillars" ADD COLUMN "title" varchar;
  ALTER TABLE "_pillars_content_v_version_pillars" ADD COLUMN "description" varchar;
  ALTER TABLE "_pillars_content_v_version_pillars" ADD COLUMN "link_label" varchar;
  ALTER TABLE "careers_content_application_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "careers_content_application_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "careers_content" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "careers_content" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "careers_content" ADD COLUMN "hero_body" varchar;
  ALTER TABLE "careers_content" ADD COLUMN "hero_cta_label" varchar;
  ALTER TABLE "careers_content" ADD COLUMN "openings_note" varchar;
  ALTER TABLE "_careers_content_v_version_application_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "_careers_content_v_version_application_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "_careers_content_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_careers_content_v" ADD COLUMN "version_hero_heading" varchar;
  ALTER TABLE "_careers_content_v" ADD COLUMN "version_hero_body" varchar;
  ALTER TABLE "_careers_content_v" ADD COLUMN "version_hero_cta_label" varchar;
  ALTER TABLE "_careers_content_v" ADD COLUMN "version_openings_note" varchar;
  ALTER TABLE "rti_content_contacts" ADD COLUMN "badge" varchar;
  ALTER TABLE "rti_content_contacts" ADD COLUMN "designation" varchar;
  ALTER TABLE "rti_content_contacts" ADD COLUMN "details_text" varchar;
  ALTER TABLE "rti_content_disclosures" ADD COLUMN "item" varchar;
  ALTER TABLE "rti_content_disclosures" ADD COLUMN "rows_text" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "hero_body" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "how_to_file_heading" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "how_to_file_sub" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "how_to_file_body" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "how_to_file_cta_label" varchar;
  ALTER TABLE "rti_content" ADD COLUMN "how_to_file_redirect_note" varchar;
  ALTER TABLE "_rti_content_v_version_contacts" ADD COLUMN "badge" varchar;
  ALTER TABLE "_rti_content_v_version_contacts" ADD COLUMN "designation" varchar;
  ALTER TABLE "_rti_content_v_version_contacts" ADD COLUMN "details_text" varchar;
  ALTER TABLE "_rti_content_v_version_disclosures" ADD COLUMN "item" varchar;
  ALTER TABLE "_rti_content_v_version_disclosures" ADD COLUMN "rows_text" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_hero_heading" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_hero_body" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_how_to_file_heading" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_how_to_file_sub" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_how_to_file_body" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_how_to_file_cta_label" varchar;
  ALTER TABLE "_rti_content_v" ADD COLUMN "version_how_to_file_redirect_note" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "hero_body" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "tender_portal_heading" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "tender_portal_sub" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "tender_portal_body" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "tender_portal_cta_label" varchar;
  ALTER TABLE "tenders_content" ADD COLUMN "tender_portal_redirect_note" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_hero_heading" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_hero_body" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_tender_portal_heading" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_tender_portal_sub" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_tender_portal_body" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_tender_portal_cta_label" varchar;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "version_tender_portal_redirect_note" varchar;
  ALTER TABLE "services_to_government_content_services" ADD COLUMN "name" varchar;
  ALTER TABLE "services_to_government_content_services" ADD COLUMN "description" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "hero_body" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "table_intro_eyebrow" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "table_intro_heading" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "table_intro_body" varchar;
  ALTER TABLE "services_to_government_content" ADD COLUMN "raise_ticket_label" varchar DEFAULT 'Raise a Ticket';
  ALTER TABLE "_services_to_government_content_v_version_services" ADD COLUMN "name" varchar;
  ALTER TABLE "_services_to_government_content_v_version_services" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hero_heading" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_hero_body" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_table_intro_eyebrow" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_table_intro_heading" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_table_intro_body" varchar;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "version_raise_ticket_label" varchar DEFAULT 'Raise a Ticket';`)
}
