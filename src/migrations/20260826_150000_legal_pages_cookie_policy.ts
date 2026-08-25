import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds "cookie-policy" as a legal-pages slug option, backing the Cookie
// Policy page the consent banner links to. Postgres can add an enum
// value inside a transaction (since PG 12) as long as nothing in the
// SAME transaction reads/uses the new value yet, which this migration
// doesn't — it only adds the value, content gets seeded separately.
//
// No down migration for the enum removal: Postgres has no `DROP VALUE`
// for enums (the only way is rebuilding the type from scratch, which
// risks data loss if a row is already using the value) — matches the
// standard, accepted limitation for this kind of change.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_legal_pages_slug" ADD VALUE 'cookie-policy';
    ALTER TYPE "public"."enum__legal_pages_v_version_slug" ADD VALUE 'cookie-policy';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Intentionally a no-op — see comment above.
}
