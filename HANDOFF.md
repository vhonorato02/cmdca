# HANDOFF · Portal CMDCA Pindamonhangaba

Atualizado: **07/11/2026, BRT**. Fotografia verificável; revalide no git, no CI e na VPS antes de agir.
Histórico: [`docs/historico/HANDOFF-2026-10-28.md`](docs/historico/HANDOFF-2026-10-28.md) e anteriores; a rodada de 06/11
está no CHANGELOG (2.2.0) e em [`docs/audit/RELATORIO-FINAL.md`](docs/audit/RELATORIO-FINAL.md).

## Estado em produção

- **Fora do domínio oficial, por decisão do Zé (07/11).** O portal responde só em
  **https://cmdca.zewithane.vps.brz.dev.br** (painel em `/admin`), com `X-Robots-Tag: noindex` em tudo e
  `robots.txt` fechado (`SITE_INDEXABLE=false`, `CMDCA_PUBLIC_URL` = temporário, nas variáveis do GitHub).
- `www.cmdcapinda.org` e `cmdcapinda.org` mostram a página "Em preparação" da plataforma (503, noindex).
  Para voltar: devolver os domínios oficiais ao site na VPS (skill `vps-zewithane`), `CMDCA_PUBLIC_URL` =
  `https://www.cmdcapinda.org`, `SITE_INDEXABLE=true` e um novo deploy (a URL entra no build).
- VPS `zewithane`, plataforma `vps-platform` 1.0. Site `cmdca`: 512 MB, raiz gravável (`--rw`, motivo em
  `docs/ARQUITETURA.md`), banco `cmdca` no Postgres 17 da plataforma, mídia em `/srv/sites/cmdca/data/media`.
- Painel: contas de teste **apagadas**; as 3 contas reais (2 administradores, 1 editor) com senhas novas em
  `C:\Users\Ze\Backups\vps-zewithane\cms-acessos-2026-11-07.txt` (fora do repositório; apagar depois de anotar).
- Versão no ar: **`6e63238`** (2.3.0, redesign "Caderno público"), publicada pelo CI: Produção `42409041255`, E2E
  `42409762881` e Lighthouse `42410185397` verdes. Confira com `site versoes cmdca` e o cabeçalho `X-Release-Commit`.
  O primeiro push do redesign (`c1cc66b`, run `42407697861`) parou na qualidade (estouro de 23 px em 320 px com o
  título padrão do CI) e não publicou nada; a correção é o `6e63238`.

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

## Pendências

| # | O quê | Quem | Como |
| --- | --- | --- | --- |
| 1 | **Backup off-site automático** (único gate para `stable`) | Zé dá 1 clique; agente faz o resto | R2 pede cartão, então o destino escolhido é o Google Drive do Zé (restic criptografado, escopo `drive.file`). No notebook, peça ao agente para retomar: ele roda `rclone authorize drive` (está em `Z:\Dev\sandbox\rclone\`) e você clica em **Permitir** no navegador. Depois ele grava o remoto na VPS e testa uma restauração |
| 2 | Excluir o projeto `cmdca` da Vercel | Zé | A API pede confirmação por link enviado ao dono da conta. Nada depende dele (está pausado, 503) |
| 3 | Excluir o banco Neon e o bucket R2 antigos | Zé (login nas contas) ou agente com token | Os dados já estão na VPS desde 26/10 (conferido); nada no portal usa esses serviços |
| 4 | Voltar ao domínio oficial | Zé decide quando; agente executa | Ver "Para voltar" acima |
| 5 | Conteúdo sem fonte pública: calendário de reuniões, entidades registradas, dados bancários do Fundo, encarregado LGPD | Conselho | Painel → pendências (o site mostra estado vazio honesto) |
| 6 | Raiz somente-leitura no container | Agente | `cacheHandler` do Next + teste no CI; depois recriar o site sem `--rw` |
| 7 | Testes manuais com leitor de tela e Android físico | Zé ou agente com aparelho | `docs/QA.md` |
| 8 | Renomear a pasta `Z:\Dev\projetos\cmdca-main` para `cmdca` | Zé, com o T3 fechado | `Rename-Item Z:\Dev\projetos\cmdca-main cmdca` e ajustar a pasta do projeto no T3 |

## Como continuar

- Código: `main`, commits pequenos em inglês; push dispara qualidade → imagem → deploy → E2E/Lighthouse de produção
  (commits só de documentação não publicam).
- Local com dados reais: restaure o dump num PostgreSQL 17 portátil (README → "Rodar localmente"). Build de produção
  local: `ENFORCE_PRODUCTION_ENV=false` e `NEXT_PUBLIC_SERVER_URL` em HTTPS (ex.: `https://127.0.0.1:3100`), porque o
  config recusa origem HTTP fora do CI isolado.
- Auditoria visual: `CHROME_PATH=<chrome.exe> node scripts/audit-visual.mjs <url> <pasta>`.
- Servidor: skill `vps-zewithane`; `docs/OPERACOES.md` para backup, rollback, recuperação e incidente.
