import Link from 'next/link'

import { Hero } from '@/components/Hero'

export default function NotFound() {
  return (
    <>
      <Hero
        deep
        eyebrow="Erro 404"
        titulo="Página não encontrada"
        texto="O endereço que você procurou não existe, mudou de lugar ou foi removido."
      />
      <section className="band">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">Por onde seguir</span>
              <h2>Talvez um destes caminhos ajude</h2>
            </div>
          </div>
          <div className="links">
            <Link href="/">
              <h4>Início</h4>
              <p>Voltar à página inicial do conselho.</p>
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
              <p>Indicadores, gráficos e recursos do FMDCA.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
