'use client'

/**
 * "Sair rápido" (padrão GOV.UK): troca a página por um site neutro sem deixar
 * esta no botão Voltar. Ajuda quem pede socorro perto de quem a ameaça.
 */
export function QuickExit() {
  return (
    <button
      type="button"
      className="btn btn--danger quick-exit"
      onClick={() => window.location.replace('https://www.google.com.br/search?q=previs%C3%A3o+do+tempo')}
    >
      Sair rápido
      <span className="sr-only"> desta página</span>
    </button>
  )
}
