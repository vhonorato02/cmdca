# Changelog

As mudanças relevantes do projeto seguem o formato do [Keep a Changelog](https://keepachangelog.com/pt-BR/) e o versionamento semântico.

## [Não publicado]

## [2.0.0] — 2026-10-27

No ar em https://www.cmdcapinda.org, hospedado na VPS própria. Vercel, Neon e R2 deixam de ser usados (o desligamento depende do dono).

### Alterado

- redesenho "Sinal amarelo" (docs/design): paleta medida no logo (anil e amarelo), Archivo condensada nos títulos e numerais, Atkinson Hyperlegible Next no texto, foco anil com halo amarelo;
- CSS reescrito do zero em cinco camadas (`tokens`, `base`, `layout`, `components`, `pages`), sem regras mortas, com papéis semânticos de cor (o alto contraste troca só os tokens) e `!important` apenas no movimento reduzido;
- faixa de proteção no topo e barra fixa no celular com 190, Disque 100 e Conselho Tutelar a um toque, vindos do CMS;
- todas as páginas públicas refeitas com componentes tipados (cabeçalho de página, seções, lista de atos, estados vazio e de erro, paginação), filtros por URL sem JavaScript e 404/500 com caminhos de saída;
- botão "Sair rápido" na página de ajuda; menu móvel com foco preso, Esc e o botão de fechar sempre visível;
- links internos sem pré-busca automática e fonte de títulos local de 25 KB, para pesar menos em celulares;
- painel com a marca do portal e lista de pendências (dados em `XXXX` ou sem conferência).

### Adicionado

- global **Textos das páginas** e coleção **Páginas institucionais** (privacidade, termos de uso, acessibilidade e créditos), com migration que publica o conteúdo inicial;
- campos de endereço, horário e encarregado de dados (LGPD) em Configurações institucionais e links "Sobre o site" na navegação do rodapé;
- workflows pós-deploy contra a produção: `E2E (producao)` (leitura + axe, desktop e celular) e `Lighthouse (producao)` (mobile, mínimo 95);
- monitor externo `Disponibilidade` a cada 15 minutos, com alerta no ntfy;
- domínio definitivo `www.cmdcapinda.org` com HTTPS; `cmdcapinda.org`, `pt.cmdcapinda.org` e o endereço temporário respondem 301 para ele (ADR 0007);
- limite de 20 tentativas de login e de recuperação de senha por IP a cada 10 minutos (ADR 0010);
- CSP aplicada também no painel (antes só em modo de relatório);
- primeiros atos reais: Resolução 153/2025 e Edital CMDCA 02/2024 (2ª retificação), com o PDF do Diário Oficial.

### Corrigido

- número do Conselho Tutelar na barra do celular estourava a tela em 320 px enquanto a fonte carregava; agora quebra entre o DDD e o número;
- avatar do VLibras bloqueado pela CSP (`frame-src`); `unsafe-eval` removido;
- logo depois de cada deploy, as páginas mostravam o HTML do build (sem notícias nem diretoria) até o fim da janela do ISR; agora o primeiro acesso já busca o conteúdo do banco;
- o `sitemap.xml` nunca incluía as notícias (era gerado só no build) e os PDFs públicos estavam bloqueados para buscadores;
- o botão Menu saía da tela em 320 px com a fonte de fallback, e os botões da capa encostavam no primeiro card;
- no painel: mídia sem arquivo podia ser publicada; abrir "Criar" na Mídia deixava registros vazios; havia dois botões de menu no desktop;
- os links "Publicação oficial" agora avisam quando abrem um PDF.

### Removido

- carrosséis, animação de entrada por seção, filtro de grão, ilustrações genéricas e componentes sem uso (`Charts`, `StatsBand` e os cabeçalho e rodapé antigos).

## [1.0.0] — 2026-07-19

### Adicionado

- papéis separados de Administrador, Editor de rascunhos e Revisão jurídica/publicação;
- trilha editorial com fonte, URL, data de verificação, estado de revisão, responsável e observações internas;
- validações de publicação para impedir conteúdo incompleto, marcador de placeholder e arquivo incompatível;
- rascunhos, autosave, histórico de versões e recuperação editorial nas áreas críticas;
- proteção do último administrador e contra autoexclusão;
- política de consentimento e crédito para mídia envolvendo crianças e adolescentes;
- metadados por rota, Open Graph, dados estruturados serializados com segurança, sitemap e robots;
- mapa do site, documentação de arquitetura, CMS, operações e QA;
- configuração de produção Vercel conectada ao GitHub.

### Alterado

- stack estabilizada em Next.js 16, React 19, Payload 3, Node.js 24 e pnpm 11;
- interface pública refeita como portal de serviço, com hierarquia, responsividade, navegação por teclado, redução de movimento e alternativas textuais para visualizações;
- conteúdo público reescrito para remover promessas, números ilustrativos e fatos sem confirmação;
- regra de destinação do Imposto de Renda separada entre destinação durante o ano e na declaração, com orientação para consulta à Receita Federal;
- publicação agora é reservada ao Jurídico e ao Administrador; Editor trabalha somente com rascunhos;
- migrations usam conexão direta do Neon e o runtime usa conexão pooled;
- uploads usam Cloudflare R2, sem depender do filesystem efêmero da Vercel;
- documentação substituída para refletir a operação real em Vercel + Neon + R2.

### Segurança

- GraphQL desativado quando não necessário;
- segredos obrigatórios falham cedo em produção;
- seed bloqueado em produção e sem credenciais conhecidas no repositório;
- limite de tentativas, bloqueio temporário e duração reduzida de sessão no painel;
- dados editoriais internos e comprovações de consentimento deixam de ser públicos pela API;
- dependências atualizadas e resoluções de segurança aplicadas no lockfile.

### Removido

- configuração Render;
- Dockerfile e Compose incompatíveis com o banco PostgreSQL atual;
- prévia HTML, prompt de geração e preferências locais do Claude, que não faziam parte da aplicação em produção.

## [0.2.1] — 2026-06-01

- correção da visibilidade dos contatos de emergência;
- um título principal por página e melhorias de semântica;
- estado real do alto contraste e respeito a movimento reduzido;
- 404 e tela de erro com identidade institucional.

## [0.2.0] — 2026-06-01

- painel Payload em português e com identidade do CMDCA;
- integração opcional com SMTP/Nodemailer;
- documentação inicial de fontes e dados confirmados;
- ajustes de conexão segura com Neon.

## [0.1.0] — 2026-05-31

- primeira implementação em Next.js e Payload CMS;
- banco Neon e mídia Cloudflare R2;
- rotas institucionais e painel administrativo.
