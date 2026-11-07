import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { lexical } from '../content/lexical'
import { PAGINAS_PADRAO } from '../content/paginas'

// Só conteúdo: a página de Créditos passa a citar a foto livre da capa e a fonte
// Newsreader (redesign de 07/11/2026). Reescreve apenas se ainda estiver com o
// texto semeado em 26/10 (cita a Archivo); uma versão editada no painel fica como está.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const pagina = PAGINAS_PADRAO.find((p) => p.slug === 'creditos')
  if (!pagina) return
  const existing = await payload.find({
    collection: 'paginas',
    where: { slug: { equals: 'creditos' } },
    limit: 1,
    depth: 0,
    req,
  })
  const doc = existing.docs[0]
  if (!doc || !JSON.stringify(doc.corpo ?? '').includes('Archivo')) return
  await payload.update({
    collection: 'paginas',
    id: doc.id,
    data: {
      resumo: pagina.resumo,
      atualizadoEm: pagina.atualizadoEm,
      corpo: lexical(pagina.blocos),
      controleEditorial: {
        fonte: 'Texto institucional do portal do CMDCA (versão de 07/11/2026)',
        verificadoEm: pagina.atualizadoEm,
      },
      _status: 'published',
    },
    req,
  })
}

// Sem volta automática: o texto anterior continua no histórico de versões da página.
export async function down(_args: MigrateDownArgs): Promise<void> {}
