import React from 'react'

/**
 * Filtro de grão SVG (portado verbatim da prévia). Renderizado uma vez no layout;
 * as ilustrações (ill) referenciam url(#grain).
 */
export function GrainFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  )
}
