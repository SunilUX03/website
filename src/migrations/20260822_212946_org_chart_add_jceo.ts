import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "org_chart_content_locales" ADD COLUMN "jceo_label" varchar DEFAULT 'JCEO';
  ALTER TABLE "_org_chart_content_v_locales" ADD COLUMN "version_jceo_label" varchar DEFAULT 'JCEO';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "org_chart_content_locales" DROP COLUMN "jceo_label";
  ALTER TABLE "_org_chart_content_v_locales" DROP COLUMN "version_jceo_label";`)
}
