import Link from 'next/link'

import { HomeSlider, type Slide } from '@/components/home/HomeSlider'
import { Vozes, type Voz } from '@/components/home/Vozes'
import { NewsCard } from '@/components/NewsCard'
import { Illustration } from '@/components/Illustration'
import { Reveal } from '@/components/Reveal'
import { StatsBand } from '@/components/StatsBand'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import type { Depoimento, Destaque, Noticia } from '@/payload-types'

export const revalidate = 300

const DEFAULT_BLOCOS = ['slider', 'sobre', 'atalhos', 'indicadores', 'vozes', 'noticias']

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [pagina, config, destaques, depoimentos, indicadores, noticias] = await Promise.all([
    payload.findGlobal({ slug: 'pagina-inicial' }).catch(() => null),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null),
    payload
      .find({ collection: 'destaques', where: { _status: { equals: 'published' } }, sort: 'ordem', limit: 20, depth: 0 })
      .catch(() => ({ docs: [] as Destaque[] })),
    payload
      .find({ collection: 'depoimentos', where: { _status: { equals: 'published' } }, limit: 20, depth: 0 })
      .catch(() => ({ docs: [] as Depoimento[] })),
    payload.findGlobal({ slug: 'indicadores' }).catch(() => null),
    payload
      .find({ collection: 'noticias', where: { _status: { equals: 'published' } }, sort: '-data', limit: 4, depth: 1 })
      .catch(() => ({ docs: [] as Noticia[] })),
  ])

  const blocosCfg = (pagina?.blocos && pagina.blocos.length ? pagina.blocos : null) as
    | { tipo: string; ativo?: boolean | null }[]
    | null
  const ordem = blocosCfg ? blocosCfg.filter((b) => b.ativo !== false).map((b) => b.tipo) : DEFAULT_BLOCOS

  const slides: Slide[] = (destaques.docs as Destaque[]).map((d) => ({
    kicker: d.kicker,
    titulo: d.titulo,
    texto: d.texto,
    cta: d.cta,
    tema: d.tema,
  }))
  const vozes: Voz[] = (depoimentos.docs as Depoimento[]).map((d) => ({
    frase: d.frase,
    autor: d.autor,
    papel: d.papel,
  }))
  const dir = config?.diretoria
  const ind = indicadores

  const stats = ind
    ? [
        { value: ind.alcancados ?? 0, label: 'crianças e adolescentes alcançados' },
        { value: ind.projetos ?? 0, label: 'projetos apoiados pelo FMDCA' },
        { value: ind.entidades ?? 0, label: 'entidades registradas' },
        { value: ind.reunioesNoAno ?? 0, label: 'reuniões realizadas no ano' },
      ]
    : []

  const news = noticias.docs as Noticia[]
  const lead = news.find((n) => n.destaque) || news[0]
  const rest = lead ? news.filter((n) => n.id !== lead.id).slice(0, 3) : []

  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: config?.nomeConselho || 'CMDCA Pindamonhangaba',
    url: base,
    logo: `${base}/brand/logo-cmdca.jpg`,
    email: config?.contato?.email || undefined,
    telephone: config?.contato?.telefone || undefined,
    sameAs: config?.redes?.instagramUrl ? [config.redes.instagramUrl] : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pindamonhangaba',
      addressRegion: 'SP',
      addressCountry: 'BR',
      postalCode: config?.contato?.cep || undefined,
    },
  }

  const blocos: Record<string, React.ReactNode> = {
    slider: slides.length ? <HomeSlider key="slider" slides={slides} /> : null,

    sobre: (
      <section className="band" key="sobre">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">O Conselho</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: 'clamp(1.6rem,3vw,2.3rem)',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Quem garante os direitos da infância em Pindamonhangaba.
                </h2>
                <p>
                  O <b>CMDCA</b> é o órgão deliberativo, consultivo e fiscalizador da política de
                  proteção à criança e ao adolescente na <b>Princesa do Norte</b>. É <b>paritário</b>:
                  reúne, em igual número, representantes do poder público e da sociedade civil — todos
                  atuando de forma voluntária. Gere o orçamento do <b>FMDCA</b>, registra e acompanha as
                  entidades da área e fiscaliza a escolha dos conselheiros tutelares.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">{dir?.gestaoLabel || 'Gestão 2025–2027'}</span>
                <div className="nm">{dir?.presidenteNome || 'Dr. Rodolfo Brockhof'}</div>
                <div className="ro">{dir?.presidenteCargo || 'Presidente'}</div>
                <hr />
                <div className="nm" style={{ fontSize: '1.05rem' }}>
                  {dir?.viceNome || 'Andrea Campos Sales Martins'}
                </div>
                <div className="ro">{dir?.viceCargo || 'Vice-presidente'}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    ),

    atalhos: (
      <section className="band" key="atalhos">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Por onde começar</span>
                <h2>Acesso rápido</h2>
              </div>
            </div>
            <div className="links">
              <Link href="/ajuda">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M12 21C7 17.5 4 14 4 9.5 4 6.5 6.2 4.5 9 4.5c1.7 0 3 .9 3 .9s1.3-.9 3-.9c2.8 0 5 2 5 5C20 14 17 17.5 12 21Z" />
                </svg>
                <h4>Pedir ajuda</h4>
                <p>Denunciar, orientar-se ou agir numa emergência.</p>
              </Link>
              <Link href="/reunioes">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M4 10h16" />
                </svg>
                <h4>Reuniões e atas</h4>
                <p>Calendário, pautas e atas das reuniões.</p>
              </Link>
              <Link href="/transparencia">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M5 19V9M12 19V5M19 19v-7M3 21h18" />
                </svg>
                <h4>Transparência</h4>
                <p>Recursos do FMDCA, projetos e contas.</p>
              </Link>
              <Link href="/fmdca">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M4 12v6a1 1 0 0 0 1 1h3v-7M8 12 4 9l8-5 8 5v9a1 1 0 0 1-1 1h-3v-7" />
                </svg>
                <h4>Destinar seu IR</h4>
                <p>Transforme parte do seu imposto em projeto.</p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),

    indicadores: stats.length ? (
      <section className="band" key="indicadores">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Transparência viva</span>
                <h2>O conselho em números</h2>
              </div>
              <Link className="more" href="/transparencia">
                Ver painel completo →
              </Link>
            </div>
            <StatsBand stats={stats} />
          </Reveal>
        </div>
      </section>
    ) : null,

    vozes: vozes.length ? (
      <section className="band" key="vozes">
        <div className="wrap">
          <Reveal>
            <Vozes vozes={vozes} />
          </Reveal>
        </div>
      </section>
    ) : null,

    noticias: (
      <section className="band" key="noticias">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Acontece no conselho</span>
                <h2>Notícias</h2>
              </div>
              <Link className="more" href="/noticias">
                Todas as notícias →
              </Link>
            </div>
            {lead ? (
              <>
                <Link className="news-lead" href={`/noticias/${lead.slug}`}>
                  <div className="vis">
                    <Illustration theme={lead.tema || 'familia'} />
                    <span className="credit">ilustração CMDCA</span>
                  </div>
                  <div>
                    <span className="tag">{lead.categoria}</span>
                    <h3>{lead.title}</h3>
                    <p>{lead.resumo}</p>
                    {lead.data ? <div className="date">{formatDate(lead.data)}</div> : null}
                  </div>
                </Link>
                {rest.length ? (
                  <div className="news-list">
                    {rest.map((n) => (
                      <NewsCard key={n.id} noticia={n} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p style={{ color: 'var(--ink-2)' }}>Novas publicações em breve.</p>
            )}
          </Reveal>
        </div>
      </section>
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      {ordem.map((tipo) => blocos[tipo] ?? null)}
    </>
  )
}
