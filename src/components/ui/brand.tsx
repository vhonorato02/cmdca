/**
 * Forma da marca: o emblema vetorial usado no cabeçalho. O logo completo oficial continua em
 * /brand/logo-cmdca.jpg e aparece no rodapé.
 */

export function Emblem({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="7" fill="#F6EC27" />
      <ellipse
        cx="24"
        cy="21"
        rx="20.5"
        ry="7.5"
        fill="none"
        stroke="#271A58"
        strokeWidth="2.4"
        transform="rotate(-12 24 21)"
      />
      <g stroke="#271A58" strokeLinecap="round" fill="none">
        <path d="M24 19.5 18.8 39M24 19.5 29.2 39" strokeWidth="4.4" />
        <path d="M12 26.5 9 39M12 26.5 15 39" strokeWidth="3.4" />
        <path d="M36.5 26.5 33.5 39M36.5 26.5 39.5 39M36.5 26 41 21.5" strokeWidth="3.4" />
      </g>
      <g fill="#271A58">
        <circle cx="24" cy="13" r="4.4" />
        <circle cx="12" cy="21.5" r="3.2" />
        <circle cx="36.5" cy="21.5" r="3.2" />
      </g>
    </svg>
  )
}
