import type { Metadata } from 'next'
import { AppLink as Link } from '@/components/ui/AppLink'

import { Orbit } from '@/components/ui/brand'
import { getTextos } from '@/lib/content'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Página não encontrada | CMDCA de Pindamonhangaba',
  description: 'O endereço solicitado não foi encontrado.',
  path: '/404',
  noIndex: true,
})

const CAMINHOS = [
  { href: '/', titulo: 'Início', texto: 'Volte à página inicial do conselho.' },
  { href: '/ajuda', titulo: 'Buscar ajuda', texto: 'Emergência, Disque 100 e Conselho Tutelar.' },
  { href: '/noticias', titulo: 'Notícias', texto: 'Comunicados e campanhas do CMDCA.' },
  { href: '/mapa-do-site', titulo: 'Mapa do site', texto: 'Todas as páginas, em uma lista.' },
]

export default async function NotFound() {
  const textos = await getTextos()
  return (
    <section className="not-found" aria-labelledby="nao-encontrada">
      <div className="wrap not-found__inner">
        <div className="not-found__mark" aria-hidden="true">
          <p className="not-found__code">404</p>
          <Orbit className="not-found__orbit" strokeWidth={5} />
        </div>
        <h1 id="nao-encontrada">{textos.geral.naoEncontradaTitulo}</h1>
        <p className="lead">{textos.geral.naoEncontradaTexto}</p>
        <ul className="card-grid" aria-label="Caminhos sugeridos">
          {CAMINHOS.map((c) => (
            <li key={c.href} className="card">
              <h2 className="card__title">
                <Link href={c.href}>{c.titulo}</Link>
              </h2>
              <p className="muted">{c.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
