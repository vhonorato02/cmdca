# Deploy do CMDCA (VPS zewithane, plataforma `vps-platform`)

Produção: **https://cmdca.zewithane.vps.brz.dev.br** (domínio temporário; o definitivo fica no Wix, veja abaixo).
A infraestrutura é a plataforma multi-site do repositório privado `vhonorato02/vps-platform`:

- Caddy com HTTPS automático, publicado por labels;
- Postgres 17 compartilhado, com banco `cmdca` e usuário próprio;
- stack compose em `/srv/sites/cmdca`;
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
| Variable | `CMDCA_PUBLIC_URL` | `https://cmdca.zewithane.vps.brz.dev.br` |
| Variable | `DEPLOY_HOST` | `ssh.zewithane.vps.brz.dev.br` |
| Variable | `DEPLOY_PORT` | `22322` |
| Secret | `DEPLOY_SSH_KEY` | gerado por `site chave-deploy cmdca` na VPS |
| Secret | `DEPLOY_KNOWN_HOSTS` | idem |

## Variáveis do app na VPS

Para editar: `site config cmdca` (abre `/srv/sites/cmdca/app.env` e republica sem downtime).
`DATABASE_URL`, `PORT` e `HOSTNAME` são injetados pela plataforma.

```
NODE_ENV=production
ENFORCE_PRODUCTION_ENV=true
NEXT_PUBLIC_SERVER_URL=https://<domínio>       # origem HTTPS, sem caminho
SITE_INDEXABLE=false                           # true só no domínio definitivo
PAYLOAD_SECRET=<64 hex, gerado no servidor>    # trocar encerra as sessões
SMTP_HOST= SMTP_PORT=587 SMTP_USER= SMTP_PASS= EMAIL_FROM_ADDRESS=   # recuperação de senha (pendente)
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

Também dá para fazer pelo Dockge (`https://zewithane-1.tail731312.ts.net:10000`, só na Tailscale): stack `cmdca`.

## Monitoramento

- **Na VPS:** o healthwatch do `vps-platform` vigia containers, disco e backup e alerta no ntfy.
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

Nas próximas mudanças de schema, use expandir/contrair: uma versão para de usar a
coluna e só a seguinte a remove.

## Trocar para o domínio definitivo (Wix)

Domínio definitivo: **www.cmdcapinda.org** (canônico). O raiz `cmdcapinda.org` e o
antigo `pt.cmdcapinda.org` respondem com 301 para o `www`, preservando caminho e query
(ADR 0007). O Wix não tem site conectado nem histórico no Wayback, então não há URLs
antigas para redirecionar além dos hosts.

1. **Dono, no painel do Wix:** **Domínios → cmdcapinda.org → Registros DNS**.
   - Apague os registros `A`/`CNAME` antigos de `@`, `www` e `pt` que apontam para o Wix.
   - `CNAME www → cmdca.zewithane.vps.brz.dev.br`
   - `CNAME pt → cmdca.zewithane.vps.brz.dev.br`
   - `A @ → 177.107.94.31`. Esse IP é dinâmico; se mudar, só o `A` precisa ser atualizado
     (o `www` segue sozinho pelo CNAME).
2. **Esperar o DNS:** `nslookup www.cmdcapinda.org 1.1.1.1` deve mostrar o IP da VPS.
3. **Na VPS** (o domínio temporário continua respondendo e passa a redirecionar):
   ```bash
   site dominio cmdca www.cmdcapinda.org,cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br \
     --redirecionar cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br --para www.cmdcapinda.org
   sudo sed -i -e 's#^NEXT_PUBLIC_SERVER_URL=.*#NEXT_PUBLIC_SERVER_URL=https://www.cmdcapinda.org#' \
     -e 's#^SITE_INDEXABLE=.*#SITE_INDEXABLE=true#' /srv/sites/cmdca/app.env
   ```
4. **No GitHub** (rebuild com a nova origem e deploy pelo CI):
   ```bash
   gh variable set CMDCA_PUBLIC_URL --body https://www.cmdcapinda.org
   gh variable set SITE_INDEXABLE --body true
   gh workflow run deploy.yml --ref main
   ```
5. **Validar:** `curl -I https://cmdcapinda.org/x?y=1` → `301` para `https://www.cmdcapinda.org/x?y=1`;
   `https://www.cmdcapinda.org/robots.txt` sem `Disallow: /`; certificado válido nos três hosts.
6. Depois de validar: desligue o projeto na Vercel e os recursos legados do Neon e do R2.

Para voltar atrás: `site dominio cmdca cmdca.zewithane.vps.brz.dev.br`, restaure as duas
linhas do `app.env` e as variáveis do GitHub, e rode o deploy de novo.

## Restaurar backup

- **Banco e mídia do CMDCA:** `site restaurar cmdca [snapshot]`. Guarda o estado atual antes de restaurar.
- **Servidor novo:** veja o `RUNBOOK.md` do `vps-platform`, seção "Restaurar backup".
- **Último teste:** `/srv/backups/restore-test.log`. Exemplo de linha: `OK snapshot=ddc7712e bancos=[cmdca:52] midia=ok`.
