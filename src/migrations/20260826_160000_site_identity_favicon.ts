import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a dedicated favicon upload to site_identity, separate from
// markImage — a favicon often needs a simplified/higher-contrast crop to
// stay legible at tab-icon size, so tying it to the exact same file as
// the full header/footer mark isn't always right. Falls back to
// markImage in the frontend fetcher (see lib/cms/site-identity.ts) when
// left empty, so this is non-breaking to seed.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_identity" ADD COLUMN "favicon_image_id" integer;
    ALTER TABLE "site_identity" ADD CONSTRAINT "site_identity_favicon_image_id_media_id_fk" FOREIGN KEY ("favicon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "site_identity_favicon_image_idx" ON "site_identity" USING btree ("favicon_image_id");

    ALTER TABLE "_site_identity_v" ADD COLUMN "version_favicon_image_id" integer;
    ALTER TABLE "_site_identity_v" ADD CONSTRAINT "_site_identity_v_version_favicon_image_id_media_id_fk" FOREIGN KEY ("version_favicon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "_site_identity_v_version_version_favicon_image_idx" ON "_site_identity_v" USING btree ("version_favicon_image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_identity" DROP CONSTRAINT "site_identity_favicon_image_id_media_id_fk";
    DROP INDEX "site_identity_favicon_image_idx";
    ALTER TABLE "site_identity" DROP COLUMN "favicon_image_id";

    ALTER TABLE "_site_identity_v" DROP CONSTRAINT "_site_identity_v_version_favicon_image_id_media_id_fk";
    DROP INDEX "_site_identity_v_version_version_favicon_image_idx";
    ALTER TABLE "_site_identity_v" DROP COLUMN "version_favicon_image_id";
  `)
}
