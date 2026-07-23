type AllowedOriginsInput = {
  nodeEnv: string | undefined
  serverURL: string
  publicServerURL?: string
  vercelURL?: string
}

const normalizeOrigin = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  try {
    return new URL(value).origin
  } catch {
    return undefined
  }
}

/**
 * Mantém localhost disponível no desenvolvimento, mas nunca o autoriza a
 * enviar cookies ao CMS hospedado. Uma página local não deve fazer requisições
 * autenticadas ao banco de produção.
 */
export function buildAllowedOrigins({
  nodeEnv,
  serverURL,
  publicServerURL,
  vercelURL,
}: AllowedOriginsInput): string[] {
  const deploymentURL = vercelURL ? `https://${vercelURL}` : undefined
  const candidates = [
    nodeEnv === 'production' ? undefined : 'http://localhost:3000',
    serverURL,
    publicServerURL,
    deploymentURL,
  ]

  return Array.from(
    new Set(candidates.map(normalizeOrigin).filter((origin): origin is string => Boolean(origin))),
  )
}
