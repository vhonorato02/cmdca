import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Página não encontrada | CMDCA de Pindamonhangaba',
  description: 'O endereço solicitado não foi encontrado.',
  path: '/404',
  noIndex: true,
})

export default function NotFound() {
  return (
    <>
      <Hero
        deep
        eyebrow="Erro 404"
        titulo="Página não encontrada"
        texto="Confira o endereço ou escolha um dos caminhos abaixo."
      />
      <section className="band">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Por onde seguir</span>
              <h2>Encontre o que você precisa</h2>
            </div>
          </div>
          <div className="links">
            <Link href="/">
              <h4>Início</h4>
              <p>Volte à página inicial do conselho.</p>
            </Link>
            <Link href="/ajuda">
              <h4>Preciso de ajuda</h4>
              <p>Emergência (190), Disque 100 e Conselho Tutelar.</p>
            </Link>
            <Link href="/noticias">
              <h4>Notícias</h4>
              <p>Comunicados e publicações do conselho.</p>
            </Link>
            <Link href="/transparencia">
              <h4>Transparência</h4>
              <p>Atos, documentos e informações sobre o Fundo Municipal.</p>
            </Link>
            <Link href="/mapa-do-site">
              <h4>Mapa do site</h4>
              <p>Veja todas as áreas públicas disponíveis.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
