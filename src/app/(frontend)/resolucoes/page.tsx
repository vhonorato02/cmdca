import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'
import type { Configuracoe, Resolucoe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Resoluções do CMDCA de Pindamonhangaba | Atos Oficiais',
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
      })
      .catch(() => ({ docs: [] as Resolucoe[] })),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null as Configuracoe | null),
  ])
  const docs = (res.docs as Resolucoe[]).filter(
    (item) => publicText(item.numero) && publicText(item.titulo),
  )
  const tribuna = publicHref(config?.tribunaUrl) || 'https://www.jornaltribunadonorte.com.br'

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Atos normativos</span>
              <h1>Resoluções</h1>
              <p>
                Consulte o documento anexado e, quando disponível, o link direto para a publicação
                oficial. Para pesquisar outras edições, acesse o portal da{' '}
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
              const numero = publicText(r.numero) as string
              const titulo = publicText(r.titulo) as string
              const linkTribuna = publicHref(r.linkTribuna)
              const arquivoUrl = publicHref(arquivo?.url)
              return (
                <div className="meet" key={r.id}>
                  <div className="dt">
                    <b>{numero}</b>
                    <span>{r.data ? formatDate(r.data) : ''}</span>
                  </div>
                  <div className="info">
                    <h4>{titulo}</h4>
                  </div>
                  <div className="acts">
                    {arquivoUrl ? (
                      <a
                        className="mini"
                        href={arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir PDF da resolução ${numero}: ${titulo}`}
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
                        aria-label={`Ver publicação oficial da resolução ${numero}`}
                      >
                        Publicação oficial
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>Nenhuma resolução publicada até o momento.</p>
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
