import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members_locales" ADD COLUMN "name" varchar;
  ALTER TABLE "_team_members_v_locales" ADD COLUMN "version_name" varchar;
  ALTER TABLE "board_content_members_locales" ADD COLUMN "name" varchar;
  ALTER TABLE "board_content_locales" ADD COLUMN "chairman_name" varchar;
  ALTER TABLE "board_content_locales" ADD COLUMN "member_secretary_name" varchar;
  ALTER TABLE "_board_content_v_version_members_locales" ADD COLUMN "name" varchar;
  ALTER TABLE "_board_content_v_locales" ADD COLUMN "version_chairman_name" varchar;
  ALTER TABLE "_board_content_v_locales" ADD COLUMN "version_member_secretary_name" varchar;
  ALTER TABLE "rti_content_contacts_locales" ADD COLUMN "name" varchar;
  ALTER TABLE "_rti_content_v_version_contacts_locales" ADD COLUMN "name" varchar;

  -- Copy-forward: the new *_locales "name" columns start NULL for every
  -- existing locale row. Backfill them from the old unlocalized "name"
  -- column (both en and ta rows get the same starting value) before that
  -- column is dropped below, so nothing goes blank. A follow-up content
  -- script overwrites the ta rows with real translations afterward.
  UPDATE "team_members_locales" tl
  SET "name" = t."name"
  FROM "team_members" t
  WHERE tl."_parent_id" = t."id";

  UPDATE "board_content_members_locales" bml
  SET "name" = bm."name"
  FROM "board_content_members" bm
  WHERE bml."_parent_id" = bm."id";

  UPDATE "board_content_locales" bl
  SET "chairman_name" = b."chairman_name",
      "member_secretary_name" = b."member_secretary_name"
  FROM "board_content" b
  WHERE bl."_parent_id" = b."id";

  UPDATE "rti_content_contacts_locales" rcl
  SET "name" = rc."name"
  FROM "rti_content_contacts" rc
  WHERE rcl."_parent_id" = rc."id";

  ALTER TABLE "team_members" DROP COLUMN "name";
  ALTER TABLE "_team_members_v" DROP COLUMN "version_name";
  ALTER TABLE "board_content_members" DROP COLUMN "name";
  ALTER TABLE "board_content" DROP COLUMN "chairman_name";
  ALTER TABLE "board_content" DROP COLUMN "member_secretary_name";
  ALTER TABLE "_board_content_v_version_members" DROP COLUMN "name";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_chairman_name";
  ALTER TABLE "_board_content_v" DROP COLUMN "version_member_secretary_name";
  ALTER TABLE "rti_content_contacts" DROP COLUMN "name";
  ALTER TABLE "_rti_content_v_version_contacts" DROP COLUMN "name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members" ADD COLUMN "name" varchar;
  ALTER TABLE "_team_members_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "board_content_members" ADD COLUMN "name" varchar;
  ALTER TABLE "board_content" ADD COLUMN "chairman_name" varchar;
  ALTER TABLE "board_content" ADD COLUMN "member_secretary_name" varchar;
  ALTER TABLE "_board_content_v_version_members" ADD COLUMN "name" varchar;
  ALTER TABLE "_board_content_v" ADD COLUMN "version_chairman_name" varchar;
  ALTER TABLE "_board_content_v" ADD COLUMN "version_member_secretary_name" varchar;
  ALTER TABLE "rti_content_contacts" ADD COLUMN "name" varchar;
  ALTER TABLE "_rti_content_v_version_contacts" ADD COLUMN "name" varchar;
  ALTER TABLE "team_members_locales" DROP COLUMN "name";
  ALTER TABLE "_team_members_v_locales" DROP COLUMN "version_name";
  ALTER TABLE "board_content_members_locales" DROP COLUMN "name";
  ALTER TABLE "board_content_locales" DROP COLUMN "chairman_name";
  ALTER TABLE "board_content_locales" DROP COLUMN "member_secretary_name";
  ALTER TABLE "_board_content_v_version_members_locales" DROP COLUMN "name";
  ALTER TABLE "_board_content_v_locales" DROP COLUMN "version_chairman_name";
  ALTER TABLE "_board_content_v_locales" DROP COLUMN "version_member_secretary_name";
  ALTER TABLE "rti_content_contacts_locales" DROP COLUMN "name";
  ALTER TABLE "_rti_content_v_version_contacts_locales" DROP COLUMN "name";`)
}
