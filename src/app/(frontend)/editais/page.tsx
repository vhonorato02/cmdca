import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
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
      })
      .catch(() => ({ docs: [] as Editai[] })),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = (res.docs as Editai[]).filter((item) => publicText(item.titulo))
  const tribuna = publicHref(config?.tribunaUrl) || 'https://www.jornaltribunadonorte.com.br'

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Chamamentos e processos</span>
              <h1>Editais</h1>
              <p>
                Confira o documento, os anexos, os prazos e as retificações. Quando houver link,
                prefira a publicação oficial. Para pesquisar outras edições, acesse a{' '}
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
              const titulo = publicText(e.titulo) as string
              const numero = publicText(e.numero)
              const linkTribuna = publicHref(e.linkTribuna)
              const arquivoUrl = publicHref(arquivo?.url)
              return (
                <div className="meet" key={e.id}>
                  <div className="dt">
                    <b>{numero || 'Edital'}</b>
                    <span>{e.data ? formatDate(e.data) : ''}</span>
                  </div>
                  <div className="info">
                    <h4>
                      {titulo} <span className="pill ord">{TIPO_LABEL[e.tipo] || 'Edital'}</span>
                    </h4>
                    {e.prazo ? <div className="meta">Prazo: {formatDate(e.prazo)}</div> : null}
                  </div>
                  <div className="acts">
                    {arquivoUrl ? (
                      <a
                        className="mini"
                        href={arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir PDF do edital${numero ? ` ${numero}` : ''}: ${titulo}`}
                      >
                        Abrir PDF
                      </a>
                    ) : null}
                    {linkTribuna ? (
                      <a
                        className="mini"
                        href={linkTribuna}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver publicação oficial do edital${numero ? ` ${numero}` : ''}`}
                      >
                        Publicação oficial
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })
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
