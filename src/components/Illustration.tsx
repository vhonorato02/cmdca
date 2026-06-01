import React from 'react'

export type IllTheme = 'familia' | 'maos' | 'cidade' | 'encontro' | 'escudo' | 'doc'

/**
 * Ilustrações SVG autorais — PORTADO VERBATIM da função ill(theme) da prévia.
 * Motivo da órbita do logo. Não alterar o SVG. (A variável "L" da prévia não era
 * usada dentro de ill() e foi omitida; não muda a saída.)
 */
export function illSvg(theme: string): string {
  const I = '#262357',
    A = '#C9A227',
    P = '#F4F2EB',
    C = '#9C2A22'
  const bg =
    '<defs><linearGradient id="g' +
    theme +
    '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d2a63"/><stop offset="1" stop-color="#16142f"/></linearGradient></defs><rect width="400" height="250" fill="url(#g' +
    theme +
    ')"/>'
  const orb =
    '<ellipse cx="210" cy="120" rx="150" ry="54" fill="none" stroke="' +
    A +
    '" stroke-width="2.5" opacity=".55" transform="rotate(-12 210 120)"/>'
  const fig = (x: number, y: number, s: number, col: string) =>
    '<g transform="translate(' +
    x +
    ' ' +
    y +
    ')"><circle cx="0" cy="0" r="' +
    11 * s +
    '" fill="' +
    col +
    '"/><path d="M0 ' +
    11 * s +
    ' L' +
    -13 * s +
    ' ' +
    55 * s +
    ' M0 ' +
    11 * s +
    ' L' +
    13 * s +
    ' ' +
    55 * s +
    ' M' +
    -11 * s +
    ' ' +
    30 * s +
    ' L' +
    11 * s +
    ' ' +
    30 * s +
    '" stroke="' +
    col +
    '" stroke-width="' +
    9 * s +
    '" stroke-linecap="round" fill="none"/></g>'
  let s = ''
  if (theme === 'familia') {
    s = orb + fig(165, 95, 1.25, P) + fig(245, 108, 0.95, A)
  } else if (theme === 'maos') {
    s =
      orb +
      fig(205, 92, 1, P) +
      '<path d="M120 200 q40 -55 90 -55 q50 0 90 55" fill="none" stroke="' +
      A +
      '" stroke-width="5" stroke-linecap="round"/><path d="M110 210 q50 -70 100 -70 q50 0 100 70" fill="none" stroke="' +
      P +
      '" stroke-width="3" opacity=".5"/>'
  } else if (theme === 'cidade') {
    s =
      orb +
      '<circle cx="320" cy="74" r="26" fill="' +
      A +
      '" opacity=".9"/><g fill="' +
      P +
      '" opacity=".92"><rect x="70" y="150" width="34" height="80"/><rect x="112" y="120" width="38" height="110"/><rect x="158" y="160" width="30" height="70"/><rect x="196" y="100" width="42" height="130"/><rect x="246" y="140" width="34" height="90"/><rect x="288" y="120" width="40" height="110"/></g><g fill="' +
      I +
      '"><rect x="120" y="135" width="8" height="8"/><rect x="134" y="135" width="8" height="8"/><rect x="206" y="118" width="9" height="9"/><rect x="220" y="118" width="9" height="9"/></g>'
  } else if (theme === 'encontro') {
    s =
      orb +
      fig(135, 110, 0.8, P) +
      fig(200, 98, 0.85, A) +
      fig(265, 112, 0.8, P) +
      '<path d="M135 150 H265" stroke="' +
      P +
      '" stroke-width="2" opacity=".4" stroke-dasharray="4 5"/>'
  } else if (theme === 'escudo') {
    s =
      orb +
      '<path d="M210 70 l60 22 v36 c0 50 -38 76 -60 86 c-22 -10 -60 -36 -60 -86 v-36 z" fill="none" stroke="' +
      A +
      '" stroke-width="3"/><path d="M210 120 c-7 -12 -28 -10 -28 6 c0 14 16 22 28 32 c12 -10 28 -18 28 -32 c0 -16 -21 -18 -28 -6z" fill="' +
      C +
      '"/>'
  } else {
    s =
      orb +
      '<rect x="150" y="78" width="100" height="120" rx="5" fill="' +
      P +
      '"/><path d="M168 104 H232 M168 124 H232 M168 144 H214" stroke="' +
      I +
      '" stroke-width="4" stroke-linecap="round"/><path d="M225 78 v22 h22" fill="none" stroke="' +
      A +
      '" stroke-width="4"/>'
  }
  return (
    '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
    bg +
    s +
    '<rect width="400" height="250" filter="url(#grain)" opacity="0.06"/></svg>'
  )
}

/** Renderiza a ilustração autoral no tema indicado (preenche o container). */
export function Illustration({ theme = 'familia', className }: { theme?: string; className?: string }) {
  return (
    <span
      className={className ? `ill ${className}` : 'ill'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: illSvg(theme) }}
    />
  )
}
