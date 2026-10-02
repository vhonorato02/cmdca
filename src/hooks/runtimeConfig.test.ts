import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('dotenv', () => ({ config: vi.fn() }))
vi.mock('@payloadcms/db-postgres', () => ({ postgresAdapter: vi.fn(() => ({})) }))
vi.mock('@payloadcms/email-nodemailer', () => ({ nodemailerAdapter: vi.fn(() => undefined) }))
vi.mock('@payloadcms/richtext-lexical', () => ({ lexicalEditor: vi.fn(() => ({})) }))
vi.mock('@payloadcms/storage-s3', () => ({ s3Storage: vi.fn(() => (config: unknown) => config) }))
vi.mock('sharp', () => ({ default: vi.fn() }))
vi.mock('nodemailer', () => ({ default: { createTransport: vi.fn() } }))
vi.mock('payload', () => ({
  APIError: class extends Error {},
  NotFound: class extends Error {},
  buildConfig: (config: unknown) => config,
}))

afterEach(() => vi.unstubAllEnvs())
const load = async () => {
  vi.resetModules()
  return (await import('../payload.config')).default
}
const runtime = () => {
  for (const name of ['SMTP_HOST', 'EMAIL_FROM_ADDRESS', 'DATABASE_URI', 'DATABASE_URI_UNPOOLED', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'NEXT_PUBLIC_R2_PUBLIC_URL', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'VERCEL_ENV', 'DATABASE_MIGRATION', 'GITHUB_ACTIONS', 'ENFORCE_PRODUCTION_ENV']) vi.stubEnv(name, '')
  vi.stubEnv('NODE_ENV', 'production')
}

describe('produção self-host do CMS', () => {
  it('runtime de produção recusa configuração ausente mesmo sem sinalizador Vercel', async () => {
    runtime()
    await expect(load()).rejects.toThrow('DATABASE_URI')
  }, 60_000)
  it('somente o banco efêmero do Actions dispensa SMTP', async () => {
    runtime()
    vi.stubEnv('GITHUB_ACTIONS', 'true')
    vi.stubEnv('DATABASE_URI', 'postgresql://localhost/cmdca_test?sslmode=disable')
    vi.stubEnv('DATABASE_URI_UNPOOLED', 'postgresql://localhost/cmdca_test?sslmode=disable')
    const config = await load()
    expect(config.i18n?.supportedLanguages?.pt?.translations.authentication.login).toBe('Entrar')
    vi.stubEnv('ENFORCE_PRODUCTION_ENV', 'true')
    await expect(load()).rejects.toThrow('PAYLOAD_SECRET')
  }, 60_000)
})
