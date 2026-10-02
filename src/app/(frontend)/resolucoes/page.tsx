import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { amendedBy, relatedActs, RESOLUCAO_SITUACAO, statusInfo } from '@/components/officialActs'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'
import type { Configuracoe, Resolucoe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Resoluções do CMDCA | Atos Oficiais',
  description:
    'Consulte resoluções do CMDCA por número, data e assunto, com documento e publicação oficial quando disponíveis.',
  path: '/resolucoes',
})

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
      }),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = (res.docs as Resolucoe[]).filter(
    (item) => publicText(item.numero) && publicText(item.titulo),
  )
  const tribuna = publicHref(config?.tribunaUrl) || 'https://www.jornaltribunadonorte.com.br'
  const listedIds = new Set(docs.map((item) => item.id))
  const anchor = (id: number | string) => `resolucao-${id}`

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Atos normativos</span>
              <h1>Resoluções</h1>
              <p>
                Cada resolução mostra a situação jurídica informada pelo conselho e os atos que ela
                retifica ou altera. Consulte o documento anexado e, quando houver, o link direto
                para a publicação oficial. Para pesquisar outras edições, acesse o portal da{' '}
                <a href={tribuna} target="_blank" rel="noopener noreferrer">
                  Tribuna do Norte
                </a>
                .
              </p>
            </div>
          </div>
          {docs.length ? (
            <ul className="meeting-list">
            {docs.map((r) => {
              const arquivo = typeof r.arquivo === 'object' && r.arquivo ? r.arquivo : null
              const numero = publicText(r.numero) as string
              const titulo = publicText(r.titulo) as string
              const linkTribuna = publicHref(r.linkTribuna)
              const arquivoUrl = publicHref(arquivo?.url)
              const situacao = statusInfo(RESOLUCAO_SITUACAO, r.situacaoJuridica)
              const altera = relatedActs(r, listedIds)
              const alteradaPor = amendedBy(r, docs)
              return (
                <li className="meet" key={r.id} id={anchor(r.id)}>
                  <div className="dt">
                    <b>{numero}</b>
                    {r.data ? (
                      <time dateTime={r.data}>{formatDate(r.data)}</time>
                    ) : null}
                  </div>
                  <div className="info">
                    <h2>
                      {titulo}{' '}
                      <span className={`pill status-${situacao.tone}`}>
                        <span className="sr-only">Situação: </span>
                        {situacao.label}
                      </span>
                    </h2>
                    {altera.length ? (
                      <p className="meta">
                        Retifica ou altera:{' '}
                        {altera.map((ref, index) => (
                          <span key={ref.id}>
                            {index ? ', ' : null}
                            {ref.listed ? (
                              <a href={`#${anchor(ref.id)}`}>Resolução {ref.numero}</a>
                            ) : (
                              <>Resolução {ref.numero}</>
                            )}
                          </span>
                        ))}
                      </p>
                    ) : null}
                    {alteradaPor.length ? (
                      <p className="meta">
                        Retificada ou alterada por:{' '}
                        {alteradaPor.map((ref, index) => (
                          <span key={ref.id}>
                            {index ? ', ' : null}
                            <a href={`#${anchor(ref.id)}`}>Resolução {ref.numero}</a>
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
                        aria-label={`Abrir PDF da resolução ${numero}: ${titulo} (abre em nova aba)`}
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
                        aria-label={`Ver publicação oficial da resolução ${numero} (abre em nova aba)`}
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
            <p style={{ color: 'var(--ink-2)' }}>Não há resoluções publicadas nesta página no momento.</p>
          )}
          <p style={{ color: 'var(--ink-2)', marginTop: 24 }}>
            Consulte também as <Link href="/reunioes">reuniões e atas</Link> e os{' '}
            <Link href="/editais">editais</Link> do conselho.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
