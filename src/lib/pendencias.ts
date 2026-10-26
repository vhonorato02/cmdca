import type { Payload } from 'payload'

/** Marcadores de dado não confirmado: XXXX (padrão do projeto) e os antigos "[A CONFIRMAR]". */
const MARKER = /\bX{4}\b|\[?\s*a confirmar\s*\]?/i

/** Caminhos (a.b.c) de todos os textos com marcador de pendência. */
export function findMarkers(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return MARKER.test(value) ? [prefix] : []
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findMarkers(item, `${prefix}.${index + 1}`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      key.startsWith('_') || key === 'id' || key === 'controleEditorial'
        ? []
        : findMarkers(item, prefix ? `${prefix}.${key}` : key),
    )
  }
  return []
}

const LABELS: Record<string, string> = {
  'contato.endereco': 'Endereço de atendimento do CMDCA',
  'contato.horario': 'Horário de atendimento',
  'contato.telefone': 'Telefone do CMDCA',
  'contato.casaConselhosEndereco': 'Endereço da Casa dos Conselhos',
  'contato.casaConselhosTelefone': 'Telefone da Casa dos Conselhos',
  'lgpd.encarregado': 'Encarregado de dados (LGPD)',
  'lgpd.encarregadoContato': 'Contato do encarregado de dados',
  'fmdca.cnpj': 'CNPJ do Fundo Municipal',
  'fmdca.conta': 'Banco, agência e conta do Fundo Municipal',
  'baseLegal.regimento': 'Regimento interno',
}

export type Pendencia = {
  area: string
  item: string
  href: string
  restrito?: boolean
}

type Source = {
  area: string
  href: string
  restrito?: boolean
  load: (payload: Payload) => Promise<unknown>
}

const GLOBALS: Source[] = [
  {
    area: 'Configurações institucionais',
    href: '/admin/globals/configuracoes',
    restrito: true,
    load: (payload) => payload.findGlobal({ slug: 'configuracoes', depth: 0, draft: true, overrideAccess: true }),
  },
  {
    area: 'Textos das páginas',
    href: '/admin/globals/textos',
    load: (payload) => payload.findGlobal({ slug: 'textos', depth: 0, draft: true, overrideAccess: true }),
  },
  {
    area: 'Página inicial',
    href: '/admin/globals/pagina-inicial',
    load: (payload) =>
      payload.findGlobal({ slug: 'pagina-inicial', depth: 0, draft: true, overrideAccess: true }),
  },
]

/**
 * Lista o que ainda falta confirmar para o site ficar completo. O site
 * público nunca exibe esses valores; o painel mostra onde corrigir.
 */
export async function listPendencias(payload: Payload): Promise<Pendencia[]> {
  const out: Pendencia[] = []

  for (const source of GLOBALS) {
    try {
      const doc = (await source.load(payload)) as Record<string, unknown>
      for (const path of findMarkers(doc)) {
        out.push({
          area: source.area,
          item: LABELS[path] ?? path,
          href: source.href,
          restrito: source.restrito,
        })
      }
      if (source.area === 'Configurações institucionais') {
        const fmdca = doc.fmdca as { dadosBancariosConfirmados?: boolean } | undefined
        if (!fmdca?.dadosBancariosConfirmados) {
          out.push({
            area: source.area,
            item: 'Conferir e autorizar a publicação dos dados bancários do Fundo',
            href: source.href,
            restrito: true,
          })
        }
      }
    } catch (error) {
      payload.logger.warn({ err: error }, `Pendências: falha ao ler ${source.area}`)
    }
  }

  for (const [collection, area, titleField] of [
    ['rede-protecao', 'Rede de proteção', 'nome'],
    ['paginas', 'Páginas institucionais', 'titulo'],
  ] as const) {
    try {
      const res = await payload.find({
        collection,
        limit: 200,
        depth: 0,
        draft: true,
        overrideAccess: true,
        pagination: false,
      })
      for (const doc of res.docs as unknown as Record<string, unknown>[]) {
        const paths = findMarkers(doc)
        if (!paths.length) continue
        out.push({
          area,
          item: `${String(doc[titleField] ?? 'Sem título')}: ${paths.join(', ')}`,
          href: `/admin/collections/${collection}/${String(doc.id)}`,
        })
      }
    } catch (error) {
      payload.logger.warn({ err: error }, `Pendências: falha ao ler ${area}`)
    }
  }

  return out
}
