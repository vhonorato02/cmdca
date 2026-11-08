# HANDOFF · Portal CMDCA Pindamonhangaba

Atualizado: **08/11/2026, BRT**. Fotografia verificável; revalide no git, no CI e na VPS antes de agir.
Histórico: [`docs/historico/HANDOFF-2026-10-28.md`](docs/historico/HANDOFF-2026-10-28.md) e anteriores; a rodada de 06/11
está no CHANGELOG (2.2.0) e em [`docs/audit/RELATORIO-FINAL.md`](docs/audit/RELATORIO-FINAL.md).

## Estado em produção

- **De volta ao domínio oficial (07/11, ~17:30, a pedido do Zé).** Canônico **https://www.cmdcapinda.org** (painel em
  `/admin`); `cmdcapinda.org`, `pt.cmdcapinda.org` e `cmdca.zewithane.vps.brz.dev.br` redirecionam com 301 para o `www`.
  Indexação liberada: `SITE_INDEXABLE=true` e `CMDCA_PUBLIC_URL=https://www.cmdcapinda.org` nas variáveis do
  repositório **e** do ambiente `Production` do GitHub (o ambiente sobrepõe o repositório) e no `app.env` da VPS.
  O site estático `cmdca-oficial` (página "Em preparação") foi removido; cópia em
  `/srv/backups/removidos/cmdca-oficial-20261107-173219`.
- VPS `zewithane`, plataforma `vps-platform` 1.0. Site `cmdca`: 512 MB, raiz gravável (`--rw`, motivo em
  `docs/ARQUITETURA.md`), banco `cmdca` no Postgres 17 da plataforma, mídia em `/srv/sites/cmdca/data/media`.
- Painel: contas de teste **apagadas**; as 3 contas reais (2 administradores, 1 editor) com senhas novas em
  `C:\Users\Ze\Backups\vps-zewithane\cms-acessos-2026-11-07.txt` (fora do repositório; apagar depois de anotar).
- Versão no ar: **`b2f9a7b`** (2.4.0, redesign "Serviço público 2026"): Produção `42455365947` verde (qualidade,
  imagem, deploy, fumaça); E2E de produção `42455929265` e Lighthouse: ver "Feito em 08/11". Confira com
  `site versoes cmdca` e o cabeçalho `X-Release-Commit`. A tentativa anterior (`42fb103`) foi barrada na CI e não
  chegou à produção (ver abaixo).

## Feito em 08/11 (2.4.0, redesign "Serviço público 2026")

1. Direção em [`docs/design/DIRECAO.md`](docs/design/DIRECAO.md): linguagem simples do gov.br (verbos no infinitivo),
   capa com foto e painel "Precisa de ajuda agora?" em vidro, bento de serviços, ícones Lucide, Bricolage Grotesque +
   Public Sans. A thread anterior chegou a usar a Rawline do gov.br e trocou de fonte; docs, créditos e a migration
   (renomeada para `20261108_020000_creditos_tipografia`) foram alinhados com o que está no código.
2. Migrations de conteúdo (`copy_govbr`, `textos_padrao_govbr`, `creditos_tipografia`) testadas antes numa cópia do
   banco de produção (dump de 07/11) e aplicadas em produção no deploy; só trocam texto ainda igual ao original.
3. Auditoria: cartões que surgem ao rolar não mexem mais na opacidade (axe acusava contraste de 1,3:1 antes de
   entrarem na tela); verde "Vigente" escurecido (`#13731F`, 5,3:1); `@view-transition` entre páginas retirado
   (travava o "Carregando…" do filtro de Reuniões na CI, embora o servidor mandasse a página completa).
4. Nova suíte `tests/e2e/visual-audit.spec.ts` (12 rotas × 320/390/768/1280/1440 px: sem rolagem lateral, h1 único,
   alt, alvos ≥ 24 px; JSON-LD da capa). `playwright.config.ts` aceita `CHROME_PATH` para rodar com o Chrome local.
5. Evidência local (build de produção sobre a cópia do banco): visual-audit + axe em 17 rotas nos perfis desktop e
   celular + login do CMS: 42/42 verdes; lint e tipos verdes. Na CI: 148 unitários e 136 E2E verdes.
6. Observação: o unitário `rate-limit › continua rápido` estoura 2 s no notebook quando a CPU está a 100% (outras
   threads); passa na CI. Ao rodar local, use a porta 3107 se a 3100 estiver ocupada por outro projeto.

## Feito em 07/11 (terceira auditoria)

1. Site tirado do domínio oficial e deixado no temporário sem indexação; acessos do CMS em .txt.
2. **Redesign** ([`docs/design/DIRECAO.md`](docs/design/DIRECAO.md)): Newsreader nos títulos, foto real da cidade na capa
   (CC BY-SA 4.0, creditada na legenda e em `/creditos`), amarelo só como sinal, notícias editoriais, sem
   animações decorativas nem órbita/pictogramas.
