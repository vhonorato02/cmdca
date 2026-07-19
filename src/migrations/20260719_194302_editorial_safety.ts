import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_noticias_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__noticias_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_reunioes_acesso" AS ENUM('publica', 'reservada');
  CREATE TYPE "public"."enum_reunioes_modalidade" AS ENUM('presencial', 'online', 'hibrida');
  CREATE TYPE "public"."enum_reunioes_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__reunioes_v_version_acesso" AS ENUM('publica', 'reservada');
  CREATE TYPE "public"."enum__reunioes_v_version_modalidade" AS ENUM('presencial', 'online', 'hibrida');
  CREATE TYPE "public"."enum__reunioes_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_resolucoes_situacao_juridica" AS ENUM('vigente', 'alterada', 'revogada', 'sem_efeito');
  CREATE TYPE "public"."enum_resolucoes_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__resolucoes_v_version_situacao_juridica" AS ENUM('vigente', 'alterada', 'revogada', 'sem_efeito');
  CREATE TYPE "public"."enum__resolucoes_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_editais_situacao_juridica" AS ENUM('vigente', 'encerrado', 'suspenso', 'revogado', 'anulado');
  CREATE TYPE "public"."enum_editais_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__editais_v_version_situacao_juridica" AS ENUM('vigente', 'encerrado', 'suspenso', 'revogado', 'anulado');
  CREATE TYPE "public"."enum__editais_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_entidades_situacao_registro" AS ENUM('ativo', 'vencido', 'suspenso', 'cancelado');
  CREATE TYPE "public"."enum_entidades_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__entidades_v_version_situacao_registro" AS ENUM('ativo', 'vencido', 'suspenso', 'cancelado');
  CREATE TYPE "public"."enum__entidades_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_rede_protecao_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__rede_protecao_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_depoimentos_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__depoimentos_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_faq_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__faq_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_media_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_media_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__media_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_configuracoes_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_configuracoes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__configuracoes_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__configuracoes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pagina_inicial_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pagina_inicial_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_indicadores_status_revisao" AS ENUM('pendente', 'aprovada');
  CREATE TYPE "public"."enum_indicadores_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__indicadores_v_version_status_revisao" AS ENUM('pendente', 'aprovada');
  CREATE TYPE "public"."enum__indicadores_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'juridico';
  -- Backfill defensivo e idempotente: instalações antigas sem papel não podem
  -- perder o acesso ao painel. Se não houver administrador, promove a conta
  -- mais antiga; instalações já corretas permanecem intocadas.
  UPDATE "users"
  SET "role" = CASE
    WHEN lower("email") = 'admin@cmdca-pinda.local' THEN 'admin'::"public"."enum_users_role"
    ELSE 'editor'::"public"."enum_users_role"
  END
  WHERE "role" IS NULL;
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM "users")
      AND NOT EXISTS (SELECT 1 FROM "users" WHERE "role" = 'admin') THEN
      UPDATE "users"
      SET "role" = 'admin'::"public"."enum_users_role"
      WHERE "id" = (SELECT "id" FROM "users" ORDER BY "created_at" ASC, "id" ASC LIMIT 1);
    END IF;
  END $$;
  CREATE TABLE "resolucoes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"resolucoes_id" integer
  );
  
  CREATE TABLE "_resolucoes_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"resolucoes_id" integer
  );
  
  CREATE TABLE "editais_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"editais_id" integer
  );
  
  CREATE TABLE "_editais_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"editais_id" integer
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar,
  	"version_credito" varchar,
  	"version_envolve_menor_identificavel" boolean DEFAULT false,
  	"version_consentimento_menor" boolean DEFAULT false,
  	"version_referencia_consentimento" varchar,
  	"version_controle_editorial_fonte" varchar,
  	"version_controle_editorial_fonte_u_r_l" varchar,
  	"version_controle_editorial_verificado_em" timestamp(3) with time zone,
  	"version_controle_editorial_status_revisao" "enum__media_v_version_controle_editorial_status_revisao" DEFAULT 'pendente',
  	"version_controle_editorial_revisado_por_id" integer,
  	"version_controle_editorial_observacoes_internas" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__media_v_version_status" DEFAULT 'draft',
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"version_sizes_thumbnail_url" varchar,
  	"version_sizes_thumbnail_width" numeric,
  	"version_sizes_thumbnail_height" numeric,
  	"version_sizes_thumbnail_mime_type" varchar,
  	"version_sizes_thumbnail_filesize" numeric,
  	"version_sizes_thumbnail_filename" varchar,
  	"version_sizes_card_url" varchar,
  	"version_sizes_card_width" numeric,
  	"version_sizes_card_height" numeric,
  	"version_sizes_card_mime_type" varchar,
  	"version_sizes_card_filesize" numeric,
  	"version_sizes_card_filename" varchar,
  	"version_sizes_hero_url" varchar,
  	"version_sizes_hero_width" numeric,
  	"version_sizes_hero_height" numeric,
  	"version_sizes_hero_mime_type" varchar,
  	"version_sizes_hero_filesize" numeric,
  	"version_sizes_hero_filename" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "reunioes" ALTER COLUMN "tipo" SET DATA TYPE text;
  ALTER TABLE "reunioes" ALTER COLUMN "tipo" SET DEFAULT 'ordinaria'::text;
  DROP TYPE "public"."enum_reunioes_tipo";
  UPDATE "reunioes" SET "tipo" = 'ordinaria' WHERE "tipo" NOT IN ('ordinaria', 'extraordinaria');
  CREATE TYPE "public"."enum_reunioes_tipo" AS ENUM('ordinaria', 'extraordinaria');
  ALTER TABLE "reunioes" ALTER COLUMN "tipo" SET DEFAULT 'ordinaria'::"public"."enum_reunioes_tipo";
  ALTER TABLE "reunioes" ALTER COLUMN "tipo" SET DATA TYPE "public"."enum_reunioes_tipo" USING "tipo"::"public"."enum_reunioes_tipo";
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_tipo" SET DATA TYPE text;
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_tipo" SET DEFAULT 'ordinaria'::text;
  DROP TYPE "public"."enum__reunioes_v_version_tipo";
  UPDATE "_reunioes_v" SET "version_tipo" = 'ordinaria' WHERE "version_tipo" NOT IN ('ordinaria', 'extraordinaria');
  CREATE TYPE "public"."enum__reunioes_v_version_tipo" AS ENUM('ordinaria', 'extraordinaria');
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_tipo" SET DEFAULT 'ordinaria'::"public"."enum__reunioes_v_version_tipo";
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_tipo" SET DATA TYPE "public"."enum__reunioes_v_version_tipo" USING "version_tipo"::"public"."enum__reunioes_v_version_tipo";
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "configuracoes" ALTER COLUMN "diretoria_presidente_nome" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "diretoria_vice_nome" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_telefone" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_cep" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_casa_conselhos_telefone" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_casa_conselhos_endereco" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_assessora" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "redes_instagram_handle" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "redes_instagram_url" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_cnpj" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_conta" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_como_destinar" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_lei_c_m_d_c_a" SET DEFAULT 'Lei Municipal nº 2.626, de 19/12/1991';
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_lei_f_m_d_c_a" SET DEFAULT 'Lei Municipal nº 4.140, de 23/03/2004';
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_regimento" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_diretoria_presidente_nome" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_diretoria_vice_nome" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_telefone" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_cep" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_casa_conselhos_telefone" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_casa_conselhos_endereco" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_assessora" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_redes_instagram_handle" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_redes_instagram_url" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_cnpj" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_conta" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_como_destinar" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_lei_c_m_d_c_a" SET DEFAULT 'Lei Municipal nº 2.626, de 19/12/1991';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_lei_f_m_d_c_a" SET DEFAULT 'Lei Municipal nº 4.140, de 23/03/2004';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_regimento" DROP DEFAULT;
  ALTER TABLE "pagina_inicial_blocos" ALTER COLUMN "tipo" DROP NOT NULL;
  ALTER TABLE "_pagina_inicial_v_version_blocos" ALTER COLUMN "tipo" DROP NOT NULL;
  ALTER TABLE "indicadores_serie_anual" ALTER COLUMN "ano" DROP NOT NULL;
  ALTER TABLE "indicadores_serie_anual" ALTER COLUMN "valor" DROP NOT NULL;
  ALTER TABLE "indicadores_aplicacao_por_area" ALTER COLUMN "area" DROP NOT NULL;
  ALTER TABLE "indicadores_aplicacao_por_area" ALTER COLUMN "percentual" DROP NOT NULL;
  ALTER TABLE "indicadores" ALTER COLUMN "observacao" DROP DEFAULT;
  ALTER TABLE "_indicadores_v_version_serie_anual" ALTER COLUMN "ano" DROP NOT NULL;
  ALTER TABLE "_indicadores_v_version_serie_anual" ALTER COLUMN "valor" DROP NOT NULL;
  ALTER TABLE "_indicadores_v_version_aplicacao_por_area" ALTER COLUMN "area" DROP NOT NULL;
  ALTER TABLE "_indicadores_v_version_aplicacao_por_area" ALTER COLUMN "percentual" DROP NOT NULL;
  ALTER TABLE "_indicadores_v" ALTER COLUMN "version_observacao" DROP DEFAULT;
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_status_revisao" "enum_noticias_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "noticias" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "noticias" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__noticias_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_noticias_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "reunioes" ADD COLUMN "hora" varchar;
  ALTER TABLE "reunioes" ADD COLUMN "acesso" "enum_reunioes_acesso" DEFAULT 'publica';
  ALTER TABLE "reunioes" ADD COLUMN "modalidade" "enum_reunioes_modalidade" DEFAULT 'presencial';
  ALTER TABLE "reunioes" ADD COLUMN "link_transmissao" varchar;
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_status_revisao" "enum_reunioes_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "reunioes" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "reunioes" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_hora" varchar;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_acesso" "enum__reunioes_v_version_acesso" DEFAULT 'publica';
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_modalidade" "enum__reunioes_v_version_modalidade" DEFAULT 'presencial';
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_link_transmissao" varchar;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__reunioes_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_reunioes_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_reunioes_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "resolucoes" ADD COLUMN "situacao_juridica" "enum_resolucoes_situacao_juridica" DEFAULT 'vigente';
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_status_revisao" "enum_resolucoes_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "resolucoes" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "resolucoes" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_situacao_juridica" "enum__resolucoes_v_version_situacao_juridica" DEFAULT 'vigente';
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__resolucoes_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_resolucoes_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "editais" ADD COLUMN "situacao_juridica" "enum_editais_situacao_juridica" DEFAULT 'vigente';
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_status_revisao" "enum_editais_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "editais" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "editais" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_editais_v" ADD COLUMN "version_situacao_juridica" "enum__editais_v_version_situacao_juridica" DEFAULT 'vigente';
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__editais_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_editais_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_editais_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_editais_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "entidades" ADD COLUMN "situacao_registro" "enum_entidades_situacao_registro" DEFAULT 'ativo';
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_status_revisao" "enum_entidades_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "entidades" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "entidades" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_situacao_registro" "enum__entidades_v_version_situacao_registro" DEFAULT 'ativo';
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__entidades_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_entidades_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_entidades_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_status_revisao" "enum_rede_protecao_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "rede_protecao" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "rede_protecao" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__rede_protecao_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_rede_protecao_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "depoimentos" ADD COLUMN "origem" varchar;
  ALTER TABLE "depoimentos" ADD COLUMN "autorizacao_publicacao" boolean DEFAULT false;
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_status_revisao" "enum_depoimentos_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "depoimentos" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "depoimentos" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_origem" varchar;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_autorizacao_publicacao" boolean DEFAULT false;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__depoimentos_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_depoimentos_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "destaques" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_destaques_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_destaques_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_status_revisao" "enum_faq_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "faq" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "faq" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__faq_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_faq_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_faq_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_faq_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "media" ADD COLUMN "envolve_menor_identificavel" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "media" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "media" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "controle_editorial_status_revisao" "enum_media_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "media" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "media" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "_status" "enum_media_status" DEFAULT 'draft';
  ALTER TABLE "configuracoes" ADD COLUMN "fmdca_dados_bancarios_confirmados" boolean DEFAULT false;
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_fonte" varchar;
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_status_revisao" "enum_configuracoes_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_revisado_por_id" integer;
  ALTER TABLE "configuracoes" ADD COLUMN "controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "configuracoes" ADD COLUMN "_status" "enum_configuracoes_status" DEFAULT 'draft';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_fmdca_dados_bancarios_confirmados" boolean DEFAULT false;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_fonte" varchar;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_fonte_u_r_l" varchar;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_status_revisao" "enum__configuracoes_v_version_controle_editorial_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_revisado_por_id" integer;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_controle_editorial_observacoes_internas" varchar;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version__status" "enum__configuracoes_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "_configuracoes_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "pagina_inicial" ADD COLUMN "_status" "enum_pagina_inicial_status" DEFAULT 'draft';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version__status" "enum__pagina_inicial_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "indicadores" ADD COLUMN "publicar" boolean DEFAULT false;
  ALTER TABLE "indicadores" ADD COLUMN "periodo_referencia" varchar;
  ALTER TABLE "indicadores" ADD COLUMN "fonte" varchar;
  ALTER TABLE "indicadores" ADD COLUMN "fonte_u_r_l" varchar;
  ALTER TABLE "indicadores" ADD COLUMN "verificado_em" timestamp(3) with time zone;
  ALTER TABLE "indicadores" ADD COLUMN "status_revisao" "enum_indicadores_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "indicadores" ADD COLUMN "observacoes_internas" varchar;
  ALTER TABLE "indicadores" ADD COLUMN "_status" "enum_indicadores_status" DEFAULT 'draft';
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_publicar" boolean DEFAULT false;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_periodo_referencia" varchar;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_fonte" varchar;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_fonte_u_r_l" varchar;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_verificado_em" timestamp(3) with time zone;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_status_revisao" "enum__indicadores_v_version_status_revisao" DEFAULT 'pendente';
  ALTER TABLE "_indicadores_v" ADD COLUMN "version_observacoes_internas" varchar;
  ALTER TABLE "_indicadores_v" ADD COLUMN "version__status" "enum__indicadores_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_indicadores_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "_indicadores_v" ADD COLUMN "autosave" boolean;
  -- Preserva como publicada a configuração que já alimentava o site antes de
  -- os globais ganharem drafts. Indicadores permanecem com publicar=false.
  UPDATE "configuracoes" SET "_status" = 'published';
  UPDATE "pagina_inicial" SET "_status" = 'published';
  UPDATE "indicadores" SET "_status" = 'published', "publicar" = false;
  UPDATE "_configuracoes_v" SET "version__status" = 'published', "latest" = false;
  UPDATE "_pagina_inicial_v" SET "version__status" = 'published', "latest" = false;
  UPDATE "_indicadores_v" SET "version__status" = 'published', "version_publicar" = false, "latest" = false;
  UPDATE "_configuracoes_v"
    SET "latest" = true
    WHERE "id" = (SELECT "id" FROM "_configuracoes_v" ORDER BY "created_at" DESC, "id" DESC LIMIT 1);
  UPDATE "_pagina_inicial_v"
    SET "latest" = true
    WHERE "id" = (SELECT "id" FROM "_pagina_inicial_v" ORDER BY "created_at" DESC, "id" DESC LIMIT 1);
  UPDATE "_indicadores_v"
    SET "latest" = true
    WHERE "id" = (SELECT "id" FROM "_indicadores_v" ORDER BY "created_at" DESC, "id" DESC LIMIT 1);
  ALTER TABLE "resolucoes_rels" ADD CONSTRAINT "resolucoes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resolucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resolucoes_rels" ADD CONSTRAINT "resolucoes_rels_resolucoes_fk" FOREIGN KEY ("resolucoes_id") REFERENCES "public"."resolucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resolucoes_v_rels" ADD CONSTRAINT "_resolucoes_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resolucoes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resolucoes_v_rels" ADD CONSTRAINT "_resolucoes_v_rels_resolucoes_fk" FOREIGN KEY ("resolucoes_id") REFERENCES "public"."resolucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editais_rels" ADD CONSTRAINT "editais_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."editais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "editais_rels" ADD CONSTRAINT "editais_rels_editais_fk" FOREIGN KEY ("editais_id") REFERENCES "public"."editais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_editais_v_rels" ADD CONSTRAINT "_editais_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_editais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_editais_v_rels" ADD CONSTRAINT "_editais_v_rels_editais_fk" FOREIGN KEY ("editais_id") REFERENCES "public"."editais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "resolucoes_rels_order_idx" ON "resolucoes_rels" USING btree ("order");
  CREATE INDEX "resolucoes_rels_parent_idx" ON "resolucoes_rels" USING btree ("parent_id");
  CREATE INDEX "resolucoes_rels_path_idx" ON "resolucoes_rels" USING btree ("path");
  CREATE INDEX "resolucoes_rels_resolucoes_id_idx" ON "resolucoes_rels" USING btree ("resolucoes_id");
  CREATE INDEX "_resolucoes_v_rels_order_idx" ON "_resolucoes_v_rels" USING btree ("order");
  CREATE INDEX "_resolucoes_v_rels_parent_idx" ON "_resolucoes_v_rels" USING btree ("parent_id");
  CREATE INDEX "_resolucoes_v_rels_path_idx" ON "_resolucoes_v_rels" USING btree ("path");
  CREATE INDEX "_resolucoes_v_rels_resolucoes_id_idx" ON "_resolucoes_v_rels" USING btree ("resolucoes_id");
  CREATE INDEX "editais_rels_order_idx" ON "editais_rels" USING btree ("order");
  CREATE INDEX "editais_rels_parent_idx" ON "editais_rels" USING btree ("parent_id");
  CREATE INDEX "editais_rels_path_idx" ON "editais_rels" USING btree ("path");
  CREATE INDEX "editais_rels_editais_id_idx" ON "editais_rels" USING btree ("editais_id");
  CREATE INDEX "_editais_v_rels_order_idx" ON "_editais_v_rels" USING btree ("order");
  CREATE INDEX "_editais_v_rels_parent_idx" ON "_editais_v_rels" USING btree ("parent_id");
  CREATE INDEX "_editais_v_rels_path_idx" ON "_editais_v_rels" USING btree ("path");
  CREATE INDEX "_editais_v_rels_editais_id_idx" ON "_editais_v_rels" USING btree ("editais_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_controle_editorial_version_controle_edi_idx" ON "_media_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_deleted_at_idx" ON "_media_v" USING btree ("version_deleted_at");
  CREATE INDEX "_media_v_version_version__status_idx" ON "_media_v" USING btree ("version__status");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_thumbnail_version_sizes_thumbnail_idx" ON "_media_v" USING btree ("version_sizes_thumbnail_filename");
  CREATE INDEX "_media_v_version_sizes_card_version_sizes_card_filename_idx" ON "_media_v" USING btree ("version_sizes_card_filename");
  CREATE INDEX "_media_v_version_sizes_hero_version_sizes_hero_filename_idx" ON "_media_v" USING btree ("version_sizes_hero_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_latest_idx" ON "_media_v" USING btree ("latest");
  CREATE INDEX "_media_v_autosave_idx" ON "_media_v" USING btree ("autosave");
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reunioes_v" ADD CONSTRAINT "_reunioes_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resolucoes" ADD CONSTRAINT "resolucoes_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resolucoes_v" ADD CONSTRAINT "_resolucoes_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editais" ADD CONSTRAINT "editais_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_editais_v" ADD CONSTRAINT "_editais_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entidades" ADD CONSTRAINT "entidades_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_entidades_v" ADD CONSTRAINT "_entidades_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rede_protecao" ADD CONSTRAINT "rede_protecao_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_rede_protecao_v" ADD CONSTRAINT "_rede_protecao_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "depoimentos" ADD CONSTRAINT "depoimentos_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_depoimentos_v" ADD CONSTRAINT "_depoimentos_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq" ADD CONSTRAINT "faq_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracoes" ADD CONSTRAINT "configuracoes_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracoes_v" ADD CONSTRAINT "_configuracoes_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "noticias_controle_editorial_controle_editorial_revisado__idx" ON "noticias" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "noticias_deleted_at_idx" ON "noticias" USING btree ("deleted_at");
  CREATE INDEX "_noticias_v_version_controle_editorial_version_controle__idx" ON "_noticias_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_noticias_v_version_version_deleted_at_idx" ON "_noticias_v" USING btree ("version_deleted_at");
  CREATE INDEX "_noticias_v_autosave_idx" ON "_noticias_v" USING btree ("autosave");
  CREATE INDEX "reunioes_controle_editorial_controle_editorial_revisado__idx" ON "reunioes" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "reunioes_deleted_at_idx" ON "reunioes" USING btree ("deleted_at");
  CREATE INDEX "_reunioes_v_version_controle_editorial_version_controle__idx" ON "_reunioes_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_reunioes_v_version_version_deleted_at_idx" ON "_reunioes_v" USING btree ("version_deleted_at");
  CREATE INDEX "_reunioes_v_autosave_idx" ON "_reunioes_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "resolucoes_numero_idx" ON "resolucoes" USING btree ("numero");
  CREATE INDEX "resolucoes_controle_editorial_controle_editorial_revisad_idx" ON "resolucoes" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "resolucoes_deleted_at_idx" ON "resolucoes" USING btree ("deleted_at");
  CREATE INDEX "_resolucoes_v_version_version_numero_idx" ON "_resolucoes_v" USING btree ("version_numero");
  CREATE INDEX "_resolucoes_v_version_controle_editorial_version_control_idx" ON "_resolucoes_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_resolucoes_v_version_version_deleted_at_idx" ON "_resolucoes_v" USING btree ("version_deleted_at");
  CREATE INDEX "_resolucoes_v_autosave_idx" ON "_resolucoes_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "editais_numero_idx" ON "editais" USING btree ("numero");
  CREATE INDEX "editais_controle_editorial_controle_editorial_revisado_p_idx" ON "editais" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "editais_deleted_at_idx" ON "editais" USING btree ("deleted_at");
  CREATE INDEX "_editais_v_version_version_numero_idx" ON "_editais_v" USING btree ("version_numero");
  CREATE INDEX "_editais_v_version_controle_editorial_version_controle_e_idx" ON "_editais_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_editais_v_version_version_deleted_at_idx" ON "_editais_v" USING btree ("version_deleted_at");
  CREATE INDEX "_editais_v_autosave_idx" ON "_editais_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "entidades_registro_idx" ON "entidades" USING btree ("registro");
  CREATE INDEX "entidades_controle_editorial_controle_editorial_revisado_idx" ON "entidades" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "entidades_deleted_at_idx" ON "entidades" USING btree ("deleted_at");
  CREATE INDEX "_entidades_v_version_version_registro_idx" ON "_entidades_v" USING btree ("version_registro");
  CREATE INDEX "_entidades_v_version_controle_editorial_version_controle_idx" ON "_entidades_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_entidades_v_version_version_deleted_at_idx" ON "_entidades_v" USING btree ("version_deleted_at");
  CREATE INDEX "_entidades_v_autosave_idx" ON "_entidades_v" USING btree ("autosave");
  CREATE INDEX "rede_protecao_controle_editorial_controle_editorial_revi_idx" ON "rede_protecao" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "rede_protecao_deleted_at_idx" ON "rede_protecao" USING btree ("deleted_at");
  CREATE INDEX "_rede_protecao_v_version_controle_editorial_version_cont_idx" ON "_rede_protecao_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_rede_protecao_v_version_version_deleted_at_idx" ON "_rede_protecao_v" USING btree ("version_deleted_at");
  CREATE INDEX "_rede_protecao_v_autosave_idx" ON "_rede_protecao_v" USING btree ("autosave");
  CREATE INDEX "depoimentos_controle_editorial_controle_editorial_revisa_idx" ON "depoimentos" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "depoimentos_deleted_at_idx" ON "depoimentos" USING btree ("deleted_at");
  CREATE INDEX "_depoimentos_v_version_controle_editorial_version_contro_idx" ON "_depoimentos_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_depoimentos_v_version_version_deleted_at_idx" ON "_depoimentos_v" USING btree ("version_deleted_at");
  CREATE INDEX "_depoimentos_v_autosave_idx" ON "_depoimentos_v" USING btree ("autosave");
  CREATE INDEX "destaques_deleted_at_idx" ON "destaques" USING btree ("deleted_at");
  CREATE INDEX "_destaques_v_version_version_deleted_at_idx" ON "_destaques_v" USING btree ("version_deleted_at");
  CREATE INDEX "_destaques_v_autosave_idx" ON "_destaques_v" USING btree ("autosave");
  CREATE INDEX "faq_controle_editorial_controle_editorial_revisado_por_idx" ON "faq" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "faq_deleted_at_idx" ON "faq" USING btree ("deleted_at");
  CREATE INDEX "_faq_v_version_controle_editorial_version_controle_edito_idx" ON "_faq_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_faq_v_version_version_deleted_at_idx" ON "_faq_v" USING btree ("version_deleted_at");
  CREATE INDEX "_faq_v_autosave_idx" ON "_faq_v" USING btree ("autosave");
  CREATE INDEX "media_controle_editorial_controle_editorial_revisado_por_idx" ON "media" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "media__status_idx" ON "media" USING btree ("_status");
  CREATE INDEX "configuracoes_controle_editorial_controle_editorial_revi_idx" ON "configuracoes" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "configuracoes__status_idx" ON "configuracoes" USING btree ("_status");
  CREATE INDEX "_configuracoes_v_version_controle_editorial_version_cont_idx" ON "_configuracoes_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_configuracoes_v_version_version__status_idx" ON "_configuracoes_v" USING btree ("version__status");
  CREATE INDEX "_configuracoes_v_latest_idx" ON "_configuracoes_v" USING btree ("latest");
  CREATE INDEX "_configuracoes_v_autosave_idx" ON "_configuracoes_v" USING btree ("autosave");
  CREATE INDEX "pagina_inicial__status_idx" ON "pagina_inicial" USING btree ("_status");
  CREATE INDEX "_pagina_inicial_v_version_version__status_idx" ON "_pagina_inicial_v" USING btree ("version__status");
  CREATE INDEX "_pagina_inicial_v_latest_idx" ON "_pagina_inicial_v" USING btree ("latest");
  CREATE INDEX "_pagina_inicial_v_autosave_idx" ON "_pagina_inicial_v" USING btree ("autosave");
  CREATE INDEX "indicadores__status_idx" ON "indicadores" USING btree ("_status");
  CREATE INDEX "_indicadores_v_version_version__status_idx" ON "_indicadores_v" USING btree ("version__status");
  CREATE INDEX "_indicadores_v_latest_idx" ON "_indicadores_v" USING btree ("latest");
  CREATE INDEX "_indicadores_v_autosave_idx" ON "_indicadores_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_reunioes_tipo" ADD VALUE 'publica';
  ALTER TYPE "public"."enum_reunioes_tipo" ADD VALUE 'reservada';
  ALTER TYPE "public"."enum__reunioes_v_version_tipo" ADD VALUE 'publica';
  ALTER TYPE "public"."enum__reunioes_v_version_tipo" ADD VALUE 'reservada';
  ALTER TABLE "resolucoes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resolucoes_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "editais_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_editais_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_media_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resolucoes_rels" CASCADE;
  DROP TABLE "_resolucoes_v_rels" CASCADE;
  DROP TABLE "editais_rels" CASCADE;
  DROP TABLE "_editais_v_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  ALTER TABLE "noticias" DROP CONSTRAINT "noticias_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_noticias_v" DROP CONSTRAINT "_noticias_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "reunioes" DROP CONSTRAINT "reunioes_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_reunioes_v" DROP CONSTRAINT "_reunioes_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "resolucoes" DROP CONSTRAINT "resolucoes_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_resolucoes_v" DROP CONSTRAINT "_resolucoes_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "editais" DROP CONSTRAINT "editais_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_editais_v" DROP CONSTRAINT "_editais_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "entidades" DROP CONSTRAINT "entidades_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_entidades_v" DROP CONSTRAINT "_entidades_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "rede_protecao" DROP CONSTRAINT "rede_protecao_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_rede_protecao_v" DROP CONSTRAINT "_rede_protecao_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "depoimentos" DROP CONSTRAINT "depoimentos_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_depoimentos_v" DROP CONSTRAINT "_depoimentos_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "faq" DROP CONSTRAINT "faq_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_faq_v" DROP CONSTRAINT "_faq_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "configuracoes" DROP CONSTRAINT "configuracoes_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "_configuracoes_v" DROP CONSTRAINT "_configuracoes_v_version_controle_editorial_revisado_por_id_users_id_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  UPDATE "users" SET "role" = 'editor' WHERE "role" = 'juridico';
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "noticias_controle_editorial_controle_editorial_revisado__idx";
  DROP INDEX "noticias_deleted_at_idx";
  DROP INDEX "_noticias_v_version_controle_editorial_version_controle__idx";
  DROP INDEX "_noticias_v_version_version_deleted_at_idx";
  DROP INDEX "_noticias_v_autosave_idx";
  DROP INDEX "reunioes_controle_editorial_controle_editorial_revisado__idx";
  DROP INDEX "reunioes_deleted_at_idx";
  DROP INDEX "_reunioes_v_version_controle_editorial_version_controle__idx";
  DROP INDEX "_reunioes_v_version_version_deleted_at_idx";
  DROP INDEX "_reunioes_v_autosave_idx";
  DROP INDEX "resolucoes_numero_idx";
  DROP INDEX "resolucoes_controle_editorial_controle_editorial_revisad_idx";
  DROP INDEX "resolucoes_deleted_at_idx";
  DROP INDEX "_resolucoes_v_version_version_numero_idx";
  DROP INDEX "_resolucoes_v_version_controle_editorial_version_control_idx";
  DROP INDEX "_resolucoes_v_version_version_deleted_at_idx";
  DROP INDEX "_resolucoes_v_autosave_idx";
  DROP INDEX "editais_numero_idx";
  DROP INDEX "editais_controle_editorial_controle_editorial_revisado_p_idx";
  DROP INDEX "editais_deleted_at_idx";
  DROP INDEX "_editais_v_version_version_numero_idx";
  DROP INDEX "_editais_v_version_controle_editorial_version_controle_e_idx";
  DROP INDEX "_editais_v_version_version_deleted_at_idx";
  DROP INDEX "_editais_v_autosave_idx";
  DROP INDEX "entidades_registro_idx";
  DROP INDEX "entidades_controle_editorial_controle_editorial_revisado_idx";
  DROP INDEX "entidades_deleted_at_idx";
  DROP INDEX "_entidades_v_version_version_registro_idx";
  DROP INDEX "_entidades_v_version_controle_editorial_version_controle_idx";
  DROP INDEX "_entidades_v_version_version_deleted_at_idx";
  DROP INDEX "_entidades_v_autosave_idx";
  DROP INDEX "rede_protecao_controle_editorial_controle_editorial_revi_idx";
  DROP INDEX "rede_protecao_deleted_at_idx";
  DROP INDEX "_rede_protecao_v_version_controle_editorial_version_cont_idx";
  DROP INDEX "_rede_protecao_v_version_version_deleted_at_idx";
  DROP INDEX "_rede_protecao_v_autosave_idx";
  DROP INDEX "depoimentos_controle_editorial_controle_editorial_revisa_idx";
  DROP INDEX "depoimentos_deleted_at_idx";
  DROP INDEX "_depoimentos_v_version_controle_editorial_version_contro_idx";
  DROP INDEX "_depoimentos_v_version_version_deleted_at_idx";
  DROP INDEX "_depoimentos_v_autosave_idx";
  DROP INDEX "destaques_deleted_at_idx";
  DROP INDEX "_destaques_v_version_version_deleted_at_idx";
  DROP INDEX "_destaques_v_autosave_idx";
  DROP INDEX "faq_controle_editorial_controle_editorial_revisado_por_idx";
  DROP INDEX "faq_deleted_at_idx";
  DROP INDEX "_faq_v_version_controle_editorial_version_controle_edito_idx";
  DROP INDEX "_faq_v_version_version_deleted_at_idx";
  DROP INDEX "_faq_v_autosave_idx";
  DROP INDEX "media_controle_editorial_controle_editorial_revisado_por_idx";
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "media__status_idx";
  DROP INDEX "configuracoes_controle_editorial_controle_editorial_revi_idx";
  DROP INDEX "configuracoes__status_idx";
  DROP INDEX "_configuracoes_v_version_controle_editorial_version_cont_idx";
  DROP INDEX "_configuracoes_v_version_version__status_idx";
  DROP INDEX "_configuracoes_v_latest_idx";
  DROP INDEX "_configuracoes_v_autosave_idx";
  DROP INDEX "pagina_inicial__status_idx";
  DROP INDEX "_pagina_inicial_v_version_version__status_idx";
  DROP INDEX "_pagina_inicial_v_latest_idx";
  DROP INDEX "_pagina_inicial_v_autosave_idx";
  DROP INDEX "indicadores__status_idx";
  DROP INDEX "_indicadores_v_version_version__status_idx";
  DROP INDEX "_indicadores_v_latest_idx";
  DROP INDEX "_indicadores_v_autosave_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "configuracoes" ALTER COLUMN "diretoria_presidente_nome" SET DEFAULT 'Dr. Rodolfo Brockhof';
  ALTER TABLE "configuracoes" ALTER COLUMN "diretoria_vice_nome" SET DEFAULT 'Andrea Campos Sales Martins';
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_telefone" SET DEFAULT '(12) 3642-1249';
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_cep" SET DEFAULT '12420-070';
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_casa_conselhos_telefone" SET DEFAULT '(12) 3643-1607 / 3643-1609';
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_casa_conselhos_endereco" SET DEFAULT '[A CONFIRMAR] — endereço exato da Casa dos Conselhos';
  ALTER TABLE "configuracoes" ALTER COLUMN "contato_assessora" SET DEFAULT 'Simone Braça';
  ALTER TABLE "configuracoes" ALTER COLUMN "redes_instagram_handle" SET DEFAULT '@cmdca_pindamonhangaba';
  ALTER TABLE "configuracoes" ALTER COLUMN "redes_instagram_url" SET DEFAULT 'https://www.instagram.com/cmdca_pindamonhangaba';
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_cnpj" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_conta" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_como_destinar" SET DEFAULT 'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.';
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_lei_c_m_d_c_a" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_lei_f_m_d_c_a" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "configuracoes" ALTER COLUMN "base_legal_regimento" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_diretoria_presidente_nome" SET DEFAULT 'Dr. Rodolfo Brockhof';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_diretoria_vice_nome" SET DEFAULT 'Andrea Campos Sales Martins';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_telefone" SET DEFAULT '(12) 3642-1249';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_cep" SET DEFAULT '12420-070';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_casa_conselhos_telefone" SET DEFAULT '(12) 3643-1607 / 3643-1609';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_casa_conselhos_endereco" SET DEFAULT '[A CONFIRMAR] — endereço exato da Casa dos Conselhos';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_contato_assessora" SET DEFAULT 'Simone Braça';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_redes_instagram_handle" SET DEFAULT '@cmdca_pindamonhangaba';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_redes_instagram_url" SET DEFAULT 'https://www.instagram.com/cmdca_pindamonhangaba';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_cnpj" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_conta" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_como_destinar" SET DEFAULT 'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_lei_c_m_d_c_a" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_lei_f_m_d_c_a" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_base_legal_regimento" SET DEFAULT '[A CONFIRMAR]';
  ALTER TABLE "pagina_inicial_blocos" ALTER COLUMN "tipo" SET NOT NULL;
  ALTER TABLE "_pagina_inicial_v_version_blocos" ALTER COLUMN "tipo" SET NOT NULL;
  ALTER TABLE "indicadores_serie_anual" ALTER COLUMN "ano" SET NOT NULL;
  ALTER TABLE "indicadores_serie_anual" ALTER COLUMN "valor" SET NOT NULL;
  ALTER TABLE "indicadores_aplicacao_por_area" ALTER COLUMN "area" SET NOT NULL;
  ALTER TABLE "indicadores_aplicacao_por_area" ALTER COLUMN "percentual" SET NOT NULL;
  ALTER TABLE "indicadores" ALTER COLUMN "observacao" SET DEFAULT 'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.';
  ALTER TABLE "_indicadores_v_version_serie_anual" ALTER COLUMN "ano" SET NOT NULL;
  ALTER TABLE "_indicadores_v_version_serie_anual" ALTER COLUMN "valor" SET NOT NULL;
  ALTER TABLE "_indicadores_v_version_aplicacao_por_area" ALTER COLUMN "area" SET NOT NULL;
  ALTER TABLE "_indicadores_v_version_aplicacao_por_area" ALTER COLUMN "percentual" SET NOT NULL;
  ALTER TABLE "_indicadores_v" ALTER COLUMN "version_observacao" SET DEFAULT 'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.';
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "noticias" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "noticias" DROP COLUMN "deleted_at";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_noticias_v" DROP COLUMN "autosave";
  ALTER TABLE "reunioes" DROP COLUMN "hora";
  ALTER TABLE "reunioes" DROP COLUMN "acesso";
  ALTER TABLE "reunioes" DROP COLUMN "modalidade";
  ALTER TABLE "reunioes" DROP COLUMN "link_transmissao";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "reunioes" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "reunioes" DROP COLUMN "deleted_at";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_hora";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_acesso";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_modalidade";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_link_transmissao";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_reunioes_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_reunioes_v" DROP COLUMN "autosave";
  ALTER TABLE "resolucoes" DROP COLUMN "situacao_juridica";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "resolucoes" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "resolucoes" DROP COLUMN "deleted_at";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_situacao_juridica";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_resolucoes_v" DROP COLUMN "autosave";
  ALTER TABLE "editais" DROP COLUMN "situacao_juridica";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "editais" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "editais" DROP COLUMN "deleted_at";
  ALTER TABLE "_editais_v" DROP COLUMN "version_situacao_juridica";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_editais_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_editais_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_editais_v" DROP COLUMN "autosave";
  ALTER TABLE "entidades" DROP COLUMN "situacao_registro";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "entidades" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "entidades" DROP COLUMN "deleted_at";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_situacao_registro";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_entidades_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_entidades_v" DROP COLUMN "autosave";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "rede_protecao" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "rede_protecao" DROP COLUMN "deleted_at";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_rede_protecao_v" DROP COLUMN "autosave";
  ALTER TABLE "depoimentos" DROP COLUMN "origem";
  ALTER TABLE "depoimentos" DROP COLUMN "autorizacao_publicacao";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "depoimentos" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "depoimentos" DROP COLUMN "deleted_at";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_origem";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_autorizacao_publicacao";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_depoimentos_v" DROP COLUMN "autosave";
  ALTER TABLE "destaques" DROP COLUMN "deleted_at";
  ALTER TABLE "_destaques_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_destaques_v" DROP COLUMN "autosave";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "faq" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "faq" DROP COLUMN "deleted_at";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_faq_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_faq_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "_faq_v" DROP COLUMN "autosave";
  ALTER TABLE "media" DROP COLUMN "envolve_menor_identificavel";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "media" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "media" DROP COLUMN "_status";
  ALTER TABLE "configuracoes" DROP COLUMN "fmdca_dados_bancarios_confirmados";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_fonte";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_fonte_u_r_l";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_verificado_em";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_status_revisao";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_revisado_por_id";
  ALTER TABLE "configuracoes" DROP COLUMN "controle_editorial_observacoes_internas";
  ALTER TABLE "configuracoes" DROP COLUMN "_status";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_fmdca_dados_bancarios_confirmados";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_fonte";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_fonte_u_r_l";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_verificado_em";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_status_revisao";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_revisado_por_id";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_controle_editorial_observacoes_internas";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version__status";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "latest";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "autosave";
  ALTER TABLE "pagina_inicial" DROP COLUMN "_status";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version__status";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "latest";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "autosave";
  ALTER TABLE "indicadores" DROP COLUMN "publicar";
  ALTER TABLE "indicadores" DROP COLUMN "periodo_referencia";
  ALTER TABLE "indicadores" DROP COLUMN "fonte";
  ALTER TABLE "indicadores" DROP COLUMN "fonte_u_r_l";
  ALTER TABLE "indicadores" DROP COLUMN "verificado_em";
  ALTER TABLE "indicadores" DROP COLUMN "status_revisao";
  ALTER TABLE "indicadores" DROP COLUMN "observacoes_internas";
  ALTER TABLE "indicadores" DROP COLUMN "_status";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_publicar";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_periodo_referencia";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_fonte";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_fonte_u_r_l";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_verificado_em";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_status_revisao";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version_observacoes_internas";
  ALTER TABLE "_indicadores_v" DROP COLUMN "version__status";
  ALTER TABLE "_indicadores_v" DROP COLUMN "latest";
  ALTER TABLE "_indicadores_v" DROP COLUMN "autosave";
  DROP TYPE "public"."enum_noticias_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__noticias_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_reunioes_acesso";
  DROP TYPE "public"."enum_reunioes_modalidade";
  DROP TYPE "public"."enum_reunioes_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__reunioes_v_version_acesso";
  DROP TYPE "public"."enum__reunioes_v_version_modalidade";
  DROP TYPE "public"."enum__reunioes_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_resolucoes_situacao_juridica";
  DROP TYPE "public"."enum_resolucoes_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__resolucoes_v_version_situacao_juridica";
  DROP TYPE "public"."enum__resolucoes_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_editais_situacao_juridica";
  DROP TYPE "public"."enum_editais_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__editais_v_version_situacao_juridica";
  DROP TYPE "public"."enum__editais_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_entidades_situacao_registro";
  DROP TYPE "public"."enum_entidades_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__entidades_v_version_situacao_registro";
  DROP TYPE "public"."enum__entidades_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_rede_protecao_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__rede_protecao_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_depoimentos_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__depoimentos_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_faq_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__faq_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_media_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_media_status";
  DROP TYPE "public"."enum__media_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__media_v_version_status";
  DROP TYPE "public"."enum_configuracoes_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_configuracoes_status";
  DROP TYPE "public"."enum__configuracoes_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__configuracoes_v_version_status";
  DROP TYPE "public"."enum_pagina_inicial_status";
  DROP TYPE "public"."enum__pagina_inicial_v_version_status";
  DROP TYPE "public"."enum_indicadores_status_revisao";
  DROP TYPE "public"."enum_indicadores_status";
  DROP TYPE "public"."enum__indicadores_v_version_status_revisao";
  DROP TYPE "public"."enum__indicadores_v_version_status";`)
}
