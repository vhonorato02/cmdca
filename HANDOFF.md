# HANDOFF
Atualizado: 2026-10-27 (domínio definitivo + QA completo, v2.0.0)

## Rodada de 26/10/2026

Decisões do dono (Q/A de 26/10): zerar a VPS e reconstruí-la como plataforma
multi-site (CMDCA é o 1º site), com Cockpit; tudo na `main`, direto em produção.
Conteúdo: pesquisar fontes públicas de Pindamonhangaba-SP (resultado em
`docs/research/conteudo-pesquisa.md`). Usuários do CMS: dono (perfil dev/admin) e
conselheiros (editor geral); credenciais iniciais foram passadas em chat e
devem ir só para env/seed local, nunca para o repo. Custo zero (free tier/VPS).
Visual: redesenho moderno. Domínio no Wix: avisar o dono quando for configurar o DNS.
E-mail: sem SMTP (ADR 0009). Dados que faltam (encarregado LGPD,
FMDCA etc.) ficam como `XXXX` e aparecem como pendência no CMS. Dados saem do Neon/R2 para a VPS
e a Vercel será desligada depois.

## Estado em 27/10/2026 — NO AR EM https://www.cmdcapinda.org

- **Domínio definitivo ativo desde 27/10 00:50** (DNS no Wix apontado pelo dono). `cmdcapinda.org`,
  `pt.cmdcapinda.org` e `cmdca.zewithane.vps.brz.dev.br` respondem 301 para `https://www.cmdcapinda.org`,
  com Let's Encrypt nos 4 hosts. `SITE_INDEXABLE=true`, sitemap com as notícias, `robots.txt` liberado.
- **E-mail:** o site não envia e-mail (ADR 0009). Senhas são redefinidas por um administrador.
- **Painel:** https://www.cmdcapinda.org/admin. Política: quem edita publica; revisão jurídica é só
  informativa (`docs/CMS.md`).
- **Conteúdo real novo:** Resolução 153/2025 e Edital CMDCA 02/2024 (2ª retificação), com o PDF da p. 4
  do Diário Oficial de 28/03/2025. Reuniões e entidades seguem vazias: não há fonte aberta (`docs/research`).
- **Corrigido nesta rodada (com teste):**
  - páginas do build vazias após cada deploy (truque do mtime no Dockerfile + passo no CI);
  - sitemap congelado no build;
  - `noindex` nos PDFs públicos;
  - limite de login por IP (ADR 0010);
  - CSP aplicada no `/admin`;
  - mídia sem arquivo publicável e sem autosave (migration `20261027_044136`);
  - regras mortas de "aprovação jurídica";
  - dois botões de menu no painel;
  - botão Menu saindo da tela em 320 px;
  - link de PDF sem aviso de formato;
  - resumo do Lighthouse que quebrava em silêncio.
- **Evidências:** `docs/QA.md` → "27/10/2026".
- **Conta temporária de QA:** `qa-temporario@cmdcapinda.org` foi criada para o teste do painel e
  **apagada no fim**. A senha ficou em `C:\Users\Ze\Backups\vps-zewithane\cms-qa-temporario.env`, que
  também foi apagado.

## Próximos passos (dependem do dono)
1. **Desligar o projeto na Vercel** (`cmdca.vercel.app/admin` ainda está editável, sobre o Neon antigo).
   Depois: export final do Neon e do R2 e desligamento dos dois.
2. Senhas fortes nas contas do painel e um 2º administrador (hoje há 1 admin: `v.honorato02@gmail.com`).
3. Conta grátis Backblaze B2 ou R2 para o backup off-site (`RESTIC_REPOSITORY_OFFSITE`).
4. Horário para o teste de reboot da VPS (o T3 também roda nela).
5. Conteúdo: calendário de reuniões, entidades registradas e dados em `XXXX` (lista no painel).

## Rodadas anteriores
Atualizado: 2026-10-13 19:15

## Rodada de 13/10/2026 (UX independente + pacote editorial)

Revisao independente de UI/UX (codex exec read-only) sem P0; todos os P1
aplicados em cf238ec: Participe sem beco sem saida, FMDCA com passos de
destinacao no IR, menu com "Fundo e IR", reunioes futuras/realizadas, ajuda com
telefones tocaveis, mobile do header/capa/rodape, data da noticia na coluna
principal do CMS. Pacote `src/seed/content-pack-2026-10.ts`: 11 noticias com
data e fonte (Tribuna do Norte, imprensa oficial; ata Edital-10434.pdf), 6 FAQ,
2 destaques; despublica 2 destaques defasados. Script idempotente
`pnpm apply:content-pack` (transacao unica, marcador, trava de banco nao local).
CI aplica o pacote duas vezes (19 criados, depois 0). Noticias sem data agora
vao para o fim na home, lista e conferencias (`sortByDateDesc`).
CI 38474174232: pacote, 121 unitarios e 128/128 E2E aprovados; auditoria do
portal reprovou a linha "Fonte:" como alvo de toque pequeno; corrigida para
texto corrido. CI 38475913896 (bce6716) APROVADO: pacote 19/0, 128/128 E2E,
admin 16/16, portal 116 capturas sem estouro, h1 unico, sem alvo pequeno.
Capturas da lista de noticias (390) e da noticia da conferencia conferidas.
O PACOTE NAO FOI APLICADO NO NEON. Isso exige backup novo, as 2 migrations
pendentes (`20260929_150216_payload_upgrade_compatibility`,
`20261011_073400_editorial_controls`) e o e-mail de um usuario real como autor.
A Vercel (cmdca.vercel.app) le esse banco: aplicar torna o conteudo publico.

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
CI 38295915240 (a412f99) APROVADO: 115 unitarios, 128/128 E2E, auditorias
admin 16/16 e portal nas quatro larguras sem estouro. Capturas do CMS revisadas.
Isso aprova o codigo em ambiente efemero, nao a producao.
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

Privacidade direta R2 (HEAD anonimo 200), SMTP institucional,
backup automatico/offsite, conteudo atual/fonte publica, DNS Wix exato e implantacao HTTPS.
Auditoria prod: 1 high em braces 3.0.3 sem versao corrigida no registry.
Pendencias editoriais detalhadas no historico abaixo continuam abertas.

## Proxima acao unica

Tornar o bucket R2 privado (desligar acesso publico/r2.dev no painel Cloudflare)
e repetir HEAD anonimo esperando 403/404; so depois preparar o deploy via
comando site/Traefik na VPS com backup Neon novo antes das migrations.

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

