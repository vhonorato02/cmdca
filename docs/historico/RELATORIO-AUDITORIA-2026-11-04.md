# Relatório da rodada de auditoria · 04/11/2026
**Status: execução parcial documentada; release stable não aprovada.** Este nome corresponde ao entregável do mandato, não a uma declaração de fechamento de QA.

## Alteração executada
- `f630bda5a1cb1d459e1a0ac43eb35e5feaec2dad`: `ci(test): align disposable PostgreSQL with production 17`, `.github/workflows/quality.yml` PostgreSQL 16 → 17. Workflow acionado: https://github.com/vhonorato02/cmdca/actions/runs/41955135317. O resultado deve ser consultado no link, não inferido.
- Documentação de inventário, riscos, arquitetura, matrizes e bloqueios criada nesta rodada; não altera dados de usuários nem banco.
- Segunda correção candidata: manifesto standalone e atalho de ajuda, com regressão unitária. Não implica offline/push nem comprova instalação real.

## Comparação antes / depois
| Tema | Antes | Depois verificável |
|---|---|---|
| Fidelidade PostgreSQL CI | Quality 16, build/deploy 17 | Quality declarada em 17 no Git |
| Proveniência da topologia | Documentos antigos de Neon/R2/Coolify contradizem VPS | Inventário/arquitetura datados identificam documentos históricos |
| QA/release | Evidência histórica e gates não reunidos | Pendências objetivas e não verificado registrado sem maquiagem |
| Legado | Documentação previa Vercel antiga | Projeto READY + login público confirmados, sem deleção |
| PWA | Manifest e ícones, display browser | Modo standalone corrigido no código e teste unitário adicionado; instalação real/offline/push ainda não comprovados |

## Testes efetivamente realizados
- Leitura GitHub autenticada: HEAD/refs, árvore, código crítico, workflows, tags/releases e histórico recente.
- HTTP público: home, ajuda, login CMS, health, robots, sitemap, manifest e login legado. Sem autenticação, escrita ou dados privados.
- Vercel: projeto legado `cmdca`, deployment READY antigo no painel.
- **Não realizados diretamente neste ambiente:** build local, lint/typecheck local, teste de CMS autenticado por operador, inspeção humana de screenshots, teste Android, stress, SSH, restore, off-site, push ou teste adversarial de segurança. **Executados em CI**: quality do GitHub Actions (migrations, lint/typecheck, testes, Playwright/artefato, build) aprovado nos commits `f630bda` e `22d2146`, conforme runs correspondentes. Isso não equivale a inspeção manual local.
- **Sem dados privados coletados ou publicados.**

## Gates que impedem stable
1. Resultado de qualidade/E2E da correção e SHA live verificados.
2. Encerramento seguro ou mitigação do CMS legado e revisão do banco que ele usa.
3. Login/Payload completo com três papéis, preview, PDF e reservas em banco descartável.
4. PWA com escopo explícito e teste em Android, sem alegar offline/push inexistentes.
5. WCAG/UX em navegador real e revisão manual.
6. Backup off-site e restauração íntegra de PostgreSQL + mídia.
7. Integridade de metadados, licensing, versão e release/tags conciliadas.

Não foram encontradas provas de vazamento ativo; também não foi possível descartá-lo com inspeção anônima. O critério seguro é **não lançar a etiqueta stable**. Leia `RISCOS.md`, `MATRIZ-FLUXOS.md` e `PLANO-DE-EXECUCAO.md`.

## Ampliação do smoke de leitura pública
Em 04/11/2026 foram verificadas 11 rotas públicas HTTP 200 e uma rota fictícia com HTTP 404, sem `XXXX` no texto retornado. Foram constatados estados vazios honestos em reuniões e entidades. Critério: leitura HTTP, sem Playwright, login, testes de PDF ou confirmação de SHA. A primeira alteração (`f630bda`) teve workflow de deploy VPS **success** (`41955135317`); a publicação da segunda alteração (PWA) exige sua própria run e smoke.

## Leitura anônima das APIs
Verificação GET adicional: `/api/users` 403, `/api/preferences` 404, `/api/graphql` 405, `/api/media` 200 (3 registros públicos no total, amostra sem metadados internos), `/api/noticias` 200 (16 notícias no total, amostra sem controle editorial), `/api/reunioes` 200 (0 registros públicos). Nenhum teste de login ou tentativa de bypass autenticado foi executado; **não afirmar auditoria de segurança concluída**.

## Código da plataforma VPS também inspecionado
O repositório **privado** `vhonorato02/vps-platform` foi lido via integração GitHub, incluindo Compose, Caddy, script de deploy, restic, healthwatch e restore-test. O projeto implementa arquitetura multi-tenant com serviços isolados e backups programados. Não foi consultada a instância rodando na VPS. A prova de off-site, restauração de todos os dados e integridade dos PDFs continua pendente; detalhes técnicos em [OPERACAO-RECUPERACAO.md](OPERACAO-RECUPERACAO.md).

## Evidência de deploy do PWA em 05/11/2026 UTC
- `https://github.com/vhonorato02/cmdca/actions/runs/41956344743`: quality, imagem e deploy VPS concluídos com **success** para o commit **`22d2146eea0c1b6cc49a274b75932d300c84794c`**.
- `/manifest.webmanifest` consultado sem cache de scraping após publicação: HTTP 200, `display:'standalone'`, `/ajuda` primeiro atalho; arquivos de ícone 192, 512, maskable e apple-touch: todos HTTP 200, `image/png`.
- O manifest novo prova que a versão funcional mudou no site, mas **não** constitui inspeção independente do header `X-Release-Commit` ou instalação Android.
- A execução E2E de produção pós-deploy está registrada em `https://github.com/vhonorato02/cmdca/actions/runs/41957378741`; consultar resultado no GitHub, sem pressupor sucesso antes de concluir.
- Stable continua **bloqueada** pelos gates estruturais já relacionados; nenhuma tag `stable` ou GitHub Release foi criada.

## Decisão revisada de produto (04/11/2026)
O responsável esclareceu que o CMDCA é exclusivamente um **portal responsivo**, não deve atuar como PWA. Correção da rodada atual: remover `src/app/manifest.ts`, o teste de instalação e `appleWebApp` do layout; proibir `VERCEL_PROJECT_PRODUCTION_URL` como fallback e remover o seletor S3/R2 do runtime Payload/Next. O backup externo criptografado é exceção expressamente aceita, ainda dependente de repositório remoto e credenciais do operador.
A pausa reversível do projeto legado `cmdca` na Vercel foi confirmada por `https://cmdca.vercel.app/admin` respondendo HTTP 503, enquanto `https://www.cmdcapinda.org/api/health` seguiu HTTP 200. Não apagar banco e arquivos históricos sem inventário/backup.

## Revisão do escopo: responsividade sem PWA
O usuário descartou instalação de app. A implementação retirou os arquivos de manifesto e os metadados Apple Web App. A suíte agora verifica explicitamente ausência de `rel=manifest` e rolagem lateral nos layouts de 320, 390, 768 e 1440 px, para home, ajuda, FMDCA e notícias. O teste compara a área útil do viewport e a largura do documento; não substitui análise com leitores de tela, zoom ou toque em dispositivo.
