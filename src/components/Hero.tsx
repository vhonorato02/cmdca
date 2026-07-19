import type { ReactNode } from 'react'

/** Cabeçalho índigo das páginas internas (classe .ajuda-hero da prévia). */
export function Hero({
  eyebrow,
  titulo,
  texto,
  deep,
}: {
  eyebrow?: string
  titulo: string
  texto?: ReactNode
  deep?: boolean
}) {
  return (
    <header className={deep ? 'ajuda-hero ajuda-hero--deep' : 'ajuda-hero'}>
      <div className="wrap">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{titulo}</h1>
        {texto ? <p>{texto}</p> : null}
      </div>
    </header>
  )
}
