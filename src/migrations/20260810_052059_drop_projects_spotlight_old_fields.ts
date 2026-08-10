import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_spotlight" DROP CONSTRAINT "projects_spotlight_image_id_media_id_fk";
  
  ALTER TABLE "_projects_spotlight_v" DROP CONSTRAINT "_projects_spotlight_v_version_image_id_media_id_fk";
  
  DROP INDEX "projects_spotlight_image_idx";
  DROP INDEX "_projects_spotlight_v_version_version_image_idx";
  ALTER TABLE "projects_spotlight" DROP COLUMN "name";
  ALTER TABLE "projects_spotlight" DROP COLUMN "description";
  ALTER TABLE "projects_spotlight" DROP COLUMN "image_id";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "version_name";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "version_description";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "version_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_spotlight" ADD COLUMN "name" varchar;
  ALTER TABLE "projects_spotlight" ADD COLUMN "description" varchar;
  ALTER TABLE "projects_spotlight" ADD COLUMN "image_id" integer;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "projects_spotlight" ADD CONSTRAINT "projects_spotlight_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v" ADD CONSTRAINT "_projects_spotlight_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_spotlight_image_idx" ON "projects_spotlight" USING btree ("image_id");
  CREATE INDEX "_projects_spotlight_v_version_version_image_idx" ON "_projects_spotlight_v" USING btree ("version_image_id");`)
}
