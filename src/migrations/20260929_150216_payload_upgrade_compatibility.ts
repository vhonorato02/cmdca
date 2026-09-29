import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "noticias" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_noticias_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "reunioes" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "resolucoes" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_resolucoes_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "editais" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_editais_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "entidades" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_entidades_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "rede_protecao" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_rede_protecao_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "depoimentos" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_depoimentos_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "faq" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_faq_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "media" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_media_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_controle_editorial_status_revisao" DROP DEFAULT;
  ALTER TABLE "indicadores" ALTER COLUMN "status_revisao" DROP DEFAULT;
  ALTER TABLE "_indicadores_v" ALTER COLUMN "version_status_revisao" DROP DEFAULT;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "_media_v" ADD COLUMN IF NOT EXISTS "version__objectkey" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "noticias" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_noticias_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "reunioes" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_reunioes_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "resolucoes" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_resolucoes_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "editais" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_editais_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "entidades" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_entidades_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "rede_protecao" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_rede_protecao_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "depoimentos" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_depoimentos_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "faq" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_faq_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "media" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_media_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "configuracoes" ALTER COLUMN "controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_controle_editorial_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "indicadores" ALTER COLUMN "status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "_indicadores_v" ALTER COLUMN "version_status_revisao" SET DEFAULT 'pendente';
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "_media_v" DROP COLUMN "version__objectkey";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";`)
}
