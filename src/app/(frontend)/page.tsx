import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { HomeSlider, type Slide } from '@/components/home/HomeSlider'
import { Vozes, type Voz } from '@/components/home/Vozes'
import { CATEGORIA_LABEL, NewsCard } from '@/components/NewsCard'
import { Illustration } from '@/components/Illustration'
import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata, serializeJsonLd } from '@/lib/seo'
import {
  absoluteUrl,
  containsUnverifiedMarker,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  publicHref,
  publicText,
  SITE_NAME,
  WEBSITE_ID,
} from '@/lib/site'
import type { Depoimento, Destaque, Noticia } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'CMDCA de Pindamonhangaba | Direitos da Criança e do Adolescente',
  description:
    'Acesse os canais de proteção, reuniões, resoluções, editais, entidades registradas e informações do Fundo Municipal em Pindamonhangaba.',
  path: '/',
})

const DEFAULT_BLOCOS = ['slider', 'sobre', 'atalhos', 'vozes', 'noticias']

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [pagina, config, destaques, depoimentos, noticias] = await Promise.all([
    payload.findGlobal({ slug: 'pagina-inicial' }).catch(() => null),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null),
    payload
      .find({
        collection: 'destaques',
        where: { _status: { equals: 'published' } },
        sort: 'ordem',
        limit: 20,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Destaque[] })),
    payload
      .find({
        collection: 'depoimentos',
        where: { _status: { equals: 'published' } },
        limit: 20,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Depoimento[] })),
    payload
      .find({
        collection: 'noticias',
        where: { _status: { equals: 'published' } },
        sort: '-data',
        limit: 4,
        depth: 1,
      })
      .catch(() => ({ docs: [] as Noticia[] })),
  ])

  const blocosCfg = (pagina?.blocos && pagina.blocos.length ? pagina.blocos : null) as
    { tipo: string; ativo?: boolean | null }[] | null
  const ordem = blocosCfg
    ? blocosCfg.filter((b) => b.ativo !== false).map((b) => b.tipo)
    : DEFAULT_BLOCOS

  const slides: Slide[] = (destaques.docs as Destaque[]).flatMap((d) => {
    const titulo = publicText(d.titulo)
    const texto = publicText(d.texto)
    const ctaLabel = publicText(d.cta?.label)
    const ctaHref = publicHref(d.cta?.href)
    const combined = [d.kicker, d.titulo, d.texto, d.cta?.label].filter(Boolean).join(' ')

    if (!titulo || containsUnverifiedMarker(combined) || /transmiss[aã]o online/i.test(combined)) {
      return []
    }

    return [
      {
        kicker: publicText(d.kicker),
        titulo,
        texto,
        cta: ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined,
        tema: d.tema,
      },
    ]
  })
  const vozes: Voz[] = (depoimentos.docs as Depoimento[]).flatMap((d) => {
    const frase = publicText(d.frase)
    const autor = publicText(d.autor)
    const papel = publicText(d.papel)
    if (!frase || !autor || containsUnverifiedMarker([d.frase, d.autor, d.papel])) return []
    return [{ frase, autor, papel }]
  })
  const dir = config?.diretoria

  const news = (noticias.docs as Noticia[]).filter(
    (item) =>
      publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
  )
  const lead = news.find((n) => n.destaque) || news[0]
  const rest = lead ? news.filter((n) => n.id !== lead.id).slice(0, 3) : []

  const email = publicText(config?.contato?.email)
  const telephone = publicText(config?.contato?.telefone)
  const postalCode = publicText(config?.contato?.cep)
  const instagram = publicHref(config?.redes?.instagramUrl)
  const organizationLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GovernmentOrganization',
        '@id': ORGANIZATION_ID(),
        name: publicText(config?.nomeConselho) || ORGANIZATION_NAME,
        alternateName: 'CMDCA de Pindamonhangaba',
        description:
          'Conselho municipal responsável por deliberar e controlar ações da política de atendimento aos direitos da criança e do adolescente.',
        url: absoluteUrl('/'),
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/brand/logo-cmdca.jpg'),
        },
        email,
        telephone,
        contactPoint:
          email || telephone
            ? {
                '@type': 'ContactPoint',
                contactType: 'atendimento institucional',
                availableLanguage: 'Portuguese',
                email,
                telephone,
              }
            : undefined,
        sameAs: instagram ? [instagram] : undefined,
        areaServed: {
          '@type': 'City',
          name: 'Pindamonhangaba',
          containedInPlace: { '@type': 'State', name: 'São Paulo' },
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Pindamonhangaba',
          addressRegion: 'SP',
          addressCountry: 'BR',
          postalCode,
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID(),
        name: SITE_NAME,
        url: absoluteUrl('/'),
        inLanguage: 'pt-BR',
        publisher: { '@id': ORGANIZATION_ID() },
      },
    ],
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
                  Onde as decisões sobre direitos ganham forma pública.
                </h2>
                <p>
                  O <b>CMDCA</b> reúne poder público e sociedade civil em número igual. Aqui são
                  deliberadas prioridades da política municipal, decisões sobre o Fundo e regras
                  para o registro de entidades e programas. O conselho também conduz o processo de
                  escolha do Conselho Tutelar.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">{publicText(dir?.gestaoLabel) || 'Gestão 2025–2027'}</span>
                <div className="nm">Composição paritária</div>
                <p className="ro" style={{ marginTop: 8 }}>
                  Veja quem compõe o colegiado, o que ele faz e quais leis o orientam.
                </p>
                <Link
                  className="mini"
                  href="/conselho"
                  style={{ marginTop: 14, display: 'inline-flex' }}
                >
                  Entender o CMDCA
                </Link>
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
                <span className="eyebrow">Serviços e informações</span>
                <h2>Encontre o que você precisa</h2>
              </div>
            </div>
            <div className="links">
              <Link href="/ajuda">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M12 21C7 17.5 4 14 4 9.5 4 6.5 6.2 4.5 9 4.5c1.7 0 3 .9 3 .9s1.3-.9 3-.9c2.8 0 5 2 5 5C20 14 17 17.5 12 21Z" />
                </svg>
                <h3>Pedir ajuda</h3>
                <p>Encontre o canal adequado para emergência, denúncia ou orientação.</p>
              </Link>
              <Link href="/reunioes">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M4 10h16" />
                </svg>
                <h3>Reuniões e atas</h3>
                <p>Consulte calendário, pautas e atas já publicadas.</p>
              </Link>
              <Link href="/transparencia">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M5 19V9M12 19V5M19 19v-7M3 21h18" />
                </svg>
                <h3>Transparência</h3>
                <p>Acesse atos, documentos e informações que já estão disponíveis.</p>
              </Link>
              <Link href="/fmdca">
                <svg className="icn ic" viewBox="0 0 24 24">
                  <path d="M4 12v6a1 1 0 0 0 1 1h3v-7M8 12 4 9l8-5 8 5v9a1 1 0 0 1-1 1h-3v-7" />
                </svg>
                <h3>Destinar seu IR</h3>
                <p>Confira regras, limites e fontes oficiais antes de destinar.</p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),

    // Indicadores só voltarão ao site quando houver fonte, período e metodologia verificáveis no CMS.
    indicadores: null,

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
                <span className="eyebrow">Atualizações</span>
                <h2>Notícias do conselho</h2>
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
                    <span className="tag">{CATEGORIA_LABEL[lead.categoria] || 'Notícia'}</span>
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
              <p style={{ color: 'var(--ink-2)' }}>Não há notícias publicadas no momento.</p>
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationLd) }}
      />
      <section className="home-entry" aria-labelledby="inicio-titulo">
        <div className="wrap">
          <div className="home-entry-grid">
            <div className="home-entry-copy">
              <span className="eyebrow">Informação pública para a cidade</span>
              <h1
                id="inicio-titulo"
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(2rem,4vw,3.15rem)',
                  lineHeight: 1.05,
                  margin: '12px 0 16px',
                  maxWidth: '20ch',
                }}
              >
                Direitos de crianças e adolescentes em Pindamonhangaba
              </h1>
              <p>
                Encontre canais de proteção, atos oficiais, reuniões e informações sobre o Fundo.
                Saiba também como acompanhar as decisões do CMDCA.
              </p>
            </div>
            <div className="home-entry-image">
              <Image
                src="/images/institucional/cuidado-coletivo-cmdca.webp"
                alt="Adultos e crianças caminham juntos em um espaço comunitário, vistos de costas."
                fill
                priority
                sizes="(max-width: 880px) 100vw, 52vw"
              />
              <span>Imagem ilustrativa</span>
            </div>
          </div>
          <aside className="home-help" aria-label="Orientação para situações urgentes">
            <div>
              <span className="k">Precisa de proteção?</span>
              <strong>Comece pelo canal adequado à situação.</strong>
            </div>
            <p>Em perigo imediato, ligue 190. Para denunciar violações de direitos, use o Disque 100.</p>
            <Link className="btn" href="/ajuda">
              Buscar ajuda
            </Link>
          </aside>
        </div>
      </section>
      {ordem.map((tipo) => blocos[tipo] ?? null)}
    </>
  )
}
