# 0011 — Design "Caderno público"

Data: 07/11/2026 · Situação: aceita · Substitui a [0004](0004-design-sinal-amarelo.md)

## Contexto
O dono reprovou o "Sinal amarelo" ("feio que dói"): bloco amarelo saturado na capa,
títulos condensados pesados, cartões de estilos diferentes, ícones e animações sem
função, nenhuma foto real.

## Decisão
Tom editorial de órgão público: Newsreader (serifa com eixo óptico) nos títulos e
numerais, Atkinson Hyperlegible Next mantida no texto, paleta fria, réguas finas em
vez de cartões com sombra, foto real e livre da cidade na capa. O amarelo do logo fica
restrito a sinal (telefones de proteção, foco, "Buscar ajuda"). Movimento só com
função. Detalhes em `docs/design/DIRECAO.md`.

## Consequências
Mesma arquitetura de CSS (camadas e tokens); a troca foi feita nos tokens e nas peças
que definem a cara do site. Sai a órbita como enfeite e os pictogramas. Fotos novas
precisam de licença livre ou autorização e crédito em `/creditos`.
