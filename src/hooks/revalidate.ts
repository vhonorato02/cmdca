import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

type AnyDoc = Record<string, unknown>

const isPublished = (doc: AnyDoc | undefined) => doc?._status === 'published'
const truthy = (value: unknown) => value === true || value === 'true'

async function doRevalidate(paths: string[], req: PayloadRequest) {
  if (process.env.DATABASE_MIGRATION === 'true' || process.env.NODE_ENV === 'test') return
  const uniquePaths = [...new Set(paths.filter((path) => path && path !== '/null'))]
  if (!uniquePaths.length) return

  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of uniquePaths) revalidatePath(path)
  } catch (error) {
    req.payload.logger.warn({ err: error, paths: uniquePaths }, 'Falha ao revalidar páginas do site')
  }
}

function wasExplicitlyUnpublished(doc: AnyDoc, previousDoc: AnyDoc, req: PayloadRequest): boolean {
  return (
    isPublished(previousDoc) &&
    !isPublished(doc) &&
    (truthy(req.query?.unpublishAllLocales) || Boolean(doc.deletedAt))
  )
}

export function revalidateCollection(getPaths: (doc: AnyDoc) => string[]): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
    const current = doc as AnyDoc
    const previous = previousDoc as AnyDoc
    const paths: string[] = []

    if (isPublished(current)) paths.push(...getPaths(current))
    if (
      isPublished(previous) &&
      (wasExplicitlyUnpublished(current, previous, req) || previous.slug !== current.slug)
    ) {
      paths.push(...getPaths(previous))
    }

    await doRevalidate(paths, req)
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    const deleted = doc as AnyDoc
    if (isPublished(deleted)) await doRevalidate(getPaths(deleted), req)
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

export function revalidateGlobal(paths: string[]): { afterChange: GlobalAfterChangeHook[] } {
  const afterChange: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
    const current = doc as AnyDoc
    const previous = previousDoc as AnyDoc
    if (isPublished(current) || wasExplicitlyUnpublished(current, previous, req)) {
      await doRevalidate(paths, req)
    }
    return doc
  }
  return { afterChange: [afterChange] }
}
