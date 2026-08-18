import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ADD COLUMN "jd_id" integer;
  ALTER TABLE "job_openings" DROP COLUMN "jd_href";
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_jd_id" integer;
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_jd_href";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" ADD COLUMN "jd_href" varchar;
  ALTER TABLE "job_openings" DROP COLUMN "jd_id";
  ALTER TABLE "_job_openings_v" ADD COLUMN "version_jd_href" varchar;
  ALTER TABLE "_job_openings_v" DROP COLUMN "version_jd_id";`)
}
