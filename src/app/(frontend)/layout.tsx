import type { Metadata } from 'next'
import React from 'react'

import { A11yBar } from '@/components/A11yBar'
import { GrainFilter } from '@/components/GrainFilter'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { VLibras } from '@/components/VLibras'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'CMDCA Pindamonhangaba',
    template: '%s · CMDCA Pindamonhangaba',
  },
  description:
    'Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba — proteção, participação e transparência para a infância.',
  icons: { icon: '/brand/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'CMDCA Pindamonhangaba',
    title: 'CMDCA Pindamonhangaba',
    description:
      'Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba.',
    images: ['/brand/logo-cmdca.jpg'],
  },
  twitter: { card: 'summary' },
}

// Antes da pintura: marca .js (para a animação reveal) e reaplica as preferências
// de acessibilidade salvas (alto contraste e tamanho de fonte) sem flash.
const A11Y_INIT = `(function(){try{var d=document.documentElement;d.classList.add('js');if(localStorage.getItem('cmdca-contrast')==='1')d.classList.add('contrast');var f=localStorage.getItem('cmdca-fs');if(f)d.style.setProperty('--fs',f+'%');}catch(e){}})();`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fontes carregadas no layout raiz (aplicam a todo o site) — regra do pages router não se aplica. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Public+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Pular para o conteúdo
        </a>
        <A11yBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <GrainFilter />
        <VLibras />
      </body>
    </html>
  )
}
