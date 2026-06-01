import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_noticias_categoria" AS ENUM('noticia', 'conferencia', 'evento', 'gestao', 'fmdca', 'orientacao', 'nota-tecnica');
  CREATE TYPE "public"."enum_noticias_tema" AS ENUM('familia', 'maos', 'cidade', 'encontro', 'escudo', 'doc');
  CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_version_categoria" AS ENUM('noticia', 'conferencia', 'evento', 'gestao', 'fmdca', 'orientacao', 'nota-tecnica');
  CREATE TYPE "public"."enum__noticias_v_version_tema" AS ENUM('familia', 'maos', 'cidade', 'encontro', 'escudo', 'doc');
  CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reunioes_tipo" AS ENUM('ordinaria', 'extraordinaria', 'publica', 'reservada');
  CREATE TYPE "public"."enum_reunioes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reunioes_v_version_tipo" AS ENUM('ordinaria', 'extraordinaria', 'publica', 'reservada');
  CREATE TYPE "public"."enum__reunioes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_resolucoes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resolucoes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_editais_tipo" AS ENUM('chamamento', 'conselho_tutelar', 'fmdca', 'outro');
  CREATE TYPE "public"."enum_editais_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__editais_v_version_tipo" AS ENUM('chamamento', 'conselho_tutelar', 'fmdca', 'outro');
  CREATE TYPE "public"."enum__editais_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_entidades_area" AS ENUM('educacao', 'saude', 'cultura_esporte', 'assistencia', 'acolhimento', 'outro');
  CREATE TYPE "public"."enum_entidades_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__entidades_v_version_area" AS ENUM('educacao', 'saude', 'cultura_esporte', 'assistencia', 'acolhimento', 'outro');
  CREATE TYPE "public"."enum__entidades_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_rede_protecao_tipo" AS ENUM('ct', 'cras', 'creas', 'casa', 'outro');
  CREATE TYPE "public"."enum_rede_protecao_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__rede_protecao_v_version_tipo" AS ENUM('ct', 'cras', 'creas', 'casa', 'outro');
  CREATE TYPE "public"."enum__rede_protecao_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_depoimentos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__depoimentos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_destaques_tema" AS ENUM('familia', 'maos', 'cidade', 'encontro', 'escudo', 'doc');
  CREATE TYPE "public"."enum_destaques_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__destaques_v_version_tema" AS ENUM('familia', 'maos', 'cidade', 'encontro', 'escudo', 'doc');
  CREATE TYPE "public"."enum__destaques_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_contexto" AS ENUM('ajuda', 'fmdca', 'geral');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_contexto" AS ENUM('ajuda', 'fmdca', 'geral');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_pagina_inicial_blocos_tipo" AS ENUM('slider', 'sobre', 'atalhos', 'indicadores', 'vozes', 'noticias');
  CREATE TYPE "public"."enum__pagina_inicial_v_version_blocos_tipo" AS ENUM('slider', 'sobre', 'atalhos', 'indicadores', 'vozes', 'noticias');
  CREATE TABLE "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"categoria" "enum_noticias_categoria" DEFAULT 'noticia',
  	"resumo" varchar,
  	"corpo" jsonb,
  	"capa_id" integer,
  	"tema" "enum_noticias_tema" DEFAULT 'familia',
  	"autor" varchar DEFAULT 'Comunicação CMDCA',
  	"destaque" boolean DEFAULT false,
  	"data" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_categoria" "enum__noticias_v_version_categoria" DEFAULT 'noticia',
  	"version_resumo" varchar,
  	"version_corpo" jsonb,
  	"version_capa_id" integer,
  	"version_tema" "enum__noticias_v_version_tema" DEFAULT 'familia',
  	"version_autor" varchar DEFAULT 'Comunicação CMDCA',
  	"version_destaque" boolean DEFAULT false,
  	"version_data" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "reunioes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"data" timestamp(3) with time zone,
  	"tipo" "enum_reunioes_tipo" DEFAULT 'ordinaria',
  	"local" varchar,
  	"pauta" jsonb,
  	"ata_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reunioes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_reunioes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_data" timestamp(3) with time zone,
  	"version_tipo" "enum__reunioes_v_version_tipo" DEFAULT 'ordinaria',
  	"version_local" varchar,
  	"version_pauta" jsonb,
  	"version_ata_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reunioes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "resolucoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar,
  	"titulo" varchar,
  	"data" timestamp(3) with time zone,
  	"arquivo_id" integer,
  	"link_tribuna" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resolucoes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_resolucoes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_numero" varchar,
  	"version_titulo" varchar,
  	"version_data" timestamp(3) with time zone,
  	"version_arquivo_id" integer,
  	"version_link_tribuna" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resolucoes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "editais" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar,
  	"titulo" varchar,
  	"tipo" "enum_editais_tipo" DEFAULT 'chamamento',
  	"data" timestamp(3) with time zone,
  	"prazo" timestamp(3) with time zone,
  	"arquivo_id" integer,
  	"link_tribuna" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_editais_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_editais_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_numero" varchar,
  	"version_titulo" varchar,
  	"version_tipo" "enum__editais_v_version_tipo" DEFAULT 'chamamento',
  	"version_data" timestamp(3) with time zone,
  	"version_prazo" timestamp(3) with time zone,
  	"version_arquivo_id" integer,
  	"version_link_tribuna" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__editais_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "entidades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"area" "enum_entidades_area" DEFAULT 'assistencia',
  	"registro" varchar,
  	"validade" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_entidades_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "entidades_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_entidades_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_area" "enum__entidades_v_version_area" DEFAULT 'assistencia',
  	"version_registro" varchar,
  	"version_validade" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__entidades_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_entidades_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "rede_protecao" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar,
  	"tipo" "enum_rede_protecao_tipo" DEFAULT 'ct',
  	"endereco" varchar,
  	"telefone" varchar,
  	"email" varchar,
  	"horario" varchar,
  	"obs" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_rede_protecao_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_rede_protecao_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nome" varchar,
  	"version_tipo" "enum__rede_protecao_v_version_tipo" DEFAULT 'ct',
  	"version_endereco" varchar,
  	"version_telefone" varchar,
  	"version_email" varchar,
  	"version_horario" varchar,
  	"version_obs" varchar,
  	"version_lat" numeric,
  	"version_lng" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__rede_protecao_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "depoimentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"frase" varchar,
  	"autor" varchar,
  	"papel" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_depoimentos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_depoimentos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_frase" varchar,
  	"version_autor" varchar,
  	"version_papel" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__depoimentos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "destaques" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"titulo" varchar,
  	"texto" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"tema" "enum_destaques_tema" DEFAULT 'cidade',
  	"ordem" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_destaques_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_destaques_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kicker" varchar,
  	"version_titulo" varchar,
  	"version_texto" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_tema" "enum__destaques_v_version_tema" DEFAULT 'cidade',
  	"version_ordem" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__destaques_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pergunta" varchar,
  	"resposta" varchar,
  	"contexto" "enum_faq_contexto" DEFAULT 'ajuda',
  	"ordem" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faq_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_pergunta" varchar,
  	"version_resposta" varchar,
  	"version_contexto" "enum__faq_v_version_contexto" DEFAULT 'ajuda',
  	"version_ordem" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credito" varchar,
  	"consentimento_menor" boolean DEFAULT false,
  	"referencia_consentimento" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"noticias_id" integer,
  	"reunioes_id" integer,
  	"resolucoes_id" integer,
  	"editais_id" integer,
  	"entidades_id" integer,
  	"rede_protecao_id" integer,
  	"depoimentos_id" integer,
  	"destaques_id" integer,
  	"faq_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "configuracoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome_conselho" varchar DEFAULT 'CMDCA Pindamonhangaba',
  	"municipio" varchar DEFAULT 'Pindamonhangaba/SP',
  	"contato_email" varchar DEFAULT 'cmdca@pindamonhangaba.sp.gov.br',
  	"contato_telefone" varchar DEFAULT '(12) 3642-1249',
  	"contato_cep" varchar DEFAULT '12420-070',
  	"contato_casa_conselhos_telefone" varchar DEFAULT '(12) 3643-1607 / 3643-1609',
  	"contato_casa_conselhos_endereco" varchar DEFAULT '[A CONFIRMAR] — endereço exato da Casa dos Conselhos',
  	"contato_assessora" varchar DEFAULT 'Simone Braça',
  	"redes_instagram_handle" varchar DEFAULT '@cmdca_pindamonhangaba',
  	"redes_instagram_url" varchar DEFAULT 'https://www.instagram.com/cmdca_pindamonhangaba',
  	"fmdca_cnpj" varchar DEFAULT '[A CONFIRMAR]',
  	"fmdca_conta" varchar DEFAULT '[A CONFIRMAR]',
  	"fmdca_percentual_deducao_i_r" numeric DEFAULT 6,
  	"fmdca_como_destinar" varchar DEFAULT 'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.',
  	"base_legal_lei_c_m_d_c_a" varchar DEFAULT '[A CONFIRMAR]',
  	"base_legal_lei_f_m_d_c_a" varchar DEFAULT '[A CONFIRMAR]',
  	"base_legal_regimento" varchar DEFAULT '[A CONFIRMAR]',
  	"tribuna_url" varchar DEFAULT 'https://www.jornaltribunadonorte.com.br',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_configuracoes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_nome_conselho" varchar DEFAULT 'CMDCA Pindamonhangaba',
  	"version_municipio" varchar DEFAULT 'Pindamonhangaba/SP',
  	"version_contato_email" varchar DEFAULT 'cmdca@pindamonhangaba.sp.gov.br',
  	"version_contato_telefone" varchar DEFAULT '(12) 3642-1249',
  	"version_contato_cep" varchar DEFAULT '12420-070',
  	"version_contato_casa_conselhos_telefone" varchar DEFAULT '(12) 3643-1607 / 3643-1609',
  	"version_contato_casa_conselhos_endereco" varchar DEFAULT '[A CONFIRMAR] — endereço exato da Casa dos Conselhos',
  	"version_contato_assessora" varchar DEFAULT 'Simone Braça',
  	"version_redes_instagram_handle" varchar DEFAULT '@cmdca_pindamonhangaba',
  	"version_redes_instagram_url" varchar DEFAULT 'https://www.instagram.com/cmdca_pindamonhangaba',
  	"version_fmdca_cnpj" varchar DEFAULT '[A CONFIRMAR]',
  	"version_fmdca_conta" varchar DEFAULT '[A CONFIRMAR]',
  	"version_fmdca_percentual_deducao_i_r" numeric DEFAULT 6,
  	"version_fmdca_como_destinar" varchar DEFAULT 'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.',
  	"version_base_legal_lei_c_m_d_c_a" varchar DEFAULT '[A CONFIRMAR]',
  	"version_base_legal_lei_f_m_d_c_a" varchar DEFAULT '[A CONFIRMAR]',
  	"version_base_legal_regimento" varchar DEFAULT '[A CONFIRMAR]',
  	"version_tribuna_url" varchar DEFAULT 'https://www.jornaltribunadonorte.com.br',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pagina_inicial_blocos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tipo" "enum_pagina_inicial_blocos_tipo" NOT NULL,
  	"ativo" boolean DEFAULT true
  );
  
  CREATE TABLE "pagina_inicial" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pagina_inicial_v_version_blocos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tipo" "enum__pagina_inicial_v_version_blocos_tipo" NOT NULL,
  	"ativo" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pagina_inicial_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "indicadores_serie_anual" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ano" varchar NOT NULL,
  	"valor" numeric NOT NULL
  );
  
  CREATE TABLE "indicadores_aplicacao_por_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL,
  	"percentual" numeric NOT NULL
  );
  
  CREATE TABLE "indicadores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alcancados" numeric DEFAULT 0,
  	"projetos" numeric DEFAULT 0,
  	"entidades" numeric DEFAULT 0,
  	"reunioes_no_ano" numeric DEFAULT 0,
  	"observacao" varchar DEFAULT 'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_indicadores_v_version_serie_anual" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ano" varchar NOT NULL,
  	"valor" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_indicadores_v_version_aplicacao_por_area" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL,
  	"percentual" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_indicadores_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_alcancados" numeric DEFAULT 0,
  	"version_projetos" numeric DEFAULT 0,
  	"version_entidades" numeric DEFAULT 0,
  	"version_reunioes_no_ano" numeric DEFAULT 0,
  	"version_observacao" varchar DEFAULT 'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_capa_id_media_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_capa_id_media_id_fk" FOREIGN KEY ("version_capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_ata_id_media_id_fk" FOREIGN KEY ("ata_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reunioes_v" ADD CONSTRAINT "_reunioes_v_parent_id_reunioes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reunioes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reunioes_v" ADD CONSTRAINT "_reunioes_v_version_ata_id_media_id_fk" FOREIGN KEY ("version_ata_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resolucoes" ADD CONSTRAINT "resolucoes_arquivo_id_media_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resolucoes_v" ADD CONSTRAINT "_resolucoes_v_parent_id_resolucoes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resolucoes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resolucoes_v" ADD CONSTRAINT "_resolucoes_v_version_arquivo_id_media_id_fk" FOREIGN KEY ("version_arquivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "editais" ADD CONSTRAINT "editais_arquivo_id_media_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_editais_v" ADD CONSTRAINT "_editais_v_parent_id_editais_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."editais"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_editais_v" ADD CONSTRAINT "_editais_v_version_arquivo_id_media_id_fk" FOREIGN KEY ("version_arquivo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entidades_rels" ADD CONSTRAINT "entidades_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entidades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entidades_rels" ADD CONSTRAINT "entidades_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_entidades_v" ADD CONSTRAINT "_entidades_v_parent_id_entidades_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entidades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_entidades_v_rels" ADD CONSTRAINT "_entidades_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_entidades_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_entidades_v_rels" ADD CONSTRAINT "_entidades_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rede_protecao_v" ADD CONSTRAINT "_rede_protecao_v_parent_id_rede_protecao_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."rede_protecao"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_depoimentos_v" ADD CONSTRAINT "_depoimentos_v_parent_id_depoimentos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."depoimentos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destaques_v" ADD CONSTRAINT "_destaques_v_parent_id_destaques_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destaques"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_parent_id_faq_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reunioes_fk" FOREIGN KEY ("reunioes_id") REFERENCES "public"."reunioes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resolucoes_fk" FOREIGN KEY ("resolucoes_id") REFERENCES "public"."resolucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editais_fk" FOREIGN KEY ("editais_id") REFERENCES "public"."editais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entidades_fk" FOREIGN KEY ("entidades_id") REFERENCES "public"."entidades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rede_protecao_fk" FOREIGN KEY ("rede_protecao_id") REFERENCES "public"."rede_protecao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_depoimentos_fk" FOREIGN KEY ("depoimentos_id") REFERENCES "public"."depoimentos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destaques_fk" FOREIGN KEY ("destaques_id") REFERENCES "public"."destaques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pagina_inicial_blocos" ADD CONSTRAINT "pagina_inicial_blocos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pagina_inicial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pagina_inicial_v_version_blocos" ADD CONSTRAINT "_pagina_inicial_v_version_blocos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pagina_inicial_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicadores_serie_anual" ADD CONSTRAINT "indicadores_serie_anual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."indicadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "indicadores_aplicacao_por_area" ADD CONSTRAINT "indicadores_aplicacao_por_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."indicadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_indicadores_v_version_serie_anual" ADD CONSTRAINT "_indicadores_v_version_serie_anual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_indicadores_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_indicadores_v_version_aplicacao_por_area" ADD CONSTRAINT "_indicadores_v_version_aplicacao_por_area_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_indicadores_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX "noticias_capa_idx" ON "noticias" USING btree ("capa_id");
  CREATE INDEX "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE INDEX "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX "_noticias_v_version_version_capa_idx" ON "_noticias_v" USING btree ("version_capa_id");
  CREATE INDEX "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  CREATE INDEX "reunioes_ata_idx" ON "reunioes" USING btree ("ata_id");
  CREATE INDEX "reunioes_updated_at_idx" ON "reunioes" USING btree ("updated_at");
  CREATE INDEX "reunioes_created_at_idx" ON "reunioes" USING btree ("created_at");
  CREATE INDEX "reunioes__status_idx" ON "reunioes" USING btree ("_status");
  CREATE INDEX "_reunioes_v_parent_idx" ON "_reunioes_v" USING btree ("parent_id");
  CREATE INDEX "_reunioes_v_version_version_ata_idx" ON "_reunioes_v" USING btree ("version_ata_id");
  CREATE INDEX "_reunioes_v_version_version_updated_at_idx" ON "_reunioes_v" USING btree ("version_updated_at");
  CREATE INDEX "_reunioes_v_version_version_created_at_idx" ON "_reunioes_v" USING btree ("version_created_at");
  CREATE INDEX "_reunioes_v_version_version__status_idx" ON "_reunioes_v" USING btree ("version__status");
  CREATE INDEX "_reunioes_v_created_at_idx" ON "_reunioes_v" USING btree ("created_at");
  CREATE INDEX "_reunioes_v_updated_at_idx" ON "_reunioes_v" USING btree ("updated_at");
  CREATE INDEX "_reunioes_v_latest_idx" ON "_reunioes_v" USING btree ("latest");
  CREATE INDEX "resolucoes_arquivo_idx" ON "resolucoes" USING btree ("arquivo_id");
  CREATE INDEX "resolucoes_updated_at_idx" ON "resolucoes" USING btree ("updated_at");
  CREATE INDEX "resolucoes_created_at_idx" ON "resolucoes" USING btree ("created_at");
  CREATE INDEX "resolucoes__status_idx" ON "resolucoes" USING btree ("_status");
  CREATE INDEX "_resolucoes_v_parent_idx" ON "_resolucoes_v" USING btree ("parent_id");
  CREATE INDEX "_resolucoes_v_version_version_arquivo_idx" ON "_resolucoes_v" USING btree ("version_arquivo_id");
  CREATE INDEX "_resolucoes_v_version_version_updated_at_idx" ON "_resolucoes_v" USING btree ("version_updated_at");
  CREATE INDEX "_resolucoes_v_version_version_created_at_idx" ON "_resolucoes_v" USING btree ("version_created_at");
  CREATE INDEX "_resolucoes_v_version_version__status_idx" ON "_resolucoes_v" USING btree ("version__status");
  CREATE INDEX "_resolucoes_v_created_at_idx" ON "_resolucoes_v" USING btree ("created_at");
  CREATE INDEX "_resolucoes_v_updated_at_idx" ON "_resolucoes_v" USING btree ("updated_at");
  CREATE INDEX "_resolucoes_v_latest_idx" ON "_resolucoes_v" USING btree ("latest");
  CREATE INDEX "editais_arquivo_idx" ON "editais" USING btree ("arquivo_id");
  CREATE INDEX "editais_updated_at_idx" ON "editais" USING btree ("updated_at");
  CREATE INDEX "editais_created_at_idx" ON "editais" USING btree ("created_at");
  CREATE INDEX "editais__status_idx" ON "editais" USING btree ("_status");
  CREATE INDEX "_editais_v_parent_idx" ON "_editais_v" USING btree ("parent_id");
  CREATE INDEX "_editais_v_version_version_arquivo_idx" ON "_editais_v" USING btree ("version_arquivo_id");
  CREATE INDEX "_editais_v_version_version_updated_at_idx" ON "_editais_v" USING btree ("version_updated_at");
  CREATE INDEX "_editais_v_version_version_created_at_idx" ON "_editais_v" USING btree ("version_created_at");
  CREATE INDEX "_editais_v_version_version__status_idx" ON "_editais_v" USING btree ("version__status");
  CREATE INDEX "_editais_v_created_at_idx" ON "_editais_v" USING btree ("created_at");
  CREATE INDEX "_editais_v_updated_at_idx" ON "_editais_v" USING btree ("updated_at");
  CREATE INDEX "_editais_v_latest_idx" ON "_editais_v" USING btree ("latest");
  CREATE INDEX "entidades_updated_at_idx" ON "entidades" USING btree ("updated_at");
  CREATE INDEX "entidades_created_at_idx" ON "entidades" USING btree ("created_at");
  CREATE INDEX "entidades__status_idx" ON "entidades" USING btree ("_status");
  CREATE INDEX "entidades_rels_order_idx" ON "entidades_rels" USING btree ("order");
  CREATE INDEX "entidades_rels_parent_idx" ON "entidades_rels" USING btree ("parent_id");
  CREATE INDEX "entidades_rels_path_idx" ON "entidades_rels" USING btree ("path");
  CREATE INDEX "entidades_rels_media_id_idx" ON "entidades_rels" USING btree ("media_id");
  CREATE INDEX "_entidades_v_parent_idx" ON "_entidades_v" USING btree ("parent_id");
  CREATE INDEX "_entidades_v_version_version_updated_at_idx" ON "_entidades_v" USING btree ("version_updated_at");
  CREATE INDEX "_entidades_v_version_version_created_at_idx" ON "_entidades_v" USING btree ("version_created_at");
  CREATE INDEX "_entidades_v_version_version__status_idx" ON "_entidades_v" USING btree ("version__status");
  CREATE INDEX "_entidades_v_created_at_idx" ON "_entidades_v" USING btree ("created_at");
  CREATE INDEX "_entidades_v_updated_at_idx" ON "_entidades_v" USING btree ("updated_at");
  CREATE INDEX "_entidades_v_latest_idx" ON "_entidades_v" USING btree ("latest");
  CREATE INDEX "_entidades_v_rels_order_idx" ON "_entidades_v_rels" USING btree ("order");
  CREATE INDEX "_entidades_v_rels_parent_idx" ON "_entidades_v_rels" USING btree ("parent_id");
  CREATE INDEX "_entidades_v_rels_path_idx" ON "_entidades_v_rels" USING btree ("path");
  CREATE INDEX "_entidades_v_rels_media_id_idx" ON "_entidades_v_rels" USING btree ("media_id");
  CREATE INDEX "rede_protecao_updated_at_idx" ON "rede_protecao" USING btree ("updated_at");
  CREATE INDEX "rede_protecao_created_at_idx" ON "rede_protecao" USING btree ("created_at");
  CREATE INDEX "rede_protecao__status_idx" ON "rede_protecao" USING btree ("_status");
  CREATE INDEX "_rede_protecao_v_parent_idx" ON "_rede_protecao_v" USING btree ("parent_id");
  CREATE INDEX "_rede_protecao_v_version_version_updated_at_idx" ON "_rede_protecao_v" USING btree ("version_updated_at");
  CREATE INDEX "_rede_protecao_v_version_version_created_at_idx" ON "_rede_protecao_v" USING btree ("version_created_at");
  CREATE INDEX "_rede_protecao_v_version_version__status_idx" ON "_rede_protecao_v" USING btree ("version__status");
  CREATE INDEX "_rede_protecao_v_created_at_idx" ON "_rede_protecao_v" USING btree ("created_at");
  CREATE INDEX "_rede_protecao_v_updated_at_idx" ON "_rede_protecao_v" USING btree ("updated_at");
  CREATE INDEX "_rede_protecao_v_latest_idx" ON "_rede_protecao_v" USING btree ("latest");
  CREATE INDEX "depoimentos_updated_at_idx" ON "depoimentos" USING btree ("updated_at");
  CREATE INDEX "depoimentos_created_at_idx" ON "depoimentos" USING btree ("created_at");
  CREATE INDEX "depoimentos__status_idx" ON "depoimentos" USING btree ("_status");
  CREATE INDEX "_depoimentos_v_parent_idx" ON "_depoimentos_v" USING btree ("parent_id");
  CREATE INDEX "_depoimentos_v_version_version_updated_at_idx" ON "_depoimentos_v" USING btree ("version_updated_at");
  CREATE INDEX "_depoimentos_v_version_version_created_at_idx" ON "_depoimentos_v" USING btree ("version_created_at");
  CREATE INDEX "_depoimentos_v_version_version__status_idx" ON "_depoimentos_v" USING btree ("version__status");
  CREATE INDEX "_depoimentos_v_created_at_idx" ON "_depoimentos_v" USING btree ("created_at");
  CREATE INDEX "_depoimentos_v_updated_at_idx" ON "_depoimentos_v" USING btree ("updated_at");
  CREATE INDEX "_depoimentos_v_latest_idx" ON "_depoimentos_v" USING btree ("latest");
  CREATE INDEX "destaques_updated_at_idx" ON "destaques" USING btree ("updated_at");
  CREATE INDEX "destaques_created_at_idx" ON "destaques" USING btree ("created_at");
  CREATE INDEX "destaques__status_idx" ON "destaques" USING btree ("_status");
  CREATE INDEX "_destaques_v_parent_idx" ON "_destaques_v" USING btree ("parent_id");
  CREATE INDEX "_destaques_v_version_version_updated_at_idx" ON "_destaques_v" USING btree ("version_updated_at");
  CREATE INDEX "_destaques_v_version_version_created_at_idx" ON "_destaques_v" USING btree ("version_created_at");
  CREATE INDEX "_destaques_v_version_version__status_idx" ON "_destaques_v" USING btree ("version__status");
  CREATE INDEX "_destaques_v_created_at_idx" ON "_destaques_v" USING btree ("created_at");
  CREATE INDEX "_destaques_v_updated_at_idx" ON "_destaques_v" USING btree ("updated_at");
  CREATE INDEX "_destaques_v_latest_idx" ON "_destaques_v" USING btree ("latest");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "faq__status_idx" ON "faq" USING btree ("_status");
  CREATE INDEX "_faq_v_parent_idx" ON "_faq_v" USING btree ("parent_id");
  CREATE INDEX "_faq_v_version_version_updated_at_idx" ON "_faq_v" USING btree ("version_updated_at");
  CREATE INDEX "_faq_v_version_version_created_at_idx" ON "_faq_v" USING btree ("version_created_at");
  CREATE INDEX "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");
  CREATE INDEX "payload_locked_documents_rels_reunioes_id_idx" ON "payload_locked_documents_rels" USING btree ("reunioes_id");
  CREATE INDEX "payload_locked_documents_rels_resolucoes_id_idx" ON "payload_locked_documents_rels" USING btree ("resolucoes_id");
  CREATE INDEX "payload_locked_documents_rels_editais_id_idx" ON "payload_locked_documents_rels" USING btree ("editais_id");
  CREATE INDEX "payload_locked_documents_rels_entidades_id_idx" ON "payload_locked_documents_rels" USING btree ("entidades_id");
  CREATE INDEX "payload_locked_documents_rels_rede_protecao_id_idx" ON "payload_locked_documents_rels" USING btree ("rede_protecao_id");
  CREATE INDEX "payload_locked_documents_rels_depoimentos_id_idx" ON "payload_locked_documents_rels" USING btree ("depoimentos_id");
  CREATE INDEX "payload_locked_documents_rels_destaques_id_idx" ON "payload_locked_documents_rels" USING btree ("destaques_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "_configuracoes_v_created_at_idx" ON "_configuracoes_v" USING btree ("created_at");
  CREATE INDEX "_configuracoes_v_updated_at_idx" ON "_configuracoes_v" USING btree ("updated_at");
  CREATE INDEX "pagina_inicial_blocos_order_idx" ON "pagina_inicial_blocos" USING btree ("_order");
  CREATE INDEX "pagina_inicial_blocos_parent_id_idx" ON "pagina_inicial_blocos" USING btree ("_parent_id");
  CREATE INDEX "_pagina_inicial_v_version_blocos_order_idx" ON "_pagina_inicial_v_version_blocos" USING btree ("_order");
  CREATE INDEX "_pagina_inicial_v_version_blocos_parent_id_idx" ON "_pagina_inicial_v_version_blocos" USING btree ("_parent_id");
  CREATE INDEX "_pagina_inicial_v_created_at_idx" ON "_pagina_inicial_v" USING btree ("created_at");
  CREATE INDEX "_pagina_inicial_v_updated_at_idx" ON "_pagina_inicial_v" USING btree ("updated_at");
  CREATE INDEX "indicadores_serie_anual_order_idx" ON "indicadores_serie_anual" USING btree ("_order");
  CREATE INDEX "indicadores_serie_anual_parent_id_idx" ON "indicadores_serie_anual" USING btree ("_parent_id");
  CREATE INDEX "indicadores_aplicacao_por_area_order_idx" ON "indicadores_aplicacao_por_area" USING btree ("_order");
  CREATE INDEX "indicadores_aplicacao_por_area_parent_id_idx" ON "indicadores_aplicacao_por_area" USING btree ("_parent_id");
  CREATE INDEX "_indicadores_v_version_serie_anual_order_idx" ON "_indicadores_v_version_serie_anual" USING btree ("_order");
  CREATE INDEX "_indicadores_v_version_serie_anual_parent_id_idx" ON "_indicadores_v_version_serie_anual" USING btree ("_parent_id");
  CREATE INDEX "_indicadores_v_version_aplicacao_por_area_order_idx" ON "_indicadores_v_version_aplicacao_por_area" USING btree ("_order");
  CREATE INDEX "_indicadores_v_version_aplicacao_por_area_parent_id_idx" ON "_indicadores_v_version_aplicacao_por_area" USING btree ("_parent_id");
  CREATE INDEX "_indicadores_v_created_at_idx" ON "_indicadores_v" USING btree ("created_at");
  CREATE INDEX "_indicadores_v_updated_at_idx" ON "_indicadores_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "noticias" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  DROP TABLE "reunioes" CASCADE;
  DROP TABLE "_reunioes_v" CASCADE;
  DROP TABLE "resolucoes" CASCADE;
  DROP TABLE "_resolucoes_v" CASCADE;
  DROP TABLE "editais" CASCADE;
  DROP TABLE "_editais_v" CASCADE;
  DROP TABLE "entidades" CASCADE;
  DROP TABLE "entidades_rels" CASCADE;
  DROP TABLE "_entidades_v" CASCADE;
  DROP TABLE "_entidades_v_rels" CASCADE;
  DROP TABLE "rede_protecao" CASCADE;
  DROP TABLE "_rede_protecao_v" CASCADE;
  DROP TABLE "depoimentos" CASCADE;
  DROP TABLE "_depoimentos_v" CASCADE;
  DROP TABLE "destaques" CASCADE;
  DROP TABLE "_destaques_v" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "configuracoes" CASCADE;
  DROP TABLE "_configuracoes_v" CASCADE;
  DROP TABLE "pagina_inicial_blocos" CASCADE;
  DROP TABLE "pagina_inicial" CASCADE;
  DROP TABLE "_pagina_inicial_v_version_blocos" CASCADE;
  DROP TABLE "_pagina_inicial_v" CASCADE;
  DROP TABLE "indicadores_serie_anual" CASCADE;
  DROP TABLE "indicadores_aplicacao_por_area" CASCADE;
  DROP TABLE "indicadores" CASCADE;
  DROP TABLE "_indicadores_v_version_serie_anual" CASCADE;
  DROP TABLE "_indicadores_v_version_aplicacao_por_area" CASCADE;
  DROP TABLE "_indicadores_v" CASCADE;
  DROP TYPE "public"."enum_noticias_categoria";
  DROP TYPE "public"."enum_noticias_tema";
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_categoria";
  DROP TYPE "public"."enum__noticias_v_version_tema";
  DROP TYPE "public"."enum__noticias_v_version_status";
  DROP TYPE "public"."enum_reunioes_tipo";
  DROP TYPE "public"."enum_reunioes_status";
  DROP TYPE "public"."enum__reunioes_v_version_tipo";
  DROP TYPE "public"."enum__reunioes_v_version_status";
  DROP TYPE "public"."enum_resolucoes_status";
  DROP TYPE "public"."enum__resolucoes_v_version_status";
  DROP TYPE "public"."enum_editais_tipo";
  DROP TYPE "public"."enum_editais_status";
  DROP TYPE "public"."enum__editais_v_version_tipo";
  DROP TYPE "public"."enum__editais_v_version_status";
  DROP TYPE "public"."enum_entidades_area";
  DROP TYPE "public"."enum_entidades_status";
  DROP TYPE "public"."enum__entidades_v_version_area";
  DROP TYPE "public"."enum__entidades_v_version_status";
  DROP TYPE "public"."enum_rede_protecao_tipo";
  DROP TYPE "public"."enum_rede_protecao_status";
  DROP TYPE "public"."enum__rede_protecao_v_version_tipo";
  DROP TYPE "public"."enum__rede_protecao_v_version_status";
  DROP TYPE "public"."enum_depoimentos_status";
  DROP TYPE "public"."enum__depoimentos_v_version_status";
  DROP TYPE "public"."enum_destaques_tema";
  DROP TYPE "public"."enum_destaques_status";
  DROP TYPE "public"."enum__destaques_v_version_tema";
  DROP TYPE "public"."enum__destaques_v_version_status";
  DROP TYPE "public"."enum_faq_contexto";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_contexto";
  DROP TYPE "public"."enum__faq_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pagina_inicial_blocos_tipo";
  DROP TYPE "public"."enum__pagina_inicial_v_version_blocos_tipo";`)
}
