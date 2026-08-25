import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "Initiatives & Projects" footer link group as a real
// CMS-backed array (matching quickLinks/citizenServices/helpSupport) —
// the schema field previously existed in a stale form only; this creates
// its actual tables so it round-trips through the CMS. The live footer
// column was rendering a hardcoded static list instead (see
// FooterClient.tsx) until this was wired up.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "footer_content_initiatives_projects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "footer_content"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "href" varchar
    );
    CREATE INDEX "footer_content_initiatives_projects_order_idx" ON "footer_content_initiatives_projects" ("_order");
    CREATE INDEX "footer_content_initiatives_projects_parent_id_idx" ON "footer_content_initiatives_projects" ("_parent_id");

    CREATE TABLE "footer_content_initiatives_projects_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "footer_content_initiatives_projects"("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "footer_content_initiatives_projects_locales_locale_parent_id_unique" ON "footer_content_initiatives_projects_locales" ("_locale", "_parent_id");

    CREATE TABLE "_footer_content_v_version_initiatives_projects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_footer_content_v"("id") ON DELETE CASCADE,
      "id" serial PRIMARY KEY NOT NULL,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE INDEX "_footer_content_v_version_initiatives_projects_order_idx" ON "_footer_content_v_version_initiatives_projects" ("_order");
    CREATE INDEX "_footer_content_v_version_initiatives_projects_parent_id_idx" ON "_footer_content_v_version_initiatives_projects" ("_parent_id");

    CREATE TABLE "_footer_content_v_version_initiatives_projects_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "_footer_content_v_version_initiatives_projects"("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX "_footer_content_v_version_initiatives_projects_locales_locale_parent_id_unique" ON "_footer_content_v_version_initiatives_projects_locales" ("_locale", "_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_footer_content_v_version_initiatives_projects_locales";
    DROP TABLE IF EXISTS "_footer_content_v_version_initiatives_projects";
    DROP TABLE IF EXISTS "footer_content_initiatives_projects_locales";
    DROP TABLE IF EXISTS "footer_content_initiatives_projects";
  `)
}
