import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_sections" AS ENUM('citizen-services', 'e-governance-projects', 'services');
  CREATE TYPE "public"."enum_services_real_type_label" AS ENUM('Project', 'Service');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_sections" AS ENUM('citizen-services', 'e-governance-projects', 'services');
  CREATE TYPE "public"."enum__services_v_version_real_type_label" AS ENUM('Project', 'Service');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "services_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_real_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_key_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_key_feature_descriptions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_eligibility" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_what_youll_need" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "services_real_faqs_more" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "services_real_about_link_modal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_real_product_tour" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "services_real_get_started_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"stats" varchar,
  	"image_id" integer,
  	"access_portal_href" varchar,
  	"real_tagline" varchar,
  	"real_hide_stat_feature_cards" boolean DEFAULT false,
  	"real_about_second_paragraph" varchar,
  	"real_hide_about_second_paragraph" boolean DEFAULT false,
  	"real_callout_text" varchar,
  	"real_about_link_modal_label" varchar,
  	"real_about_link_modal_title" varchar,
  	"real_product_tour_caption" varchar,
  	"real_get_started_intro" varchar,
  	"real_get_started_outro" varchar,
  	"real_direct_link_label" varchar,
  	"real_coming_soon" boolean DEFAULT false,
  	"real_gated_access" boolean DEFAULT false,
  	"real_related_card_stats" varchar,
  	"real_type_label" "enum_services_real_type_label",
  	"real_contact_email" varchar,
  	"real_contact_phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v_version_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_v_version_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_v_version_real_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_key_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_key_feature_descriptions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_eligibility" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_what_youll_need" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_faqs_more" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_about_link_modal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_product_tour" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_real_get_started_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_stats" varchar,
  	"version_image_id" integer,
  	"version_access_portal_href" varchar,
  	"version_real_tagline" varchar,
  	"version_real_hide_stat_feature_cards" boolean DEFAULT false,
  	"version_real_about_second_paragraph" varchar,
  	"version_real_hide_about_second_paragraph" boolean DEFAULT false,
  	"version_real_callout_text" varchar,
  	"version_real_about_link_modal_label" varchar,
  	"version_real_about_link_modal_title" varchar,
  	"version_real_product_tour_caption" varchar,
  	"version_real_get_started_intro" varchar,
  	"version_real_get_started_outro" varchar,
  	"version_real_direct_link_label" varchar,
  	"version_real_coming_soon" boolean DEFAULT false,
  	"version_real_gated_access" boolean DEFAULT false,
  	"version_real_related_card_stats" varchar,
  	"version_real_type_label" "enum__services_v_version_real_type_label",
  	"version_real_contact_email" varchar,
  	"version_real_contact_phone" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "services_sections" ADD CONSTRAINT "services_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_statistics" ADD CONSTRAINT "services_real_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_key_features" ADD CONSTRAINT "services_real_key_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_key_feature_descriptions" ADD CONSTRAINT "services_real_key_feature_descriptions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_eligibility" ADD CONSTRAINT "services_real_eligibility_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_what_youll_need" ADD CONSTRAINT "services_real_what_youll_need_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_faqs" ADD CONSTRAINT "services_real_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_faqs_more" ADD CONSTRAINT "services_real_faqs_more_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_about_link_modal_items" ADD CONSTRAINT "services_real_about_link_modal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_product_tour" ADD CONSTRAINT "services_real_product_tour_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_real_product_tour" ADD CONSTRAINT "services_real_product_tour_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_real_get_started_steps" ADD CONSTRAINT "services_real_get_started_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_sections" ADD CONSTRAINT "_services_v_version_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_statistics" ADD CONSTRAINT "_services_v_version_real_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_key_features" ADD CONSTRAINT "_services_v_version_real_key_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_key_feature_descriptions" ADD CONSTRAINT "_services_v_version_real_key_feature_descriptions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_eligibility" ADD CONSTRAINT "_services_v_version_real_eligibility_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_what_youll_need" ADD CONSTRAINT "_services_v_version_real_what_youll_need_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_faqs" ADD CONSTRAINT "_services_v_version_real_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_faqs_more" ADD CONSTRAINT "_services_v_version_real_faqs_more_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_about_link_modal_items" ADD CONSTRAINT "_services_v_version_real_about_link_modal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_product_tour" ADD CONSTRAINT "_services_v_version_real_product_tour_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_product_tour" ADD CONSTRAINT "_services_v_version_real_product_tour_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_real_get_started_steps" ADD CONSTRAINT "_services_v_version_real_get_started_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_sections_order_idx" ON "services_sections" USING btree ("order");
  CREATE INDEX "services_sections_parent_idx" ON "services_sections" USING btree ("parent_id");
  CREATE INDEX "services_real_statistics_order_idx" ON "services_real_statistics" USING btree ("_order");
  CREATE INDEX "services_real_statistics_parent_id_idx" ON "services_real_statistics" USING btree ("_parent_id");
  CREATE INDEX "services_real_key_features_order_idx" ON "services_real_key_features" USING btree ("_order");
  CREATE INDEX "services_real_key_features_parent_id_idx" ON "services_real_key_features" USING btree ("_parent_id");
  CREATE INDEX "services_real_key_feature_descriptions_order_idx" ON "services_real_key_feature_descriptions" USING btree ("_order");
  CREATE INDEX "services_real_key_feature_descriptions_parent_id_idx" ON "services_real_key_feature_descriptions" USING btree ("_parent_id");
  CREATE INDEX "services_real_eligibility_order_idx" ON "services_real_eligibility" USING btree ("_order");
  CREATE INDEX "services_real_eligibility_parent_id_idx" ON "services_real_eligibility" USING btree ("_parent_id");
  CREATE INDEX "services_real_what_youll_need_order_idx" ON "services_real_what_youll_need" USING btree ("_order");
  CREATE INDEX "services_real_what_youll_need_parent_id_idx" ON "services_real_what_youll_need" USING btree ("_parent_id");
  CREATE INDEX "services_real_faqs_order_idx" ON "services_real_faqs" USING btree ("_order");
  CREATE INDEX "services_real_faqs_parent_id_idx" ON "services_real_faqs" USING btree ("_parent_id");
  CREATE INDEX "services_real_faqs_more_order_idx" ON "services_real_faqs_more" USING btree ("_order");
  CREATE INDEX "services_real_faqs_more_parent_id_idx" ON "services_real_faqs_more" USING btree ("_parent_id");
  CREATE INDEX "services_real_about_link_modal_items_order_idx" ON "services_real_about_link_modal_items" USING btree ("_order");
  CREATE INDEX "services_real_about_link_modal_items_parent_id_idx" ON "services_real_about_link_modal_items" USING btree ("_parent_id");
  CREATE INDEX "services_real_product_tour_order_idx" ON "services_real_product_tour" USING btree ("_order");
  CREATE INDEX "services_real_product_tour_parent_id_idx" ON "services_real_product_tour" USING btree ("_parent_id");
  CREATE INDEX "services_real_product_tour_photo_idx" ON "services_real_product_tour" USING btree ("photo_id");
  CREATE INDEX "services_real_get_started_steps_order_idx" ON "services_real_get_started_steps" USING btree ("_order");
  CREATE INDEX "services_real_get_started_steps_parent_id_idx" ON "services_real_get_started_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_sections_order_idx" ON "_services_v_version_sections" USING btree ("order");
  CREATE INDEX "_services_v_version_sections_parent_idx" ON "_services_v_version_sections" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_real_statistics_order_idx" ON "_services_v_version_real_statistics" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_statistics_parent_id_idx" ON "_services_v_version_real_statistics" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_key_features_order_idx" ON "_services_v_version_real_key_features" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_key_features_parent_id_idx" ON "_services_v_version_real_key_features" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_key_feature_descriptions_order_idx" ON "_services_v_version_real_key_feature_descriptions" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_key_feature_descriptions_parent_id_idx" ON "_services_v_version_real_key_feature_descriptions" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_eligibility_order_idx" ON "_services_v_version_real_eligibility" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_eligibility_parent_id_idx" ON "_services_v_version_real_eligibility" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_what_youll_need_order_idx" ON "_services_v_version_real_what_youll_need" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_what_youll_need_parent_id_idx" ON "_services_v_version_real_what_youll_need" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_faqs_order_idx" ON "_services_v_version_real_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_faqs_parent_id_idx" ON "_services_v_version_real_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_faqs_more_order_idx" ON "_services_v_version_real_faqs_more" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_faqs_more_parent_id_idx" ON "_services_v_version_real_faqs_more" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_about_link_modal_items_order_idx" ON "_services_v_version_real_about_link_modal_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_about_link_modal_items_parent_id_idx" ON "_services_v_version_real_about_link_modal_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_product_tour_order_idx" ON "_services_v_version_real_product_tour" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_product_tour_parent_id_idx" ON "_services_v_version_real_product_tour" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_real_product_tour_photo_idx" ON "_services_v_version_real_product_tour" USING btree ("photo_id");
  CREATE INDEX "_services_v_version_real_get_started_steps_order_idx" ON "_services_v_version_real_get_started_steps" USING btree ("_order");
  CREATE INDEX "_services_v_version_real_get_started_steps_parent_id_idx" ON "_services_v_version_real_get_started_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_image_idx" ON "_services_v" USING btree ("version_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_key_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_key_feature_descriptions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_eligibility" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_what_youll_need" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_faqs_more" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_about_link_modal_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_product_tour" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_real_get_started_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_key_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_key_feature_descriptions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_eligibility" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_what_youll_need" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_faqs_more" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_about_link_modal_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_product_tour" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_real_get_started_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_sections" CASCADE;
  DROP TABLE "services_real_statistics" CASCADE;
  DROP TABLE "services_real_key_features" CASCADE;
  DROP TABLE "services_real_key_feature_descriptions" CASCADE;
  DROP TABLE "services_real_eligibility" CASCADE;
  DROP TABLE "services_real_what_youll_need" CASCADE;
  DROP TABLE "services_real_faqs" CASCADE;
  DROP TABLE "services_real_faqs_more" CASCADE;
  DROP TABLE "services_real_about_link_modal_items" CASCADE;
  DROP TABLE "services_real_product_tour" CASCADE;
  DROP TABLE "services_real_get_started_steps" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_sections" CASCADE;
  DROP TABLE "_services_v_version_real_statistics" CASCADE;
  DROP TABLE "_services_v_version_real_key_features" CASCADE;
  DROP TABLE "_services_v_version_real_key_feature_descriptions" CASCADE;
  DROP TABLE "_services_v_version_real_eligibility" CASCADE;
  DROP TABLE "_services_v_version_real_what_youll_need" CASCADE;
  DROP TABLE "_services_v_version_real_faqs" CASCADE;
  DROP TABLE "_services_v_version_real_faqs_more" CASCADE;
  DROP TABLE "_services_v_version_real_about_link_modal_items" CASCADE;
  DROP TABLE "_services_v_version_real_product_tour" CASCADE;
  DROP TABLE "_services_v_version_real_get_started_steps" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  DROP TYPE "public"."enum_services_sections";
  DROP TYPE "public"."enum_services_real_type_label";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_sections";
  DROP TYPE "public"."enum__services_v_version_real_type_label";
  DROP TYPE "public"."enum__services_v_version_status";`)
}
