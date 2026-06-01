import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
      connectionString: connectionString || '',
    },
    // Schema controlado por migrations (não usar push automático com o Neon).
    push: false,
  }),
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
