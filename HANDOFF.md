# HANDOFF · Portal CMDCA Pindamonhangaba

Atualizado: **07/11/2026, BRT**. Fotografia verificável; revalide no git, no CI e na VPS antes de agir.
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
- Versão no ar: **`321cc77`** (2.3.1, tag `v2.3.1`): Produção `42425496759`, E2E `42426566241` e Lighthouse
  `42427100043` verdes (home 96/100/100/100). A primeira tentativa de E2E e Lighthouse falhou por sobrecarga da VPS
  (load ~4,6 em 2 vCPUs, deploy de outro site no mesmo horário, clínica com 502); repetidos com a VPS ociosa, passaram.
  Confira com `site versoes cmdca` e o cabeçalho `X-Release-Commit`.

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
