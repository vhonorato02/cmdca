# 0007 — Domínio canônico www.cmdcapinda.org

Data: 26/10/2026 · Situação: aceita

## Contexto
O domínio `cmdcapinda.org` está registrado no Wix, mas sem site conectado (a
resposta é "ConnectYourDomain") e sem capturas no Wayback Machine. O IP da VPS
é dinâmico.

## Decisão
- O endereço canônico é `https://www.cmdcapinda.org`. O `www` é um CNAME para o
  domínio da VPS, então acompanha o IP sozinho.
- O raiz `cmdcapinda.org`, o antigo `pt.cmdcapinda.org` e o temporário
  `cmdca.zewithane.vps.brz.dev.br` respondem com 301 para o `www`, preservando
  caminho e query. Isso é feito pelo Caddy, com `site dominio --redirecionar`
  do `vps-platform` (testado em `ci/check-domains.sh` e na VPS).
- Não há URLs antigas para mapear, então não existem redirects por caminho.

## Consequências
Um único endereço para buscadores e links. Se o IP mudar, só o registro `A` do
raiz precisa ser atualizado. A troca de domínio leva poucos passos, descritos
no `DEPLOY.md`.
