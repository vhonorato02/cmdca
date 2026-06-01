import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "configuracoes" ADD COLUMN "diretoria_gestao_label" varchar DEFAULT 'Gestão 2025–2027';
  ALTER TABLE "configuracoes" ADD COLUMN "diretoria_presidente_nome" varchar DEFAULT 'Dr. Rodolfo Brockhof';
  ALTER TABLE "configuracoes" ADD COLUMN "diretoria_presidente_cargo" varchar DEFAULT 'Presidente';
  ALTER TABLE "configuracoes" ADD COLUMN "diretoria_vice_nome" varchar DEFAULT 'Andrea Campos Sales Martins';
  ALTER TABLE "configuracoes" ADD COLUMN "diretoria_vice_cargo" varchar DEFAULT 'Vice-presidente';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_diretoria_gestao_label" varchar DEFAULT 'Gestão 2025–2027';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_diretoria_presidente_nome" varchar DEFAULT 'Dr. Rodolfo Brockhof';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_diretoria_presidente_cargo" varchar DEFAULT 'Presidente';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_diretoria_vice_nome" varchar DEFAULT 'Andrea Campos Sales Martins';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_diretoria_vice_cargo" varchar DEFAULT 'Vice-presidente';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "configuracoes" DROP COLUMN "diretoria_gestao_label";
  ALTER TABLE "configuracoes" DROP COLUMN "diretoria_presidente_nome";
  ALTER TABLE "configuracoes" DROP COLUMN "diretoria_presidente_cargo";
  ALTER TABLE "configuracoes" DROP COLUMN "diretoria_vice_nome";
  ALTER TABLE "configuracoes" DROP COLUMN "diretoria_vice_cargo";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_diretoria_gestao_label";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_diretoria_presidente_nome";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_diretoria_presidente_cargo";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_diretoria_vice_nome";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_diretoria_vice_cargo";`)
}
