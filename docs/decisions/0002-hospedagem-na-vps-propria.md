# 0002 — Hospedar na VPS própria, com banco e mídia locais

**Status:** aceita · 2026-10-26 (decisão do dono: "zerar a VPS, custo zero")

**Contexto.**
- Antes: Vercel (app), Neon (Postgres) e Cloudflare R2 (mídia), três contas externas com limites de free tier.
- O R2 servia arquivos publicamente (`r2.dev`).
- O dono quer a VPS como plataforma para vários sites e custo zero.

**Decisão.**
- O app roda como stack da plataforma `vps-platform` (Caddy + Docker) na VPS.
- O banco `cmdca` fica no Postgres compartilhado da plataforma, sem TLS: a rede `db` é interna.
- A mídia fica em disco (`MEDIA_DIR=/app/media`, volume `/srv/sites/cmdca/data/media`), servida por `/api/media/file/` com o controle de acesso do Payload. Arquivo em rascunho não vaza.
- S3/R2 continua suportado só se `S3_BUCKET` for definido.
- As migrations rodam no start (`prodMigrations`).
- Deploy pelo GitHub Actions, com chave SSH restrita ao comando `deploy <tag>`.

**Alternativas.**
- Manter Vercel + Neon + R2: custo e limites, dados espalhados.
- Coolify: painel pesado para 2 GB.

**Consequências.**
- Um único servidor: backup restic diário com teste semanal de restauração. O off-site ainda está pendente.
- Mais performance (sem cold start) e privacidade (sem bucket público).
- O IP do servidor é dinâmico; o domínio definitivo deve usar CNAME onde der.
