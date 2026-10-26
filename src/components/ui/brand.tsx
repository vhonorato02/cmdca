/**
 * Formas da marca: a órbita do logo (assinatura visual, uma por página) e o
 * emblema vetorial usado no cabeçalho. O logo completo oficial continua em
 * /brand/logo-cmdca.jpg e aparece no rodapé.
 */

export function Orbit({ className, strokeWidth = 3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse
        cx="200"
        cy="70"
        rx="196"
        ry="64"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

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

/**
 * Versão em pictograma do símbolo do CMDCA para a capa: três pessoas sob a
 * órbita, desenhadas como sinalização (traço grosso, cantos arredondados).
 */
export function HeroMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 480 360" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M240 118 196 318M240 118l44 200M190 196h100" strokeWidth="30" />
        <path d="M108 206 84 318M108 206l24 112M80 252h56" strokeWidth="22" />
        <path d="M374 192 348 318M374 192l26 126M382 214l44-52M406 156l24-2-2 24" strokeWidth="22" />
      </g>
      <g fill="currentColor">
        <circle cx="240" cy="72" r="32" />
        <circle cx="108" cy="174" r="22" />
        <circle cx="374" cy="158" r="23" />
      </g>
      <ellipse
        cx="240"
        cy="196"
        rx="226"
        ry="74"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        transform="rotate(-12 240 196)"
      />
    </svg>
  )
}
