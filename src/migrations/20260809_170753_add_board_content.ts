import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_board_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__board_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "board_content_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"is_placeholder" boolean DEFAULT false
  );
  
  CREATE TABLE "board_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"chairman_role" varchar DEFAULT 'Chairman',
  	"chairman_name" varchar,
  	"chairman_title" varchar,
  	"member_secretary_role" varchar DEFAULT 'Member Secretary',
  	"member_secretary_name" varchar,
  	"member_secretary_title" varchar,
  	"_status" "enum_board_content_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_board_content_v_version_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"is_placeholder" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_board_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_chairman_role" varchar DEFAULT 'Chairman',
  	"version_chairman_name" varchar,
  	"version_chairman_title" varchar,
  	"version_member_secretary_role" varchar DEFAULT 'Member Secretary',
  	"version_member_secretary_name" varchar,
  	"version_member_secretary_title" varchar,
  	"version__status" "enum__board_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "board_content_members" ADD CONSTRAINT "board_content_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."board_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_board_content_v_version_members" ADD CONSTRAINT "_board_content_v_version_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_board_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "board_content_members_order_idx" ON "board_content_members" USING btree ("_order");
  CREATE INDEX "board_content_members_parent_id_idx" ON "board_content_members" USING btree ("_parent_id");
  CREATE INDEX "board_content__status_idx" ON "board_content" USING btree ("_status");
  CREATE INDEX "_board_content_v_version_members_order_idx" ON "_board_content_v_version_members" USING btree ("_order");
  CREATE INDEX "_board_content_v_version_members_parent_id_idx" ON "_board_content_v_version_members" USING btree ("_parent_id");
  CREATE INDEX "_board_content_v_version_version__status_idx" ON "_board_content_v" USING btree ("version__status");
  CREATE INDEX "_board_content_v_created_at_idx" ON "_board_content_v" USING btree ("created_at");
  CREATE INDEX "_board_content_v_updated_at_idx" ON "_board_content_v" USING btree ("updated_at");
  CREATE INDEX "_board_content_v_latest_idx" ON "_board_content_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "board_content_members" CASCADE;
  DROP TABLE "board_content" CASCADE;
  DROP TABLE "_board_content_v_version_members" CASCADE;
  DROP TABLE "_board_content_v" CASCADE;
  DROP TYPE "public"."enum_board_content_status";
  DROP TYPE "public"."enum__board_content_v_version_status";`)
}
