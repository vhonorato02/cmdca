# Lighthouse mobile (26/10/2026)

Build de produção local (`next build` + `next start`, commit `1b92c76`), Lighthouse 12.8.2 com o perfil mobile padrão: Moto G Power, 4G lento simulado e CPU 4x. Cada página rodou 3 vezes e o relatório guardado é a **mediana** por performance. Os relatórios HTML trazem o JSON completo; o da home também está em `mobile-home.report.json`.

| Página | Performance | Acessibilidade | Boas práticas | SEO | FCP | LCP | TBT | CLS | Benchmark da CPU |
|---|---|---|---|---|---|---|---|---|---|
| home | 79 | 100 | 100 | 100 | 1,0 s | 3,0 s | 610 ms | 0 | 831 |
| ajuda | 73 | 100 | 100 | 100 | 1,0 s | 3,1 s | 940 ms | 0 | 710 |
| fmdca | 87 | 100 | 100 | 100 | 0,9 s | 3,0 s | 340 ms | 0 | 1287 |
| noticias | 76 | 100 | 100 | 100 | 1,0 s | 3,2 s | 640 ms | 0 | 768 |
| reunioes | 74 | 100 | 100 | 100 | 1,2 s | 3,2 s | 810 ms | 0 | 1062 |
| privacidade | 81 | 100 | 100 | 100 | 1,0 s | 3,0 s | 530 ms | 0 | 1245 |

Antes do redesenho, a home na Vercel marcava 67 de performance, com LCP de 4,4 s e TBT de 360 ms (`docs/AUDIT.md`). A medição foi feita em outra máquina e outra rede, então não é comparação direta.

## Como ler
- **Acessibilidade, boas práticas e SEO ficaram em 100 em todas as páginas.** O SEO foi medido com `SITE_INDEXABLE=true`, a configuração prevista para o domínio final. Com o valor atual da VPS (`false`), o portal envia `noindex` de propósito e o item "página indexável" reprova.
- **A meta de 95 em performance não foi atingida nesta máquina.** A CPU (Intel i3-1215U) oscilou entre 709 e 1287 no índice de benchmark do Lighthouse, ou seja, abaixo da faixa para a qual a simulação 4x foi calibrada. Por isso a mesma página variou até 20 pontos entre rodadas, sem mudança de código. Vale medir de novo no PageSpeed Insights quando o domínio final estiver no ar.
- O que pesa: o LCP (o título da capa) é estimado depois do download e da hidratação do JavaScript do Next/React (cerca de 160 KB comprimidos). O TBT vem dessa hidratação e do layout inicial. O CLS é 0 em todas as páginas.

## O que já foi feito para performance
- Archivo dos títulos virou uma instância local de 25 KB (antes 90 KB), com `display: optional`.
- Links internos sem pré-busca automática (`AppLink`): a home deixou de fazer 9 requisições de rota durante o carregamento.
- VLibras, mapa (Leaflet e OpenStreetMap) e simulador só carregam quando pedidos ou na página em que são usados. Sem carrossel, animação de entrada ou filtros SVG.
- Filtros e paginação por formulário GET, sem JavaScript.

## Próximos passos possíveis
- Medir no PageSpeed Insights no domínio final, com CPU de referência.
- Avaliar `experimental.inlineCss` para tirar a requisição de CSS do caminho crítico.
- Reduzir o JavaScript de cliente que ainda resta (`MainNav` e `A11yTools`).
