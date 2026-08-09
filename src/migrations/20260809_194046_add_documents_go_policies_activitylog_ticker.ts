import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_government_orders_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__government_orders_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_activity_log_action" AS ENUM('created', 'updated', 'published', 'unpublished', 'deleted');
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "government_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"year" varchar,
  	"department" varchar,
  	"file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_government_orders_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_government_orders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_year" varchar,
  	"version_department" varchar,
  	"version_file_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__government_orders_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"year" varchar,
  	"category" varchar,
  	"file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_policies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_year" varchar,
  	"version_category" varchar,
  	"version_file_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__policies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "activity_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_email" varchar NOT NULL,
  	"action" "enum_activity_log_action" NOT NULL,
  	"section" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "announcements" ADD COLUMN "ticker_featured" boolean DEFAULT false;
  ALTER TABLE "announcements" ADD COLUMN "ticker_order" numeric DEFAULT 0;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_ticker_featured" boolean DEFAULT false;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_ticker_order" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "government_orders_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "policies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activity_log_id" integer;
  ALTER TABLE "government_orders" ADD CONSTRAINT "government_orders_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_government_orders_v" ADD CONSTRAINT "_government_orders_v_parent_id_government_orders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."government_orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_government_orders_v" ADD CONSTRAINT "_government_orders_v_version_file_id_documents_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "policies" ADD CONSTRAINT "policies_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_parent_id_policies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_version_file_id_documents_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "government_orders_file_idx" ON "government_orders" USING btree ("file_id");
  CREATE INDEX "government_orders_updated_at_idx" ON "government_orders" USING btree ("updated_at");
  CREATE INDEX "government_orders_created_at_idx" ON "government_orders" USING btree ("created_at");
  CREATE INDEX "government_orders__status_idx" ON "government_orders" USING btree ("_status");
  CREATE INDEX "_government_orders_v_parent_idx" ON "_government_orders_v" USING btree ("parent_id");
  CREATE INDEX "_government_orders_v_version_version_file_idx" ON "_government_orders_v" USING btree ("version_file_id");
  CREATE INDEX "_government_orders_v_version_version_updated_at_idx" ON "_government_orders_v" USING btree ("version_updated_at");
  CREATE INDEX "_government_orders_v_version_version_created_at_idx" ON "_government_orders_v" USING btree ("version_created_at");
  CREATE INDEX "_government_orders_v_version_version__status_idx" ON "_government_orders_v" USING btree ("version__status");
  CREATE INDEX "_government_orders_v_created_at_idx" ON "_government_orders_v" USING btree ("created_at");
  CREATE INDEX "_government_orders_v_updated_at_idx" ON "_government_orders_v" USING btree ("updated_at");
  CREATE INDEX "_government_orders_v_latest_idx" ON "_government_orders_v" USING btree ("latest");
  CREATE INDEX "policies_file_idx" ON "policies" USING btree ("file_id");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "policies__status_idx" ON "policies" USING btree ("_status");
  CREATE INDEX "_policies_v_parent_idx" ON "_policies_v" USING btree ("parent_id");
  CREATE INDEX "_policies_v_version_version_file_idx" ON "_policies_v" USING btree ("version_file_id");
  CREATE INDEX "_policies_v_version_version_updated_at_idx" ON "_policies_v" USING btree ("version_updated_at");
  CREATE INDEX "_policies_v_version_version_created_at_idx" ON "_policies_v" USING btree ("version_created_at");
  CREATE INDEX "_policies_v_version_version__status_idx" ON "_policies_v" USING btree ("version__status");
  CREATE INDEX "_policies_v_created_at_idx" ON "_policies_v" USING btree ("created_at");
  CREATE INDEX "_policies_v_updated_at_idx" ON "_policies_v" USING btree ("updated_at");
  CREATE INDEX "_policies_v_latest_idx" ON "_policies_v" USING btree ("latest");
  CREATE INDEX "activity_log_updated_at_idx" ON "activity_log" USING btree ("updated_at");
  CREATE INDEX "activity_log_created_at_idx" ON "activity_log" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_government_orders_fk" FOREIGN KEY ("government_orders_id") REFERENCES "public"."government_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activity_log_fk" FOREIGN KEY ("activity_log_id") REFERENCES "public"."activity_log"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_government_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("government_orders_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");
  CREATE INDEX "payload_locked_documents_rels_activity_log_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_log_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "government_orders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_government_orders_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_policies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activity_log" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "government_orders" CASCADE;
  DROP TABLE "_government_orders_v" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "_policies_v" CASCADE;
  DROP TABLE "activity_log" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_government_orders_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_policies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activity_log_fk";
  
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_government_orders_id_idx";
  DROP INDEX "payload_locked_documents_rels_policies_id_idx";
  DROP INDEX "payload_locked_documents_rels_activity_log_id_idx";
  ALTER TABLE "announcements" DROP COLUMN "ticker_featured";
  ALTER TABLE "announcements" DROP COLUMN "ticker_order";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_ticker_featured";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_ticker_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "government_orders_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "policies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activity_log_id";
  DROP TYPE "public"."enum_government_orders_status";
  DROP TYPE "public"."enum__government_orders_v_version_status";
  DROP TYPE "public"."enum_policies_status";
  DROP TYPE "public"."enum__policies_v_version_status";
  DROP TYPE "public"."enum_activity_log_action";`)
}
