# Changelog

As mudanças relevantes do projeto seguem o formato do [Keep a Changelog](https://keepachangelog.com/pt-BR/) e o versionamento semântico.

## [Não publicado]

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
- campos de endereço, horário e encarregado de dados (LGPD) em Configurações institucionais e links "Sobre o site" na navegação do rodapé.

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
