import type { Metadata } from 'next'
import { AppLink as Link } from '@/components/ui/AppLink'

import { PageHeader } from '@/components/ui/PageHeader'
import { getTextos } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'
import { breadcrumbJsonLd, createMetadata, serializeJsonLd } from '@/lib/seo'
import { publicText } from '@/lib/site'
import type { Pagina } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = createMetadata({
  title: 'Mapa do site | CMDCA de Pindamonhangaba',
  description: 'Todas as páginas do portal do CMDCA de Pindamonhangaba, organizadas por assunto.',
  path: '/mapa-do-site',
})

export default async function MapaDoSitePage() {
  const textos = await getTextos()
  let paginas: Pagina[] = []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'paginas',
      where: { _status: { equals: 'published' } },
      sort: 'titulo',
      limit: 100,
      depth: 0,
    })
    paginas = (res.docs as Pagina[]).filter((p) => publicText(p.titulo))
  } catch {
    paginas = []
  }

  const groups = [
    {
      title: 'Proteção',
      items: [{ href: '/ajuda', label: textos.ajuda.titulo }],
    },
    {
      title: 'Fundo e Imposto de Renda',
      items: [{ href: '/fmdca', label: textos.fmdca.titulo }],
    },
    {
      title: 'O conselho e a participação',
      items: [
        { href: '/conselho', label: textos.conselho.titulo },
        { href: '/participe', label: textos.participe.titulo },
        { href: '/reunioes', label: textos.atos.reunioesTitulo },
        { href: '/conferencias', label: textos.publicacoes.conferenciasTitulo },
        { href: '/noticias', label: textos.publicacoes.noticiasTitulo },
      ],
    },
    {
      title: 'Atos e transparência',
      items: [
        { href: '/transparencia', label: textos.transparencia.titulo },
        { href: '/resolucoes', label: textos.atos.resolucoesTitulo },
        { href: '/editais', label: textos.atos.editaisTitulo },
        { href: '/entidades', label: textos.atos.entidadesTitulo },
      ],
    },
    {
      title: 'Sobre o portal',
      items: paginas.map((p) => ({ href: `/${p.slug}`, label: p.titulo })),
    },
  ].filter((group) => group.items.length)

  const ld = breadcrumbJsonLd([
    { name: 'Início', path: '/' },
    { name: 'Mapa do site', path: '/mapa-do-site' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <PageHeader title="Mapa do site" lead="Todas as páginas do portal, organizadas por assunto." />
      <div className="section">
        <div className="wrap sitemap">
          {groups.map((group, index) => (
            <section key={group.title} aria-labelledby={`grupo-${index}`} className="sitemap__group">
              <h2 id={`grupo-${index}`} className="callout__title">
                {group.title}
              </h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
