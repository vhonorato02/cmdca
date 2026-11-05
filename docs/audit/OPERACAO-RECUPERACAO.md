# Operação, CI e recuperação: estado verificado

**Configuração por código:** `quality.yml` com Postgres efêmero, migrations, lint, types, unidade, testes CMS, Playwright+axe+auditoria, container; `deploy.yml` gera imagem GHCR com SHA e pede deploy restrito. `e2e-producao.yml` testa a leitura do SHA da execução; `uptime.yml` verifica saúde e home periodicamente. Commit anterior `cc437d7` com deploy Actions bem-sucedido. Commit `f630bda` iniciou novo pipeline após alinhar versão CI PostgreSQL.

**VPS:** segundo `DEPLOY.md` e ADRs, Caddy, Docker, PostgreSQL 17 lógico compartilhado, mídia em volume e restic; sem SSH nesta rodada. Limites, consumo, tenants, permissões Docker, firewall, HSTS efetivo, certificados, backups e fallback **não verificados agora**.

**Backup e legado:** `HANDOFF.md` 28/10 sinaliza backup off-site e encerramento Vercel/Neon/R2 pendentes. Integração Vercel e HTTP confirmam projeto antigo ainda disponível. Antes de qualquer descomissionamento, documentar dependentes, exportação de banco e arquivos, checksums, retenção, permissão das contas e procedimento de reversão. Pausa só após autorização operacional.

**Runbook de recuperação seguro:** (1) registrar incidente/SHA, não apagar registros; (2) interromper promoção de imagens ruins e proteger dados; (3) verificar saúde, logs redigidos e uso de disco; (4) se regressão de código sem migração incompatível, aplicar rollback pelo comando autorizado da plataforma; (5) se dados/mídia corrompidos, restaurar em isolamento e validar consistência antes de decidir restauração real; (6) pós-recovery validar público, CMS, documentos e observabilidade. Não executar prune/reboot/firewall amplo na plataforma compartilhada.

**Gate não cumprido:** sem restore completo banco+mídia com hashes, RPO/RTO e cópia externa demonstrada, a release stable permanece bloqueada.

## Inspeção do código da plataforma multi-tenant (GitHub privado)
- `vps-platform/compose.yml`: PostgreSQL 17, Caddy em rede de borda com proxy de socket somente leitura; Dockge recebe acesso ao socket mas escuta em interface local (exposição efetiva depende do host).
- `scripts/backup.sh`: dump por banco, restic sobre diretórios de plataforma/sites e dumps; retenção 7 diários/4 semanais/6 mensais; `restic check` de 5% dos dados; replicação externa **condicional** à existência de `RESTIC_REPOSITORY_OFFSITE`. Não foi possível verificar se essa variável está configurada no servidor.
- `scripts/restore-test.sh`: restaura dumps em PostgreSQL 17 descartável sem rede e verifica que há tabelas, além de um arquivo de mídia. **Não** demonstra hash de todos os PDFs, recuperação de todas as referências ou consistência transacional banco + mídia. Cron semanal está definido no repositório, execução no host não foi comprovada.
- `scripts/deploy.sh` e `bin/gh-deploy`: lock por site, espera de readiness, promoção de réplica nova e rollback de tag quando ela não sobe; comandos SSH restringidos a deploy/status. Não houve execução SSH nesta rodada.
- **Atenção:** o script de backup tolera retorno 3 do `restic backup` (snapshot parcial com arquivos ilegíveis) como aviso; avaliar política para não considerar restauração completa sem conferir esses arquivos, especialmente mídia e anexos públicos.

Isso reforça a classificação **não verificado** para backup externo, restauração completa, permissões e disponibilidade operacional, mesmo quando o código de automação existe.
