import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Drops three real.* fields that were removed from the admin form:
// relatedCardStats (localized, on 2 live items — see down() note),
// ctaHref (now always reuses accessPortalHref), and productTourEyebrow
// (Product Tour collapsed to a single heading field). typeLabel's
// existing enum keeps its 'Service' value (Postgres can't drop enum
// values) even though the Payload select no longer offers it — no live
// item was using it (confirmed before this migration was written).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_related_card_stats";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_related_card_stats";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "real_cta_href";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_real_cta_href";
    ALTER TABLE "services_locales" DROP COLUMN IF EXISTS "real_product_tour_eyebrow";
    ALTER TABLE "_services_v_locales" DROP COLUMN IF EXISTS "version_real_product_tour_eyebrow";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_locales" ADD COLUMN "real_related_card_stats" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_related_card_stats" varchar;
    ALTER TABLE "services" ADD COLUMN "real_cta_href" varchar;
    ALTER TABLE "_services_v" ADD COLUMN "version_real_cta_href" varchar;
    ALTER TABLE "services_locales" ADD COLUMN "real_product_tour_eyebrow" varchar;
    ALTER TABLE "_services_v_locales" ADD COLUMN "version_real_product_tour_eyebrow" varchar;
  `)
  // Content in the dropped columns (e-Gazette Portal and e-Sign's
  // relatedCardStats) is NOT restored by this down() — Postgres doesn't
  // retain dropped-column data. If this needs reverting, restore that
  // content from a pre-migration backup, not from this migration.
}
