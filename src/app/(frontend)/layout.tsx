import type { Metadata } from 'next'
import { Newsreader, Public_Sans } from 'next/font/google'
import React from 'react'

import { A11yBar } from '@/components/A11yBar'
import { GrainFilter } from '@/components/GrainFilter'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { VLibras } from '@/components/VLibras'
import { absoluteUrl, DEFAULT_DESCRIPTION, getSiteUrl, SITE_NAME } from '@/lib/site'

import './globals.css'

const publicSans = Public_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-public-sans',
})

const newsreader = Newsreader({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'CMDCA de Pindamonhangaba — Direitos da Criança e do Adolescente',
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'governo',
  icons: { icon: '/brand/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: 'CMDCA de Pindamonhangaba — Direitos da Criança e do Adolescente',
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl('/'),
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: 'CMDCA de Pindamonhangaba — direitos da criança e do adolescente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMDCA de Pindamonhangaba | Direitos da Criança e do Adolescente',
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl('/opengraph-image')],
  },
  formatDetection: { address: false, email: false, telephone: false },
}

// Antes da pintura: marca .js (para a animação reveal) e reaplica as preferências
// de acessibilidade salvas (alto contraste e tamanho de fonte) sem flash.
const A11Y_INIT = `(function(){try{var d=document.documentElement;d.classList.add('js');if(localStorage.getItem('cmdca-contrast')==='1')d.classList.add('contrast');var f=localStorage.getItem('cmdca-fs');if(f)d.style.setProperty('--fs',f+'%');}catch(e){}})();`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Pular para o conteúdo
        </a>
        <A11yBar />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <GrainFilter />
        <VLibras />
      </body>
    </html>
  )
}
