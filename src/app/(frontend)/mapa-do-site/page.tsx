import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { createMetadata, serializeJsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = createMetadata({
  title: 'Mapa do Site | CMDCA de Pindamonhangaba',
  description:
    'Encontre as páginas institucionais, atos oficiais, serviços de proteção, transparência e participação do CMDCA de Pindamonhangaba.',
  path: '/mapa-do-site',
})

const groups = [
  {
    title: 'Proteção e atendimento',
    items: [
      {
        href: '/ajuda',
        label: 'Preciso de ajuda',
        description: 'Emergência, Disque 100, Conselhos Tutelares e rede de proteção.',
      },
      {
        href: '/entidades',
        label: 'Entidades registradas',
        description: 'Organizações com registro publicado pelo conselho.',
      },
    ],
  },
  {
    title: 'Conselho e participação',
    items: [
      {
        href: '/conselho',
        label: 'O Conselho',
        description: 'Competências, composição, funcionamento e base legal.',
      },
      {
        href: '/reunioes',
        label: 'Reuniões',
        description: 'Calendário, classificação e atas publicadas.',
      },
      {
        href: '/conferencias',
        label: 'Conferências e fóruns',
        description: 'Registros, notícias e futuras convocações oficiais.',
      },
      {
        href: '/participe',
        label: 'Participe',
        description: 'Formas de acompanhar o conselho e canais de contato.',
      },
    ],
  },
  {
    title: 'Atos e transparência',
    items: [
      {
        href: '/resolucoes',
        label: 'Resoluções',
        description: 'Atos normativos e publicações oficiais disponíveis.',
      },
      {
        href: '/editais',
        label: 'Editais',
        description: 'Chamamentos, processos, prazos e documentos.',
      },
      {
        href: '/fmdca',
        label: 'Fundo Municipal',
        description: 'Regras e fontes oficiais para destinação do Imposto de Renda.',
      },
      {
        href: '/transparencia',
        label: 'Transparência',
        description: 'Atos, planos, projetos e prestações de contas disponíveis.',
      },
    ],
  },
  {
    title: 'Informação e políticas do site',
    items: [
      {
        href: '/noticias',
        label: 'Notícias',
        description: 'Comunicados, campanhas e atividades do conselho.',
      },
      {
        href: '/acessibilidade',
        label: 'Acessibilidade',
        description: 'Recursos, referências, limitações e canal para relatar barreiras.',
      },
      {
        href: '/privacidade',
        label: 'Aviso de privacidade',
        description: 'Tratamento de dados pessoais e direitos previstos na LGPD.',
      },
      {
        href: '/creditos',
        label: 'Créditos e licenças',
        description: 'Identidade, imagens, mapas, fontes e tecnologias.',
      },
    ],
  },
]

export default function MapaDoSitePage() {
  const allItems = groups.flatMap((group) => group.items)
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mapa do site do CMDCA de Pindamonhangaba',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: absoluteUrl(item.href),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListLd) }}
      />
      <Hero
        deep
        eyebrow="Navegação"
        titulo="Mapa do site"
        texto="Todas as áreas públicas do CMDCA reunidas em um só lugar."
      />
      {groups.map((group, groupIndex) => (
        <section className="band" key={group.title} aria-labelledby={`grupo-${groupIndex}`}>
          <div className="wrap">
            <Reveal>
              <div className="sec-head">
                <div>
                  <h2 id={`grupo-${groupIndex}`}>{group.title}</h2>
                </div>
              </div>
              <div className="links">
                {group.items.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <h3
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: '1.12rem',
                        margin: '13px 0 5px',
                      }}
                    >
                      {item.label}
                    </h3>
                    <p>{item.description}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  )
}
