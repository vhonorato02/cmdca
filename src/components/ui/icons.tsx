import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

/** Indica link que abre em outra aba ou outro site. */
export const ExternalIcon = (props: IconProps) => (
  <svg {...base} strokeWidth={2.2} className="ext-icon" {...props}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

export const ChevronRight = (props: IconProps) => (
  <svg {...base} strokeWidth={2.5} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const Plus = (props: IconProps) => (
  <svg {...base} strokeWidth={2.5} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Phone = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6.6 3.5 9 3l1.6 4.2-2 1.5a12 12 0 0 0 6.7 6.7l1.5-2L21 15l-.5 2.4A2 2 0 0 1 18.6 19 15.6 15.6 0 0 1 5 5.4a2 2 0 0 1 1.6-1.9Z" />
  </svg>
)

export const Menu = (props: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Close = (props: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Document = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
)

export const Calendar = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M4 10h16" />
  </svg>
)

export const Search = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
)

export const Alert = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </svg>
)

export const Shield = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const Coins = (props: IconProps) => (
  <svg {...base} {...props}>
    <ellipse cx="9" cy="7" rx="5" ry="2.5" />
    <path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7M10 16.5c.6 1.3 2.6 2 5 2 2.8 0 5-1.1 5-2.5v-4c0-1.4-2.2-2.5-5-2.5" />
  </svg>
)

export const Gavel = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m14 4 6 6M11 7l6 6M12.5 5.5 8 10l6 6 4.5-4.5M10 13l-6.5 6.5M3 21h8" />
  </svg>
)

export const LifeBuoy = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
  </svg>
)

export const MapPin = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const Mail = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export const Clock = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Instagram = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8h.01" />
  </svg>
)

/** Meio círculo cheio: alto contraste. */
export const Contrast = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
  </svg>
)

/** Mão aberta: tradução para Libras. */
export const Hand = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v7M14 10.5V5.5a1.5 1.5 0 0 1 3 0V13" />
    <path d="M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3.8 14.9a1.6 1.6 0 0 1 2.5-2L8 15" />
  </svg>
)

export const ArrowUp = (props: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

export const Copy = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)

export const Check = (props: IconProps) => (
  <svg {...base} strokeWidth={2.6} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const Compass = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </svg>
)

export const Building = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M9 11h.01M15 11h.01" />
  </svg>
)

export const Ballot = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 13h16v8H4ZM8 13V4h8v9" />
    <path d="m10 8 1.5 1.5L14 7" />
  </svg>
)

export const Scale = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 4v17M7 21h10M5 7h14M12 4l-1 3h2Z" />
    <path d="m5 7-3 7a3 3 0 0 0 6 0ZM19 7l-3 7a3 3 0 0 0 6 0Z" />
  </svg>
)

export const People = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13a5.5 5.5 0 0 1 5.5 5.5V20M15 14.2a4.5 4.5 0 0 1 6 4.3V20" />
  </svg>
)

const TOPICS: [RegExp, (props: IconProps) => ReactNode][] = [
  [/fundo|fmdca|recurso|imposto/, Coins],
  [/tutelar|escolha|elei/, Ballot],
  [/entidade|programa|registr/, Building],
  [/politica|diretriz|plano/, Compass],
  [/fiscaliz|lei|resolu|delibera/, Scale],
  [/reuni|particip|conferen|pessoa/, People],
]

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Escolhe um ícone pelo assunto de um texto editável no CMS: primeiro o título, depois o texto. */
export function TopicIcon({ title, text = '', className }: { title: string; text?: string; className?: string }) {
  const t = normalize(title)
  const d = normalize(text)
  const Icon = TOPICS.find(([re]) => re.test(t))?.[1] ?? TOPICS.find(([re]) => re.test(d))?.[1] ?? Check
  return <Icon className={className} />
}

/** Pictogramas por tema editorial das notícias (campo `tema`). */
const PICTOGRAMS: Record<string, ReactNode> = {
  familia: (
    <>
      <circle cx="8" cy="6" r="2.5" />
      <circle cx="16.5" cy="8" r="2" />
      <path d="M4.5 21v-6a3.5 3.5 0 0 1 7 0v6M13.5 21v-4.5a3 3 0 0 1 6 0V21" />
    </>
  ),
  maos: (
    <>
      <path d="M3 13.5 7 10l3 2 3-2.5 4 1.5 4 3" />
      <path d="M7 10V5.5a1.5 1.5 0 0 1 3 0V12M13 9.5V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M3 13.5V20h18v-5.5" />
    </>
  ),
  cidade: (
    <>
      <path d="M3 21h18M5 21V9l4-3v15M9 21V11h6v10M15 21V5l4 2v14" />
    </>
  ),
  encontro: (
    <>
      <circle cx="12" cy="5.5" r="2.2" />
      <circle cx="5" cy="10" r="2" />
      <circle cx="19" cy="10" r="2" />
      <path d="M8.5 20v-5a3.5 3.5 0 0 1 7 0v5M2.5 20v-3.5a2.5 2.5 0 0 1 5 0M16.5 16.5a2.5 2.5 0 0 1 5 0V20" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6Z" />
      <path d="M12 9.5c-1-1.4-3.5-1-3.5 1 0 1.8 3.5 3.8 3.5 3.8s3.5-2 3.5-3.8c0-2-2.5-2.4-3.5-1Z" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
}

export function Pictogram({ tema, className }: { tema?: string | null; className?: string }) {
  return (
    <svg {...base} strokeWidth={1.6} className={className}>
      {PICTOGRAMS[tema ?? ''] ?? PICTOGRAMS.doc}
    </svg>
  )
}
