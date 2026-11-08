import type { Metadata } from 'next'
import Image from 'next/image'
import { AppLink as Link } from '@/components/ui/AppLink'
import type { ReactNode } from 'react'

import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  HandCoins,
  Landmark,
  type LucideIcon,
  Megaphone,
  MessageCircleHeart,
  Phone,
  Quote,
  Siren,
  Users,
} from 'lucide-react'

import { NewsCard } from '@/components/NewsCard'
import { ButtonLink, SmartLink } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'
import { Section } from '@/components/ui/Section'
import { canaisDiscaveis, getInstituicao, getPaginaInicial, getTextos } from '@/lib/content'
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

const DEFAULT_BLOCOS = ['atalhos', 'slider', 'noticias', 'sobre', 'indicadores', 'vozes']

/** Ícone de cada tipo de canal de proteção. */
const CANAL_ICONE: Record<string, LucideIcon> = {
  emergencia: Siren,
  denuncia: Megaphone,
  tutelar: Landmark,
  outro: MessageCircleHeart,
}

type Servico = { href: string; icone: LucideIcon; titulo: string; texto: string }

/** Foto padrão da capa quando o CMS não tem uma imagem conferida (licença livre). */
const FOTO_CIDADE = {
  src: '/images/cidade/pindamonhangaba-serra.jpg',
  alt: 'Telhados do centro de Pindamonhangaba com a Serra da Mantiqueira ao fundo, numa manhã clara.',
  credito: 'Foto: Facs90, CC BY-SA 4.0, via Wikimedia Commons',
  fonte: 'https://commons.wikimedia.org/wiki/File:Panor%C3%A2mica_de_Pindamonhangaba_02.jpg',
}

