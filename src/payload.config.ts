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
import nodemailer from 'nodemailer'

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
import { Paginas } from './collections/Paginas'
import { Configuracoes } from './globals/Configuracoes'
import { PaginaInicial } from './globals/PaginaInicial'
import { Indicadores } from './globals/Indicadores'
import { Navegacao } from './globals/Navegacao'
import { Textos } from './globals/Textos'
import { buildAllowedOrigins } from './security/origins'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// .env.local é convenção do Next; a CLI do Payload (migrate/seed/generate) não a
// carrega sozinha. Carregamos aqui sem sobrescrever variáveis já definidas pelo Next.
dotenvConfig({ path: path.resolve(dirname, '../.env.local') })

// Runtime usa DATABASE_URI (ou DATABASE_URL, injetada pela plataforma da VPS).
// Migrations/seed podem usar uma conexão direta separada (DATABASE_URI_UNPOOLED);
// sem ela, usam a mesma conexão do runtime (Postgres próprio do site, sem pooler).
const isMigrating = process.env.DATABASE_MIGRATION === 'true'
const isIsolatedCI = process.env.GITHUB_ACTIONS === 'true' &&
  ['DATABASE_URI', 'DATABASE_URI_UNPOOLED'].every((name) => {
    try {
      const uri = new URL(process.env[name] || '')
      return ['localhost', '127.0.0.1'].includes(uri.hostname) && uri.pathname === '/cmdca_test'
    } catch {
      return false
    }
  })
const isHostedProduction =
  process.env.ENFORCE_PRODUCTION_ENV === 'true' ||
  (process.env.NODE_ENV === 'production' && !isIsolatedCI)

function requiredInHostedProduction(name: string, minimumLength = 1): string | undefined {
  const value = process.env[name]?.trim()
  if (isHostedProduction && (!value || value.length < minimumLength)) {
    throw new Error(`Variável obrigatória ausente ou inválida em produção: ${name}`)
  }
  return value
}

const runtimeDatabaseURI = process.env.DATABASE_URI?.trim() || process.env.DATABASE_URL?.trim()
if (isHostedProduction && !runtimeDatabaseURI) {
  throw new Error('Variável obrigatória ausente em produção: DATABASE_URI (ou DATABASE_URL)')
}
const connectionString = isMigrating
  ? process.env.DATABASE_URI_UNPOOLED?.trim() || runtimeDatabaseURI
  : runtimeDatabaseURI

const payloadSecret = requiredInHostedProduction('PAYLOAD_SECRET', 32) || process.env.PAYLOAD_SECRET || ''
const publicServerURL = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
if (isHostedProduction && !publicServerURL) {
  throw new Error('Defina NEXT_PUBLIC_SERVER_URL em produção.')
}

// Armazenamento de mídia: disco local (volume persistente) por padrão. S3/R2 só
// é usado quando S3_BUCKET está definido, para manter compatibilidade.
const s3Bucket = process.env.S3_BUCKET?.trim()
const mediaDir = path.resolve(process.env.MEDIA_DIR?.trim() || path.resolve(dirname, '../media'))

if (isHostedProduction && publicServerURL) {
  const uri = new URL(publicServerURL)
  if (uri.protocol !== 'https:' || uri.username || uri.password || uri.pathname !== '/' || uri.search || uri.hash) {
    throw new Error('NEXT_PUBLIC_SERVER_URL deve ser uma origem HTTPS, sem credenciais, caminho ou parâmetros.')
  }
}

// O driver `pg` trata `sslmode=require/prefer/verify-ca` como `verify-full` e
// avisa no console. Tornamos isso explícito. Sem `sslmode`, a conexão segue sem
// TLS: é o caso do Postgres do site em rede Docker interna, sem saída externa.
function withExplicitSSLMode(uri: string | undefined): string {
  if (!uri) return ''
  return uri.replace(/([?&]sslmode=)(require|prefer|verify-ca)\b/, '$1verify-full')
}
const secureConnectionString = withExplicitSSLMode(connectionString)

