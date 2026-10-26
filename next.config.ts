import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Permite que o next/image sirva as imagens da URL pública do R2.
let r2Hostname: string | undefined
try {
  if (process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
    r2Hostname = new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname
  }
} catch {
  r2Hostname = undefined
}

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // O binding do sharp é rastreado automaticamente, mas o libvips carregado
  // dinamicamente pode ficar fora do artefato serverless. Incluímos somente o
  // arquivo nativo ausente; globs amplos em `.pnpm` capturam symlinks inválidos.
  outputFileTracingIncludes: {
    '/*': [
      'node_modules/.pnpm/@img+sharp-libvips-linux-x64@*/node_modules/@img/sharp-libvips-linux-x64/lib/*.so.*',
    ],
  },
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/brand/**' },
      { pathname: '/images/**' },
    ],
    remotePatterns: r2Hostname ? [{ protocol: 'https', hostname: r2Hostname }] : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      // O preview editorial do Payload pode usar iframe na mesma origem.
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      },
    ]

    // Temporary hostnames and previews stay out of search until explicitly promoted.
    if (process.env.SITE_INDEXABLE !== 'true') {
      securityHeaders.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' })
    }

    // Actions injects this immutable revision while generating the artifact.
    // The post-deploy smoke verifies the canonical alias serves that revision.
    if (process.env.GITHUB_SHA && /^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA)) {
      securityHeaders.push({ key: 'X-Release-Commit', value: process.env.GITHUB_SHA })
    }

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }

    // CSP: só o que o portal carrega de fora — VLibras (widget do governo; usa
    // WebAssembly do Unity) e os tiles do OpenStreetMap no mapa da rede.
    // 'unsafe-inline' cobre os scripts JSON-LD/inicialização inline sem obrigar
    // nonce, que tornaria todas as páginas dinâmicas e acabaria com o ISR.
    const vlibras = 'https://vlibras.gov.br https://*.vlibras.gov.br'
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${vlibras}`,
      `style-src 'self' 'unsafe-inline' ${vlibras}`,
      `img-src 'self' data: blob: https://*.tile.openstreetmap.org ${vlibras}`,
      `font-src 'self' data: ${vlibras}`,
      `connect-src 'self' ${vlibras}`,
      `media-src 'self' blob: ${vlibras}`,
      "worker-src 'self' blob:",
      "frame-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Site público: CSP aplicada (o painel fica fora até validar a dele).
        source: '/((?!admin).*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
