// CSP do site público. Só libera o que o portal carrega de fora:
// - VLibras (widget do governo): script, iframe e WebAssembly do avatar (Unity);
// - tiles do OpenStreetMap no mapa da rede.
// 'unsafe-inline' em script-src cobre os scripts inline do Next (dados do RSC),
// que mudam a cada página e revalidação. Nonce exigiria renderizar tudo de forma
// dinâmica e acabaria com o ISR (docs/decisions/0008-csp.md).
// O PostHog que o VLibras tenta carregar fica bloqueado de propósito.
const vlibras = 'https://vlibras.gov.br https://*.vlibras.gov.br https://cdn.jsdelivr.net'

export function contentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${vlibras}`,
    `style-src 'self' 'unsafe-inline' ${vlibras}`,
    `img-src 'self' data: blob: https://*.tile.openstreetmap.org ${vlibras}`,
    `font-src 'self' data: ${vlibras}`,
    `connect-src 'self' ${vlibras}`,
    `media-src 'self' blob: ${vlibras}`,
    "worker-src 'self' blob:",
    "frame-src 'self' https://vlibras.gov.br https://*.vlibras.gov.br",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ')
}
