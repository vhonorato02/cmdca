import configPromise from '@/payload.config'
import { getPayload, type Payload } from 'payload'

let publicClient: Payload | undefined

/**
 * Cliente usado pelo site público. O Payload Local API ignora access control
 * por padrão; o proxy força `overrideAccess: false` em todas as leituras para
 * que drafts, reuniões reservadas e campos internos nunca escapem por engano.
 */
export async function getPayloadClient(): Promise<Payload> {
  if (publicClient) return publicClient
  const payload = await getPayload({ config: await configPromise })
  const protectedMethods = new Set(['count', 'find', 'findByID', 'findGlobal'])

  publicClient = new Proxy(payload, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      if (!protectedMethods.has(String(property)) || typeof value !== 'function') return value

      return (args: Record<string, unknown>) =>
        Reflect.apply(value, target, [{ ...args, overrideAccess: false }])
    },
  })
  return publicClient
}
