import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { amendedBy, EDITAL_SITUACAO, relatedActs, statusInfo } from '@/components/officialActs'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'
import type { Configuracoe, Editai } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Editais do CMDCA | Prazos, Anexos e Publicações',
  description:
    'Consulte editais do CMDCA, com prazos, anexos e links para as publicações oficiais quando disponíveis.',
  path: '/editais',
})

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
      }),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = (res.docs as Editai[]).filter((item) => publicText(item.titulo))
  const tribuna = publicHref(config?.tribunaUrl) || 'https://www.jornaltribunadonorte.com.br'
  const listedIds = new Set(docs.map((item) => item.id))
  const anchor = (id: number | string) => `edital-${id}`
  const refLabel = (numero: string) => `Edital ${numero}`

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Chamamentos e processos</span>
              <h1>Editais</h1>
              <p>
                Cada edital mostra a situação informada pelo conselho, o prazo e as retificações
                relacionadas. Quando houver link, prefira a publicação oficial. Para pesquisar
                outras edições, acesse a{' '}
                <a href={tribuna} target="_blank" rel="noopener noreferrer">
                  Tribuna do Norte
                </a>
                .
              </p>
            </div>
          </div>
          {docs.length ? (
            <ul className="meeting-list">
            {docs.map((e) => {
              const arquivo = typeof e.arquivo === 'object' && e.arquivo ? e.arquivo : null
              const titulo = publicText(e.titulo) as string
              const numero = publicText(e.numero)
              const linkTribuna = publicHref(e.linkTribuna)
              const arquivoUrl = publicHref(arquivo?.url)
              const situacao = statusInfo(EDITAL_SITUACAO, e.situacaoJuridica)
              const retifica = relatedActs(e, listedIds)
              const retificadoPor = amendedBy(e, docs)
              return (
                <li className="meet" key={e.id} id={anchor(e.id)}>
                  <div className="dt">
                    <b>{numero || 'Edital'}</b>
                    {e.data ? (
                      <time dateTime={e.data}>{formatDate(e.data)}</time>
                    ) : null}
                  </div>
                  <div className="info">
                    <h2>
                      {titulo} <span className="pill ord">{TIPO_LABEL[e.tipo] || 'Edital'}</span>
                      <span className={`pill status-${situacao.tone}`}>
                        <span className="sr-only">Situação: </span>
                        {situacao.label}
                      </span>
                    </h2>
                    {e.prazo ? (
                      <p className="meta">
                        Prazo final: <time dateTime={e.prazo}>{formatDate(e.prazo)}</time>
                      </p>
                    ) : null}
                    {retifica.length ? (
                      <p className="meta">
                        Retifica:{' '}
                        {retifica.map((ref, index) => (
                          <span key={ref.id}>
                            {index ? ', ' : null}
                            {ref.listed ? (
                              <a href={`#${anchor(ref.id)}`}>{refLabel(ref.numero)}</a>
                            ) : (
                              refLabel(ref.numero)
                            )}
                          </span>
                        ))}
                      </p>
                    ) : null}
                    {retificadoPor.length ? (
                      <p className="meta">
                        Retificado por:{' '}
                        {retificadoPor.map((ref, index) => (
                          <span key={ref.id}>
                            {index ? ', ' : null}
                            <a href={`#${anchor(ref.id)}`}>{refLabel(ref.numero)}</a>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>
                  <div className="acts">
                    {arquivoUrl ? (
                      <a
                        className="mini"
                        href={arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir PDF do edital${numero ? ` ${numero}` : ''}: ${titulo} (abre em nova aba)`}
                      >
                        Abrir PDF <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {linkTribuna ? (
                      <a
                        className="mini"
                        href={linkTribuna}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver publicação oficial do edital${numero ? ` ${numero}` : ''} (abre em nova aba)`}
                      >
                        Publicação oficial <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            })}
            </ul>
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>Não há editais publicados nesta página no momento.</p>
          )}
          <p style={{ color: 'var(--ink-2)', marginTop: 24 }}>
            Veja também as <Link href="/resolucoes">resoluções</Link> e a página de{' '}
            <Link href="/transparencia">transparência</Link>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
