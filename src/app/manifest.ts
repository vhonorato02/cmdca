import type { MetadataRoute } from 'next'

import { DEFAULT_DESCRIPTION, ORGANIZATION_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ORGANIZATION_NAME,
    short_name: 'CMDCA Pinda',
    description: DEFAULT_DESCRIPTION,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'browser',
    lang: 'pt-BR',
    dir: 'ltr',
    background_color: '#f5f1e8',
    theme_color: '#1a1140',
    categories: ['government', 'education', 'social'],
    icons: [
      { src: '/brand/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/brand/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: 'Reuniões', url: '/reunioes' },
      { name: 'Resoluções', url: '/resolucoes' },
      { name: 'Editais', url: '/editais' },
      { name: 'Doe pelo Imposto de Renda', url: '/fmdca' },
    ],
  }
}
