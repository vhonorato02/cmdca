import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "noticias" ADD COLUMN "declaracao_protecao" boolean DEFAULT false;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_declaracao_protecao" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "situacao_protegida" boolean DEFAULT false;
  ALTER TABLE "_media_v" ADD COLUMN "version_situacao_protegida" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "noticias" DROP COLUMN "declaracao_protecao";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_declaracao_protecao";
  ALTER TABLE "media" DROP COLUMN "situacao_protegida";
  ALTER TABLE "_media_v" DROP COLUMN "version_situacao_protegida";`)
}
