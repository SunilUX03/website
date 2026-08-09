import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_openings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "job_openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"type" varchar DEFAULT 'Contract',
  	"department" varchar,
  	"deadline" timestamp(3) with time zone,
  	"jd_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_openings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_job_openings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_role" varchar,
  	"version_type" varchar DEFAULT 'Contract',
  	"version_department" varchar,
  	"version_deadline" timestamp(3) with time zone,
  	"version_jd_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_openings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_openings_id" integer;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_parent_id_job_openings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "job_openings_updated_at_idx" ON "job_openings" USING btree ("updated_at");
  CREATE INDEX "job_openings_created_at_idx" ON "job_openings" USING btree ("created_at");
  CREATE INDEX "job_openings__status_idx" ON "job_openings" USING btree ("_status");
  CREATE INDEX "_job_openings_v_parent_idx" ON "_job_openings_v" USING btree ("parent_id");
  CREATE INDEX "_job_openings_v_version_version_updated_at_idx" ON "_job_openings_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_openings_v_version_version_created_at_idx" ON "_job_openings_v" USING btree ("version_created_at");
  CREATE INDEX "_job_openings_v_version_version__status_idx" ON "_job_openings_v" USING btree ("version__status");
  CREATE INDEX "_job_openings_v_created_at_idx" ON "_job_openings_v" USING btree ("created_at");
  CREATE INDEX "_job_openings_v_updated_at_idx" ON "_job_openings_v" USING btree ("updated_at");
  CREATE INDEX "_job_openings_v_latest_idx" ON "_job_openings_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_openings_fk" FOREIGN KEY ("job_openings_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_job_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_openings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "job_openings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "job_openings" CASCADE;
  DROP TABLE "_job_openings_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_openings_fk";
  
  DROP INDEX "payload_locked_documents_rels_job_openings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_openings_id";
  DROP TYPE "public"."enum_job_openings_status";
  DROP TYPE "public"."enum__job_openings_v_version_status";`)
}
