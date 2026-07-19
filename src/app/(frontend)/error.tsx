'use client'

import Link from 'next/link'

import { Hero } from '@/components/Hero'

/**
 * Error boundary do site público. Mostra uma página com identidade do CMDCA
 * (em vez do erro cru) e um botão para tentar novamente.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <Hero
        deep
        eyebrow="Ops"
        titulo="Não foi possível carregar esta página"
        texto="Tente novamente. Se o problema continuar, use um dos caminhos abaixo."
      />
      <section className="band">
        <div className="wrap">
          <div style={{ marginBottom: 22 }}>
            <button type="button" className="btn" onClick={reset}>
              Tentar novamente
            </button>
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
            <Link href="/mapa-do-site">
              <h4>Mapa do site</h4>
              <p>Acesse todas as áreas públicas do portal.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
