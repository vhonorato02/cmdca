import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navegacao_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navegacao_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "navegacao_menu_principal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navegacao_rodape_institucional" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navegacao" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_navegacao_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_navegacao_v_version_menu_principal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navegacao_v_version_rodape_institucional" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navegacao_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__navegacao_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "pagina_inicial" ADD COLUMN "capa_titulo" varchar;
  ALTER TABLE "pagina_inicial" ADD COLUMN "capa_texto" varchar;
  ALTER TABLE "pagina_inicial" ADD COLUMN "capa_imagem_id" integer;
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_capa_titulo" varchar;
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_capa_texto" varchar;
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_capa_imagem_id" integer;
  ALTER TABLE "navegacao_menu_principal" ADD CONSTRAINT "navegacao_menu_principal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navegacao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navegacao_rodape_institucional" ADD CONSTRAINT "navegacao_rodape_institucional_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navegacao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navegacao_v_version_menu_principal" ADD CONSTRAINT "_navegacao_v_version_menu_principal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navegacao_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navegacao_v_version_rodape_institucional" ADD CONSTRAINT "_navegacao_v_version_rodape_institucional_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navegacao_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navegacao_menu_principal_order_idx" ON "navegacao_menu_principal" USING btree ("_order");
  CREATE INDEX "navegacao_menu_principal_parent_id_idx" ON "navegacao_menu_principal" USING btree ("_parent_id");
  CREATE INDEX "navegacao_rodape_institucional_order_idx" ON "navegacao_rodape_institucional" USING btree ("_order");
  CREATE INDEX "navegacao_rodape_institucional_parent_id_idx" ON "navegacao_rodape_institucional" USING btree ("_parent_id");
  CREATE INDEX "navegacao__status_idx" ON "navegacao" USING btree ("_status");
  CREATE INDEX "_navegacao_v_version_menu_principal_order_idx" ON "_navegacao_v_version_menu_principal" USING btree ("_order");
  CREATE INDEX "_navegacao_v_version_menu_principal_parent_id_idx" ON "_navegacao_v_version_menu_principal" USING btree ("_parent_id");
  CREATE INDEX "_navegacao_v_version_rodape_institucional_order_idx" ON "_navegacao_v_version_rodape_institucional" USING btree ("_order");
  CREATE INDEX "_navegacao_v_version_rodape_institucional_parent_id_idx" ON "_navegacao_v_version_rodape_institucional" USING btree ("_parent_id");
  CREATE INDEX "_navegacao_v_version_version__status_idx" ON "_navegacao_v" USING btree ("version__status");
  CREATE INDEX "_navegacao_v_created_at_idx" ON "_navegacao_v" USING btree ("created_at");
  CREATE INDEX "_navegacao_v_updated_at_idx" ON "_navegacao_v" USING btree ("updated_at");
  CREATE INDEX "_navegacao_v_latest_idx" ON "_navegacao_v" USING btree ("latest");
  CREATE INDEX "_navegacao_v_autosave_idx" ON "_navegacao_v" USING btree ("autosave");
  ALTER TABLE "pagina_inicial" ADD CONSTRAINT "pagina_inicial_capa_imagem_id_media_id_fk" FOREIGN KEY ("capa_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pagina_inicial_v" ADD CONSTRAINT "_pagina_inicial_v_version_capa_imagem_id_media_id_fk" FOREIGN KEY ("version_capa_imagem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pagina_inicial_capa_capa_imagem_idx" ON "pagina_inicial" USING btree ("capa_imagem_id");
  CREATE INDEX "_pagina_inicial_v_version_capa_version_capa_imagem_idx" ON "_pagina_inicial_v" USING btree ("version_capa_imagem_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "navegacao_menu_principal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navegacao_rodape_institucional" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navegacao" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navegacao_v_version_menu_principal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navegacao_v_version_rodape_institucional" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navegacao_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "navegacao_menu_principal" CASCADE;
  DROP TABLE "navegacao_rodape_institucional" CASCADE;
  DROP TABLE "navegacao" CASCADE;
  DROP TABLE "_navegacao_v_version_menu_principal" CASCADE;
  DROP TABLE "_navegacao_v_version_rodape_institucional" CASCADE;
  DROP TABLE "_navegacao_v" CASCADE;
  ALTER TABLE "pagina_inicial" DROP CONSTRAINT "pagina_inicial_capa_imagem_id_media_id_fk";
  
  ALTER TABLE "_pagina_inicial_v" DROP CONSTRAINT "_pagina_inicial_v_version_capa_imagem_id_media_id_fk";
  
  DROP INDEX "pagina_inicial_capa_capa_imagem_idx";
  DROP INDEX "_pagina_inicial_v_version_capa_version_capa_imagem_idx";
  ALTER TABLE "pagina_inicial" DROP COLUMN "capa_titulo";
  ALTER TABLE "pagina_inicial" DROP COLUMN "capa_texto";
  ALTER TABLE "pagina_inicial" DROP COLUMN "capa_imagem_id";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_capa_titulo";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_capa_texto";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_capa_imagem_id";
  DROP TYPE "public"."enum_navegacao_status";
  DROP TYPE "public"."enum__navegacao_v_version_status";`)
}
