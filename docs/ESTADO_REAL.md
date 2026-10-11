# Estado real

Verificacao: 2026-10-11. Base inicial: c71580083f5849ab5084737843144ba124e233cb.

## Evidencias atuais

- Git main limpo no inicio. GitHub publico vhonorato02/cmdca, autenticacao com repo/workflow.
- CI anterior 36954468993 aprovado em 02/10. Nao comprova estas alteracoes.
- Dependencias locais tinham diretorios vazios de Payload, Sharp e Postgres.
  Reinstalacao pelo lockfile recuperou os pacotes, sem atualizar versoes.
- Portal aberto em navegador Playwright em http://localhost:3000 em 11/10.
  Nenhuma escrita de teste no Neon/R2 operacional.
- SSH autenticado com chave existente e parametros explicitos. Config SSH global
  rejeitada por ACL local; nenhum arquivo global foi alterado.
- VPS Ubuntu 24.04.5, 2 CPUs, 1.9 GiB RAM, 3 GiB swap, 14 GiB disco livre.
  Traefik central, Postgres privado, sites quarau e teste ativos. Coolify ausente.
  Handoff anterior sobre acesso recusado/Coolify ficou desatualizado.
- cmdca.zewithane.vps.brz.dev.br resolve para 177.107.94.31. Isso comprova
  DNS, nao publicacao CMDCA ou certificado TLS.

## Mapa

| Superficie | Estado | Evidencia / lacuna |
| --- | --- | --- |
| Portal e noticias | REAL / PARCIAL | Renderizado local; conteudo legado exige revisao atual |
| Auth e papeis | PARCIAL | Codigo e CI anterior; repeticao isolada pendente |
| Preview de noticias | PARCIAL | Implementado nesta sessao, E2E remoto pendente |
| Menu e capa editaveis | PARCIAL | Global e campos integrados; migration gerada, nao aplicada operacionalmente |
| Arquivos privados | PARCIAL | URLs via Payload e no-store; acesso direto R2 ainda precisa ser desativado |
| PDFs | PARCIAL | Testes de bytes/download e upload UI adicionados ao CI |
| Fontes publicas | PARCIAL | Metadados internos existentes, fonte ainda nao exibida em todas noticias |
| Publicacao VPS | AUSENTE | Nenhum container CMDCA implantado |
| SMTP/reset real | AUSENTE | Sem SMTP local; nao remover bloqueio de producao |
| Backup/restore CMDCA | AUSENTE | Plataforma possui timers, mas nao comprovam backup do Neon/R2 |
| Wix | NAO VERIFICADO | Dominio exato/zona nao encontrados; nenhum registro alterado |

## Revisao independente

Revisor identificou ausencia de preview/menu e exposicao direta de R2. Correcoes
em andamento. Classificacao P0 da revisao juridica obrigatoria nao foi adotada:
README, campos e testes existentes explicitamente permitem editor publicar.
Nao introduzir uma aprovacao obrigatoria por inferencia. Nomes de hooks no-op
e regras mortas permanecem divida de clareza, nao prova de escalada de privilegio.

PATCH parcial de draft foi corrigido para preservar o estado original. Criacao
sem flag explicita continua validada, evitando afrouxar o default de publicacao.

## Proxima verificacao

Executar CI completo no Postgres descartavel, revisar capturas e resultados,
resolver R2 privado/SMTP/backup antes da promocao. Nao chamar esta etapa de entrega.
