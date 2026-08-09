import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ADD COLUMN "real_suppress_get_started_steps" boolean DEFAULT false;
  ALTER TABLE "_services_v" ADD COLUMN "version_real_suppress_get_started_steps" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP COLUMN "real_suppress_get_started_steps";
  ALTER TABLE "_services_v" DROP COLUMN "version_real_suppress_get_started_steps";`)
}
