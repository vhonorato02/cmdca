import { AppLink as Link } from '@/components/ui/AppLink'

import { ArrowLeft, ArrowRight } from './icons'

/** Converte `?pagina=` em número válido dentro do total. */
export function parsePage(value: string | string[] | undefined, totalPages = Infinity): number {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw ?? '1', 10)
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.min(page, Math.max(1, totalPages))
}

function pageWindow(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) =>
    index && page - sorted[index - 1] > 1 ? (['gap', page] as const) : [page],
  )
}

/**
 * Paginação acessível por links (funciona sem JavaScript e mantém o estado na
 * URL). `buildHref` recebe o número da página e devolve o endereço.
 */
export function Pagination({
  current,
  total,
  buildHref,
}: {
  current: number
  total: number
  buildHref: (page: number) => string
}) {
  if (total <= 1) return null
  return (
    <nav className="pagination" aria-label="Paginação">
      <ul>
        {current > 1 ? (
          <li>
            <Link href={buildHref(current - 1)} rel="prev">
              <ArrowLeft width={18} height={18} />
              <span className="sr-only">Página anterior</span>
            </Link>
          </li>
        ) : null}
        {pageWindow(current, total).map((page, index) =>
          page === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={page}>
              {page === current ? (
                <span aria-current="page">
                  <span className="sr-only">Página </span>
                  {page}
                </span>
              ) : (
                <Link href={buildHref(page)}>
                  <span className="sr-only">Página </span>
                  {page}
                </Link>
              )}
            </li>
          ),
        )}
        {current < total ? (
          <li>
            <Link href={buildHref(current + 1)} rel="next">
              <ArrowRight width={18} height={18} />
              <span className="sr-only">Próxima página</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
