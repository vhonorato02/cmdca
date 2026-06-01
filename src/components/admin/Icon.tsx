import React from 'react'

/**
 * Ícone do CMDCA no topo da barra lateral do painel (substitui a marca do Payload).
 * SVG inline (mesma marca do favicon) — sem requisição de imagem, nítido em qualquer DPI.
 */
export default function AdminIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      role="img"
      aria-label="CMDCA Pindamonhangaba"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#C9A227" />
      <ellipse
        cx="16"
        cy="13"
        rx="12"
        ry="5"
        fill="none"
        stroke="#262357"
        strokeWidth="2.4"
        transform="rotate(-12 16 13)"
      />
      <circle cx="13" cy="11" r="3" fill="#262357" />
      <path d="M13 14 L10 24 M13 14 L16 24" stroke="#262357" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
