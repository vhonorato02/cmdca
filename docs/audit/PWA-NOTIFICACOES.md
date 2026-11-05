> **Decisão vigente:** NÃO haverá PWA. O CMDCA é um site institucional responsivo; o histórico de PWA abaixo foi substituído pela decisão do responsável em 04/11/2026. Não criar manifest, service worker, instalação standalone ou push.

# PWA e notificações: capacidade e decisão

**Estado antes da correção:** `/manifest.webmanifest` respondia 200, com ícones 192/512/maskable, porém `display:'browser'`. 
**Correção de código desta rodada:** `display:'standalone'`, atalho prioritário para `/ajuda` e testes unitários em `src/app/manifest.test.ts`. A publicação e o comportamento real no Android devem ser conferidos no CI e em dispositivo. **Nenhum service worker ou Web Push foi implementado**; a aplicação não promete offline nem notificações. Documentação técnica consultada: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest e https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/ . A documentação instalada `node_modules/next/dist/docs` não pôde ser lida neste ambiente sem checkout/dependências; isso permanece como limitação explícita.

**Direção recomendada:** instalar como `standalone` se teste Android/Samsung demonstrar navegação, retorno, teclado virtual, safe-area, deep links e ausência de travamento; não simular telas nativas. Um portal cívico não precisa copiar padrões de aplicativo de chat.

**Offline:** por padrão, manter notícias, contatos de ajuda e atos network-first; não manter sem atualização dados de emergência, telefones, reuniões canceladas, PDFs reservados e conteúdo do CMS. Em SW futuro, excluir `/admin`, previews, APIs privadas, cookies e anexos restritos; política de expiração, fallback datado e migração de caches são gates obrigatórios.

**Notificações:** ainda não implementadas. Considerar apenas novas resoluções, editais ou reuniões publicadas após revisão, opt-in contextual, categorias e cancelamento imediato. Sem autorização e serviço idempotente de subscriptions, **não ativar** nem solicitar permissão de push.

**Provas pendentes:** Android Chrome e Samsung Internet instalados, desktop, rede lenta, offline/online, atualização de versão, deep links, permissões negadas, recebimento real isolado e nenhuma notificação de ensaio a usuários reais.

## Validação no domínio canônico
Após o deploy do commit `22d2146` com status **success** (`41956344743`), consulta pública de `/manifest.webmanifest` retornou HTTP 200, `display:'standalone'` e `Pedir ajuda` como atalho prioritário. Quatro PNGs declarados (192, 512, maskable e Apple) responderam HTTP 200 com Content-Type `image/png`. **Evidência de instalação real e atualização One UI permanece pendente.**

## Requisito substituído por decisão do responsável
**Decisão mais recente:** o portal não é PWA e não deve tentar se comportar como aplicativo. Manifest de instalação, modo standalone e respectivo teste foram removidos do código; os registros acima são apenas históricos. Sucesso atual é layout adaptável, navegação no navegador e acessibilidade. Nenhuma notificação push planejada. A medida foi enviada ao CI para validar build/deploy.
