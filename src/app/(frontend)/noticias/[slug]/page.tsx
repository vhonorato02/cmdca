import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CATEGORIA_LABEL } from '@/components/NewsCard'
import { Illustration } from '@/components/Illustration'
import { formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo'
import {
  absoluteUrl,
  containsUnverifiedMarker,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  publicHref,
  publicText,
  SITE_NAME,
} from '@/lib/site'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

async function getPost(slug: string): Promise<Noticia | null> {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'noticias',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    .catch(() => ({ docs: [] as Noticia[] }))
  const post = (res.docs[0] as Noticia) || null
  if (
    !post ||
    !publicText(post.title) ||
    containsUnverifiedMarker([post.title, post.resumo, post.corpo])
  ) {
    return null
  }
  return post
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'noticias',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      pagination: false,
    })
    .catch(() => ({ docs: [] as Noticia[] }))
  return (res.docs as Noticia[])
    .filter(
      (n) =>
        n.slug && publicText(n.title) && !containsUnverifiedMarker([n.title, n.resumo, n.corpo]),
    )
    .map((n) => ({ slug: n.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) {
    return {
      title: { absolute: 'Notícia não encontrada | CMDCA de Pindamonhangaba' },
      robots: { index: false, follow: false },
    }
  }
  const capa = typeof post.capa === 'object' && post.capa ? post.capa : null
  const path = `/noticias/${encodeURIComponent(slug)}`
  const url = absoluteUrl(path)
  const description = publicText(post.resumo) || `Notícia publicada pelo ${ORGANIZATION_NAME}.`
  const imagePath = publicHref(capa?.url)
  const imageUrl = imagePath ? absoluteUrl(imagePath) : absoluteUrl('/opengraph-image')
  const images = [
    {
      url: imageUrl,
      alt: publicText(capa?.alt) || post.title,
      width: capa?.width || 1200,
      height: capa?.height || 630,
    },
  ]
  return {
    title: { absolute: `${post.title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      publishedTime: post.data || undefined,
      modifiedTime: post.updatedAt || post.data || undefined,
      authors: [ORGANIZATION_NAME],
      section: CATEGORIA_LABEL[post.categoria] || 'Notícias',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const capa = typeof post.capa === 'object' && post.capa ? post.capa : null
  const canonical = absoluteUrl(`/noticias/${encodeURIComponent(slug)}`)
  const imagePath = publicHref(capa?.url)
  const imageUrl = imagePath ? absoluteUrl(imagePath) : absoluteUrl('/opengraph-image')
  const category = CATEGORIA_LABEL[post.categoria] || 'Notícia'
  const articleLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${canonical}#article`,
        headline: post.title,
        description: publicText(post.resumo) || undefined,
        datePublished: post.data || undefined,
        dateModified: post.updatedAt || post.data || undefined,
        inLanguage: 'pt-BR',
        articleSection: category,
        author: { '@id': ORGANIZATION_ID() },
        publisher: {
          '@type': 'GovernmentOrganization',
          '@id': ORGANIZATION_ID(),
          name: ORGANIZATION_NAME,
          url: absoluteUrl('/'),
          logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/logo-cmdca.jpg') },
        },
        image: [imageUrl],
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      },
      breadcrumbJsonLd([
        { name: 'Início', path: '/' },
        { name: 'Notícias', path: '/noticias' },
        { name: post.title, path: `/noticias/${encodeURIComponent(slug)}` },
      ]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleLd) }}
      />
      <div className="wrap post-head">
        <nav aria-label="Navegação estrutural" style={{ marginBottom: 16 }}>
          <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/noticias">Notícias</Link>
        </nav>
        <div style={{ height: 10 }} />
        <span className="tag">{category}</span>
        <h1>{post.title}</h1>
        <div className="post-meta">
          {post.data ? <span>{formatDateLong(post.data)}</span> : null}
          {publicText(post.autor) ? <span>{publicText(post.autor)}</span> : null}
          {post.updatedAt && post.updatedAt !== post.data ? (
            <span>Atualizado em {formatDateLong(post.updatedAt)}</span>
          ) : null}
        </div>
      </div>
      <div className="wrap">
        <div className="post-cover vis">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={publicText(capa?.alt) || post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width:1140px) 100vw, 1100px"
            />
          ) : (
            <>
              <Illustration theme={post.tema || 'familia'} />
              <span className="credit">ilustração CMDCA</span>
            </>
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="post-body">{post.corpo ? <RichText data={post.corpo} /> : null}</div>
      </div>
      <div style={{ height: 36 }} />
    </>
  )
}
