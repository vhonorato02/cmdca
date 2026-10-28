import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Contas existentes não são forçadas a trocar a senha (DEFAULT false); contas novas
// recebem "true" pelo próprio Payload (defaultValue do campo e hook de Users).
// As colunas antigas de chave do R2 (_objectkey) ficam: removê-las agora quebraria
// o rollback para imagens anteriores (expandir/contrair, ver DEPLOY.md).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trocar_senha" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "trocar_senha";`)
}
