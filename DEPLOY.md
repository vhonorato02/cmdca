> Atualizado em 06/11/2026: VPS reinstalada com a plataforma `vps-platform` 1.0 (Caddy com rotas geradas pelo CLI, sem Dockge). O CMDCA voltou com os mesmos dados. Portal responsivo **sem PWA**; runtime só na VPS (sem Vercel, Neon ou R2). Backup e recuperação: [`docs/OPERACOES.md`](docs/OPERACOES.md).

# Deploy do CMDCA (VPS zewithane, plataforma `vps-platform`)

Produção: **https://www.cmdcapinda.org** (DNS no Wix; o endereço antigo `cmdca.zewithane.vps.brz.dev.br` redireciona com 301).
A infraestrutura é a plataforma multi-site do repositório privado `vhonorato02/vps-platform`:

- Caddy com HTTPS automático e rota gerada pelo CLI `site` (`/srv/platform/caddy/sites/cmdca.caddy`);
- Postgres 17 compartilhado, com banco `cmdca` e usuário próprio;
- stack compose em `/srv/sites/cmdca` (512 MB, raiz gravável `--rw`: ver `docs/ARQUITETURA.md`);
- mídia em disco em `/srv/sites/cmdca/data/media`;
- backup restic diário, com teste de restauração semanal.

Operação do servidor: `RUNBOOK.md` daquele repositório.

## Fluxo (automático a cada push na `main`)

Workflow `Producao (VPS)` (`.github/workflows/deploy.yml`). Mudanças só em `*.md` e `docs/` não disparam deploy.

1. **Qualidade** (`quality.yml`), com Postgres descartável:
   - migrations, lint, tipos e testes unitários;
   - build standalone e container;
   - E2E Playwright no container, incluindo o CMS autenticado e os downloads de mídia;
   - auditorias de acessibilidade e layout.
2. **Imagem:** o build roda contra um banco vazio e migrado, então nenhum conteúdo de teste vai embutido. A imagem é publicada como `ghcr.io/vhonorato02/cmdca:<sha>`.
3. **Deploy:** `ssh -p 22322 deploy@ssh.zewithane.vps.brz.dev.br "deploy <sha>"`.
   - A chave só executa esse comando (forced command), e só para o `cmdca`.
   - O `GITHUB_TOKEN` do job vai pelo stdin e serve só para baixar a imagem. Nenhum token fica no servidor.
   - O servidor sobe a versão nova ao lado da atual e espera `/api/health`. Só então desliga a antiga, sem downtime.
   - Se a nova não ficar saudável, ela é descartada e a antiga segue no ar.
4. **Migrations:** rodam quando o container sobe (`prodMigrations` do Payload).
5. **Fumaça e aquecimento:** `/api/health`, sitemap e as páginas principais.

Configuração no GitHub (ambiente `production`):

| Tipo | Nome | Valor |
| --- | --- | --- |
| Variable | `CMDCA_PUBLIC_URL` | `https://www.cmdcapinda.org` |
| Variable | `DEPLOY_HOST` | `ssh.zewithane.vps.brz.dev.br` |
| Variable | `DEPLOY_PORT` | `22322` |
| Secret (ambiente) | `DEPLOY_SSH_KEY` | gerado por `site chave-deploy cmdca` na VPS (renovado em 06/11/2026) |
| Secret (ambiente) | `DEPLOY_KNOWN_HOSTS` | idem |

## Variáveis do app na VPS

Para editar: monte o arquivo no notebook e rode `cat app.env | ssh zewithane-vps 'site config cmdca --stdin'` (vale no próximo deploy).
`DATABASE_URL`, `PORT` e `HOSTNAME` são injetados pela plataforma.

```
NODE_ENV=production
ENFORCE_PRODUCTION_ENV=true
NEXT_PUBLIC_SERVER_URL=https://<domínio>       # origem HTTPS, sem caminho
SITE_INDEXABLE=false                           # true só no domínio definitivo
PAYLOAD_SECRET=<64 hex, gerado no servidor>    # trocar encerra as sessões
# Sem SMTP (ADR 0009): senha esquecida é redefinida por um administrador.
```

`NEXT_PUBLIC_SERVER_URL` também entra no build pela variável `CMDCA_PUBLIC_URL`. Ao trocar o domínio, mude os dois.

## Operação rápida (na VPS)

```bash
site versoes cmdca          # versão no ar e histórico
site rollback cmdca         # volta para a versão anterior (sem downtime)
site logs cmdca 200
site banco cmdca            # psql no banco do CMDCA
site backup && site teste-restauracao
```

Painéis só pela Tailscale (`site paineis`): Gatus (disponibilidade) e Beszel (recursos). O Dockge foi removido na plataforma 1.0.

## Monitoramento

- **Na VPS:** o healthwatch do `vps-platform` vigia o site (primeiro domínio da lista, por isso o `www` vem primeiro), containers, disco, backup local e off-site, e alerta no ntfy.
- **Fora da VPS:** o workflow `Disponibilidade` (`.github/workflows/uptime.yml`) consulta `/api/health`
  e a home a cada 15 minutos. Se falhar, alerta no mesmo ntfy (secret `ALERT_URL`) e o GitHub envia
  e-mail de falha. Assim, uma queda da VPS inteira também é avisada.
- **Depois de cada deploy:** `E2E (producao)` (Playwright de leitura + axe) e `Lighthouse (producao)`.

### Rollback e migrations

O `site rollback` troca só a imagem. Se a versão nova aplicou uma migration que remove
coluna ou tabela, a imagem anterior quebra até a migration ser desfeita. Antes de voltar
para uma versão anterior a uma dessas, rode na VPS `site banco cmdca` e o `down` da
migration (o SQL está em `src/migrations/<nome>.ts`). Hoje isso vale para
`20261027_044136_media_sem_autosave` (remove `_media_v.autosave`).
A `20261027_235800_trocar_senha` só adiciona `users.trocar_senha`: voltar para uma imagem
anterior funciona sem desfazê-la (a versão antiga ignora a coluna e ninguém fica bloqueado).

Nas próximas mudanças de schema, use expandir/contrair: uma versão para de usar a
coluna e só a seguinte a remove.

## Domínios

`www.cmdcapinda.org` é o canônico (ADR 0007); `cmdcapinda.org`, `pt.cmdcapinda.org` e `cmdca.zewithane.vps.brz.dev.br`
respondem 301 para ele, preservando caminho e query. DNS no Wix: `www` e `pt` em CNAME para
`cmdca.zewithane.vps.brz.dev.br`, `@` em A para o IP da VPS (177.107.94.31 em 06/11/2026). Comando aplicado na VPS:

```bash
site dominio cmdca www.cmdcapinda.org,cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br   --redirecionar cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br --para www.cmdcapinda.org
```

O histórico da troca de domínio (27/10) está em `docs/historico/HANDOFF-2026-10-28.md`.

## Restaurar backup e backup fora da VPS

Ver [`docs/OPERACOES.md`](docs/OPERACOES.md): restauração do CMDCA, recuperação com a VPS perdida (executada de verdade
em 06/11/2026), cópia off-site manual pelo notebook e configuração do R2 automático.
