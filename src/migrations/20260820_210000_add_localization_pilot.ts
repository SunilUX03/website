import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__announcements_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__media_items_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__job_openings_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__team_members_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__government_orders_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__policies_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__legal_pages_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__awards_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__roll_of_honour_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__projects_spotlight_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__social_posts_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__department_contacts_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__nav_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__board_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__hero_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__leadership_band_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__footer_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__about_page_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__org_chart_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__metrics_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__pillars_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__careers_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__rti_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__tenders_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__site_copy_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TYPE "public"."enum__services_to_government_content_v_published_locale" AS ENUM('en', 'ta');
  CREATE TABLE "nav_content_about_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nav_content_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nav_content_notifications_updates_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nav_content_notifications_documents_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nav_content_locales" (
  	"gov_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_nav_content_v_version_about_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_nav_content_v_version_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_nav_content_v_version_notifications_updates_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_nav_content_v_version_notifications_documents_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_nav_content_v_locales" (
  	"version_gov_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_content_agency_label_cycle_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hero_content_headline_cycle_words_locales" (
  	"word" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hero_content_locales" (
  	"headline_template" varchar,
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hero_content_v_version_agency_label_cycle_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hero_content_v_version_headline_cycle_words_locales" (
  	"word" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_hero_content_v_locales" (
  	"version_headline_template" varchar,
  	"version_tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_content_quick_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_content_citizen_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_content_help_support_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_content_locales" (
  	"description" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_content_v_version_quick_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_content_v_version_citizen_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_content_v_version_help_support_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_content_v_locales" (
  	"version_description" varchar,
  	"version_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_copy_content_reach_us_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_copy_content_locales" (
  	"announcements_hero_eyebrow" varchar,
  	"announcements_hero_heading" varchar,
  	"announcements_hero_body" varchar,
  	"government_orders_hero_eyebrow" varchar,
  	"government_orders_hero_heading" varchar,
  	"government_orders_hero_body" varchar,
  	"policies_hero_eyebrow" varchar,
  	"policies_hero_heading" varchar,
  	"policies_hero_body" varchar,
  	"media_hero_eyebrow" varchar,
  	"media_hero_heading" varchar,
  	"media_hero_body" varchar,
  	"services_hero_eyebrow" varchar,
  	"services_hero_heading" varchar,
  	"services_hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_copy_content_v_version_reach_us_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_copy_content_v_locales" (
  	"version_announcements_hero_eyebrow" varchar,
  	"version_announcements_hero_heading" varchar,
  	"version_announcements_hero_body" varchar,
  	"version_government_orders_hero_eyebrow" varchar,
  	"version_government_orders_hero_heading" varchar,
  	"version_government_orders_hero_body" varchar,
  	"version_policies_hero_eyebrow" varchar,
  	"version_policies_hero_heading" varchar,
  	"version_policies_hero_body" varchar,
  	"version_media_hero_eyebrow" varchar,
  	"version_media_hero_heading" varchar,
  	"version_media_hero_body" varchar,
  	"version_services_hero_eyebrow" varchar,
  	"version_services_hero_heading" varchar,
  	"version_services_hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "_announcements_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_announcements_v" ADD COLUMN "published_locale" "enum__announcements_v_published_locale";
  ALTER TABLE "_media_items_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_media_items_v" ADD COLUMN "published_locale" "enum__media_items_v_published_locale";
  ALTER TABLE "_job_openings_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_job_openings_v" ADD COLUMN "published_locale" "enum__job_openings_v_published_locale";
  ALTER TABLE "_team_members_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_team_members_v" ADD COLUMN "published_locale" "enum__team_members_v_published_locale";
  ALTER TABLE "_services_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_services_v" ADD COLUMN "published_locale" "enum__services_v_published_locale";
  ALTER TABLE "_government_orders_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_government_orders_v" ADD COLUMN "published_locale" "enum__government_orders_v_published_locale";
  ALTER TABLE "_policies_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_policies_v" ADD COLUMN "published_locale" "enum__policies_v_published_locale";
  ALTER TABLE "_legal_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_legal_pages_v" ADD COLUMN "published_locale" "enum__legal_pages_v_published_locale";
  ALTER TABLE "_awards_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_awards_v" ADD COLUMN "published_locale" "enum__awards_v_published_locale";
  ALTER TABLE "_roll_of_honour_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_roll_of_honour_v" ADD COLUMN "published_locale" "enum__roll_of_honour_v_published_locale";
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "published_locale" "enum__projects_spotlight_v_published_locale";
  ALTER TABLE "_social_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_social_posts_v" ADD COLUMN "published_locale" "enum__social_posts_v_published_locale";
  ALTER TABLE "_department_contacts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_department_contacts_v" ADD COLUMN "published_locale" "enum__department_contacts_v_published_locale";
  ALTER TABLE "_nav_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_nav_content_v" ADD COLUMN "published_locale" "enum__nav_content_v_published_locale";
  ALTER TABLE "_board_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_board_content_v" ADD COLUMN "published_locale" "enum__board_content_v_published_locale";
  ALTER TABLE "_hero_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_hero_content_v" ADD COLUMN "published_locale" "enum__hero_content_v_published_locale";
  ALTER TABLE "_leadership_band_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_leadership_band_content_v" ADD COLUMN "published_locale" "enum__leadership_band_content_v_published_locale";
  ALTER TABLE "_footer_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_footer_content_v" ADD COLUMN "published_locale" "enum__footer_content_v_published_locale";
  ALTER TABLE "_about_page_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_about_page_content_v" ADD COLUMN "published_locale" "enum__about_page_content_v_published_locale";
  ALTER TABLE "_org_chart_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_org_chart_content_v" ADD COLUMN "published_locale" "enum__org_chart_content_v_published_locale";
  ALTER TABLE "_metrics_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_metrics_content_v" ADD COLUMN "published_locale" "enum__metrics_content_v_published_locale";
  ALTER TABLE "_pillars_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pillars_content_v" ADD COLUMN "published_locale" "enum__pillars_content_v_published_locale";
  ALTER TABLE "_careers_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_careers_content_v" ADD COLUMN "published_locale" "enum__careers_content_v_published_locale";
  ALTER TABLE "_rti_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_rti_content_v" ADD COLUMN "published_locale" "enum__rti_content_v_published_locale";
  ALTER TABLE "_tenders_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_tenders_content_v" ADD COLUMN "published_locale" "enum__tenders_content_v_published_locale";
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "published_locale" "enum__site_copy_content_v_published_locale";
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_services_to_government_content_v" ADD COLUMN "published_locale" "enum__services_to_government_content_v_published_locale";
  ALTER TABLE "nav_content_about_locales" ADD CONSTRAINT "nav_content_about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_services_locales" ADD CONSTRAINT "nav_content_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_notifications_updates_locales" ADD CONSTRAINT "nav_content_notifications_updates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content_notifications_updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_notifications_documents_locales" ADD CONSTRAINT "nav_content_notifications_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content_notifications_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nav_content_locales" ADD CONSTRAINT "nav_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_about_locales" ADD CONSTRAINT "_nav_content_v_version_about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v_version_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_services_locales" ADD CONSTRAINT "_nav_content_v_version_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v_version_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_notifications_updates_locales" ADD CONSTRAINT "_nav_content_v_version_notifications_updates_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v_version_notifications_updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_version_notifications_documents_locales" ADD CONSTRAINT "_nav_content_v_version_notifications_documents_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v_version_notifications_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_nav_content_v_locales" ADD CONSTRAINT "_nav_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_nav_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_content_agency_label_cycle_locales" ADD CONSTRAINT "hero_content_agency_label_cycle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_content_agency_label_cycle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_content_headline_cycle_words_locales" ADD CONSTRAINT "hero_content_headline_cycle_words_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_content_headline_cycle_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_content_locales" ADD CONSTRAINT "hero_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_content_v_version_agency_label_cycle_locales" ADD CONSTRAINT "_hero_content_v_version_agency_label_cycle_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_content_v_version_agency_label_cycle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_content_v_version_headline_cycle_words_locales" ADD CONSTRAINT "_hero_content_v_version_headline_cycle_words_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_content_v_version_headline_cycle_words"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hero_content_v_locales" ADD CONSTRAINT "_hero_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hero_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_quick_links_locales" ADD CONSTRAINT "footer_content_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_citizen_services_locales" ADD CONSTRAINT "footer_content_citizen_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content_citizen_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_help_support_locales" ADD CONSTRAINT "footer_content_help_support_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content_help_support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_locales" ADD CONSTRAINT "footer_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_quick_links_locales" ADD CONSTRAINT "_footer_content_v_version_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v_version_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_citizen_services_locales" ADD CONSTRAINT "_footer_content_v_version_citizen_services_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v_version_citizen_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_version_help_support_locales" ADD CONSTRAINT "_footer_content_v_version_help_support_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v_version_help_support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_content_v_locales" ADD CONSTRAINT "_footer_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_copy_content_reach_us_panels_locales" ADD CONSTRAINT "site_copy_content_reach_us_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_copy_content_reach_us_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_copy_content_locales" ADD CONSTRAINT "site_copy_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_copy_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels_locales" ADD CONSTRAINT "_site_copy_content_v_version_reach_us_panels_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_copy_content_v_version_reach_us_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_copy_content_v_locales" ADD CONSTRAINT "_site_copy_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_copy_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "nav_content_about_locales_locale_parent_id_unique" ON "nav_content_about_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nav_content_services_locales_locale_parent_id_unique" ON "nav_content_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nav_content_notifications_updates_locales_locale_parent_id_u" ON "nav_content_notifications_updates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nav_content_notifications_documents_locales_locale_parent_id" ON "nav_content_notifications_documents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nav_content_locales_locale_parent_id_unique" ON "nav_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_nav_content_v_version_about_locales_locale_parent_id_unique" ON "_nav_content_v_version_about_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_nav_content_v_version_services_locales_locale_parent_id_uni" ON "_nav_content_v_version_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_nav_content_v_version_notifications_updates_locales_locale_" ON "_nav_content_v_version_notifications_updates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_nav_content_v_version_notifications_documents_locales_local" ON "_nav_content_v_version_notifications_documents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_nav_content_v_locales_locale_parent_id_unique" ON "_nav_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "hero_content_agency_label_cycle_locales_locale_parent_id_uni" ON "hero_content_agency_label_cycle_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "hero_content_headline_cycle_words_locales_locale_parent_id_u" ON "hero_content_headline_cycle_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "hero_content_locales_locale_parent_id_unique" ON "hero_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_hero_content_v_version_agency_label_cycle_locales_locale_pa" ON "_hero_content_v_version_agency_label_cycle_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_hero_content_v_version_headline_cycle_words_locales_locale_" ON "_hero_content_v_version_headline_cycle_words_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_hero_content_v_locales_locale_parent_id_unique" ON "_hero_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_content_quick_links_locales_locale_parent_id_unique" ON "footer_content_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_content_citizen_services_locales_locale_parent_id_uni" ON "footer_content_citizen_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_content_help_support_locales_locale_parent_id_unique" ON "footer_content_help_support_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_content_locales_locale_parent_id_unique" ON "footer_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_footer_content_v_version_quick_links_locales_locale_parent_" ON "_footer_content_v_version_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_footer_content_v_version_citizen_services_locales_locale_pa" ON "_footer_content_v_version_citizen_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_footer_content_v_version_help_support_locales_locale_parent" ON "_footer_content_v_version_help_support_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_footer_content_v_locales_locale_parent_id_unique" ON "_footer_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_copy_content_reach_us_panels_locales_locale_parent_id_u" ON "site_copy_content_reach_us_panels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_copy_content_locales_locale_parent_id_unique" ON "site_copy_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_site_copy_content_v_version_reach_us_panels_locales_locale_" ON "_site_copy_content_v_version_reach_us_panels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_site_copy_content_v_locales_locale_parent_id_unique" ON "_site_copy_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_announcements_v_snapshot_idx" ON "_announcements_v" USING btree ("snapshot");
  CREATE INDEX "_announcements_v_published_locale_idx" ON "_announcements_v" USING btree ("published_locale");
  CREATE INDEX "_media_items_v_snapshot_idx" ON "_media_items_v" USING btree ("snapshot");
  CREATE INDEX "_media_items_v_published_locale_idx" ON "_media_items_v" USING btree ("published_locale");
  CREATE INDEX "_job_openings_v_snapshot_idx" ON "_job_openings_v" USING btree ("snapshot");
  CREATE INDEX "_job_openings_v_published_locale_idx" ON "_job_openings_v" USING btree ("published_locale");
  CREATE INDEX "_team_members_v_snapshot_idx" ON "_team_members_v" USING btree ("snapshot");
  CREATE INDEX "_team_members_v_published_locale_idx" ON "_team_members_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_government_orders_v_snapshot_idx" ON "_government_orders_v" USING btree ("snapshot");
  CREATE INDEX "_government_orders_v_published_locale_idx" ON "_government_orders_v" USING btree ("published_locale");
  CREATE INDEX "_policies_v_snapshot_idx" ON "_policies_v" USING btree ("snapshot");
  CREATE INDEX "_policies_v_published_locale_idx" ON "_policies_v" USING btree ("published_locale");
  CREATE INDEX "_legal_pages_v_snapshot_idx" ON "_legal_pages_v" USING btree ("snapshot");
  CREATE INDEX "_legal_pages_v_published_locale_idx" ON "_legal_pages_v" USING btree ("published_locale");
  CREATE INDEX "_awards_v_snapshot_idx" ON "_awards_v" USING btree ("snapshot");
  CREATE INDEX "_awards_v_published_locale_idx" ON "_awards_v" USING btree ("published_locale");
  CREATE INDEX "_roll_of_honour_v_snapshot_idx" ON "_roll_of_honour_v" USING btree ("snapshot");
  CREATE INDEX "_roll_of_honour_v_published_locale_idx" ON "_roll_of_honour_v" USING btree ("published_locale");
  CREATE INDEX "_projects_spotlight_v_snapshot_idx" ON "_projects_spotlight_v" USING btree ("snapshot");
  CREATE INDEX "_projects_spotlight_v_published_locale_idx" ON "_projects_spotlight_v" USING btree ("published_locale");
  CREATE INDEX "_social_posts_v_snapshot_idx" ON "_social_posts_v" USING btree ("snapshot");
  CREATE INDEX "_social_posts_v_published_locale_idx" ON "_social_posts_v" USING btree ("published_locale");
  CREATE INDEX "_department_contacts_v_snapshot_idx" ON "_department_contacts_v" USING btree ("snapshot");
  CREATE INDEX "_department_contacts_v_published_locale_idx" ON "_department_contacts_v" USING btree ("published_locale");
  CREATE INDEX "_nav_content_v_snapshot_idx" ON "_nav_content_v" USING btree ("snapshot");
  CREATE INDEX "_nav_content_v_published_locale_idx" ON "_nav_content_v" USING btree ("published_locale");
  CREATE INDEX "_board_content_v_snapshot_idx" ON "_board_content_v" USING btree ("snapshot");
  CREATE INDEX "_board_content_v_published_locale_idx" ON "_board_content_v" USING btree ("published_locale");
  CREATE INDEX "_hero_content_v_snapshot_idx" ON "_hero_content_v" USING btree ("snapshot");
  CREATE INDEX "_hero_content_v_published_locale_idx" ON "_hero_content_v" USING btree ("published_locale");
  CREATE INDEX "_leadership_band_content_v_snapshot_idx" ON "_leadership_band_content_v" USING btree ("snapshot");
  CREATE INDEX "_leadership_band_content_v_published_locale_idx" ON "_leadership_band_content_v" USING btree ("published_locale");
  CREATE INDEX "_footer_content_v_snapshot_idx" ON "_footer_content_v" USING btree ("snapshot");
  CREATE INDEX "_footer_content_v_published_locale_idx" ON "_footer_content_v" USING btree ("published_locale");
  CREATE INDEX "_about_page_content_v_snapshot_idx" ON "_about_page_content_v" USING btree ("snapshot");
  CREATE INDEX "_about_page_content_v_published_locale_idx" ON "_about_page_content_v" USING btree ("published_locale");
  CREATE INDEX "_org_chart_content_v_snapshot_idx" ON "_org_chart_content_v" USING btree ("snapshot");
  CREATE INDEX "_org_chart_content_v_published_locale_idx" ON "_org_chart_content_v" USING btree ("published_locale");
  CREATE INDEX "_metrics_content_v_snapshot_idx" ON "_metrics_content_v" USING btree ("snapshot");
  CREATE INDEX "_metrics_content_v_published_locale_idx" ON "_metrics_content_v" USING btree ("published_locale");
  CREATE INDEX "_pillars_content_v_snapshot_idx" ON "_pillars_content_v" USING btree ("snapshot");
  CREATE INDEX "_pillars_content_v_published_locale_idx" ON "_pillars_content_v" USING btree ("published_locale");
  CREATE INDEX "_careers_content_v_snapshot_idx" ON "_careers_content_v" USING btree ("snapshot");
  CREATE INDEX "_careers_content_v_published_locale_idx" ON "_careers_content_v" USING btree ("published_locale");
  CREATE INDEX "_rti_content_v_snapshot_idx" ON "_rti_content_v" USING btree ("snapshot");
  CREATE INDEX "_rti_content_v_published_locale_idx" ON "_rti_content_v" USING btree ("published_locale");
  CREATE INDEX "_tenders_content_v_snapshot_idx" ON "_tenders_content_v" USING btree ("snapshot");
  CREATE INDEX "_tenders_content_v_published_locale_idx" ON "_tenders_content_v" USING btree ("published_locale");
  CREATE INDEX "_site_copy_content_v_snapshot_idx" ON "_site_copy_content_v" USING btree ("snapshot");
  CREATE INDEX "_site_copy_content_v_published_locale_idx" ON "_site_copy_content_v" USING btree ("published_locale");
  CREATE INDEX "_services_to_government_content_v_snapshot_idx" ON "_services_to_government_content_v" USING btree ("snapshot");
  CREATE INDEX "_services_to_government_content_v_published_locale_idx" ON "_services_to_government_content_v" USING btree ("published_locale");
  -- Data-preserving step: copy each moved field's existing value into
  -- the new locales table as the "en" locale BEFORE the old column is
  -- dropped below. Without this, the DROP COLUMN statements that follow
  -- would silently discard all existing English content.
  INSERT INTO "nav_content_about_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "nav_content_about" WHERE "label" IS NOT NULL;
  INSERT INTO "nav_content_services_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "nav_content_services" WHERE "label" IS NOT NULL;
  INSERT INTO "nav_content_notifications_updates_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "nav_content_notifications_updates" WHERE "label" IS NOT NULL;
  INSERT INTO "nav_content_notifications_documents_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "nav_content_notifications_documents" WHERE "label" IS NOT NULL;
  INSERT INTO "nav_content_locales" ("_locale", "_parent_id", "gov_label") SELECT 'en', "id", "gov_label" FROM "nav_content" WHERE "gov_label" IS NOT NULL;
  INSERT INTO "_nav_content_v_version_about_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_nav_content_v_version_about" WHERE "label" IS NOT NULL;
  INSERT INTO "_nav_content_v_version_services_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_nav_content_v_version_services" WHERE "label" IS NOT NULL;
  INSERT INTO "_nav_content_v_version_notifications_updates_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_nav_content_v_version_notifications_updates" WHERE "label" IS NOT NULL;
  INSERT INTO "_nav_content_v_version_notifications_documents_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_nav_content_v_version_notifications_documents" WHERE "label" IS NOT NULL;
  INSERT INTO "_nav_content_v_locales" ("_locale", "_parent_id", "version_gov_label") SELECT 'en', "id", "version_gov_label" FROM "_nav_content_v" WHERE "version_gov_label" IS NOT NULL;
  INSERT INTO "hero_content_agency_label_cycle_locales" ("_locale", "_parent_id", "text") SELECT 'en', "id", "text" FROM "hero_content_agency_label_cycle" WHERE "text" IS NOT NULL;
  INSERT INTO "hero_content_headline_cycle_words_locales" ("_locale", "_parent_id", "word") SELECT 'en', "id", "word" FROM "hero_content_headline_cycle_words" WHERE "word" IS NOT NULL;
  INSERT INTO "hero_content_locales" ("_locale", "_parent_id", "headline_template", "tagline") SELECT 'en', "id", "headline_template", "tagline" FROM "hero_content" WHERE "headline_template" IS NOT NULL OR "tagline" IS NOT NULL;
  INSERT INTO "_hero_content_v_version_agency_label_cycle_locales" ("_locale", "_parent_id", "text") SELECT 'en', "id", "text" FROM "_hero_content_v_version_agency_label_cycle" WHERE "text" IS NOT NULL;
  INSERT INTO "_hero_content_v_version_headline_cycle_words_locales" ("_locale", "_parent_id", "word") SELECT 'en', "id", "word" FROM "_hero_content_v_version_headline_cycle_words" WHERE "word" IS NOT NULL;
  INSERT INTO "_hero_content_v_locales" ("_locale", "_parent_id", "version_headline_template", "version_tagline") SELECT 'en', "id", "version_headline_template", "version_tagline" FROM "_hero_content_v" WHERE "version_headline_template" IS NOT NULL OR "version_tagline" IS NOT NULL;
  INSERT INTO "footer_content_quick_links_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "footer_content_quick_links" WHERE "label" IS NOT NULL;
  INSERT INTO "footer_content_citizen_services_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "footer_content_citizen_services" WHERE "label" IS NOT NULL;
  INSERT INTO "footer_content_help_support_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "footer_content_help_support" WHERE "label" IS NOT NULL;
  INSERT INTO "footer_content_locales" ("_locale", "_parent_id", "description", "address") SELECT 'en', "id", "description", "address" FROM "footer_content" WHERE "description" IS NOT NULL OR "address" IS NOT NULL;
  INSERT INTO "_footer_content_v_version_quick_links_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_footer_content_v_version_quick_links" WHERE "label" IS NOT NULL;
  INSERT INTO "_footer_content_v_version_citizen_services_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_footer_content_v_version_citizen_services" WHERE "label" IS NOT NULL;
  INSERT INTO "_footer_content_v_version_help_support_locales" ("_locale", "_parent_id", "label") SELECT 'en', "id", "label" FROM "_footer_content_v_version_help_support" WHERE "label" IS NOT NULL;
  INSERT INTO "_footer_content_v_locales" ("_locale", "_parent_id", "version_description", "version_address") SELECT 'en', "id", "version_description", "version_address" FROM "_footer_content_v" WHERE "version_description" IS NOT NULL OR "version_address" IS NOT NULL;
  INSERT INTO "site_copy_content_reach_us_panels_locales" ("_locale", "_parent_id", "eyebrow", "title", "description", "cta_label") SELECT 'en', "id", "eyebrow", "title", "description", "cta_label" FROM "site_copy_content_reach_us_panels" WHERE "eyebrow" IS NOT NULL OR "title" IS NOT NULL OR "description" IS NOT NULL OR "cta_label" IS NOT NULL;
  INSERT INTO "site_copy_content_locales" ("_locale", "_parent_id", "announcements_hero_eyebrow", "announcements_hero_heading", "announcements_hero_body", "government_orders_hero_eyebrow", "government_orders_hero_heading", "government_orders_hero_body", "policies_hero_eyebrow", "policies_hero_heading", "policies_hero_body", "media_hero_eyebrow", "media_hero_heading", "media_hero_body", "services_hero_eyebrow", "services_hero_heading", "services_hero_body") SELECT 'en', "id", "announcements_hero_eyebrow", "announcements_hero_heading", "announcements_hero_body", "government_orders_hero_eyebrow", "government_orders_hero_heading", "government_orders_hero_body", "policies_hero_eyebrow", "policies_hero_heading", "policies_hero_body", "media_hero_eyebrow", "media_hero_heading", "media_hero_body", "services_hero_eyebrow", "services_hero_heading", "services_hero_body" FROM "site_copy_content" WHERE "announcements_hero_eyebrow" IS NOT NULL OR "announcements_hero_heading" IS NOT NULL OR "announcements_hero_body" IS NOT NULL OR "government_orders_hero_eyebrow" IS NOT NULL OR "government_orders_hero_heading" IS NOT NULL OR "government_orders_hero_body" IS NOT NULL OR "policies_hero_eyebrow" IS NOT NULL OR "policies_hero_heading" IS NOT NULL OR "policies_hero_body" IS NOT NULL OR "media_hero_eyebrow" IS NOT NULL OR "media_hero_heading" IS NOT NULL OR "media_hero_body" IS NOT NULL OR "services_hero_eyebrow" IS NOT NULL OR "services_hero_heading" IS NOT NULL OR "services_hero_body" IS NOT NULL;
  INSERT INTO "_site_copy_content_v_version_reach_us_panels_locales" ("_locale", "_parent_id", "eyebrow", "title", "description", "cta_label") SELECT 'en', "id", "eyebrow", "title", "description", "cta_label" FROM "_site_copy_content_v_version_reach_us_panels" WHERE "eyebrow" IS NOT NULL OR "title" IS NOT NULL OR "description" IS NOT NULL OR "cta_label" IS NOT NULL;
  INSERT INTO "_site_copy_content_v_locales" ("_locale", "_parent_id", "version_announcements_hero_eyebrow", "version_announcements_hero_heading", "version_announcements_hero_body", "version_government_orders_hero_eyebrow", "version_government_orders_hero_heading", "version_government_orders_hero_body", "version_policies_hero_eyebrow", "version_policies_hero_heading", "version_policies_hero_body", "version_media_hero_eyebrow", "version_media_hero_heading", "version_media_hero_body", "version_services_hero_eyebrow", "version_services_hero_heading", "version_services_hero_body") SELECT 'en', "id", "version_announcements_hero_eyebrow", "version_announcements_hero_heading", "version_announcements_hero_body", "version_government_orders_hero_eyebrow", "version_government_orders_hero_heading", "version_government_orders_hero_body", "version_policies_hero_eyebrow", "version_policies_hero_heading", "version_policies_hero_body", "version_media_hero_eyebrow", "version_media_hero_heading", "version_media_hero_body", "version_services_hero_eyebrow", "version_services_hero_heading", "version_services_hero_body" FROM "_site_copy_content_v" WHERE "version_announcements_hero_eyebrow" IS NOT NULL OR "version_announcements_hero_heading" IS NOT NULL OR "version_announcements_hero_body" IS NOT NULL OR "version_government_orders_hero_eyebrow" IS NOT NULL OR "version_government_orders_hero_heading" IS NOT NULL OR "version_government_orders_hero_body" IS NOT NULL OR "version_policies_hero_eyebrow" IS NOT NULL OR "version_policies_hero_heading" IS NOT NULL OR "version_policies_hero_body" IS NOT NULL OR "version_media_hero_eyebrow" IS NOT NULL OR "version_media_hero_heading" IS NOT NULL OR "version_media_hero_body" IS NOT NULL OR "version_services_hero_eyebrow" IS NOT NULL OR "version_services_hero_heading" IS NOT NULL OR "version_services_hero_body" IS NOT NULL;

  ALTER TABLE "nav_content_about" DROP COLUMN "label";
  ALTER TABLE "nav_content_services" DROP COLUMN "label";
  ALTER TABLE "nav_content_notifications_updates" DROP COLUMN "label";
  ALTER TABLE "nav_content_notifications_documents" DROP COLUMN "label";
  ALTER TABLE "nav_content" DROP COLUMN "gov_label";
  ALTER TABLE "_nav_content_v_version_about" DROP COLUMN "label";
  ALTER TABLE "_nav_content_v_version_services" DROP COLUMN "label";
  ALTER TABLE "_nav_content_v_version_notifications_updates" DROP COLUMN "label";
  ALTER TABLE "_nav_content_v_version_notifications_documents" DROP COLUMN "label";
  ALTER TABLE "_nav_content_v" DROP COLUMN "version_gov_label";
  ALTER TABLE "hero_content_agency_label_cycle" DROP COLUMN "text";
  ALTER TABLE "hero_content_headline_cycle_words" DROP COLUMN "word";
  ALTER TABLE "hero_content" DROP COLUMN "headline_template";
  ALTER TABLE "hero_content" DROP COLUMN "tagline";
  ALTER TABLE "_hero_content_v_version_agency_label_cycle" DROP COLUMN "text";
  ALTER TABLE "_hero_content_v_version_headline_cycle_words" DROP COLUMN "word";
  ALTER TABLE "_hero_content_v" DROP COLUMN "version_headline_template";
  ALTER TABLE "_hero_content_v" DROP COLUMN "version_tagline";
  ALTER TABLE "footer_content_quick_links" DROP COLUMN "label";
  ALTER TABLE "footer_content_citizen_services" DROP COLUMN "label";
  ALTER TABLE "footer_content_help_support" DROP COLUMN "label";
  ALTER TABLE "footer_content" DROP COLUMN "description";
  ALTER TABLE "footer_content" DROP COLUMN "address";
  ALTER TABLE "_footer_content_v_version_quick_links" DROP COLUMN "label";
  ALTER TABLE "_footer_content_v_version_citizen_services" DROP COLUMN "label";
  ALTER TABLE "_footer_content_v_version_help_support" DROP COLUMN "label";
  ALTER TABLE "_footer_content_v" DROP COLUMN "version_description";
  ALTER TABLE "_footer_content_v" DROP COLUMN "version_address";
  ALTER TABLE "site_copy_content_reach_us_panels" DROP COLUMN "eyebrow";
  ALTER TABLE "site_copy_content_reach_us_panels" DROP COLUMN "title";
  ALTER TABLE "site_copy_content_reach_us_panels" DROP COLUMN "description";
  ALTER TABLE "site_copy_content_reach_us_panels" DROP COLUMN "cta_label";
  ALTER TABLE "site_copy_content" DROP COLUMN "announcements_hero_eyebrow";
  ALTER TABLE "site_copy_content" DROP COLUMN "announcements_hero_heading";
  ALTER TABLE "site_copy_content" DROP COLUMN "announcements_hero_body";
  ALTER TABLE "site_copy_content" DROP COLUMN "government_orders_hero_eyebrow";
  ALTER TABLE "site_copy_content" DROP COLUMN "government_orders_hero_heading";
  ALTER TABLE "site_copy_content" DROP COLUMN "government_orders_hero_body";
  ALTER TABLE "site_copy_content" DROP COLUMN "policies_hero_eyebrow";
  ALTER TABLE "site_copy_content" DROP COLUMN "policies_hero_heading";
  ALTER TABLE "site_copy_content" DROP COLUMN "policies_hero_body";
  ALTER TABLE "site_copy_content" DROP COLUMN "media_hero_eyebrow";
  ALTER TABLE "site_copy_content" DROP COLUMN "media_hero_heading";
  ALTER TABLE "site_copy_content" DROP COLUMN "media_hero_body";
  ALTER TABLE "site_copy_content" DROP COLUMN "services_hero_eyebrow";
  ALTER TABLE "site_copy_content" DROP COLUMN "services_hero_heading";
  ALTER TABLE "site_copy_content" DROP COLUMN "services_hero_body";
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" DROP COLUMN "eyebrow";
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" DROP COLUMN "title";
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" DROP COLUMN "description";
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" DROP COLUMN "cta_label";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_announcements_hero_eyebrow";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_announcements_hero_heading";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_announcements_hero_body";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_government_orders_hero_eyebrow";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_government_orders_hero_heading";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_government_orders_hero_body";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_policies_hero_eyebrow";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_policies_hero_heading";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_policies_hero_body";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_media_hero_eyebrow";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_media_hero_heading";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_media_hero_body";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_services_hero_eyebrow";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_services_hero_heading";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "version_services_hero_body";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "nav_content_about_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nav_content_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nav_content_notifications_updates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nav_content_notifications_documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nav_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_nav_content_v_version_about_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_nav_content_v_version_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_nav_content_v_version_notifications_updates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_nav_content_v_version_notifications_documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_nav_content_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_content_agency_label_cycle_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_content_headline_cycle_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hero_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hero_content_v_version_agency_label_cycle_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hero_content_v_version_headline_cycle_words_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hero_content_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_quick_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_citizen_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_help_support_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_quick_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_citizen_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_version_help_support_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_content_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_copy_content_reach_us_panels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_copy_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_copy_content_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "nav_content_about_locales" CASCADE;
  DROP TABLE "nav_content_services_locales" CASCADE;
  DROP TABLE "nav_content_notifications_updates_locales" CASCADE;
  DROP TABLE "nav_content_notifications_documents_locales" CASCADE;
  DROP TABLE "nav_content_locales" CASCADE;
  DROP TABLE "_nav_content_v_version_about_locales" CASCADE;
  DROP TABLE "_nav_content_v_version_services_locales" CASCADE;
  DROP TABLE "_nav_content_v_version_notifications_updates_locales" CASCADE;
  DROP TABLE "_nav_content_v_version_notifications_documents_locales" CASCADE;
  DROP TABLE "_nav_content_v_locales" CASCADE;
  DROP TABLE "hero_content_agency_label_cycle_locales" CASCADE;
  DROP TABLE "hero_content_headline_cycle_words_locales" CASCADE;
  DROP TABLE "hero_content_locales" CASCADE;
  DROP TABLE "_hero_content_v_version_agency_label_cycle_locales" CASCADE;
  DROP TABLE "_hero_content_v_version_headline_cycle_words_locales" CASCADE;
  DROP TABLE "_hero_content_v_locales" CASCADE;
  DROP TABLE "footer_content_quick_links_locales" CASCADE;
  DROP TABLE "footer_content_citizen_services_locales" CASCADE;
  DROP TABLE "footer_content_help_support_locales" CASCADE;
  DROP TABLE "footer_content_locales" CASCADE;
  DROP TABLE "_footer_content_v_version_quick_links_locales" CASCADE;
  DROP TABLE "_footer_content_v_version_citizen_services_locales" CASCADE;
  DROP TABLE "_footer_content_v_version_help_support_locales" CASCADE;
  DROP TABLE "_footer_content_v_locales" CASCADE;
  DROP TABLE "site_copy_content_reach_us_panels_locales" CASCADE;
  DROP TABLE "site_copy_content_locales" CASCADE;
  DROP TABLE "_site_copy_content_v_version_reach_us_panels_locales" CASCADE;
  DROP TABLE "_site_copy_content_v_locales" CASCADE;
  DROP INDEX "_announcements_v_snapshot_idx";
  DROP INDEX "_announcements_v_published_locale_idx";
  DROP INDEX "_media_items_v_snapshot_idx";
  DROP INDEX "_media_items_v_published_locale_idx";
  DROP INDEX "_job_openings_v_snapshot_idx";
  DROP INDEX "_job_openings_v_published_locale_idx";
  DROP INDEX "_team_members_v_snapshot_idx";
  DROP INDEX "_team_members_v_published_locale_idx";
  DROP INDEX "_services_v_snapshot_idx";
  DROP INDEX "_services_v_published_locale_idx";
  DROP INDEX "_government_orders_v_snapshot_idx";
  DROP INDEX "_government_orders_v_published_locale_idx";
  DROP INDEX "_policies_v_snapshot_idx";
  DROP INDEX "_policies_v_published_locale_idx";
  DROP INDEX "_legal_pages_v_snapshot_idx";
  DROP INDEX "_legal_pages_v_published_locale_idx";
  DROP INDEX "_awards_v_snapshot_idx";
  DROP INDEX "_awards_v_published_locale_idx";
  DROP INDEX "_roll_of_honour_v_snapshot_idx";
  DROP INDEX "_roll_of_honour_v_published_locale_idx";
  DROP INDEX "_projects_spotlight_v_snapshot_idx";
  DROP INDEX "_projects_spotlight_v_published_locale_idx";
  DROP INDEX "_social_posts_v_snapshot_idx";
  DROP INDEX "_social_posts_v_published_locale_idx";
  DROP INDEX "_department_contacts_v_snapshot_idx";
  DROP INDEX "_department_contacts_v_published_locale_idx";
  DROP INDEX "_nav_content_v_snapshot_idx";
  DROP INDEX "_nav_content_v_published_locale_idx";
  DROP INDEX "_board_content_v_snapshot_idx";
  DROP INDEX "_board_content_v_published_locale_idx";
  DROP INDEX "_hero_content_v_snapshot_idx";
  DROP INDEX "_hero_content_v_published_locale_idx";
  DROP INDEX "_leadership_band_content_v_snapshot_idx";
  DROP INDEX "_leadership_band_content_v_published_locale_idx";
  DROP INDEX "_footer_content_v_snapshot_idx";
  DROP INDEX "_footer_content_v_published_locale_idx";
  DROP INDEX "_about_page_content_v_snapshot_idx";
  DROP INDEX "_about_page_content_v_published_locale_idx";
  DROP INDEX "_org_chart_content_v_snapshot_idx";
  DROP INDEX "_org_chart_content_v_published_locale_idx";
  DROP INDEX "_metrics_content_v_snapshot_idx";
  DROP INDEX "_metrics_content_v_published_locale_idx";
  DROP INDEX "_pillars_content_v_snapshot_idx";
  DROP INDEX "_pillars_content_v_published_locale_idx";
  DROP INDEX "_careers_content_v_snapshot_idx";
  DROP INDEX "_careers_content_v_published_locale_idx";
  DROP INDEX "_rti_content_v_snapshot_idx";
  DROP INDEX "_rti_content_v_published_locale_idx";
  DROP INDEX "_tenders_content_v_snapshot_idx";
  DROP INDEX "_tenders_content_v_published_locale_idx";
  DROP INDEX "_site_copy_content_v_snapshot_idx";
  DROP INDEX "_site_copy_content_v_published_locale_idx";
  DROP INDEX "_services_to_government_content_v_snapshot_idx";
  DROP INDEX "_services_to_government_content_v_published_locale_idx";
  ALTER TABLE "nav_content_about" ADD COLUMN "label" varchar;
  ALTER TABLE "nav_content_services" ADD COLUMN "label" varchar;
  ALTER TABLE "nav_content_notifications_updates" ADD COLUMN "label" varchar;
  ALTER TABLE "nav_content_notifications_documents" ADD COLUMN "label" varchar;
  ALTER TABLE "nav_content" ADD COLUMN "gov_label" varchar;
  ALTER TABLE "_nav_content_v_version_about" ADD COLUMN "label" varchar;
  ALTER TABLE "_nav_content_v_version_services" ADD COLUMN "label" varchar;
  ALTER TABLE "_nav_content_v_version_notifications_updates" ADD COLUMN "label" varchar;
  ALTER TABLE "_nav_content_v_version_notifications_documents" ADD COLUMN "label" varchar;
  ALTER TABLE "_nav_content_v" ADD COLUMN "version_gov_label" varchar;
  ALTER TABLE "hero_content_agency_label_cycle" ADD COLUMN "text" varchar;
  ALTER TABLE "hero_content_headline_cycle_words" ADD COLUMN "word" varchar;
  ALTER TABLE "hero_content" ADD COLUMN "headline_template" varchar;
  ALTER TABLE "hero_content" ADD COLUMN "tagline" varchar;
  ALTER TABLE "_hero_content_v_version_agency_label_cycle" ADD COLUMN "text" varchar;
  ALTER TABLE "_hero_content_v_version_headline_cycle_words" ADD COLUMN "word" varchar;
  ALTER TABLE "_hero_content_v" ADD COLUMN "version_headline_template" varchar;
  ALTER TABLE "_hero_content_v" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "footer_content_quick_links" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_content_citizen_services" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_content_help_support" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_content" ADD COLUMN "description" varchar;
  ALTER TABLE "footer_content" ADD COLUMN "address" varchar;
  ALTER TABLE "_footer_content_v_version_quick_links" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_content_v_version_citizen_services" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_content_v_version_help_support" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_content_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_footer_content_v" ADD COLUMN "version_address" varchar;
  ALTER TABLE "site_copy_content_reach_us_panels" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "site_copy_content_reach_us_panels" ADD COLUMN "title" varchar;
  ALTER TABLE "site_copy_content_reach_us_panels" ADD COLUMN "description" varchar;
  ALTER TABLE "site_copy_content_reach_us_panels" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "announcements_hero_eyebrow" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "announcements_hero_heading" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "announcements_hero_body" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "government_orders_hero_eyebrow" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "government_orders_hero_heading" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "government_orders_hero_body" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "policies_hero_eyebrow" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "policies_hero_heading" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "policies_hero_body" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "media_hero_eyebrow" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "media_hero_heading" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "media_hero_body" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "services_hero_eyebrow" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "services_hero_heading" varchar;
  ALTER TABLE "site_copy_content" ADD COLUMN "services_hero_body" varchar;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" ADD COLUMN "title" varchar;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" ADD COLUMN "description" varchar;
  ALTER TABLE "_site_copy_content_v_version_reach_us_panels" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_announcements_hero_eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_announcements_hero_heading" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_announcements_hero_body" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_government_orders_hero_eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_government_orders_hero_heading" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_government_orders_hero_body" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_policies_hero_eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_policies_hero_heading" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_policies_hero_body" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_media_hero_eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_media_hero_heading" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_media_hero_body" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_services_hero_eyebrow" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_services_hero_heading" varchar;
  ALTER TABLE "_site_copy_content_v" ADD COLUMN "version_services_hero_body" varchar;
  ALTER TABLE "_announcements_v" DROP COLUMN "snapshot";
  ALTER TABLE "_announcements_v" DROP COLUMN "published_locale";
  ALTER TABLE "_media_items_v" DROP COLUMN "snapshot";
  ALTER TABLE "_media_items_v" DROP COLUMN "published_locale";
  ALTER TABLE "_job_openings_v" DROP COLUMN "snapshot";
  ALTER TABLE "_job_openings_v" DROP COLUMN "published_locale";
  ALTER TABLE "_team_members_v" DROP COLUMN "snapshot";
  ALTER TABLE "_team_members_v" DROP COLUMN "published_locale";
  ALTER TABLE "_services_v" DROP COLUMN "snapshot";
  ALTER TABLE "_services_v" DROP COLUMN "published_locale";
  ALTER TABLE "_government_orders_v" DROP COLUMN "snapshot";
  ALTER TABLE "_government_orders_v" DROP COLUMN "published_locale";
  ALTER TABLE "_policies_v" DROP COLUMN "snapshot";
  ALTER TABLE "_policies_v" DROP COLUMN "published_locale";
  ALTER TABLE "_legal_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_legal_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_awards_v" DROP COLUMN "snapshot";
  ALTER TABLE "_awards_v" DROP COLUMN "published_locale";
  ALTER TABLE "_roll_of_honour_v" DROP COLUMN "snapshot";
  ALTER TABLE "_roll_of_honour_v" DROP COLUMN "published_locale";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "snapshot";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "published_locale";
  ALTER TABLE "_social_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_social_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "_department_contacts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_department_contacts_v" DROP COLUMN "published_locale";
  ALTER TABLE "_nav_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_nav_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_board_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_board_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_hero_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_hero_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_leadership_band_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_leadership_band_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_footer_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_footer_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_about_page_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_org_chart_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_org_chart_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_metrics_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_metrics_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_pillars_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pillars_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_careers_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_careers_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_rti_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_rti_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_tenders_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_site_copy_content_v" DROP COLUMN "published_locale";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "snapshot";
  ALTER TABLE "_services_to_government_content_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__announcements_v_published_locale";
  DROP TYPE "public"."enum__media_items_v_published_locale";
  DROP TYPE "public"."enum__job_openings_v_published_locale";
  DROP TYPE "public"."enum__team_members_v_published_locale";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum__government_orders_v_published_locale";
  DROP TYPE "public"."enum__policies_v_published_locale";
  DROP TYPE "public"."enum__legal_pages_v_published_locale";
  DROP TYPE "public"."enum__awards_v_published_locale";
  DROP TYPE "public"."enum__roll_of_honour_v_published_locale";
  DROP TYPE "public"."enum__projects_spotlight_v_published_locale";
  DROP TYPE "public"."enum__social_posts_v_published_locale";
  DROP TYPE "public"."enum__department_contacts_v_published_locale";
  DROP TYPE "public"."enum__nav_content_v_published_locale";
  DROP TYPE "public"."enum__board_content_v_published_locale";
  DROP TYPE "public"."enum__hero_content_v_published_locale";
  DROP TYPE "public"."enum__leadership_band_content_v_published_locale";
  DROP TYPE "public"."enum__footer_content_v_published_locale";
  DROP TYPE "public"."enum__about_page_content_v_published_locale";
  DROP TYPE "public"."enum__org_chart_content_v_published_locale";
  DROP TYPE "public"."enum__metrics_content_v_published_locale";
  DROP TYPE "public"."enum__pillars_content_v_published_locale";
  DROP TYPE "public"."enum__careers_content_v_published_locale";
  DROP TYPE "public"."enum__rti_content_v_published_locale";
  DROP TYPE "public"."enum__tenders_content_v_published_locale";
  DROP TYPE "public"."enum__site_copy_content_v_published_locale";
  DROP TYPE "public"."enum__services_to_government_content_v_published_locale";`)
}
