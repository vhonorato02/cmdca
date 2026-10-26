import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { PageHeader } from '@/components/ui/PageHeader'
import { getInstituicao, type Instituicao } from '@/lib/content'
import { formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicHref, publicText } from '@/lib/site'
import type { Pagina } from '@/payload-types'

export const revalidate = 600

/** Páginas institucionais do CMS (privacidade, termos, acessibilidade e outras). */
const getPagina = cache(async (path: string[]): Promise<Pagina | null> => {
  if (path.length !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path[0])) return null
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'paginas',
      where: { slug: { equals: path[0] }, _status: { equals: 'published' } },
      limit: 1,
      depth: 0,
    })
    const pagina = (res.docs[0] as Pagina | undefined) ?? null
    if (!pagina || !publicText(pagina.titulo) || containsUnverifiedMarker(pagina.corpo)) return null
    return pagina
  } catch {
    return null
  }
})

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'paginas',
      where: { _status: { equals: 'published' } },
      limit: 100,
      depth: 0,
      pagination: false,
    })
    return (res.docs as Pagina[]).map((p) => ({ path: [p.slug] }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>
}): Promise<Metadata> {
  const { path } = await params
  const pagina = await getPagina(path)
  if (!pagina) {
    return createMetadata({
      title: 'Página não encontrada | CMDCA de Pindamonhangaba',
      description: 'O endereço solicitado não foi encontrado.',
      path: '/404',
      noIndex: true,
    })
  }
  return createMetadata({
    title: `${pagina.titulo} | CMDCA de Pindamonhangaba`,
    description: publicText(pagina.resumo),
    path: `/${pagina.slug}`,
  })
}

function ContactBox({ tipo, instituicao }: { tipo: Pagina['contato']; instituicao: Instituicao }) {
  if (tipo === 'encarregado') {
    const { controlador, encarregado, encarregadoContato } = instituicao.lgpd
    const contatoHref = encarregadoContato
      ? encarregadoContato.includes('@')
        ? `mailto:${encarregadoContato}`
        : publicHref(encarregadoContato)
      : undefined
    return (
      <aside className="contact-card" aria-labelledby="contato-titulo">
        <h2 id="contato-titulo" className="callout__title">
          Fale sobre seus dados
        </h2>
        <dl>
          {controlador ? (
            <div>
              <dt>Controlador</dt>
              <dd>{controlador}</dd>
            </div>
          ) : null}
          <div>
            <dt>Encarregado de dados</dt>
            <dd>{encarregado ?? 'Em confirmação pela Prefeitura.'}</dd>
          </div>
          {contatoHref && encarregadoContato ? (
            <div>
              <dt>Canal do encarregado</dt>
              <dd>
                <a href={contatoHref}>{encarregadoContato}</a>
              </dd>
            </div>
          ) : instituicao.email ? (
            <div>
              <dt>Enquanto isso, escreva para</dt>
              <dd>
                <a href={`mailto:${instituicao.email}?subject=Privacidade%20e%20prote%C3%A7%C3%A3o%20de%20dados`}>
                  {instituicao.email}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </aside>
    )
  }
  if (tipo === 'institucional' && (instituicao.email || instituicao.telefone)) {
    return (
      <aside className="contact-card" aria-labelledby="contato-titulo">
        <h2 id="contato-titulo" className="callout__title">
          Fale com o CMDCA
        </h2>
        <dl>
          {instituicao.email ? (
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${instituicao.email}`}>{instituicao.email}</a>
              </dd>
            </div>
          ) : null}
          {instituicao.telefone ? (
            <div>
              <dt>Telefone</dt>
              <dd>{instituicao.telefone}</dd>
            </div>
          ) : null}
        </dl>
      </aside>
    )
  }
  return null
}

export default async function InstitutionalPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pagina = await getPagina(path)
  if (!pagina) notFound()
  const instituicao = await getInstituicao()
  const updated = formatDateLong(pagina.atualizadoEm)

  return (
    <>
      <PageHeader
        title={pagina.titulo}
        lead={publicText(pagina.resumo)}
        meta={
          updated ? (
            <>
              Atualizado em <time dateTime={pagina.atualizadoEm}>{updated}</time>
            </>
          ) : undefined
        }
      />
      <div className="section">
        <div className="wrap grid-2">
          <div className="prose">
            <RichText data={pagina.corpo} />
          </div>
          <ContactBox tipo={pagina.contato} instituicao={instituicao} />
        </div>
      </div>
    </>
  )
}
