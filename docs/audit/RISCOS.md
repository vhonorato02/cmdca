# Matriz de riscos

Atualizada em 06/11/2026 (segunda auditoria). Prioridade = impacto num serviço público, não CVSS. Achados novos de
06/11 (A1–A12) estão em [`RELATORIO-FINAL.md`](RELATORIO-FINAL.md).

| ID | Prio | Risco | Estado em 06/11/2026 | Fechamento |
| --- | --- | --- | --- | --- |
| R01 | P1 | Painel antigo na Vercel com login | **Contido**: projeto pausado, `cmdca.vercel.app/admin` 503; secrets Vercel removidos do GitHub | Excluir projeto Vercel, Neon e bucket R2 legados depois de export final (conta do Zé) |
| R02 | P2 | CI com Postgres 16 × produção 17 | **Fechado** (`f630bda`) | — |
| R03 | — | PWA | **Fora de escopo** (decisão do dono); manifest 404 conferido | — |
| R04 | P2 | Docs de Neon/Coolify/R2 lidos como atuais | **Fechado**: movidos para `docs/historico/`, atuais reescritos | — |
| R05 | P2 | Papel `juridico` mal explicado | **Fechado**: README, `docs/CMS.md` e `docs/ARQUITETURA.md` alinhados ao código | — |
| R06 | P1 | Perda da VPS sem cópia externa | **Mitigado**: off-site manual provado e recuperação total executada em 06/11 | Ligar R2 automático e ver `last-backup-offsite-ok` |
| R07 | P3 | OG padrão do Payload no login do painel | Aberto (painel tem `noindex`) | Metadados próprios no `/admin` |
| R08 | P3 | Versão/tag/licença divergentes | **Fechado**: 2.2.0, `UNLICENSED` | Tag `v2.2.0` no SHA publicado |
| R09 | P2 | PDF continuar público depois de despublicar ou ir para a lixeira | **Fechado**: despublicar já era testado; lixeira corrigida (A1) | — |
| R10 | P2 | Segurança adversarial ampla (IDOR, upload hostil, SSRF) | Parcial: APIs anônimas, papéis, lixeira, troca de senha e limite de login testados; fuzzing de upload não feito | Rodada dedicada em runner isolado |
| R11 | P2 | Scripts de backup do Git não instalados | **Fechado**: instalados e mantidos na plataforma 1.0 | — |
| R12 | P1 | Contas de teste ativas no painel | **Contido**: bloqueadas (A2) | Zé apaga pelo painel |
| R13 | P3 | Raiz gravável no container (`--rw`) | Aceito (A8) | `cacheHandler` e teste no CI |

Nenhum P0 encontrado. Isso não prova ausência de P0.
