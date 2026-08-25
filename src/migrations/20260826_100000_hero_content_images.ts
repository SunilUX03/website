import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds two upload fields to hero_content: `mapImage` (the citizens-over-
// Tamil-Nadu-map collage beside the headline — previously a static file
// import in Hero.tsx with no CMS control at all) and `backgroundImage`
// (an optional full-bleed override for the Hero's colour-wash
// background, which stays a programmatic CSS gradient — see
// ATMOSPHERE_BACKGROUND in Hero.tsx — when this is left unset).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_content" ADD COLUMN "map_image_id" integer;
    ALTER TABLE "hero_content" ADD COLUMN "background_image_id" integer;
    ALTER TABLE "hero_content" ADD CONSTRAINT "hero_content_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "hero_content" ADD CONSTRAINT "hero_content_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "hero_content_map_image_idx" ON "hero_content" USING btree ("map_image_id");
    CREATE INDEX "hero_content_background_image_idx" ON "hero_content" USING btree ("background_image_id");

    ALTER TABLE "_hero_content_v" ADD COLUMN "version_map_image_id" integer;
    ALTER TABLE "_hero_content_v" ADD COLUMN "version_background_image_id" integer;
    ALTER TABLE "_hero_content_v" ADD CONSTRAINT "_hero_content_v_version_map_image_id_media_id_fk" FOREIGN KEY ("version_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_hero_content_v" ADD CONSTRAINT "_hero_content_v_version_background_image_id_media_id_fk" FOREIGN KEY ("version_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "_hero_content_v_version_version_map_image_idx" ON "_hero_content_v" USING btree ("version_map_image_id");
    CREATE INDEX "_hero_content_v_version_version_background_image_idx" ON "_hero_content_v" USING btree ("version_background_image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_content" DROP CONSTRAINT "hero_content_map_image_id_media_id_fk";
    ALTER TABLE "hero_content" DROP CONSTRAINT "hero_content_background_image_id_media_id_fk";
    DROP INDEX "hero_content_map_image_idx";
    DROP INDEX "hero_content_background_image_idx";
    ALTER TABLE "hero_content" DROP COLUMN "map_image_id";
    ALTER TABLE "hero_content" DROP COLUMN "background_image_id";

    ALTER TABLE "_hero_content_v" DROP CONSTRAINT "_hero_content_v_version_map_image_id_media_id_fk";
    ALTER TABLE "_hero_content_v" DROP CONSTRAINT "_hero_content_v_version_background_image_id_media_id_fk";
    DROP INDEX "_hero_content_v_version_version_map_image_idx";
    DROP INDEX "_hero_content_v_version_version_background_image_idx";
    ALTER TABLE "_hero_content_v" DROP COLUMN "version_map_image_id";
    ALTER TABLE "_hero_content_v" DROP COLUMN "version_background_image_id";
  `)
}
