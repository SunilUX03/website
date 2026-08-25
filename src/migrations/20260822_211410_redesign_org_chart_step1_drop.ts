import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "org_chart_content_branches" CASCADE;
  DROP TABLE "org_chart_content_branches_locales" CASCADE;
  DROP TABLE "_org_chart_content_v_version_branches" CASCADE;
  DROP TABLE "_org_chart_content_v_version_branches_locales" CASCADE;
  ALTER TABLE "org_chart_content" DROP COLUMN "top_primary";
  ALTER TABLE "org_chart_content" DROP COLUMN "top_secondary";
  ALTER TABLE "_org_chart_content_v" DROP COLUMN "version_top_primary";
  ALTER TABLE "_org_chart_content_v" DROP COLUMN "version_top_secondary";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "org_chart_content_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
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
  
  CREATE TABLE "_org_chart_content_v_version_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
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
  
  ALTER TABLE "org_chart_content" ADD COLUMN "top_primary" varchar DEFAULT 'CEO';
  ALTER TABLE "org_chart_content" ADD COLUMN "top_secondary" varchar DEFAULT 'JCEO';
  ALTER TABLE "_org_chart_content_v" ADD COLUMN "version_top_primary" varchar DEFAULT 'CEO';
  ALTER TABLE "_org_chart_content_v" ADD COLUMN "version_top_secondary" varchar DEFAULT 'JCEO';
  ALTER TABLE "org_chart_content_branches" ADD CONSTRAINT "org_chart_content_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."org_chart_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "org_chart_content_branches_locales" ADD CONSTRAINT "org_chart_content_branches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."org_chart_content_branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_org_chart_content_v_version_branches" ADD CONSTRAINT "_org_chart_content_v_version_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_org_chart_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_org_chart_content_v_version_branches_locales" ADD CONSTRAINT "_org_chart_content_v_version_branches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_org_chart_content_v_version_branches"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "org_chart_content_branches_order_idx" ON "org_chart_content_branches" USING btree ("_order");
  CREATE INDEX "org_chart_content_branches_parent_id_idx" ON "org_chart_content_branches" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "org_chart_content_branches_locales_locale_parent_id_unique" ON "org_chart_content_branches_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_org_chart_content_v_version_branches_order_idx" ON "_org_chart_content_v_version_branches" USING btree ("_order");
  CREATE INDEX "_org_chart_content_v_version_branches_parent_id_idx" ON "_org_chart_content_v_version_branches" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_org_chart_content_v_version_branches_locales_locale_parent_" ON "_org_chart_content_v_version_branches_locales" USING btree ("_locale","_parent_id");`)
}
