import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ActFilters, hrefWith, pickParam, yearOf, yearOptions } from '@/components/ActFilters'
import { ActItem, ActList, Tag } from '@/components/ui/ActList'
import { ButtonLink } from '@/components/ui/Button'
import { ChevronRight } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination, parsePage } from '@/components/ui/Pagination'
import { Callout, EmptyState, ErrorState } from '@/components/ui/states'
import { getTextos } from '@/lib/content'
import { dateParts } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicHref, publicText } from '@/lib/site'
import type { Reunioe } from '@/payload-types'

const PER_PAGE = 20
const TIPO_LABEL: Record<string, string> = { ordinaria: 'Ordinária', extraordinaria: 'Extraordinária' }
const MODALIDADE: Record<string, string> = { presencial: 'Presencial', online: 'Online', hibrida: 'Híbrida' }

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Reuniões do CMDCA | Calendário, pautas e atas',
    description: textos.atos.reunioesIntro,
    path: '/reunioes',
  })
}

async function load(): Promise<Reunioe[] | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'reunioes',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 1000,
      depth: 1,
    })
    return (res.docs as Reunioe[]).filter((r) => publicText(r.titulo) && !containsUnverifiedMarker(r))
  } catch {
    return null
  }
}

/** Reuniões guardam a data à meia-noite UTC: compara por dia do calendário. */
function isUpcoming(value: string | null | undefined, today: number) {
  if (!value) return false
  const d = new Date(value)
  return !Number.isNaN(d.getTime()) && Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) >= today
}

function Meeting({ r, upcoming }: { r: Reunioe; upcoming: boolean }) {
  const parts = dateParts(r.data)
  const titulo = publicText(r.titulo) as string
  const local = publicText(r.local)
  const hora = publicText(r.hora)
  const link = publicHref(r.linkTransmissao)
  const ata = typeof r.ata === 'object' && r.ata ? publicHref(r.ata.url) : undefined
  const modalidade = MODALIDADE[r.modalidade ?? 'presencial'] ?? 'Presencial'
  return (
    <ActItem
      numeral={parts?.day ?? '--'}
      numeralLabel={parts?.monthYear}
      numeralDateTime={r.data ?? undefined}
      title={titulo}
      headingLevel={3}
      badges={<Tag>{TIPO_LABEL[r.tipo] ?? r.tipo}</Tag>}
      meta={
        <>
          <p className="act__meta">
            {hora ? `Horário: ${hora}. ` : ''}
            {modalidade}
          </p>
          {local ? <p className="act__meta">{local}</p> : null}
        </>
      }
      actions={
        <>
          {upcoming && link ? (
            <a
              className="btn btn--primary btn--sm"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Acessar reunião: ${titulo} (abre em nova aba)`}
            >
              Acessar reunião
            </a>
          ) : null}
          {ata ? (
            <a
              className="btn btn--secondary btn--sm"
              href={ata}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ata em PDF de ${titulo} (abre em nova aba)`}
            >
              Ata em PDF
            </a>
          ) : (
            <span className="act__note">{upcoming ? 'A ata sai depois da reunião' : 'Ata ainda não publicada'}</span>
          )}
        </>
      }
    >
      {r.pauta?.root?.children?.length ? (
        <details className="disclosure">
          <summary>
            <ChevronRight />
            Ver a pauta
          </summary>
          <div className="disclosure__body prose">
            <RichText data={r.pauta} />
          </div>
        </details>
      ) : null}
    </ActItem>
  )
}

export default async function ReunioesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [textos, docs, params] = await Promise.all([getTextos(), load(), searchParams])
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const ano = pickParam(params.ano)
  const tipo = pickParam(params.tipo)
  const filtered = (docs ?? []).filter(
    (r) => (ano === 'todos' || yearOf(r.data) === ano) && (tipo === 'todos' || r.tipo === tipo),
  )
  const proximas = filtered.filter((r) => isUpcoming(r.data, today)).reverse()
  const realizadas = filtered.filter((r) => !isUpcoming(r.data, today))
  const total = Math.max(1, Math.ceil(realizadas.length / PER_PAGE))
  const page = parsePage(params.pagina, total)
  const pagina = realizadas.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <PageHeader
        title={textos.atos.reunioesTitulo}
        lead={textos.atos.reunioesIntro}
        crumbs={[{ label: 'Participe', href: '/participe' }]}
      />
      <div className="section">
        <div className="wrap">
          {docs === null ? (
            <ErrorState
              title="Não foi possível carregar o calendário"
              action={<ButtonLink href="/reunioes">Tentar de novo</ButtonLink>}
            >
              O banco de dados não respondeu. Tente de novo em alguns minutos.
            </ErrorState>
          ) : docs.length ? (
            <>
              <ActFilters
                action="/reunioes"
                fields={[
                  { name: 'ano', label: 'Ano', options: yearOptions(docs.map((d) => d.data)), value: ano },
                  {
                    name: 'tipo',
                    label: 'Tipo de reunião',
                    value: tipo,
                    options: [
                      { value: 'todos', label: 'Todos os tipos' },
                      { value: 'ordinaria', label: 'Ordinária' },
                      { value: 'extraordinaria', label: 'Extraordinária' },
                    ],
                  },
                ]}
                resultLabel={`${filtered.length} ${filtered.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}`}
              />
              {filtered.length ? (
                <>
                  {proximas.length && page === 1 ? (
                    <>
                      <h2 className="group-title">Próximas reuniões</h2>
                      <ActList>
                        {proximas.map((r) => (
                          <Meeting key={r.id} r={r} upcoming />
                        ))}
                      </ActList>
                    </>
                  ) : null}
                  {pagina.length ? (
                    <>
                      <h2 className="group-title">Reuniões realizadas</h2>
                      <ActList>
                        {pagina.map((r) => (
                          <Meeting key={r.id} r={r} upcoming={false} />
                        ))}
                      </ActList>
                    </>
                  ) : null}
                  <Pagination current={page} total={total} buildHref={(p) => hrefWith('/reunioes', { ano, tipo }, p)} />
                </>
              ) : (
                <EmptyState
                  title="Nenhuma reunião neste filtro"
                  action={<ButtonLink href="/reunioes" variant="secondary">Limpar filtros</ButtonLink>}
                />
              )}
            </>
          ) : (
            <EmptyState title="O calendário ainda não foi publicado">
              As reuniões entram aqui com data, horário, local e pauta assim que forem marcadas.
              Enquanto isso, veja as <Link href="/resolucoes">resoluções</Link> já aprovadas.
            </EmptyState>
          )}
          <div className="mt-7">
            <Callout title="Como acompanhar">
              <p>{textos.atos.reunioesComoAcompanhar}</p>
            </Callout>
          </div>
        </div>
      </div>
    </>
  )
}
