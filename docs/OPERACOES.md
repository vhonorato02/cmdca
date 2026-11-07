# Operações, backup e recuperação

Atualizado em 06/11/2026 (plataforma `vps-platform` 1.0). Runbook antigo (Neon/R2/Coolify) em [`historico/`](historico/OPERACOES-2026-10-neon-r2.md). O manual do servidor é o `docs/RUNBOOK.md` do repositório `vps-platform`.

## Rotina

| O quê | Como | Frequência |
| --- | --- | --- |
| Deploy | Push na `main` → workflow `Producao (VPS)` (qualidade → imagem → `deploy <sha>` por SSH restrito) | A cada mudança de código |
| Conferir produção | `E2E (producao)` e `Lighthouse (producao)` rodam depois de cada deploy | Automático |
| Disponibilidade externa | Workflow `Disponibilidade` (a cada 15 min, alerta no ntfy) | Automático |
| Saúde na VPS | `ssh zewithane-vps 'site saude'`; painéis Gatus e Beszel pela Tailscale (`site paineis`) | Quando houver alerta |
| Backup local | Timer `platform-backup` 03:17 (dumps + restic, retenção 7d/4s/6m, check de 5%) | Diário |
| Teste de restauração | Timer `platform-restore-test` (domingo 04:30) | Semanal |
| Off-site | Cópia restic criptografada no Google Drive do Zé, no mesmo timer do backup local; `tools/offsite-pull.sh` pelo notebook continua valendo | Diário |

## Comandos na VPS

```bash
ssh zewithane-vps 'site versoes cmdca'      # versão no ar e histórico
ssh zewithane-vps 'site rollback cmdca'     # volta para a imagem anterior, sem downtime
ssh zewithane-vps 'site logs cmdca 200'
ssh zewithane-vps 'site manutencao cmdca liga'   # 503 + noindex (desliga com "desliga")
ssh zewithane-vps 'site backup && site teste-restauracao'
```

Variáveis do app (`/srv/sites/cmdca/app.env`): monte o arquivo no notebook e envie com
`cat app.env | ssh zewithane-vps 'site config cmdca --stdin'` (vale no próximo deploy). Nunca cole segredos no chat.

## Rollback e migrations

`site rollback` troca só a imagem. Se a versão nova aplicou migration que remove coluna/tabela, rode antes o `down`
da migration (`src/migrations/<nome>.ts`) via `site banco cmdca`. Hoje isso vale só para
`20261027_044136_media_sem_autosave`. Use expandir/contrair em mudanças de schema: uma versão para de usar a coluna e
só a seguinte remove.

## Backup e recuperação

- **Local:** restic em `/srv/backups/restic` com `/srv/platform`, `/srv/sites` (inclui `data/media`), `/srv/static` e
  os dumps `pg_dump -Fc` de cada banco. O repositório inteiro tem ~3 MB.
- **Senha do restic:** fora da VPS, em `C:\Users\Ze\Backups\vps-zewithane\restic-vps.env`. Sem ela não há restauração.
- **Off-site manual (provado em 06/11/2026):** no notebook, Git Bash, a partir do repositório `vps-platform`:
  ```bash
  RESTIC=/z/Dev/sandbox/offsite-restore-tools/restic.exe tools/offsite-pull.sh \
    "C:/Users/Ze/Backups/vps-zewithane/restic-offsite" "C:/Users/Ze/Backups/vps-zewithane/restic-vps.env" \
    --restaurar /z/Dev/sandbox/restore-$(date +%F)
  ```
  Resultado de 06/11: `check --read-data` sem erros; 4 arquivos de mídia com SHA-256 idêntico à produção;
  `pg_restore` num PostgreSQL 17.11 local em 5 s; contagem de linhas idêntica nas 74 tabelas.
- **Off-site automático (desde 07/11/2026):** o `backup.sh` copia o repositório restic para o Google Drive do Zé
  (`rclone:gdrive:vps-zewithane-restic`, client OAuth próprio, escopo `drive.file`), verifica e marca
  `last-backup-offsite-ok`; o healthwatch alerta se passar de 36 h. Restauração a partir do Drive conferida em 07/11
  (dump do CMDCA válido e mídia presente). Detalhes e reautorização: `docs/RUNBOOK.md` do `vps-platform`.
- **Restaurar só o CMDCA na mesma VPS:** `site restaurar cmdca [snapshot]` (guarda o estado atual antes).
- **VPS perdida ou zerada (feito de verdade em 06/11/2026):**
  1. Plataforma nova (`bootstrap.sh` + `install.sh` do `vps-platform`).
  2. `site novo cmdca --imagem ghcr.io/vhonorato02/cmdca --porta 3000 --saude /api/health --memoria 512m --rw`
  3. `app.env` antigo via `site config cmdca --stdin`.
  4. Banco: `sudo cat db.dump | sudo docker exec -i postgres pg_restore -U postgres -d cmdca --no-owner --role=cmdca --exit-on-error`
  5. Mídia: extrair em `/srv/sites/cmdca/data/media` (dono uid 1000).
  6. `site deploy cmdca <sha>` e depois
     `site dominio cmdca www.cmdcapinda.org,cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br --redirecionar cmdcapinda.org,pt.cmdcapinda.org,cmdca.zewithane.vps.brz.dev.br --para www.cmdcapinda.org`
     (o `www` primeiro: o healthwatch testa o primeiro domínio).
  7. `site chave-deploy cmdca` → secrets `DEPLOY_SSH_KEY` e `DEPLOY_KNOWN_HOSTS` do ambiente `production` no GitHub.

## Contas do painel

Seis contas em 06/11/2026: dois administradores e um editor reais, mais três contas de teste/seed
(`*@cmdca.local`, `*@cmdca-pinda.local`, `*@cmdca.teste`) que foram **bloqueadas** (`lock_until = 2099-01-01`).
Para apagar: Painel → Usuários (administrador). Para desfazer o bloqueio de uma delas:
`update users set lock_until = null, login_attempts = 0 where id = <id>;` via `site banco cmdca`.

## Incidente

Crítico: credencial exposta, dado pessoal indevido, conteúdo jurídico falso, site fora, perda de dados ou painel
comprometido. Ordem: conter (`site manutencao cmdca liga` se preciso) → trocar o segredo afetado
(`PAYLOAD_SECRET` encerra sessões; senha do banco pelo `site`) → revogar sessões → conferir logs → restaurar do backup
se houver dano → registrar início, detecção, rotas, SHA no ar, ações, ponto de recuperação e prevenção, sem PII.
