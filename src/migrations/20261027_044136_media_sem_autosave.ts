import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_media_v_autosave_idx";
  ALTER TABLE "_media_v" DROP COLUMN "autosave";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_media_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "_media_v_autosave_idx" ON "_media_v" USING btree ("autosave");`)
}
