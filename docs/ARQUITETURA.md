# Arquitetura atual

Atualizado em 06/11/2026. Versão anterior (Coolify/Neon/R2) em [`historico/`](historico/ARQUITETURA-2026-10-coolify-neon-r2.md).

## Visão geral

```
Navegador ──HTTPS/HTTP3──► Caddy (borda da VPS, Let's Encrypt)
                              │  rota gerada pelo CLI `site` (/srv/platform/caddy/sites/cmdca.caddy)
                              ▼
                      container cmdca-web (Next.js 16 + Payload 3, Node 24, standalone)
                         │                         │
                         ▼                         ▼
          Postgres 17 compartilhado          /srv/sites/cmdca/data/media
          (banco e usuário `cmdca`,           montado em /app/media
           rede interna `db`)                 (PDFs e imagens do CMS)
```

| Camada | Onde roda | Observação |
| --- | --- | --- |
| Site público + painel `/admin` | Container na VPS `zewithane` (plataforma `vps-platform` 1.0) | Imagem `ghcr.io/vhonorato02/cmdca:<sha>`, limite de 512 MB, raiz gravável (`--rw`, ver abaixo) |
| Banco | Postgres 17 da plataforma | `DATABASE_URL` injetada pela plataforma; migrations rodam no start (`prodMigrations`) |
| Mídia | Disco da VPS | Servida por `/api/media/file/<arquivo>` com a regra de acesso do Payload |
| HTTPS, redirecionamentos 301 | Caddy da plataforma | `www.cmdcapinda.org` canônico; raiz, `pt.` e o domínio temporário redirecionam |
| Build e testes | GitHub Actions | Nada é compilado na VPS |
| Backup | restic local diário na VPS + cópia off-site | Ver [`OPERACOES.md`](OPERACOES.md) |

**Fora do runtime:** Vercel (projeto pausado, 503), Neon e R2 legados não são usados pelo portal. GitHub/GHCR e o DNS (Wix) são serviços de entrega, não hospedam dados.

**Não é PWA:** sem manifest, service worker, push ou modo standalone (decisão do dono, 04/11/2026).

## Terceiros carregados pelo navegador

| Serviço | Quando | Por quê |
| --- | --- | --- |
| VLibras (`vlibras.gov.br`, `cdn.jsdelivr.net`) | Só quando a pessoa aciona "Libras" (ADR 0006) | Tradução para Libras do Governo Federal; sem alternativa local equivalente |
| Mosaicos do OpenStreetMap | Só em mapas (rede de proteção) | Mapa de endereços; a CSP limita a `*.tile.openstreetmap.org` |

Nenhum outro domínio externo é permitido pela CSP (`src/security/csp.ts`).

## Segurança da aplicação

- Papéis: `admin`, `editor`, `juridico` (`src/access/index.ts`). Todos editam e publicam; só `admin` exclui, envia à lixeira e gerencia usuários.
- Visitante lê só o que está **publicado e fora da lixeira** (`publishedLiveOrLoggedIn`); reuniões reservadas nunca saem. Isso vale também para o arquivo direto em `/api/media/file/`.
- Troca de senha obrigatória no primeiro acesso, limite de login por IP (ADR 0010), CSP (ADR 0008), sem SMTP (ADR 0009: senha é redefinida por um administrador), GraphQL desligado.
- Cabeçalhos: HSTS com preload, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Robots-Tag: noindex` no `/admin`, `X-Release-Commit` com o SHA no ar.

## Por que `--rw`

A plataforma 1.0 cria apps com raiz somente-leitura (tmpfs em `/tmp` e `/app/.next/cache`). O Next.js grava o cache das páginas (ISR) em `.next/server/app`, junto do código do servidor, e o Dockerfile depende disso para trocar o HTML do build pelo conteúdo real no primeiro acesso. O CI testa o container gravável, como a produção sempre rodou. Migrar para somente-leitura exige um `cacheHandler` próprio ou cache só em memória, testado no CI antes. Pendência P3.
