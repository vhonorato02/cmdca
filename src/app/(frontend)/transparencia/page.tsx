import type { Metadata } from 'next'
import { AppLink as Link } from '@/components/ui/AppLink'

import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Callout, EmptyState } from '@/components/ui/states'
import { ButtonLink } from '@/components/ui/Button'
import { getConfiguracoes, getTextos } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref } from '@/lib/site'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Transparência do CMDCA e do Fundo | Pindamonhangaba',
    description: textos.transparencia.introducao,
    path: '/transparencia',
  })
}

async function counts() {
  try {
    const payload = await getPayloadClient()
    const published = { _status: { equals: 'published' } } as const
    const [resolucoes, editais, reunioes, entidades] = await Promise.all([
      payload.count({ collection: 'resolucoes', where: published }),
      payload.count({ collection: 'editais', where: published }),
      payload.count({ collection: 'reunioes', where: published }),
      payload.count({ collection: 'entidades', where: published }),
    ])
    return {
      resolucoes: resolucoes.totalDocs,
      editais: editais.totalDocs,
      reunioes: reunioes.totalDocs,
      entidades: entidades.totalDocs,
    }
  } catch {
    return null
  }
}

const plural = (n: number | undefined, one: string, many: string) =>
  n === undefined ? undefined : n === 0 ? 'Nenhum registro ainda' : `${n} ${n === 1 ? one : many}`

export default async function TransparenciaPage() {
  const [textos, config, total] = await Promise.all([getTextos(), getConfiguracoes(), counts()])
  const t = textos.transparencia
  const tribuna = publicHref(config?.tribunaUrl)
  const areas = [
    { href: '/resolucoes', titulo: 'Resoluções', texto: textos.atos.resolucoesIntro, n: plural(total?.resolucoes, 'resolução', 'resoluções') },
    { href: '/editais', titulo: 'Editais', texto: textos.atos.editaisIntro, n: plural(total?.editais, 'edital', 'editais') },
    { href: '/reunioes', titulo: 'Reuniões e atas', texto: textos.atos.reunioesIntro, n: plural(total?.reunioes, 'reunião', 'reuniões') },
    { href: '/entidades', titulo: 'Entidades registradas', texto: textos.atos.entidadesIntro, n: plural(total?.entidades, 'entidade', 'entidades') },
  ]

  return (
    <>
      <PageHeader title={t.titulo} lead={t.introducao} />
      <Section id="atos" title="Atos e registros do conselho">
        <ul className="card-grid">
          {areas.map(({ href, titulo, texto, n }) => (
            <li key={href} className="card">
              <h3 className="card__title">
                <Link href={href}>{titulo}</Link>
              </h3>
              <p className="muted">{texto}</p>
              {n ? <p className="tag">{n}</p> : null}
            </li>
          ))}
        </ul>
      </Section>
      <Section id="fundo" title={t.documentosTitulo} lead={t.documentosTexto} alt>
        <EmptyState
          as="h3"
          title={t.vazio}
          action={
            <div className="actions">
              <ButtonLink href="/fmdca" variant="secondary">
                Como destinar ao Fundo
              </ButtonLink>
              {tribuna ? (
                <ButtonLink href={tribuna} variant="secondary">
                  Pesquisar na imprensa oficial
                </ButtonLink>
              ) : null}
            </div>
          }
        />
      </Section>
      <Section id="pedir-informacao">
        <Callout title="Não encontrou o que procura?">
          <p>
            Qualquer pessoa pode pedir informações públicas ao CMDCA, sem precisar dizer o motivo. A
            resposta vem em até 20 dias, prorrogáveis por mais 10 (Lei de Acesso à Informação).{' '}
            <Link href="/acesso-a-informacao">Veja como pedir</Link>.
          </p>
        </Callout>
      </Section>
    </>
  )
}
