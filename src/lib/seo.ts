import type { Metadata } from 'next'

import { absoluteUrl, DEFAULT_DESCRIPTION, ORGANIZATION_NAME, SITE_NAME } from '@/lib/site'
import { safeJsonLd } from '@/utilities/safeJsonLd'

type PageMetadata = {
  title: string
  description?: string
  path: string
  image?: string
  noIndex?: boolean
}

function metadataImage(image?: string) {
  const url = image
    ? /^https?:\/\//i.test(image)
      ? image
      : absoluteUrl(image)
    : absoluteUrl('/opengraph-image')

  return {
    url,
    width: 1200,
    height: 630,
    alt: 'CMDCA de Pindamonhangaba: direitos de crianças e adolescentes',
  }
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  noIndex = false,
}: PageMetadata): Metadata {
  const canonical = absoluteUrl(path)
  const socialImage = metadataImage(image)

  return {
    title: { absolute: title },
    description,
    keywords: [
      'CMDCA Pindamonhangaba',
      'direitos da criança e do adolescente',
      'proteção de crianças e adolescentes Pindamonhangaba',
      'Conselho Municipal dos Direitos da Criança e do Adolescente',
      'FMDCA Pindamonhangaba',
    ],
    alternates: noIndex ? undefined : { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  }
}

export function serializeJsonLd(value: unknown) {
  return safeJsonLd(value)
}

export function organizationReference() {
  return {
    '@type': 'GovernmentOrganization',
    '@id': `${absoluteUrl('/')}#organization`,
    name: ORGANIZATION_NAME,
    url: absoluteUrl('/'),
  }
}

export function websiteReference() {
  return {
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    inLanguage: 'pt-BR',
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
