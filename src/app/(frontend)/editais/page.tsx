import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import type { Configuracoe, Editai } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Editais',
  description: 'Editais, chamamentos públicos e processos de escolha do CMDCA de Pindamonhangaba.',
}

const TIPO_LABEL: Record<string, string> = {
  chamamento: 'Chamamento público',
  conselho_tutelar: 'Conselho Tutelar',
  fmdca: 'FMDCA',
  outro: 'Outro',
}

export default async function EditaisPage() {
  const payload = await getPayloadClient()
  const [res, config] = await Promise.all([
    payload
      .find({
        collection: 'editais',
        where: { _status: { equals: 'published' } },
        sort: '-data',
        limit: 200,
        depth: 1,
      })
      .catch(() => ({ docs: [] as Editai[] })),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = res.docs as Editai[]
  const tribuna = config?.tribunaUrl || 'https://www.jornaltribunadonorte.com.br'

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Chamamentos e processos</span>
              <h1>Editais</h1>
              <p>
                Publicados também na{' '}
                <a href={tribuna} target="_blank" rel="noopener noreferrer">
                  Tribuna do Norte
                </a>
                .
              </p>
            </div>
          </div>
          {docs.length ? (
            docs.map((e) => {
              const arquivo = typeof e.arquivo === 'object' && e.arquivo ? e.arquivo : null
              return (
                <div className="meet" key={e.id}>
                  <div className="dt">
                    <b>{e.numero || '—'}</b>
                    <span>{e.data ? formatDate(e.data) : ''}</span>
                  </div>
                  <div className="info">
                    <h4>
                      {e.titulo} <span className="pill ord">{TIPO_LABEL[e.tipo] || 'Edital'}</span>
                    </h4>
                    {e.prazo ? <div className="meta">Prazo: {formatDate(e.prazo)}</div> : null}
                  </div>
                  <div className="acts">
                    {arquivo?.url ? (
                      <a className="mini" href={arquivo.url} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    ) : null}
                    {e.linkTribuna ? (
                      <a className="mini" href={e.linkTribuna} target="_blank" rel="noopener noreferrer">
                        Tribuna
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>Nenhum edital publicado até o momento.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
