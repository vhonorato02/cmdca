import type { Metadata } from 'next'
import Image from 'next/image'
import { AppLink as Link } from '@/components/ui/AppLink'
import type { CSSProperties, ReactNode } from 'react'

import { canaisDaFaixa } from '@/components/layout/Protection'
import { NewsCard } from '@/components/NewsCard'
import { HeroMark } from '@/components/ui/brand'
import { ButtonLink, SmartLink } from '@/components/ui/Button'
import { ArrowRight, Calendar, Shield } from '@/components/ui/icons'
import { Section } from '@/components/ui/Section'
import {
  canaisDiscaveis,
  getInstituicao,
  getPaginaInicial,
  getTextos,
} from '@/lib/content'
import { formatDateLong, sortByDateDesc } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata, serializeJsonLd } from '@/lib/seo'
import {
  absoluteUrl,
  containsUnverifiedMarker,
  ORGANIZATION_ID,
  publicHref,
  publicMediaHref,
  publicText,
  SITE_NAME,
  WEBSITE_ID,
} from '@/lib/site'
import type { Depoimento, Destaque, Noticia, Reunioe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'CMDCA de Pindamonhangaba | Direitos da Criança e do Adolescente',
  description:
    'Canais de proteção, destinação do Imposto de Renda ao Fundo Municipal, reuniões, resoluções e editais do CMDCA de Pindamonhangaba.',
  path: '/',
})

const DEFAULT_BLOCOS = ['slider', 'sobre', 'atalhos', 'vozes', 'noticias']

