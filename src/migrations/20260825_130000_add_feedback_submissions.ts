import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// New collection: stores what visitors submit through the public
// /feedback form (previously discarded — the form validated client-side
// and showed a fake success state, but never persisted anything). No
// versions/drafts and no localization, same shape as activity_log —
// a submission is a fact, not editorial content.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "feedback_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "email" varchar,
      "subject" varchar,
      "comments" varchar,
      "locale" varchar,
      "submitted_at" timestamp(3) with time zone,
      "read" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "feedback_submissions_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_submissions_fk" FOREIGN KEY ("feedback_submissions_id") REFERENCES "public"."feedback_submissions"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_feedback_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_submissions_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_feedback_submissions_fk";
    DROP INDEX "payload_locked_documents_rels_feedback_submissions_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "feedback_submissions_id";
    DROP TABLE "feedback_submissions" CASCADE;
  `)
}
