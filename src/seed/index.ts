/**
 * Bootstrap mínimo e idempotente para desenvolvimento.
 *
 * Não cria conteúdo, não publica exemplos e não contém credenciais padrão.
 * Uso consciente:
 *   SEED_ALLOW_LOCAL=true
 *   SEED_ADMIN_EMAIL=...
 *   SEED_ADMIN_PASSWORD=... (mínimo 14 caracteres)
 *   pnpm seed
 */
import { getPayload } from 'payload'

import configPromise from '../payload.config'

function assertDevelopmentSeed(): void {
  const production =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.RENDER === 'true'
  if (production || process.env.SEED_ALLOW_LOCAL !== 'true') {
    throw new Error(
      'Seed bloqueado. Use somente em banco isolado de desenvolvimento com SEED_ALLOW_LOCAL=true.',
    )
  }
}

async function seed(): Promise<void> {
  assertDevelopmentSeed()

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Informe SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD para criar a conta local.')
  }
  if (password.length < 14) {
    throw new Error('SEED_ADMIN_PASSWORD deve ter pelo menos 14 caracteres.')
  }

  const payload = await getPayload({ config: await configPromise })
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length) {
    payload.logger.info(`Conta local ${email} já existe; nenhuma alteração foi feita.`)
    return
  }

  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name: process.env.SEED_ADMIN_NAME?.trim() || 'Administrador local',
      role: 'admin',
    },
    overrideAccess: true,
  })
  payload.logger.info(`Conta administrativa local criada: ${email}`)
}

seed().catch((error) => {
  console.error('Falha no bootstrap local:', error)
  process.exitCode = 1
})
