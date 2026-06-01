import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Revalida caminhos do Next quando o conteúdo muda no CMS (revalidação
 * on-demand). Importa next/cache dinamicamente e ignora falhas fora do
 * runtime do Next (ex.: durante migrate/seed pela CLI).
 */
async function doRevalidate(paths: string[]) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const p of paths) revalidatePath(p)
  } catch {
    /* fora do runtime do Next — ignora */
  }
}

type AnyDoc = Record<string, unknown>

/** Hooks afterChange/afterDelete para uma coleção, revalidando caminhos derivados do doc. */
export function revalidateCollection(getPaths: (doc: AnyDoc) => string[]): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} {
  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    await doRevalidate(getPaths(doc as AnyDoc))
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    await doRevalidate(getPaths(doc as AnyDoc))
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

/** Hook afterChange para um global. */
export function revalidateGlobal(paths: string[]): { afterChange: GlobalAfterChangeHook[] } {
  const afterChange: GlobalAfterChangeHook = async ({ doc }) => {
    await doRevalidate(paths)
    return doc
  }
  return { afterChange: [afterChange] }
}