3. Ajustes de interface achados na auditoria: faixa do topo numa linha (≥ 1280 px), telefone da barra fixa sem
   quebra (≥ 375 px), rodapé em 3 colunas no tablet, "Sair rápido" sem cobrir o título, legenda com alvo ≥ 24 px,
   404 sem enfeite.
4. Conteúdo: migration `20261107_120000_creditos_capa` atualiza `/creditos` (só se o texto ainda for o original).
5. E2E de produção corrigido para o modo noindex (`SITE_INDEXABLE`); antes falhava por exigir PDF indexável.
6. Evidências locais (build de produção com cópia dos dados reais e, depois, com os dados do CI): auditoria visual em
   todas as rotas × 8 larguras (320 a 1920 px) sem estouro, h1 único, imagens com alt; **axe sem violações**; 148 testes
   unitários, lint e tipos verdes. Títulos do CMS com palavra longa não estouram mais a tela estreita.

## Feito em 07/11 (noite, pedido do Zé)

1. Domínio oficial de volta, indexável (ver "Estado em produção").
2. **Backup off-site automático ligado** (era o único gate para `stable`): restic criptografado no Google Drive do Zé,
   client OAuth próprio (`backup-vps-zewithane`, escopo `drive.file`), primeira cópia e restauração conferidas;
   `site saude` mostra "backup externo confirmado". Detalhes no `docs/RUNBOOK.md` do `vps-platform`.
3. Bucket R2 `cmdca-media` excluído (3 arquivos conferidos na VPS antes; cópia extra em `Z:\Dev\sandbox\r2-cmdca-final`).

## Feito em 07/11 (quarta rodada de auditoria, 2.3.1)

1. Páginas internas no vocabulário da capa (régua no lugar de caixa, amarelo só como sinal, estados vazios sem
   ícone, Ajuda com fundo branco, atribuições sem ícones); 11 ícones mortos removidos.
2. Dependências: `zod` (alto) e `glob` corrigidos; `deepmerge` (baixo, sem versão corrigida no npm) e `minimatch`
   (moderado, só eslint, exige versão principal nova) ficam registrados.
3. Conferido sem mudança: APIs anônimas em produção (sem rascunho, lixeira, versões, usuários ou campos internos) e
   banco (17 MB, todas as chaves estrangeiras com índice, migrações em dia).
4. Evidência local: 160 combinações rota × largura sem estouro, axe sem violações, 148 unitários, lint e tipos.

## Pendências

| # | O quê | Quem | Como |
| --- | --- | --- | --- |
| 1 | Excluir o projeto `cmdca` da Vercel | Zé | Login na Vercel pede o código do autenticador (2FA). Depois: Settings → General → Delete Project (nome `cmdca`). Nada depende dele (pausado, 503) |
| 2 | Excluir o banco Neon antigo do CMDCA | Zé diz em que conta está | Não está nas organizações do login GitHub (v.honorato02): lá só há bancos do Anglo (tickets e CMS), que **não** foram tocados. Os dados já estão na VPS desde 26/10 |
| 3 | Conta Cloudflare `cmdcapinda@outlook.com` | Zé decide | O bucket `cmdca-media` foi excluído em 07/11; a conta ficou vazia. Revogar tokens de API R2 antigos no painel, se quiser |
| 4 | Conteúdo sem fonte pública: calendário de reuniões, entidades registradas, dados bancários do Fundo, encarregado LGPD | Conselho | Painel → pendências (o site mostra estado vazio honesto) |
| 5 | Raiz somente-leitura no container | Agente | `cacheHandler` do Next + teste no CI; depois recriar o site sem `--rw` |
| 6 | Testes manuais com leitor de tela e Android físico | Zé ou agente com aparelho | `docs/QA.md` |
| 7 | Renomear a pasta `Z:\Dev\projetos\cmdca-main` para `cmdca` | Zé, com o T3 fechado | `Rename-Item Z:\Dev\projetos\cmdca-main cmdca` e ajustar a pasta do projeto no T3 |

## Como continuar

- Código: `main`, commits pequenos em inglês; push dispara qualidade → imagem → deploy → E2E/Lighthouse de produção
  (commits só de documentação não publicam).
- Local com dados reais: restaure o dump num PostgreSQL 17 portátil (README → "Rodar localmente"). Build de produção
  local: `ENFORCE_PRODUCTION_ENV=false` e `NEXT_PUBLIC_SERVER_URL` em HTTPS (ex.: `https://127.0.0.1:3100`), porque o
  config recusa origem HTTP fora do CI isolado.
- Auditoria visual: `CHROME_PATH=<chrome.exe> node scripts/audit-visual.mjs <url> <pasta>`.
- Servidor: skill `vps-zewithane`; `docs/OPERACOES.md` para backup, rollback, recuperação e incidente.
