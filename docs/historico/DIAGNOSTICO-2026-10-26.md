# Diagnóstico (Fase 1)

Data: 26/10/2026. Base: `e943201` (estado em 13/10, publicado na Vercel) e VPS antes do reset.

## Resumo

O "mockup" já era um portal Next.js 16 + Payload 3 com papéis, rascunhos, testes e CI. O problema não era falta de código, e sim:

1. **Dependência de três serviços externos** (Vercel, Neon e R2), com deploy sem destino real na VPS.
2. **Interface genérica e pesada**: 2.949 linhas de CSS, ilustrações decorativas, VLibras e mapa de terceiros carregados em toda página.
3. **Texto institucional fixo no código**: as páginas Conselho, Fundo, Ajuda, Privacidade e outras não eram editáveis.
4. **Fluxo editorial travado para leigos**: publicar exigia aprovação "jurídica" registrada em campos internos.
5. **32 alertas de dependência** (5 críticos: `next` e `dompurify`).

Decisão: **manter a stack** (ADR 0001 em `docs/decisions/`) e refatorar.

## Classificação

| Parte | Decisão | Por quê |
|---|---|---|
| Next.js 16 + Payload 3 + Postgres | Manter | Adequada a um CMS editorial com SSR/ISR. Trocar só custaria tempo |
| Coleções (notícias, reuniões, resoluções, editais, entidades, rede, FAQ) | Manter e refatorar | Modelo correto. Faltavam páginas livres e textos editáveis |
| Papéis e trilha editorial | Refatorar | Simplificado para Administrador e Editor geral. A trilha de fonte continua opcional |
| Armazenamento R2 e banco Neon | Descartar | Migrados para a VPS: Postgres próprio e mídia em disco com backup |
| Deploy Vercel/Coolify | Descartar | GitHub Actions → GHCR → VPS por chave SSH restrita, com rollback |
| CSS e componentes visuais | Reescrever | Design system novo, "Sinal amarelo" (`docs/design/`) |
| Páginas institucionais em TSX | Reescrever | Viraram o global `Textos` e a coleção `Paginas` |
| Testes (125 unitários, E2E Playwright + axe) | Manter e ampliar | Boa base. Seletores atualizados para o HTML novo |
| Pacote editorial (14 notícias com fonte) | Manter | Conteúdo real e verificado |

## Problemas por severidade

### Segurança (OWASP Top 10)
- **Alta, corrigido:** dependências com CVEs críticos (A06). Agora em Next 16.4.3 e Payload 3.92, com `pnpm audit --prod` limpo.
- **Alta, corrigido:** VPS com SSH por senha nas portas 22 e 22322 (A07). Agora só chave, só na 22322, com fail2ban.
- **Média, corrigido:** faltava Content-Security-Policy (A05). Agora há CSP ativa no site e em modo relatório no `/admin`.
- **Média, corrigido:** bucket R2 com leitura anônima, ou seja, arquivos privados acessíveis por URL direta (A01). A mídia saiu do R2 e é servida pelo Payload, com controle de acesso.
- **Média, aberto:** senha `admin321`, pedida pelo dono, é fraca. O login trava 15 min após 5 erros. Troca recomendada.
- **Baixa:** GraphQL desativado, segredos validados no boot e `X-Powered-By` removido. Já estava assim.

### Performance (Lighthouse mobile, medido)
| Página | Antes (Vercel, design antigo) | Depois |
|---|---|---|
| Home | Performance 67, LCP 4,4 s, TBT 360 ms, CLS 0 | Ver `docs/qa/lighthouse/` |

Causas do "antes": imagem de capa grande, VLibras e tiles do mapa carregados sem pedido, e fontes decorativas.

### Acessibilidade
- Antes: axe sem violações nas páginas principais, mas com faixa de ruído (`GrainFilter`), animações de revelação e VLibras carregado sem pedido.
- Depois: axe com WCAG 2.2 AA e boas práticas (E2E), foco anil com halo amarelo, `prefers-reduced-motion` e alvos de toque ≥ 44 px.

### Valores fixos no código
- Textos de capa, rotas, "quem decide", ajuda, Fundo, privacidade e termos estavam em TSX. Hoje vêm do global `Textos` e da coleção `Paginas`.
- Contatos da rede de proteção já vinham do CMS e continuam vindo.
- Os padrões em `src/content/defaults.ts` só preenchem o CMS na primeira vez (seed/migration). O site lê do banco.

### Dívida técnica
- Lógica específica de Vercel, Neon pooled/direct e R2 espalhada no `payload.config.ts`, hoje removida.
- Scripts de CI específicos de Coolify, substituídos pelo workflow da VPS.

### UX
- Menu com 9 itens e rótulos internos ("Transparência", "Participe") sem caminho claro para quem precisa de ajuda.
- Hoje: faixa de proteção fixa, três rotas na home (proteger, destinar IR, acompanhar) e barra de ligação de um toque no celular.

## VPS antes do reset (inventário de 25/10)

- **Sistema e recursos:** Ubuntu 24.04.5, 2 vCPU, 1,9 GiB de RAM + 3 GiB de swap, disco de 28 GB com 50% usado.
- **Serviços:**
  - Traefik v3.6 com Postgres 17 compartilhado;
  - sites `quarau` (Next) e `teste` (nginx);
  - CLI `site` e timers de backup restic, saúde e auto-deploy;
  - restos do Coolify (`docker-fw`, `vps-diario`) e um timer órfão `anglopinda-cms-backup`.
- **Portas e firewall:**
  - SSH nas portas 22 e 22322, com senha habilitada;
  - 80 e 443 no Traefik;
  - UFW ativo, mas a porta 22 escutando.
- **Deploy:** imagem `:latest` no GHCR com auto-deploy por polling.
- **Ação tomada:**
  - backup completo, com SHA conferido, em `C:\Users\Ze\Backups\vps-zewithane\`;
  - dados do quarau em `Desktop\quarau-backup-2026-10-26`;
  - reconstrução pelo repo `vhonorato02/vps-platform`, ver o README de lá.
