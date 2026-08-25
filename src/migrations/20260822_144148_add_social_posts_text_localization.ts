import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "social_posts_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_social_posts_v_locales" (
  	"version_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "social_posts_locales" ADD CONSTRAINT "social_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_posts_v_locales" ADD CONSTRAINT "_social_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "social_posts_locales_locale_parent_id_unique" ON "social_posts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_social_posts_v_locales_locale_parent_id_unique" ON "_social_posts_v_locales" USING btree ("_locale","_parent_id");

  -- Copy-forward: this table is brand new, so seed both locale rows from
  -- the old unlocalized "text" column before it's dropped below, so
  -- nothing goes blank. A follow-up content script overwrites the ta
  -- rows with real translations afterward.
  INSERT INTO "social_posts_locales" ("_parent_id", "_locale", "text")
  SELECT "id", 'en', "text" FROM "social_posts";
  INSERT INTO "social_posts_locales" ("_parent_id", "_locale", "text")
  SELECT "id", 'ta', "text" FROM "social_posts";

  ALTER TABLE "social_posts" DROP COLUMN "text";
  ALTER TABLE "_social_posts_v" DROP COLUMN "version_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "social_posts_locales" CASCADE;
  DROP TABLE "_social_posts_v_locales" CASCADE;
  ALTER TABLE "social_posts" ADD COLUMN "text" varchar;
  ALTER TABLE "_social_posts_v" ADD COLUMN "version_text" varchar;`)
}
