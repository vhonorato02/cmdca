import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import type { Configuracoe, Resolucoe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Resoluções',
  description: 'Resoluções e atos normativos do CMDCA de Pindamonhangaba.',
}

export default async function ResolucoesPage() {
  const payload = await getPayloadClient()
  const [res, config] = await Promise.all([
    payload
      .find({
        collection: 'resolucoes',
        where: { _status: { equals: 'published' } },
        sort: '-data',
        limit: 200,
        depth: 1,
      })
      .catch(() => ({ docs: [] as Resolucoe[] })),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = res.docs as Resolucoe[]
  const tribuna = config?.tribunaUrl || 'https://www.jornaltribunadonorte.com.br'

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Atos normativos</span>
              <h2>Resoluções</h2>
              <p>
                Os atos oficiais do conselho também são publicados na{' '}
                <a href={tribuna} target="_blank" rel="noopener noreferrer">
                  Tribuna do Norte
                </a>
                .
              </p>
            </div>
          </div>
          {docs.length ? (
            docs.map((r) => {
              const arquivo = typeof r.arquivo === 'object' && r.arquivo ? r.arquivo : null
              return (
                <div className="meet" key={r.id}>
                  <div className="dt">
                    <b>{r.numero}</b>
                    <span>{r.data ? formatDate(r.data) : ''}</span>
                  </div>
                  <div className="info">
                    <h4>{r.titulo}</h4>
                  </div>
                  <div className="acts">
                    {arquivo?.url ? (
                      <a className="mini" href={arquivo.url} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    ) : null}
                    {r.linkTribuna ? (
                      <a className="mini" href={r.linkTribuna} target="_blank" rel="noopener noreferrer">
                        Tribuna
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>Nenhuma resolução publicada até o momento.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
