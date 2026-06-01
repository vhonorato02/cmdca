import configPromise from '@/payload.config'
import { getPayload } from 'payload'

/**
 * Instância do Payload para uso em Server Components / rotas (Local API).
 * getPayload memoiza por config, então é seguro chamar a cada render.
 */
export const getPayloadClient = async () => getPayload({ config: await configPromise })
