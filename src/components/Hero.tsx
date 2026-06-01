import React from 'react'

/** Cabeçalho índigo das páginas internas (classe .ajuda-hero da prévia). */
export function Hero({
  eyebrow,
  titulo,
  texto,
  deep,
}: {
  eyebrow?: string
  titulo: string
  texto?: React.ReactNode
  deep?: boolean
}) {
  return (
    <div className="ajuda-hero" style={deep ? { background: 'var(--indigo-deep)' } : undefined}>
      <div className="wrap">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{titulo}</h1>
        {texto ? <p>{texto}</p> : null}
      </div>
    </div>
  )
}
