# 0005 — Textos editáveis, páginas livres e pendências XXXX

Data: 26/10/2026 · Situação: aceita

## Contexto
Requisito "zero hardcoded" e editor leigo. Vários dados oficiais não têm fonte
pública (encarregado LGPD, conta do Fundo, horário).

## Decisão
- Global `Textos`: toda a redação fixa do site (capa, rotas, ajuda, Fundo…).
- Coleção `Paginas`: páginas livres (título, endereço, resumo, texto) com
  rascunho, prévia e publicação, servidas pela rota coringa `[...path]`.
- Valor desconhecido é gravado como `XXXX`. O site nunca o exibe e o painel
  lista cada ocorrência no quadro "Pendências" (`src/lib/pendencias.ts`).

## Consequências
Os padrões de `src/content/` só servem para popular o banco vazio. Mudar texto
não exige deploy.
