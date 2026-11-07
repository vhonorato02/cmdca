import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next, Newsreader } from 'next/font/google'
import React from 'react'

import { canaisDaFaixa, ProtectionBar, ProtectionDock } from '@/components/layout/Protection'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { BackToTop } from '@/components/ui/BackToTop'
import { canaisDiscaveis, getInstituicao, getTextos } from '@/lib/content'
import { getSiteNavigation } from '@/lib/navigation'
import { absoluteUrl, DEFAULT_DESCRIPTION, getSiteUrl, SITE_NAME } from '@/lib/site'

import './globals.css'

// Títulos e numerais: serifa editorial com eixo óptico (desenho de texto em tamanhos
// pequenos, de título nos grandes). Acentos do português conferidos.
const newsreader = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-newsreader',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

// Texto e interface: desenhada para leitores com baixa visão.
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atkinson',
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'CMDCA de Pindamonhangaba | Direitos da Criança e do Adolescente',
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'governo',
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: 'CMDCA de Pindamonhangaba | Direitos da Criança e do Adolescente',
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl('/'),
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: 'CMDCA de Pindamonhangaba: direitos da criança e do adolescente',
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

export const viewport: Viewport = {
  themeColor: '#1a1140',
  colorScheme: 'light',
}

// Antes da pintura: reaplica alto contraste e tamanho de letra salvos, sem piscar.
const A11Y_INIT = `(function(){try{var d=document.documentElement;if(localStorage.getItem('cmdca-contrast')==='1')d.classList.add('contrast');var f=parseInt(localStorage.getItem('cmdca-fs')||'',10);if(f>=90&&f<=130)d.style.setProperty('--fs',f+'%');}catch(e){}})();`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [navigation, textos, instituicao] = await Promise.all([
    getSiteNavigation(),
    getTextos(),
    getInstituicao(),
  ])
  const canais = canaisDiscaveis(textos.protecao.canais)
  const faixa = canaisDaFaixa(canais)

  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${atkinson.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline de propósito: precisa rodar antes da primeira pintura para não piscar. */}
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <ProtectionBar chamada={textos.protecao.chamada} canais={faixa} />
        <SiteHeader links={navigation.menuPrincipal} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter
          instituicao={instituicao}
          descricao={textos.geral.rodapeDescricao}
          institucional={navigation.rodapeInstitucional}
          sobreSite={navigation.rodapeSobreSite}
          canais={faixa}
        />
        <BackToTop />
        <ProtectionDock canais={faixa} />
      </body>
    </html>
  )
}
