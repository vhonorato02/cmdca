import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCard } from '@/components/NewsCard'
import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Conferências e Fóruns | Direitos de Crianças e Adolescentes',
  description:
    'Consulte notícias, documentos e convocações publicadas sobre conferências e fóruns de direitos em Pindamonhangaba.',
  path: '/conferencias',
})

const SEMANA_2025_URL =
  'https://pindamonhangaba.sp.gov.br/semana-municipal-destaca-desafios-e-avancos-na-defesa-dos-direitos-da-crianca-e-do-adolescente'

export default async function ConferenciasPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'noticias',
      where: { _status: { equals: 'published' }, categoria: { in: ['conferencia', 'evento'] } },
      sort: '-data',
      limit: 12,
      depth: 1,
    })
    .catch(() => ({ docs: [] as Noticia[] }))
  const relacionadas = (res.docs as Noticia[]).filter(
    (item) =>
      publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
  )

  return (
    <>
      <Hero
        deep
        eyebrow="Mobilização"
        titulo="Conferências e Fóruns"
        texto="Espaços públicos para debater prioridades e formular propostas para a política municipal de direitos."
      />

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">Participação social</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Acompanhe convocações, documentos e registros publicados.
                </h2>
                <p>
                  Conferências e fóruns reúnem poder público e sociedade civil para avaliar políticas,
                  debater prioridades e formular diretrizes. Uma nova edição só aparece neste site
                  após a publicação de convocação, data, local e programação nos canais oficiais.
                </p>
                <p style={{ marginTop: 16 }}>
                  Consulte os <Link href="/editais">editais</Link> e as{' '}
                  <Link href="/noticias">notícias</Link> para verificar convocações vigentes.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Registro histórico — 2025</span>
                <p style={{ marginTop: 8, color: 'var(--ink-2)', fontSize: '.92rem' }}>
                  De <b>22 a 26 de setembro de 2025</b>, a Semana Municipal dos Direitos da Criança
                  e do Adolescente ocorreu no Centro Social Salesiano, marcando os 35 anos do ECA,
                  com a Camerata Jovem do Projeto Jataí.
                </p>
                <a
                  className="mini"
                  href={SEMANA_2025_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', marginTop: 14 }}
                >
                  Ler a notícia oficial de 2025
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {relacionadas.length ? (
        <section className="band">
          <div className="wrap">
            <Reveal>
              <div className="sec-head">
                <div>
                  <span className="eyebrow">Relacionado</span>
                  <h2>Notícias de conferências e eventos</h2>
                </div>
              </div>
              <div className="news-list">
                {relacionadas.map((n) => (
                  <NewsCard key={n.id} noticia={n} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  )
}
