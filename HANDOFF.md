# HANDOFF · Portal CMDCA Pindamonhangaba

Atualizado: **06/11/2026, 23:59 BRT**. Fotografia verificável; revalide no git, no CI e na VPS antes de agir.
Histórico: [`docs/historico/HANDOFF-2026-10-28.md`](docs/historico/HANDOFF-2026-10-28.md) e anteriores.

## Estado em produção

- **https://www.cmdcapinda.org** no ar, painel em `/admin`. `cmdcapinda.org`, `pt.cmdcapinda.org` e
  `cmdca.zewithane.vps.brz.dev.br` redirecionam 301 para o `www`. Certificados Let's Encrypt novos (06/11).
- VPS `zewithane` com a plataforma `vps-platform` **1.0** (reinstalada em 06/11 por decisão do Zé). Site `cmdca`:
  512 MB, raiz gravável (`--rw`, motivo em `docs/ARQUITETURA.md`), banco `cmdca` no Postgres 17 da plataforma, mídia em
  `/srv/sites/cmdca/data/media`.
- Dados restaurados da exportação feita antes de zerar: 74 tabelas, 17 notícias (16 publicadas), 3 mídias,
  8 migrations, 6 usuários. Arquivos de mídia com SHA-256 idêntico ao de antes.
- Versão no ar: ver `ssh zewithane-vps 'site versoes cmdca'` e o cabeçalho `X-Release-Commit`.
- Deploy automático pelo GitHub Actions com chave nova (`site chave-deploy cmdca`, 06/11), secrets só no ambiente
  `production`.
- Não é PWA. Runtime só na VPS: Vercel pausada (503), Neon e R2 legados sem uso.

## Feito em 06/11 (segunda auditoria)

Relatório completo: [`docs/audit/RELATORIO-FINAL.md`](docs/audit/RELATORIO-FINAL.md).

1. **Segurança (P1):** documentos e PDFs enviados à lixeira continuavam públicos (`?trash=true` e
   `/api/media/file/`). Corrigido com `publishedLiveOrLoggedIn` e coberto por unitário, integração e E2E.
2. **Segurança (P1):** três contas de teste/seed do painel bloqueadas em produção (não apagadas).
3. Limpeza do legado: scripts Neon/R2/Coolify/Vercel, `vercel.json`, `@payloadcms/storage-s3`, secrets antigos.
4. Backup: scripts reforçados instalados; off-site **manual** provado com restauração completa fora da VPS
   (banco num PostgreSQL 17 local e mídia com hashes idênticos).
5. Recuperação real depois do zeramento da VPS, com domínio, HTTPS e redirecionamentos de volta.
6. Auditoria visual e axe em 20 rotas × 8 larguras sem violações; APIs anônimas sem vazamento.
7. Documentação atual reescrita; antigos em `docs/historico/`. Pacote `cmdca-pindamonhangaba` 2.2.0, `UNLICENSED`.

## Pendências

| # | O quê | Quem | Como |
| --- | --- | --- | --- |
| 1 | **Off-site automático (R2)** — único gate que falta para `stable` | Zé cria a conta Cloudflare; agente faz o resto | Bucket privado + token só do bucket → `/srv/platform/.env` (passo a passo em `docs/OPERACOES.md`) |
| 2 | Apagar as 3 contas de teste bloqueadas | Zé (admin) | Painel → Usuários |
| 3 | Desligar de vez Vercel, Neon e R2 legados | Zé (logins dessas contas) | Export final → excluir. Nada no portal depende deles |
| 4 | Conteúdo sem fonte pública: calendário de reuniões, entidades registradas, dados bancários do Fundo, encarregado LGPD | Conselho | Painel → pendências (o site mostra estado vazio honesto) |
| 5 | Raiz somente-leitura no container | Agente | `cacheHandler` do Next + teste no CI; depois recriar o site sem `--rw` |
| 6 | Testes manuais com leitor de tela e Android físico | Zé ou agente com aparelho | `docs/QA.md` |

## Como continuar

- Código: `main`, commits pequenos em inglês, push dispara qualidade → imagem → deploy → E2E/Lighthouse de produção.
- Local: `pnpm check`; integração do CMS contra PostgreSQL 17 portátil (README → "Rodar localmente").
- Auditoria visual: `CHROME_PATH=<chrome.exe> node scripts/audit-visual.mjs https://www.cmdcapinda.org <pasta>`.
- Servidor: skill `vps-zewithane`; `docs/OPERACOES.md` para backup, rollback, recuperação e incidente.
