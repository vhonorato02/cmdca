# Relatório de auditoria · CMDCA

Segunda auditoria completa: **06/11/2026**, somada à de 04/11 ([relatório anterior](../historico/RELATORIO-AUDITORIA-2026-11-04.md)).
Executor: Claude Opus 5.5 (T3, notebook do Zé). Matriz viva em [`RISCOS.md`](RISCOS.md).

**Veredito:** produção recuperada e corrigida; **sem tag `stable`**. Falta um gate: backup off-site **automático**
(o manual pelo notebook foi provado com restauração completa). Detalhe em "Gates".

## Linha do tempo de 06/11

| Hora (BRT) | Fato | Evidência |
| --- | --- | --- |
| 18:48 | Produção em `eb3d2bb`, VPS saudável, off-site não configurado, scripts de backup do Git (`f571b2e`) não instalados | `site saude`, `site versoes`, sha256 dos arquivos de `/srv/platform` × repo |
| 18:50 | Scripts de backup instalados; `backup.sh` corrigido (`49b40a4`) | backup manual OK, `site saude` passa a acusar off-site ausente |
| 18:57 | Off-site provado fora da VPS | ver "Backup" |
| 19:17 | `ad2e8bc` (correção da lixeira) publicado pelo CI | runs abaixo |
| 20:4x | VPS **zerada** por ordem do Zé em outra thread (plataforma 1.0); site fora do ar | `vps-platform/HANDOFF.md` |
| 23:43–23:53 | CMDCA recriado na plataforma 1.0 com banco e mídia idênticos; domínio oficial de volta | ver "Recuperação" |

## Achados desta auditoria

| ID | Prio | Achado | Estado |
| --- | --- | --- | --- |
| A1 | **P1** | Documento publicado e enviado à lixeira continuava público: o Payload não aplica o filtro de lixeira em `?trash=true` nem ao servir `/api/media/file/<arquivo>` (consulta o banco só com a regra de leitura, `node_modules/payload/dist/uploads/checkFileAccess.js`). Um PDF "apagado" seguia baixável. | **Corrigido** em `ad2e8bc`: `publishedLiveOrLoggedIn` exige `deletedAt` ausente para visitantes; reuniões idem. Regressão: unitário, integração do CMS (PDF e notícia na lixeira, com `trash` e `draft`, editor ainda vê) e E2E do arquivo direto. CI `42303572792` |
| A2 | **P1** | Três contas de teste/seed ativas no painel de produção (`*@cmdca.local` editor, `*@cmdca-pinda.local` **jurídico**, `*@cmdca.teste` editor), domínios que nem recebem e-mail | **Contido**: bloqueadas (`lock_until=2099`), login recusado conferido. Exclusão fica com o Zé (painel → Usuários) |
| A3 | P2 | `backup.sh` do Git (`f571b2e`): falha da cópia off-site derrubava o registro do backup local já verificado; bloco duplicado inalcançável; restic sem cache sob systemd (lento e mais requisições ao R2) | **Corrigido** em `vps-platform` `49b40a4`, instalado e mantido na 1.0 |
| A4 | P2 | Código morto do legado: 6 scripts Neon/R2/Coolify/Vercel, `vercel.json`, dependência `@payloadcms/storage-s3` (AWS SDK inteiro) | **Removido** em `0041802` (lockfile só encolheu, 542 linhas) |
| A5 | P2 | Secrets legados no GitHub: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` e chaves de deploy de nível de repositório já revogadas | **Removidos**; chave de deploy nova só no ambiente `production` |
| A6 | P2 | Documentação contraditória (Neon/R2/Coolify/PWA como se fossem atuais; `OPERACAO.md` × `OPERACOES.md`) | **Corrigido**: atuais reescritos, antigos em `docs/historico/` |
| A7 | P3 | `package.json` 1.0.0 × changelog 2.1.0 × tag v2.0.0; licença MIT sem arquivo nem verificação dos assets | **Corrigido**: 2.2.0, `private`, `UNLICENSED` (não concede direitos que não foram verificados) |
| A8 | P3 | Plataforma 1.0 cria apps com raiz somente-leitura; o Next grava ISR em `.next/server/app` | **Contornado** com `--rw` (configuração que a produção sempre usou e que o CI testa). Adaptar exige `cacheHandler`; pendente |
| A9 | P3 | Comando de domínios do prompt padrão punha o domínio temporário primeiro; o healthwatch testa o primeiro e recebe 301 | **Corrigido** na VPS (`www` primeiro) e registrado no `vps-platform/HANDOFF.md` |
| A10 | P3 | Dependências: `deepmerge` (baixo, runtime, sem correção publicada); `minimatch` (médio, só desenvolvimento, exige versão maior) | Aceito e registrado; revisar a cada atualização do Payload |
| A11 | P3 | Log do container avisa `metadataBase` ausente em alguma rota (as páginas públicas têm OG/canonical absolutos corretos) | Aberto, sem impacto visível |
| A12 | P3 | `robots.txt` tem a diretiva `Host:` (só Yandex) | Aberto, inofensivo |

## O que foi verificado sem achado

- **APIs anônimas** (29 consultas): `users` 403, versões 403, rascunhos invisíveis mesmo com `draft=true`
  (17 notícias no banco, 16 públicas), GraphQL 405, campos internos (`controleEditorial`, consentimentos) ausentes.
  `autor` é texto editorial, não usuário.
- **Cabeçalhos:** CSP, HSTS preload, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Robots-Tag: noindex` no `/admin`, `X-Release-Commit`.
- **SEO:** canonical e `og:url` absolutos no `www`, sitemap com 31 URLs, robots coerente, 404 com status 404, manifest 404.
- **Visual e acessibilidade (navegador real, Chromium):** 20 rotas × 8 larguras (320, 360, 390, 430, 768, 1024, 1440,
  1920) = 160 capturas; nenhum estouro horizontal, um `h1` por página, nenhuma imagem sem `alt`, nenhum alvo de toque
  < 24 px fora de texto corrido; axe (WCAG 2.0/2.1/2.2 AA) sem violações em 390 e 1440 px. Inspeção humana das capturas
  de home (390/1440), ajuda (320) e Fundo/IR (768): hierarquia e contraste corretos. Script: `scripts/audit-visual.mjs`.
