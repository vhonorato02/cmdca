/**
 * Monta documentos Lexical (formato do editor rico do Payload) a partir de
 * blocos simples. Usado para publicar o conteúdo inicial das páginas
 * institucionais. Links usam a sintaxe `[texto](https://…)`.
 */

export type Bloco = ['h2' | 'h3' | 'p', string] | ['ul', string[]]

type LexicalNode = { type: string; version: number; [key: string]: unknown }

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

const textNode = (text: string, format = 0): LexicalNode => ({
  type: 'text',
  text,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

function inline(source: string): LexicalNode[] {
  const nodes: LexicalNode[] = []
  let cursor = 0
  for (const match of source.matchAll(LINK)) {
    const [whole, label, url] = match
    const start = match.index ?? 0
    if (start > cursor) nodes.push(textNode(source.slice(cursor, start)))
    const external = /^https?:\/\//.test(url)
    nodes.push({
      type: 'link',
      fields: { url, newTab: external, linkType: 'custom' },
      children: [textNode(label)],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 3,
    })
    cursor = start + whole.length
  }
  if (cursor < source.length) nodes.push(textNode(source.slice(cursor)))
  return nodes
}

const element = (type: string, children: LexicalNode[], extra: Record<string, unknown> = {}): LexicalNode => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export function lexical(blocos: Bloco[]) {
  const children = blocos.map((bloco) => {
    if (bloco[0] === 'ul') {
      return element(
        'list',
        bloco[1].map((item, index) => element('listitem', inline(item), { value: index + 1 })),
        { listType: 'bullet', start: 1, tag: 'ul' },
      )
    }
    const [tag, text] = bloco
    return tag === 'p'
      ? element('paragraph', inline(text), { textFormat: 0, textStyle: '' })
      : element('heading', inline(text), { tag })
  })
  return {
    root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 },
  }
}
