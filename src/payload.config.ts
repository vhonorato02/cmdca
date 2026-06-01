import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pt } from '@payloadcms/translations/languages/pt'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Noticias } from './collections/Noticias'
import { Reunioes } from './collections/Reunioes'
import { Resolucoes } from './collections/Resolucoes'
import { Editais } from './collections/Editais'
import { Entidades } from './collections/Entidades'
import { RedeProtecao } from './collections/RedeProtecao'
import { Depoimentos } from './collections/Depoimentos'
import { Destaques } from './collections/Destaques'
import { Faq } from './collections/Faq'
import { Configuracoes } from './globals/Configuracoes'
import { PaginaInicial } from './globals/PaginaInicial'
import { Indicadores } from './globals/Indicadores'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// .env.local é convenção do Next; a CLI do Payload (migrate/seed/generate) não a
// carrega sozinha. Carregamos aqui sem sobrescrever variáveis já definidas pelo Next.
dotenvConfig({ path: path.resolve(dirname, '../.env.local') })

// App usa a string POOLED (Neon -pooler). Migrations/seed usam a UNPOOLED (direct),
// acionada pelo env DATABASE_MIGRATION=true definido nos scripts migrate/seed.
const isMigrating = process.env.DATABASE_MIGRATION === 'true'
const connectionString = isMigrating
  ? process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI
  : process.env.DATABASE_URI

// O driver `pg` avisa que `sslmode=require/prefer/verify-ca` é tratado, hoje,
// como `verify-full`. Tornamos isso explícito: mesmo comportamento (o Neon usa
// certificado público válido), porém sem o aviso de segurança no console/build.
function withVerifyFullSSL(uri: string | undefined): string {
  if (!uri) return ''
  if (/[?&]sslmode=/.test(uri)) {
    return uri.replace(/([?&]sslmode=)(require|prefer|verify-ca)\b/, '$1verify-full')
  }
  return `${uri}${uri.includes('?') ? '&' : '?'}sslmode=verify-full`
}
const secureConnectionString = withVerifyFullSSL(connectionString)

// Adaptador de e-mail real (ex.: reset de senha) só é ativado quando há SMTP
// configurado. Sem SMTP_HOST, o Payload usa o adaptador padrão (log no console),
// preservando o comportamento de desenvolvimento.
const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromName: process.env.EMAIL_FROM_NAME || 'CMDCA Pindamonhangaba',
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'nao-responder@cmdca-pinda.local',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  : undefined

// Em dev o painel roda em localhost; em produção, na URL pública. Manter o
// serverURL alinhado à origem real é essencial: a proteção CSRF do Payload
// rejeita o cookie de autenticação (HTTP 403 ao salvar/publicar) quando a
// origem da requisição não bate com as origens permitidas.
const serverURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    : 'http://localhost:3000'

// Origens autorizadas para CSRF (cookies de auth) e CORS. Ao usar domínio
// próprio, atualize NEXT_PUBLIC_SERVER_URL para o domínio final.
const allowedOrigins = Array.from(
  new Set(
    ['http://localhost:3000', serverURL, process.env.NEXT_PUBLIC_SERVER_URL].filter(Boolean),
  ),
) as string[]

export default buildConfig({
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Painel · CMDCA Pindamonhangaba',
      titleSuffix: '',
      description:
        'Painel administrativo do Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba.',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/brand/favicon.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
      beforeDashboard: ['/components/admin/BeforeDashboard'],
    },
  },
  // Painel somente em português: restringimos os idiomas suportados a `pt` para
  // que o admin não caia em inglês quando o navegador envia Accept-Language: en.
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { pt },
  },
  collections: [
    Noticias,
    Reunioes,
    Resolucoes,
    Editais,
    Entidades,
    RedeProtecao,
    Depoimentos,
    Destaques,
    Faq,
    Media,
    Users,
  ],
  globals: [Configuracoes, PaginaInicial, Indicadores],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: secureConnectionString,
    },
    // Schema controlado por migrations (não usar push automático com o Neon).
    push: false,
  }),
  email: emailAdapter,
  sharp,
  plugins: [
    // Mídia no Cloudflare R2 (S3-compatible). disableLocalStorage = true por padrão,
    // então uploads nunca tocam o filesystem efêmero do Render.
    s3Storage({
      collections: {
        media: {
          // Servir a partir da URL pública do bucket R2 (pub-*.r2.dev).
          generateFileURL: ({ filename, prefix }) =>
            [process.env.NEXT_PUBLIC_R2_PUBLIC_URL, prefix, filename]
              .filter(Boolean)
              .join('/'),
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        // R2 funciona de forma confiável com path-style.
        forcePathStyle: true,
      },
    }),
  ],
})
