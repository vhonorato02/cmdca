# 0003 — O CI é o único caminho para produção

**Status:** aceita · 2026-10-26

**Contexto.** O dono quer trabalho sempre na `main` e direto em produção, mas sem quebrar o site no ar.

**Decisão.**
- Todo push na `main` (exceto só docs) passa pelo `quality.yml`:
  - Postgres descartável;
  - migrations, lint, tipos e unitários;
  - build e container de produção;
  - E2E Playwright no container, incluindo o CMS e os downloads de mídia;
  - auditorias de acessibilidade e layout.
- Só depois disso a imagem é publicada e o deploy acontece.
- O deploy sobe a versão nova ao lado da antiga e só troca quando `/api/health` responde. Falhou: a antiga segue no ar.
- O build usa banco vazio, então nenhum conteúdo de teste entra na imagem. O conteúdo real chega por ISR e pelo aquecimento pós-deploy.

**Consequências.**
- Um push quebrado nunca chega ao visitante.
- Rollback manual: `site rollback cmdca`.
- Nada de build, migrate ou seed local contra produção. Operações pontuais em produção (como o pacote editorial) são feitas por túnel SSH a partir de uma cópia limpa do commit e ficam registradas no `HANDOFF.md`.
