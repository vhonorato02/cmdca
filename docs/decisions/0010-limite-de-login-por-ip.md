# 0010 — Limite de tentativas de login por IP

Data: 27/10/2026 · Situação: aceita

## Contexto
O Payload trava cada conta depois de 5 senhas erradas (15 minutos), mas não limita
por origem. Dava para testar senhas em muitas contas e bloquear de propósito as
contas reais.

## Decisão
- `src/proxy.ts` limita `POST /api/users/login` e `/api/users/forgot-password` a 20
  tentativas por IP a cada 10 minutos (`LOGIN_RATE_LIMIT_MAX` muda o número). Acima
  disso: `429` com `Retry-After`.
- O IP é o último item do `X-Forwarded-For`. O Caddy 2.11 sem `trusted_proxies`
  descarta o que o cliente manda e grava o IP real ali. Endereços IPv6 contam pelo
  prefixo /64.
- O contador fica em memória, com teto de 50 mil endereços (descarta a metade mais
  antiga de uma vez, para o custo não crescer).

## Consequências e limites
- O contador zera a cada deploy ou restart e se divide entre as duas réplicas
  durante a troca de versão. É aceitável para um painel com poucos usuários.
- **Se algum dia houver CDN (ex.: Cloudflare) na frente do Caddy,** o último
  `X-Forwarded-For` passa a ser o da CDN e todos caem no mesmo balde. Nesse caso,
  configure `trusted_proxies` no Caddy e use o cabeçalho de IP real da CDN.
