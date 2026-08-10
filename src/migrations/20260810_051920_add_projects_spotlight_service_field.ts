import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_spotlight" ADD COLUMN "service_id" integer;
  ALTER TABLE "_projects_spotlight_v" ADD COLUMN "version_service_id" integer;
  ALTER TABLE "projects_spotlight" ADD CONSTRAINT "projects_spotlight_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_spotlight_v" ADD CONSTRAINT "_projects_spotlight_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_spotlight_service_idx" ON "projects_spotlight" USING btree ("service_id");
  CREATE INDEX "_projects_spotlight_v_version_version_service_idx" ON "_projects_spotlight_v" USING btree ("version_service_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_spotlight" DROP CONSTRAINT "projects_spotlight_service_id_services_id_fk";
  
  ALTER TABLE "_projects_spotlight_v" DROP CONSTRAINT "_projects_spotlight_v_version_service_id_services_id_fk";
  
  DROP INDEX "projects_spotlight_service_idx";
  DROP INDEX "_projects_spotlight_v_version_version_service_idx";
  ALTER TABLE "projects_spotlight" DROP COLUMN "service_id";
  ALTER TABLE "_projects_spotlight_v" DROP COLUMN "version_service_id";`)
}
