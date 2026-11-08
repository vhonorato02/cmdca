import type { Metadata } from 'next'

import { AppLink as Link } from '@/components/ui/AppLink'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { normalizarTermo, PESQUISA_MAX, PESQUISA_MIN, pesquisar } from '@/lib/pesquisa'
import { createMetadata } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const termo = normalizarTermo((await searchParams).q)
  return createMetadata({
    title: termo ? `Pesquisa: ${termo} | CMDCA de Pindamonhangaba` : 'Pesquisar no portal | CMDCA de Pindamonhangaba',
    description: 'Pesquise páginas, notícias, resoluções, editais, reuniões e entidades do portal do CMDCA.',
    path: '/pesquisa',
    // Páginas de resultado não vão para buscadores; a página vazia, sim.
    noIndex: Boolean(termo),
  })
}

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const termo = normalizarTermo((await searchParams).q)
  const curto = termo.length > 0 && termo.length < PESQUISA_MIN
  const resultados = termo && !curto ? await pesquisar(await getPayloadClient(), termo) : []

  return (
    <>
      <PageHeader
        title="Pesquisar no portal"
        lead="Encontre páginas, notícias, resoluções, editais, reuniões e entidades registradas."
      />
      <div className="section">
        <div className="wrap">
          <form className="search-form" action="/pesquisa" method="get" role="search">
            <label htmlFor="pesquisa-termo">O que você procura?</label>
            <div className="search-form__row">
              <input
                id="pesquisa-termo"
                name="q"
                type="search"
                defaultValue={termo}
                minLength={PESQUISA_MIN}
                maxLength={PESQUISA_MAX}
                autoComplete="off"
                enterKeyHint="search"
              />
              <button type="submit" className="btn btn--primary">
                Pesquisar
              </button>
            </div>
          </form>

          <div className="search-results" aria-live="polite">
            {curto ? (
              <p className="muted">Digite pelo menos {PESQUISA_MIN} letras.</p>
            ) : resultados === null ? (
              <ErrorState title="A pesquisa não respondeu">
                Tente de novo em instantes ou use o <Link href="/mapa-do-site">mapa do site</Link>.
              </ErrorState>
            ) : termo && resultados.length === 0 ? (
              <EmptyState title={`Nada encontrado para “${termo}”`}>
                Tente outra palavra, sem acento ou mais curta. Também é possível navegar pelo{' '}
                <Link href="/mapa-do-site">mapa do site</Link> ou pedir a informação pela{' '}
                <Link href="/acesso-a-informacao">Lei de Acesso à Informação</Link>.
              </EmptyState>
            ) : termo ? (
              <>
                <p className="search-results__count" role="status">
                  {resultados.length === 1 ? '1 resultado' : `${resultados.length} resultados`} para “{termo}”
                </p>
                <ul className="search-results__list">
                  {resultados.map((r) => (
                    <li key={`${r.tipo}-${r.href}-${r.titulo}`} className="search-result">
                      <p className="search-result__meta">
                        <span className="tag">{r.tipo}</span>
                        {r.data ? <time dateTime={r.data}>{formatDateLong(r.data)}</time> : null}
                      </p>
                      <h2 className="search-result__title">
                        <Link href={r.href}>{r.titulo}</Link>
                      </h2>
                      {r.resumo ? <p className="muted">{r.resumo}</p> : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="muted">
                Precisa de ajuda para uma criança ou adolescente? Vá direto para{' '}
                <Link href="/ajuda">Buscar ajuda</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
