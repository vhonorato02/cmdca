import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CATEGORIA_LABEL } from '@/components/NewsCard'
import { Illustration } from '@/components/Illustration'
import { formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
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
  return (res.docs[0] as Noticia) || null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'noticias',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      pagination: false,
    })
    .catch(() => ({ docs: [] as Noticia[] }))
  return (res.docs as Noticia[]).filter((n) => n.slug).map((n) => ({ slug: n.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Notícia não encontrada' }
  return {
    title: post.title,
    description: post.resumo || undefined,
    openGraph: { title: post.title, description: post.resumo || undefined, type: 'article' },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const capa = typeof post.capa === 'object' && post.capa ? post.capa : null

  return (
    <>
      <div className="wrap post-head">
        <Link className="mini" href="/noticias" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← Voltar às notícias
        </Link>
        <div style={{ height: 10 }} />
        <span className="tag">{CATEGORIA_LABEL[post.categoria] || 'Notícia'}</span>
        <h1>{post.title}</h1>
        <div className="post-meta">
          {post.data ? <span>{formatDateLong(post.data)}</span> : null}
          {post.autor ? <span>{post.autor}</span> : null}
          <span>Leitura rápida</span>
        </div>
      </div>
      <div className="wrap">
        <div className="post-cover vis">
          {capa?.url ? (
            <Image src={capa.url} alt={capa.alt || post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:1140px) 100vw, 1100px" />
          ) : (
            <>
              <Illustration theme={post.tema || 'familia'} />
              <span className="credit">ilustração CMDCA</span>
            </>
          )}
        </div>
      </div>
      <div className="wrap">
        <div className="post-body">
          {post.corpo ? <RichText data={post.corpo} /> : null}
        </div>
      </div>
      <div style={{ height: 36 }} />
    </>
  )
}
