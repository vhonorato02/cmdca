# Inventário verificável · CMDCA
Data de inspeção: 2026-11-04 (America/Sao_Paulo). Baseline de código: `cc437d745db3f47a237272bc2795f431f1789972`. Primeira correção: `f630bda5a1cb1d459e1a0ac43eb35e5feaec2dad`.

## Fonte e limites
Inspeção de arquivos e histórico pelo GitHub autenticado; HTTP público obtido por consulta atual sem autenticação; leitura do projeto legado pela integração Vercel. Não houve clone local, acesso SSH, conexão ao banco operacional, execução local de Playwright, teste em Samsung/Android, teste de restauração nem escrita no CMS. Resultados de testes históricos **não** são resultados desta execução.

## Superfícies confirmadas
- GitHub `vhonorato02/cmdca`, `main`, acesso de escrita confirmado; último commit antes desta rodada `cc437d7`.
- Stack declarada pelo código: Next.js 16.4.3, React 19.2.7, Payload 3.92.0, Node 24, pnpm 11.15.0, PostgreSQL com adapter Payload; configuração de produção na VPS descrita em `README.md`, `DEPLOY.md` e ADRs de 26/10.
- Site público `https://www.cmdcapinda.org/`, `/ajuda`, `/admin/login`, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`: HTTP 200 no momento da inspeção; `/api/health` devolveu `{"status":"ok"}`. Isso **não** verifica autorização, integridade do banco nem SHA que está no ar.
- `https://cmdca.vercel.app/admin`: redireciona para login antigo e responde HTTP 200; `/api/health` no legado respondeu 404. Integração Vercel confirma projeto `cmdca` e deployment antigo `READY`, commit `236223c`.
- CI: `deploy.yml` delega a `quality.yml`, gera imagem GHCR por SHA, publica por SSH restrito e faz smoke; `e2e-producao.yml`, `lighthouse.yml` e `uptime.yml` existem. Último deploy anterior `cc437d7` teve workflow concluído com sucesso; ver `https://github.com/vhonorato02/cmdca/actions/runs/40645624257`.
- Coleções no `src/payload.config.ts`: noticias, reunioes, resolucoes, editais, entidades, rede-protecao, depoimentos, destaques, faq, paginas, media, users. Globais: configuracoes, pagina-inicial, textos, indicadores, navegacao.
- Papéis efetivos do código: `admin`, `editor`, `juridico`. `src/access/index.ts`, `Users.ts` e `editorialPolicy.ts` autorizam publicação aos três papéis editoriais e exclusão exclusivamente ao administrador. Revisão jurídica não é gate obrigatório.

## Rotas de aplicação inspecionadas pela árvore
Públicas: `/`, `/ajuda`, `/conselho`, `/fmdca`, `/participe`, `/transparencia`, `/noticias`, `/noticias/[slug]`, `/reunioes`, `/resolucoes`, `/editais`, `/conferencias`, `/entidades`, `/mapa-do-site` e `/[...path]`. CMS em `/admin`. Rotas específicas `/api/health`, `/api/draft`, `/api/draft/exit`, Payload REST e GraphQL desabilitado na configuração. Sitemap, robots, manifest, OG e security.txt presentes.

## Divergências de rastreabilidade
- `package.json`: versão `1.0.0`; `CHANGELOG.md`: `2.1.0`; tag Git existente `v2.0.0`; consulta de Releases retornou lista vazia. Não criar tag stable sem gates.
- `package.json` declara licença MIT; árvore de arquivos não contém `LICENSE`. Confirmar titularidade/licença de código e assets antes de licenciar.
- `docs/ARQUITETURA.md`, `docs/OPERACOES.md` e `docs/ESTADO_REAL.md` contêm descrições históricas de Neon/R2/Coolify/Traefik. Devem ser lidos com seu contexto cronológico e não como operação atual.
- `quality.yml` usava PostgreSQL 16 contra PostgreSQL 17 nos demais documentos/workflows. Alterado para 17 em `f630bda`. Execução do novo pipeline precisa ser acompanhada antes de aprovar.
- PWA possui manifesto e ícones, mas `display=browser`; não foram encontrados service worker nem push no inventário da árvore.
- A existência de backup/restic/restore da VPS consta na documentação, porém restauração íntegra e cópia off-site atual **não verificadas** nesta rodada.