// Sem SMTP, a recuperação de senha fica bloqueada (ver hook em Users) e o
// administrador redefine senhas pelo painel.
const smtpHost = process.env.SMTP_HOST?.trim()
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS?.trim()
if (smtpHost && !emailFromAddress) {
  throw new Error('EMAIL_FROM_ADDRESS é obrigatória quando SMTP_HOST está configurado.')
}
const smtpPort = Number(process.env.SMTP_PORT || 587)
if (smtpHost && (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535)) {
  throw new Error('SMTP_PORT deve ser um inteiro entre 1 e 65535.')
}
if (smtpHost && Boolean(process.env.SMTP_USER) !== Boolean(process.env.SMTP_PASS)) {
  throw new Error('SMTP_USER e SMTP_PASS devem ser configuradas em conjunto.')
}
// O adaptador de console permanece restrito ao desenvolvimento e ao CI isolado.
const emailAdapter = smtpHost
  ? nodemailerAdapter({
      defaultFromName: process.env.EMAIL_FROM_NAME || 'CMDCA Pindamonhangaba',
      defaultFromAddress: emailFromAddress!,
      transport: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        requireTLS: process.env.SMTP_SECURE !== 'true',
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      }),
    })
  : undefined

// Em dev o painel roda em localhost; em produção, na URL pública. Manter o
// serverURL alinhado à origem real é essencial: a proteção CSRF do Payload
// rejeita o cookie de autenticação (HTTP 403 ao salvar/publicar) quando a
// origem da requisição não bate com as origens permitidas.
const serverURL =
  process.env.NODE_ENV === 'production'
    ? publicServerURL || 'http://localhost:3000'
    : 'http://localhost:3000'

// Origens autorizadas para CSRF (cookies de auth) e CORS. Ao usar domínio
// próprio, atualize NEXT_PUBLIC_SERVER_URL para o domínio final.
const allowedOrigins = buildAllowedOrigins({
  nodeEnv: process.env.NODE_ENV,
  serverURL,
  publicServerURL,
})

export default buildConfig({
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    // No third-party avatar request: Gravatar would receive a hash of each editor e-mail.
    avatar: 'default',
    dateFormat: "dd/MM/yyyy 'às' HH:mm",
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
      providers: ['/components/admin/AdminA11yProvider'],
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
    supportedLanguages: {
      pt: {
        ...pt,
        translations: {
          ...pt.translations,
          authentication: {
            ...pt.translations.authentication,
            login: 'Entrar',
            logOut: 'Sair',
            logout: 'Sair',
            loggedOutSuccessfully: 'Você saiu com sucesso.',
          },
          general: {
            ...pt.translations.general,
            thisLanguage: 'Português do Brasil',
            email: 'E-mail',
            emailAddress: 'Endereço de e-mail',
            menu: 'Menu',
          },
        },
      },
    },
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
    Paginas,
    s3Bucket
      ? Media
      : { ...Media, upload: { ...(typeof Media.upload === 'object' ? Media.upload : {}), staticDir: mediaDir } },
    Users,
  ],
  globals: [Configuracoes, PaginaInicial, Textos, Indicadores, Navegacao],
  editor: lexicalEditor(),
  secret: payloadSecret,
  graphQL: { disable: true },
  maxDepth: 5,
  upload: {
    limits: { fileSize: 20 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'O arquivo excede o limite de 20 MB.',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: secureConnectionString,
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
    },
    // Schema controlado por migrations; em produção elas rodam ao iniciar o servidor.
    push: false,
    prodMigrations: migrations,
  }),
  email: emailAdapter,
  sharp,
  plugins: s3Bucket
    ? [
        // Legado (R2). Os arquivos passam pela autorização do Payload.
        s3Storage({
          collections: { media: true },
          bucket: s3Bucket,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'auto',
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
