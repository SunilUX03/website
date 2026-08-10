import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ADD COLUMN "real_cta_label" varchar;
  ALTER TABLE "services" ADD COLUMN "real_cta_href" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_cta_label" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_cta_href" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP COLUMN "real_cta_label";
  ALTER TABLE "services" DROP COLUMN "real_cta_href";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_cta_label";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_cta_href";`)
}
