# PWA e notificações: capacidade e decisão

**Estado observado:** `/manifest.webmanifest` retorna 200, possui `id`, `start_url`, `scope`, idioma `pt-BR`, cores e ícones 192/512/maskable. O código em `src/app/manifest.ts` define `display:'browser'`. A árvore da aplicação não contém service worker nem módulo de Web Push. **Não anunciar modo app, offline ou push como entregues.**

**Direção recomendada:** instalar como `standalone` se teste Android/Samsung demonstrar navegação, retorno, teclado virtual, safe-area, deep links e ausência de travamento; não simular telas nativas. Um portal cívico não precisa copiar padrões de aplicativo de chat.

**Offline:** por padrão, manter notícias, contatos de ajuda e atos network-first; não manter sem atualização dados de emergência, telefones, reuniões canceladas, PDFs reservados e conteúdo do CMS. Em SW futuro, excluir `/admin`, previews, APIs privadas, cookies e anexos restritos; política de expiração, fallback datado e migração de caches são gates obrigatórios.

**Notificações:** ainda não implementadas. Considerar apenas novas resoluções, editais ou reuniões publicadas após revisão, opt-in contextual, categorias e cancelamento imediato. Sem autorização e serviço idempotente de subscriptions, **não ativar** nem solicitar permissão de push.

**Provas pendentes:** Android Chrome e Samsung Internet instalados, desktop, rede lenta, offline/online, atualização de versão, deep links, permissões negadas, recebimento real isolado e nenhuma notificação de ensaio a usuários reais.