/** Maior limite percentual cadastrado (ex.: "6%"), para o caminho do Fundo. */
function maiorLimite(modalidades: { limite: string }[]): number | undefined {
  const values = modalidades
    .map((m) => Number.parseFloat(m.limite.replace(',', '.')))
    .filter((v) => Number.isFinite(v))
  return values.length ? Math.max(...values) : undefined
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const [pagina, textos, instituicao, destaques, depoimentos, noticias, proxima] = await Promise.all([
    getPaginaInicial(),
    getTextos(),
    getInstituicao(),
    payload
      .find({
        collection: 'destaques',
        where: { _status: { equals: 'published' } },
        sort: 'ordem',
        limit: 6,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Destaque[] })),
    payload
      .find({
        collection: 'depoimentos',
        where: { _status: { equals: 'published' } },
        limit: 3,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Depoimento[] })),
    payload
      .find({
        collection: 'noticias',
        where: { _status: { equals: 'published' } },
        sort: '-data',
        limit: 24,
        depth: 1,
      })
      .catch(() => ({ docs: [] as Noticia[] })),
    payload
      .find({
        collection: 'reunioes',
        where: { _status: { equals: 'published' }, data: { greater_than_equal: today.toISOString() } },
        sort: 'data',
        limit: 1,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Reunioe[] })),
  ])

  const blocos = pagina.blocos ?? DEFAULT_BLOCOS
  const canais = canaisDaFaixa(canaisDiscaveis(textos.protecao.canais))
  const coverURL = publicMediaHref(pagina.imagem?.url)
  const coverAlt = publicText(pagina.imagem?.alt)
  const coverCredit = publicText(pagina.imagem?.credito)
  const limite = maiorLimite(textos.fmdca.modalidades)
  const proximaReuniao = (proxima.docs as Reunioe[])[0]

  const slides = (destaques.docs as Destaque[]).flatMap((d) => {
    const titulo = publicText(d.titulo)
    const combined = [d.kicker, d.titulo, d.texto, d.cta?.label].filter(Boolean).join(' ')
    if (!titulo || containsUnverifiedMarker(combined)) return []
    const label = publicText(d.cta?.label)
    const href = publicHref(d.cta?.href)
    return [
      {
        id: d.id,
        kicker: publicText(d.kicker),
        titulo,
        texto: publicText(d.texto),
        cta: label && href ? { label, href } : undefined,
      },
    ]
  })

  const vozes = (depoimentos.docs as Depoimento[]).flatMap((d) => {
    const frase = publicText(d.frase)
    const autor = publicText(d.autor)
    if (!frase || !autor || containsUnverifiedMarker([d.frase, d.autor, d.papel])) return []
    return [{ id: d.id, frase, autor, papel: publicText(d.papel) }]
  })

  const news = sortByDateDesc(
    (noticias.docs as Noticia[]).filter(
      (item) => publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
    ),
  ).slice(0, 4)
  const lead = news.find((n) => n.destaque) || news[0]
  const rest = lead ? news.filter((n) => n.id !== lead.id).slice(0, 3) : []

  const organizationLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GovernmentOrganization',
        '@id': ORGANIZATION_ID(),
        name: 'Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba',
        alternateName: instituicao.nome,
        url: absoluteUrl('/'),
        logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/logo-cmdca.jpg') },
        email: instituicao.email,
        telephone: instituicao.telefone,
        sameAs: instituicao.instagramUrl ? [instituicao.instagramUrl] : undefined,
        areaServed: {
          '@type': 'City',
          name: 'Pindamonhangaba',
          containedInPlace: { '@type': 'State', name: 'São Paulo' },
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: instituicao.endereco,
          addressLocality: 'Pindamonhangaba',
          addressRegion: 'SP',
          addressCountry: 'BR',
          postalCode: instituicao.cep,
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

  const sections: Record<string, ReactNode> = {
    slider: slides.length ? (
      <Section key="destaques" id="destaques" title="Em destaque">
        <ul className="highlights">
          {slides.map((s) => (
            <li key={s.id} className="highlight">
              {s.kicker ? <span className="highlight__kicker">{s.kicker}</span> : null}
              <h3 className="card__title">
                {s.cta ? <SmartLink href={s.cta.href}>{s.titulo}</SmartLink> : s.titulo}
              </h3>
              {s.texto ? <p className="muted">{s.texto}</p> : null}
              {s.cta ? (
                <span className="more-link" aria-hidden="true">
                  {s.cta.label}
                  <ArrowRight />
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>
    ) : null,

    sobre: (
      <Section key="sobre" id="o-conselho" alt>
        <div className="about">
          <div>
            <h2 className="about__title">{pagina.sobre.titulo}</h2>
            <p className="lead">{pagina.sobre.texto}</p>
            <p>
              <Link className="more-link" href="/conselho">
                Conhecer o CMDCA
                <ArrowRight />
              </Link>
            </p>
          </div>
          {instituicao.presidente || instituicao.vice ? (
            <div className="stack">
              {instituicao.gestao ? <p className="muted">{instituicao.gestao}</p> : null}
              <ul className="person-list">
                {[instituicao.presidente, instituicao.vice].flatMap((p) =>
                  p ? [
                    <li className="person" key={p.nome}>
                      <p className="person__role">{p.cargo}</p>
                      <p className="person__name">{p.nome}</p>
                    </li>,
                  ] : [],
                )}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>
    ),

    vozes: vozes.length ? (
      <Section key="vozes" id="vozes" title="Quem participa">
        <ul className="quotes">
          {vozes.map((v) => (
            <li key={v.id}>
              <figure className="quote">
                <blockquote>
                  <p>“{v.frase}”</p>
                </blockquote>
                <figcaption>
                  <b>{v.autor}</b>
                  {v.papel}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>
    ) : null,

    noticias: (
      <Section
        key="noticias"
        id="noticias"
        title="Notícias"
        action={
          <Link className="more-link" href="/noticias">
            Ver todas as notícias
            <ArrowRight />
          </Link>
        }
      >
        {lead ? (
          <ul className="news-grid">
            <li className="news-grid__lead">
              <NewsCard noticia={lead} lead />
            </li>
            {rest.map((n) => (
              <li key={n.id}>
                <NewsCard noticia={n} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Ainda não há notícias publicadas.</p>
        )}
      </Section>
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationLd) }} />
      <section className="home-hero" aria-labelledby="inicio-titulo">
        <div className="wrap home-hero__inner">
          <div>
            <h1 id="inicio-titulo">{pagina.capa.titulo}</h1>
            <p className="home-hero__lead">{pagina.capa.texto}</p>
            <div className="actions">
              <ButtonLink href="/fmdca">Destinar meu Imposto de Renda</ButtonLink>
              <ButtonLink href="/reunioes" variant="secondary">
                Acompanhar as reuniões
              </ButtonLink>
            </div>
          </div>
          {coverURL ? (
            <figure className="home-hero__figure">
              <div className="home-hero__image">
                <Image
                  src={coverURL}
                  alt={coverAlt || ''}
                  fill
                  priority
                  unoptimized={coverURL.startsWith('/api/media/file/')}
                  sizes="(max-width: 900px) 100vw, 480px"
                />
              </div>
              {coverCredit ? <figcaption>{coverCredit}</figcaption> : null}
            </figure>
          ) : (
            <HeroMark className="home-hero__mark" />
          )}
        </div>
      </section>

      {blocos.includes('atalhos') ? (
        <div className="wrap">
          <ul className="routes" aria-label="Caminhos principais">
            <li className="route route--protecao">
              <Shield className="route__icon" />
              <h2 className="route__title">
                <Link href="/ajuda">{pagina.rotas.protecaoTitulo}</Link>
              </h2>
              <p>{pagina.rotas.protecaoTexto}</p>
              {canais.length ? (
                <div className="route__channels">
                  {canais.map((canal) => (
                    <a
                      key={`${canal.tipo}-${canal.numero}`}
                      className={`btn btn--sm ${canal.tipo === 'emergencia' ? 'btn--danger' : 'btn--signal'}`}
                      href={canal.href}
                    >
                      {canal.numero}
                      <span className="sr-only">, {canal.rotulo}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
            <li className="route route--fundo">
              {limite !== undefined ? (
                <p className="route__figure" aria-hidden="true">
                  {Number.isInteger(limite) && limite <= 100 ? (
                    // Conta de 0 até o valor na primeira pintura; sem suporte, mostra o valor final.
                    <span className="countup" style={{ '--to': limite } as CSSProperties}>
                      <span className="countup__static">{limite}%</span>
                    </span>
                  ) : (
                    `${limite.toLocaleString('pt-BR')}%`
                  )}
                  <small>do imposto devido</small>
                </p>
              ) : null}
              <h2 className="route__title">
                <Link href="/fmdca">{pagina.rotas.fundoTitulo}</Link>
              </h2>
              <p>{pagina.rotas.fundoTexto}</p>
            </li>
            <li className="route route--atos">
              <Calendar className="route__icon" />
              <h2 className="route__title">
                <Link href="/reunioes">{pagina.rotas.atosTitulo}</Link>
              </h2>
              <p>{pagina.rotas.atosTexto}</p>
              {proximaReuniao?.data ? (
                <p>
                  <b>Próxima reunião:</b>{' '}
                  <time dateTime={proximaReuniao.data}>{formatDateLong(proximaReuniao.data)}</time>
                </p>
              ) : null}
            </li>
          </ul>
        </div>
      ) : null}

      {blocos.filter((tipo) => tipo !== 'atalhos').map((tipo) => sections[tipo] ?? null)}
    </>
  )
}
