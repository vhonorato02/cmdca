# HANDOFF
Atualizado: 2026-10-12 16:10

## Estado atual

Retomada em main a partir de c715800. SSH funciona com parametros explicitos;
VPS usa Traefik e ja hospeda quarau/teste, nao Coolify. Dependencias locais
reparadas pelo lockfile. Implementados preview autenticado de noticias, menu
administravel, capa editavel e entrega de arquivos via autorizacao Payload.
Lint/tipos/111 unitarios passaram. Migration nova gerada sem conectar no Neon.
CI 38122123588 passou migration, integracao, build/imagem e 124 E2E, mas falhou
em 4 cenarios novos: origem interna do container no preview e imagem da capa
tratada como URL remota. Correcoes com regressao local: 114 unitarios, lint/tipos
aprovados. Novo CI ainda necessario. Nao houve deploy ou mutacao do banco fonte.
Backup Neon e restore isolado confirmados: 46 tabelas, 6 noticias, 297 KiB.
CI 38291796075 confirmou correcoes de origem e imagem. Seletores novos ajustados
para texto exato de previa e abrir menu antes de consultá-lo. Next 16.3.8 e
patches transitivos reduziram auditoria prod para 1 high (braces, sem release
corrigida no npm consultado).
CI 38294655430: 127/128 E2E passaram. Grupo Fonte na sidebar desktop nao
montou inputs mesmo apos rolagem; movido ao formulario principal. Novo CI necessario.
Backup R2 de 3 objetos (55.064 bytes) criptografado e restaurado com hash.
Fonte e restore Neon conferidos: 6 noticias, 2 midias, 2 usuarios.

## Como rodar

`pnpm dev --hostname 127.0.0.1 --port 3000` em http://127.0.0.1:3000.
Servidor iniciado e restrito a loopback. CMS usa http://localhost:3000/admin.
`pnpm check` para lint/tipos/unitarios. Escritas CMS somente no Postgres efemero do Actions.
Nao executar seed/migrate sobre .env.local. API media local retorna 500
por migration antiga ainda nao aplicada (_objectkey); home com fallback
nao comprova CMS local pronto.

## Feito nesta sessao

Diagnostico real em docs/ESTADO_REAL.md, decisao de CI em docs/CI_CD_DECISOES.md
e plataforma em docs/OPERACAO.md. Novos E2E cobrem preview/revogacao, menu/capa
CMS->publico, PDF publicado e privado com comparacao SHA256.

## Pendencias

CI remoto e capturas, privacidade direta R2 (HEAD anonimo 200), SMTP institucional,
backup automatico/offsite, conteudo atual/fonte publica, DNS Wix exato e implantacao HTTPS.
Pendencias editoriais detalhadas no historico abaixo continuam abertas.

## Proxima acao unica

Executar e corrigir o CI da fatia editorial antes de qualquer promocao.

## Pendencias editoriais e operacionais detalhadas

- Nao acionar Producao Coolify: adaptar entrega ao comando site/Traefik da VPS.
- Aplicar migrations operacionais somente apos gate e referencia de backup.
- Conteudo: composicao atual, contatos/endereco, dados bancarios do Fundo,
  reunioes, atas, resolucoes, editais, entidades, rede e indicadores com fonte.
- Duas noticias [A CONFIRMAR] continuam ocultas. Nenhuma importacao nova.
- Robots da Prefeitura restringe crawlers de IA; coleta automatizada interrompida.
- Biblioteca global de documentos, SEO editavel por pagina e fonte publica
  ainda precisam de aceite completo.
- Teste R2: `node scripts/verify-storage.mjs`, objeto unico com limpeza verificada.

