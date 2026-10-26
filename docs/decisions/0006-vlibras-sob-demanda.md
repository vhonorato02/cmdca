# 0006 — VLibras carregado sob demanda

Data: 26/10/2026 · Situação: aceita

## Contexto
O plugin do VLibras era injetado em toda página: script de terceiro sem ação do
visitante (LGPD/consentimento), servidor lento que segurava o carregamento e
fallback do jsDelivr bloqueado pela CSP.

## Decisão
O botão "Libras" da faixa de acessibilidade baixa e inicializa o plugin na
primeira vez que é clicado (`src/components/VLibras.tsx`). A CSP libera
`vlibras.gov.br` e `cdn.jsdelivr.net`.

## Consequências
Nenhuma requisição a terceiros no carregamento (coberto por E2E). Leva alguns
segundos na primeira abertura, e o botão mostra "Carregando…".
