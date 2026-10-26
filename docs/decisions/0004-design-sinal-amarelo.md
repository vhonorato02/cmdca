# 0004 — Design system "Sinal amarelo"

Data: 26/10/2026 · Situação: aceita

## Contexto
O dono reprovou a interface anterior como genérica. O site precisa passar
confiança institucional e levar quem precisa de ajuda ao canal certo em poucos toques.

## Decisão
Paleta tirada do logo (anil #271A58 + amarelo #F6EC27, contraste medido em
`docs/design/DIRECAO.md`), Archivo condensada nos títulos e Atkinson
Hyperlegible Next no texto. CSS próprio com camadas e tokens, sem framework.
Três assinaturas: faixa de proteção, órbita do logo e numerais de ato.

## Consequências
Sem dependência de UI kit; ~2,9 mil linhas de CSS organizadas em 5 arquivos.
Novos componentes devem usar os tokens de `styles/tokens.css`.