/** Dia e mês abreviado de uma data, no fuso de Pindamonhangaba (ex.: "12" e "nov"). */
function diaMes(iso: string): { dia: string; mes: string } {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'America/Sao_Paulo',
  }).formatToParts(new Date(iso))
  const dia = parts.find((p) => p.type === 'day')?.value ?? ''
  const mes = (parts.find((p) => p.type === 'month')?.value ?? '').replace('.', '')
  return { dia, mes }
}

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

  const [pagina, textos, instituicao, destaques, depoimentos, noticias, proxima] =
    await Promise.all([
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
          where: {
            _status: { equals: 'published' },
            data: { greater_than_equal: today.toISOString() },
          },
          sort: 'data',
          limit: 1,
          depth: 0,
        })
        .catch(() => ({ docs: [] as Reunioe[] })),
    ])

  const blocos = pagina.blocos ?? DEFAULT_BLOCOS
  // Painel de ajuda: os canais com número discável, na ordem do CMS (até quatro).
  const canais = canaisDiscaveis(textos.protecao.canais)
    .filter((canal) => canal.href)
    .slice(0, 3)
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
      (item) =>
        publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
    ),
  ).slice(0, 4)

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

  // Os dois blocos grandes do bento (Imposto de Renda e reuniões) mostram um dado real:
  // o maior limite de destinação e a data da próxima reunião publicada.
  const reuniaoData = proximaReuniao?.data ? diaMes(proximaReuniao.data) : null
  const anoLei = instituicao.leiCMDCA?.match(/(19|20)\d{2}/)?.[0]

  // Pedir ajuda fica no painel da capa; aqui, as outras tarefas.
  const servicos: Servico[] = [
    {
      href: '/resolucoes',
      icone: FileText,
      titulo: 'Consultar resoluções',
      texto: 'Decisões do conselho com número, data e documento.',
    },
    {
      href: '/editais',
      icone: ClipboardList,
      titulo: 'Ver editais e chamamentos',
      texto: 'Seleções e processos de escolha, com prazos e anexos.',
    },
    {
      href: '/entidades',
      icone: Building2,
      titulo: 'Registrar uma entidade',
      texto: 'Requisitos para o registro e organizações registradas.',
    },
    {
      href: '/conferencias',
      icone: Users,
      titulo: 'Participar das conferências',
      texto: 'Encontros abertos em que a cidade define prioridades.',
    },
  ]

  const [lead, ...rest] = news

  const sections: Record<string, ReactNode> = {
    atalhos: (
      <Section key="servicos" id="servicos" title="O que você pode fazer aqui">
        <ul className="bento">
          <li className="bento__item bento__item--ir reveal">
            <Link className="tile tile--signal" href="/fmdca">
              {limite !== undefined ? (
                <span className="tile__figure" aria-hidden="true">
                  {limite.toLocaleString('pt-BR')}
                  <small>%</small>
                </span>
              ) : (
                <HandCoins className="tile__glyph" aria-hidden="true" />
              )}
              <span className="tile__title">{pagina.rotas.fundoTitulo}</span>
              <span className="tile__text">
                {limite !== undefined ? (
                  <span className="sr-only">Até {limite.toLocaleString('pt-BR')}% do imposto devido. </span>
                ) : null}
                {pagina.rotas.fundoTexto}
              </span>
              <ArrowUpRight className="tile__go" aria-hidden="true" />
            </Link>
          </li>
          <li className="bento__item bento__item--meet reveal">
            <Link className="tile tile--primary" href="/reunioes">
              {reuniaoData ? (
                <span className="tile__date" aria-hidden="true">
                  <b>{reuniaoData.dia}</b>
                  {reuniaoData.mes}
                </span>
              ) : (
                <CalendarDays className="tile__glyph" aria-hidden="true" />
              )}
              <span className="tile__title">{pagina.rotas.atosTitulo}</span>
              <span className="tile__text">
                {proximaReuniao?.data
                  ? `Próxima reunião em ${formatDateLong(proximaReuniao.data)}. ${pagina.rotas.atosTexto}`
                  : pagina.rotas.atosTexto}
              </span>
              <ArrowUpRight className="tile__go" aria-hidden="true" />
            </Link>
          </li>
          {servicos.map(({ href, icone: Icone, titulo, texto }) => (
            <li key={href} className="bento__item reveal">
              <Link className="tile" href={href}>
                <span className="tile__icon" aria-hidden="true">
                  <Icone strokeWidth={1.75} />
                </span>
                <span className="tile__title">{titulo}</span>
                <span className="tile__text">{texto}</span>
                <ArrowUpRight className="tile__go" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    ),

    slider: slides.length ? (
      <Section key="destaques" id="destaques" title="Em destaque" alt>
        <ul className="highlights">
          {slides.map((s) => (
            <li key={s.id} className="card highlight reveal">
              {s.kicker ? <span className="tag">{s.kicker}</span> : null}
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
      <Section key="sobre" id="o-conselho" className="section--dark">
        <div className="about">
          <div className="about__text">
            <h2 className="about__title">{pagina.sobre.titulo}</h2>
            <p className="about__lead">{pagina.sobre.texto}</p>
            <ButtonLink href="/conselho" variant="signal">
              Conhecer o CMDCA
            </ButtonLink>
          </div>
          <dl className="stats">
            <div className="stat">
              <dt>Composição</dt>
              <dd>
                <b>50/50</b>
                Metade Prefeitura, metade sociedade civil
              </dd>
            </div>
            {anoLei ? (
              <div className="stat">
                <dt>Criado em</dt>
                <dd>
                  <b>{anoLei}</b>
                  {instituicao.leiCMDCA}
                </dd>
              </div>
            ) : null}
            {instituicao.presidente ? (
              <div className="stat stat--wide">
                <dt>{instituicao.gestao ? `Diretoria, gestão ${instituicao.gestao.replace(/^gestão\s*/i, '')}` : 'Diretoria'}</dt>
                <dd>
                  {[instituicao.presidente, instituicao.vice].flatMap((p) =>
                    p
                      ? [
                          <span className="stat__person" key={p.nome}>
                            <b>{p.nome}</b>
                            {p.cargo}
                          </span>,
                        ]
                      : [],
                  )}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Section>
    ),

    vozes: vozes.length ? (
      <Section key="vozes" id="vozes" title="Quem participa">
        <ul className="quotes">
          {vozes.map((v) => (
            <li key={v.id} className="reveal">
              <figure className="card quote">
                <Quote className="quote__mark" aria-hidden="true" />
                <blockquote>
                  <p>{v.frase}</p>
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
          <ButtonLink href="/noticias" variant="secondary">
            Ver todas as notícias
          </ButtonLink>
        }
      >
        {lead ? (
          <div className="news-feature">
            <div className="news-feature__lead reveal">
              <NewsCard noticia={lead} lead />
            </div>
            {rest.length ? (
              <ul className="news-feature__list">
                {rest.map((n) => (
                  <li key={n.id} className="reveal">
                    <NewsCard noticia={n} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="muted">Ainda não há notícias publicadas.</p>
        )}
      </Section>
    ),
  }

  const mostrarAjuda = blocos.includes('atalhos') && canais.length > 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationLd) }} />
      <section className="hero" aria-labelledby="inicio-titulo">
        <div className="hero__media home-hero__image">
          {coverURL ? (
            <Image
              src={coverURL}
              alt={coverAlt || ''}
              fill
              preload
              fetchPriority="high"
              unoptimized={coverURL.startsWith('/api/media/file/')}
              sizes="100vw"
            />
          ) : (
            <Image
              src={FOTO_CIDADE.src}
              alt={FOTO_CIDADE.alt}
              fill
              preload
              fetchPriority="high"
              quality={50}
              sizes="100vw"
            />
          )}
        </div>
        <div className="wrap hero__grid">
          <div className="hero__text">
            {proximaReuniao?.data ? (
              <Link className="hero__status" href="/reunioes">
                <span className="hero__pulse" aria-hidden="true" />
                Próxima reunião aberta: {formatDateLong(proximaReuniao.data)}
              </Link>
            ) : (
              <p className="hero__status">
                <span className="hero__pulse" aria-hidden="true" />
                Conselho Municipal dos Direitos da Criança e do Adolescente
              </p>
            )}
            <h1 id="inicio-titulo">{pagina.capa.titulo}</h1>
            <p className="hero__lead">{pagina.capa.texto}</p>
            <div className="actions">
              <ButtonLink href="/ajuda" variant="signal">
                Pedir ajuda
              </ButtonLink>
              <ButtonLink href="/fmdca" variant="inverse">
                Destinar Imposto de Renda
              </ButtonLink>
            </div>
          </div>

          {mostrarAjuda ? (
            <aside className="help-glass" aria-labelledby="ajuda-agora">
              <h2 id="ajuda-agora">{pagina.rotas.protecaoTitulo}</h2>
              <p className="help-glass__intro">{pagina.rotas.protecaoTexto}</p>
              <ul className="help-glass__list">
                {canais.map((canal) => {
                  const Icone = CANAL_ICONE[canal.tipo] ?? Phone
                  return (
                    <li key={`${canal.tipo}-${canal.rotulo}`}>
                      <a className={`help-line help-line--${canal.tipo}`} href={canal.href}>
                        <span className="help-line__icon" aria-hidden="true">
                          <Icone strokeWidth={1.75} />
                        </span>
                        <span className="help-line__text">
                          <span className="help-line__situation">{canal.situacao || canal.rotulo}</span>
                          <span className="help-line__who">
                            {canal.rotulo}
                            {canal.observacao ? <span className="sr-only">. {canal.observacao}</span> : null}
                          </span>
                        </span>
                        <span className="help-line__number">{canal.numero}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
              <Link className="help-glass__more" href="/ajuda">
                Ver todos os canais e endereços
                <ArrowRight />
              </Link>
            </aside>
          ) : null}
        </div>
        <p className="hero__credit">
          {coverURL ? (
            coverCredit
          ) : (
            <a href={FOTO_CIDADE.fonte} rel="license noopener">
              {FOTO_CIDADE.credito}
            </a>
          )}
        </p>
      </section>

      {blocos.map((tipo) => sections[tipo] ?? null)}
    </>
  )
}
