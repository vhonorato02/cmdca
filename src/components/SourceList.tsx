import { ExternalIcon } from '@/components/ui/icons'

/** Fontes oficiais citadas na página (vêm do CMS). */
export function SourceList({
  title = 'Fontes oficiais',
  items,
}: {
  title?: string
  items: { rotulo: string; url: string }[]
}) {
  const valid = items.filter((item) => item.rotulo && item.url)
  if (!valid.length) return null
  return (
    <div className="stack">
      <h2 className="callout__title">{title}</h2>
      <ul className="source-list">
        {valid.map((item) => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.rotulo}
              <ExternalIcon />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
