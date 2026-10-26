import Link from 'next/link'

export type FilterOption = { value: string; label: string }
export type FilterField = { name: string; label: string; options: FilterOption[]; value: string }

/**
 * Filtro por formulário GET: funciona sem JavaScript e mantém o estado na URL,
 * o que permite compartilhar e voltar com o navegador.
 */
export function ActFilters({
  action,
  fields,
  resultLabel,
}: {
  action: string
  fields: FilterField[]
  resultLabel: string
}) {
  const active = fields.some((field) => field.value !== 'todos')
  return (
    <>
      <form className="filters" action={action} method="get" role="search" aria-label="Filtrar a lista">
        {fields.map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={`filtro-${field.name}`}>{field.label}</label>
            <select id={`filtro-${field.name}`} name={field.name} defaultValue={field.value}>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" className="btn btn--primary">
          Filtrar
        </button>
        {active ? (
          <Link className="btn btn--secondary" href={action}>
            Limpar filtros
          </Link>
        ) : null}
      </form>
      <p className="results-status" role="status">
        {resultLabel}
      </p>
    </>
  )
}

export const pickParam = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? 'todos'

export function yearOptions(dates: (string | null | undefined)[]): FilterOption[] {
  const years = new Set<number>()
  for (const value of dates) {
    const year = value ? new Date(value).getUTCFullYear() : NaN
    if (Number.isFinite(year)) years.add(year)
  }
  return [
    { value: 'todos', label: 'Todos os anos' },
    ...[...years].sort((a, b) => b - a).map((y) => ({ value: String(y), label: String(y) })),
  ]
}

export const yearOf = (value?: string | null) =>
  value ? String(new Date(value).getUTCFullYear()) : ''

/** Monta o endereço preservando filtros e trocando só a página. */
export function hrefWith(path: string, params: Record<string, string>, page: number) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value && value !== 'todos') query.set(key, value)
  if (page > 1) query.set('pagina', String(page))
  const qs = query.toString()
  return qs ? `${path}?${qs}` : path
}
