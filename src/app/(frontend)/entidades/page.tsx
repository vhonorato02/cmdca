import type { Metadata } from 'next'
import Link from 'next/link'

import { ENTIDADE_SITUACAO, isPastDate, publicDocuments, statusInfo } from '@/components/officialActs'
import { ActItem, ActList, StatusPill, Tag } from '@/components/ui/ActList'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Callout, EmptyState, ErrorState } from '@/components/ui/states'
import { getTextos } from '@/lib/content'
import { formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'
import type { Entidade } from '@/payload-types'

export const revalidate = 300

const AREA_LABEL: Record<string, string> = {
  educacao: 'Educação',
  saude: 'Saúde',
  cultura_esporte: 'Cultura e esporte',
  assistencia: 'Assistência social',
  acolhimento: 'Acolhimento',
  outro: 'Outra área',
}

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Entidades registradas no CMDCA | Pindamonhangaba',
    description: textos.atos.entidadesIntro,
    path: '/entidades',
  })
}

/** Número curto para o numeral: "Registro 012/2024" vira "012/2024". */
const registroCurto = (value?: string) => value?.replace(/^registro\s*(n[ºo°.]*\s*)?/i, '').trim()

export default async function EntidadesPage() {
  const payload = await getPayloadClient()
  const [textos, res] = await Promise.all([
    getTextos(),
    payload
      .find({
        collection: 'entidades',
        where: { _status: { equals: 'published' } },
        sort: 'nome',
        limit: 500,
        depth: 1,
      })
      .catch(() => null),
  ])
  const docs = res ? (res.docs as Entidade[]).filter((item) => publicText(item.nome)) : null

  return (
    <>
      <PageHeader
        title={textos.atos.entidadesTitulo}
        lead={textos.atos.entidadesIntro}
        crumbs={[{ label: 'Transparência', href: '/transparencia' }]}
      />
      <div className="section">
        <div className="wrap">
          {docs === null ? (
            <ErrorState
              title="Não foi possível carregar as entidades"
              action={<ButtonLink href="/entidades">Tentar de novo</ButtonLink>}
            >
              O banco de dados não respondeu.
            </ErrorState>
          ) : docs.length ? (
            <ActList label="Entidades registradas">
              {docs.map((e) => {
                const nome = publicText(e.nome) as string
                const registro = registroCurto(publicText(e.registro))
                const documentos = publicDocuments(e.documentos)
                const validadePassou = e.situacaoRegistro === 'ativo' && isPastDate(e.validade)
                return (
                  <ActItem
                    key={e.id}
                    numeral={registro || 'Reg.'}
                    numeralLabel={registro ? 'Registro' : 'Sem número'}
                    title={nome}
                    badges={
                      <>
                        <StatusPill status={statusInfo(ENTIDADE_SITUACAO, e.situacaoRegistro)} />
                        <Tag>{e.area ? AREA_LABEL[e.area] || 'Outra área' : 'Área não informada'}</Tag>
                      </>
                    }
                    meta={
                      <>
                        {e.validade ? (
                          <p className="act__meta">
                            Válido até <time dateTime={e.validade}>{formatDateLong(e.validade)}</time>
                          </p>
                        ) : null}
                        {validadePassou ? (
                          <p className="act__meta">
                            A validade publicada já passou. Confirme a situação atual com o conselho.
                          </p>
                        ) : null}
                      </>
                    }
                    actions={
                      documentos.length ? (
                        <>
                          {documentos.map((doc) => (
                            <a
                              key={doc.key}
                              className="btn btn--secondary btn--sm"
                              href={doc.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${doc.label}, de ${nome} (documento, abre em nova aba)`}
                            >
                              {doc.label}
                            </a>
                          ))}
                        </>
                      ) : undefined
                    }
                  />
                )
              })}
            </ActList>
          ) : (
            <EmptyState title="A relação de entidades ainda não foi publicada" />
          )}
          <div className="mt-7">
            <Callout title={textos.atos.entidadesOrientacaoTitulo}>
              <p>{textos.atos.entidadesOrientacao}</p>
              <p className="actions mt-4">
                <Link href="/editais">Editais</Link>
                <Link href="/resolucoes">Resoluções</Link>
                <Link href="/participe">Fale com o conselho</Link>
              </p>
            </Callout>
          </div>
        </div>
      </div>
    </>
  )
}
