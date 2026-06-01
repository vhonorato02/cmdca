import type { Metadata } from 'next'

import { NewsCard } from '@/components/NewsCard'
import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Conferências e Fóruns',
  description:
    'Conferência Municipal dos Direitos da Criança e do Adolescente e a Semana Municipal em Pindamonhangaba.',
}

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
  const relacionadas = res.docs as Noticia[]

  return (
    <>
      <Hero
        deep
        eyebrow="Mobilização"
        titulo="Conferências e Fóruns"
        texto="Espaços de escuta e construção coletiva da política municipal da infância e da adolescência."
      />

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">Próxima etapa</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Conferência Municipal agendada para 2026.
                </h2>
                <p>
                  A Conferência Municipal dos Direitos da Criança e do Adolescente está agendada para{' '}
                  <b>2026</b>. É um momento de avaliar serviços, debater prioridades e apontar diretrizes,
                  com a participação do poder público, das entidades e da sociedade civil. Datas, local e
                  programação serão divulgados nos canais oficiais.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Semana Municipal — 2025</span>
                <p style={{ marginTop: 8, color: 'var(--ink-2)', fontSize: '.92rem' }}>
                  De <b>22 a 26 de setembro de 2025</b>, a Semana Municipal dos Direitos da Criança e do
                  Adolescente ocorreu no Centro Social Salesiano, marcando os 35 anos do ECA, com a
                  Camerata Jovem do Projeto Jataí.
                </p>
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
