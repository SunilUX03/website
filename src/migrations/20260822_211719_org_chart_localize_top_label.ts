import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "org_chart_content_locales" (
  	"top_label" varchar DEFAULT 'Chief Executive Officer',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_org_chart_content_v_locales" (
  	"version_top_label" varchar DEFAULT 'Chief Executive Officer',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "org_chart_content_locales" ADD CONSTRAINT "org_chart_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."org_chart_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_org_chart_content_v_locales" ADD CONSTRAINT "_org_chart_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_org_chart_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "org_chart_content_locales_locale_parent_id_unique" ON "org_chart_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_org_chart_content_v_locales_locale_parent_id_unique" ON "_org_chart_content_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "org_chart_content" DROP COLUMN "top_label";
  ALTER TABLE "_org_chart_content_v" DROP COLUMN "version_top_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "org_chart_content_locales" CASCADE;
  DROP TABLE "_org_chart_content_v_locales" CASCADE;
  ALTER TABLE "org_chart_content" ADD COLUMN "top_label" varchar DEFAULT 'Chief Executive Officer';
  ALTER TABLE "_org_chart_content_v" ADD COLUMN "version_top_label" varchar DEFAULT 'Chief Executive Officer';`)
}