- **Testes locais:** lint, tipos, 148 unitários; integração do CMS completa num PostgreSQL 17 local descartável.

## Backup e recuperação

- **Off-site manual (fora da VPS):** repositório restic copiado para o notebook sob o lock do backup (10 s, 2,1 MB);
  `restic check --read-data` com a senha guardada fora da VPS: sem erros; restauração do snapshot `8f3723b6` em 3 s;
  4 arquivos de mídia com SHA-256 idêntico à produção; `pg_restore` num PostgreSQL 17.11 local em 5 s com contagem de
  linhas idêntica nas 74 tabelas. Ferramenta: `vps-platform/tools/offsite-pull.sh` (`d4f9a3d`).
- **Recuperação real:** depois do zeramento da VPS, o CMDCA voltou a partir dos dados exportados: 74 tabelas,
  17 notícias, 8 migrations, 6 usuários, 3 mídias; os 4 arquivos de mídia com os mesmos SHA-256. RTO desta ocorrência:
  ~10 min de trabalho depois que a plataforma ficou pronta (o site ficou fora ~3 h por decisão do dono durante a
  reinstalação). RPO: zero (exportação feita minutos antes de zerar).
- **Automático:** backup local diário e teste semanal ativos na plataforma 1.0. **R2 ainda não configurado** (conta
  Cloudflare do Zé).

## Versões `HEAD → CI → imagem → VPS`

| Commit | CI | Imagem | Produção |
| --- | --- | --- | --- |
| `ad2e8bc` (lixeira) | Produção `42303572792` ✓ · E2E produção `42304937769` ✓ · Lighthouse `42305596575` ✓ | `ghcr.io/vhonorato02/cmdca:ad2e8bc…` | no ar 19:17–20:4x (VPS antiga) e de novo desde 23:43 (plataforma 1.0), `X-Release-Commit` conferido |

A linha final (commit desta documentação e versão 2.2.0) está no `HANDOFF.md`.

## Gates para `stable`

| Gate | Estado |
| --- | --- |
| Site e CMS reais na VPS com dados atuais | ✓ |
| Nada de runtime em Neon/R2/Vercel | ✓ (código, dependências e secrets limpos; Vercel pausada 503) |
| PWA ausente, responsividade aprovada | ✓ |
| Documentos privados e lixeira protegidos em teste integrado | ✓ |
| CI, imagem, VPS, E2E e Lighthouse do mesmo SHA | ✓ para `ad2e8bc` |
| Backup off-site com restauração real | ✓ manual · ✗ **automático (R2)** |
| Rollback de código e banco documentado e executável | ✓ (`docs/OPERACOES.md`; recuperação total executada) |
| Conteúdo institucional com fonte | Parcial: reuniões, entidades e dados bancários do Fundo seguem vazios por falta de fonte pública (estado honesto no site) |

`stable` fica para quando o R2 estiver ligado e o primeiro `last-backup-offsite-ok` aparecer no `site saude`.

## Não verificado nesta rodada

Leitor de tela real (NVDA/TalkBack), aparelho Android físico, zoom de 400% manual, teste de carga, dados de campo de
Web Vitals (não há RUM), revisão jurídica do conteúdo, inventário do Neon/R2 legados (sem login dessas contas aqui).
