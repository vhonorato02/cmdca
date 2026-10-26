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

## Trocar para o domínio definitivo (Wix)

1. No painel do Wix: **Domínios → (domínio) → Registros DNS**.
   - Crie `CNAME www → cmdca.zewithane.vps.brz.dev.br`.
   - Para o domínio raiz, crie um registro `A @ → 177.107.94.31`. Esse IP é dinâmico; se mudar, o `A` precisa ser atualizado. Prefira manter o raiz redirecionando para o `www`, que é CNAME.
2. Na VPS:
   - `site dominio cmdca www.<dominio>,<dominio>`;
   - `site config cmdca`, com `NEXT_PUBLIC_SERVER_URL=https://www.<dominio>` e `SITE_INDEXABLE=true`.
3. No GitHub: mude `CMDCA_PUBLIC_URL` para a nova origem e faça um push (ou rode o workflow manualmente) para rebuildar.
4. Depois de validar: desligue o projeto na Vercel e os recursos legados do Neon e do R2.

## Restaurar backup

- **Banco e mídia do CMDCA:** `site restaurar cmdca [snapshot]`. Guarda o estado atual antes de restaurar.
- **Servidor novo:** veja o `RUNBOOK.md` do `vps-platform`, seção "Restaurar backup".
- **Último teste:** `/srv/backups/restore-test.log`. Exemplo de linha: `OK snapshot=ddc7712e bancos=[cmdca:52] midia=ok`.
