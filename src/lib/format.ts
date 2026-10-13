const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

/** dd/MM/yyyy (em UTC, para não deslocar o dia). */
export function formatDate(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getUTCFullYear()}`
}

/** "22 de setembro de 2025" */
export function formatDateLong(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}

function timeOf(value?: string | null): number | null {
  if (!value) return null
  const t = new Date(value).getTime()
  return Number.isNaN(t) ? null : t
}

/**
 * Mais recentes primeiro. Itens sem data vão para o fim (o Postgres coloca nulos
 * no topo em ordem decrescente), desempatando pela data de criação.
 */
export function sortByDateDesc<T extends { data?: string | null; createdAt?: string | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const da = timeOf(a.data)
    const db = timeOf(b.data)
    if (da !== null && db !== null && da !== db) return db - da
    if (da === null && db !== null) return 1
    if (db === null && da !== null) return -1
    return (timeOf(b.createdAt) ?? 0) - (timeOf(a.createdAt) ?? 0)
  })
}
