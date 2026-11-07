# Changelog

As mudanças relevantes do projeto seguem o formato do [Keep a Changelog](https://keepachangelog.com/pt-BR/) e o versionamento semântico.

## [Não publicado]

## [2.3.0] — 2026-11-07

Terceira auditoria e redesign. O site saiu do domínio oficial e ficou só no temporário, sem indexação, até o lançamento.

### Alterado

- **redesign "Caderno público"** ([direção](docs/design/DIRECAO.md)): títulos em Newsreader (serifa com eixo óptico) no lugar da Archivo condensada; paleta fria sem o lilás; amarelo restrito a sinal (telefones de proteção, foco, "Buscar ajuda"); capa com foto real da cidade (Facs90, CC BY-SA 4.0) e título editorial; painel "Proteger agora" em linhas situação → número; caminhos do IR e do conselho em texto com régua; notícias editoriais (rubrica e data em linha, título em serifa); cabeçalhos internos sem faixa amarela; item ativo do menu sublinhado;
- faixa de proteção do topo numa linha só a partir de 1280 px; barra fixa do celular sem quebrar o telefone do Conselho Tutelar a partir de 375 px; rodapé em três colunas no tablet; o "Sair rápido" da Ajuda não cobre mais o título da primeira seção no celular;
- página `/creditos` cita a foto da capa e a nova fonte (migration de conteúdo `20261107_120000_creditos_capa`, que só reescreve a página se ela ainda tiver o texto original);
- E2E de produção respeita `SITE_INDEXABLE`: com o site em noindex de propósito, não exige PDFs indexáveis.

### Removido

- animações decorativas (entrada em cascata da capa, cartões que sobem no hover, contador do "6%"), a órbita decorativa, o pictograma da capa e os pictogramas por tema das notícias, e a fonte Archivo local.

### Operação

- site só em `https://cmdca.zewithane.vps.brz.dev.br`, com `noindex` global e `robots.txt` fechado; `www.cmdcapinda.org` e `cmdcapinda.org` mostram "Em preparação" (503, noindex);
- contas de teste do painel apagadas; as três contas reais com senhas novas (arquivo fora do repositório).

## [2.2.0] — 2026-11-06

Segunda auditoria completa, somada à de 04/11 ([relatório](docs/audit/RELATORIO-FINAL.md)).

### Segurança

- documentos publicados e depois enviados à lixeira continuavam legíveis por visitantes em `?trash=true` e, no caso de PDFs e imagens, pelo endereço direto `/api/media/file/<arquivo>`. As coleções agora usam `publishedLiveOrLoggedIn` (publicado e fora da lixeira); reuniões reservadas também. Regressão no teste de integração do CMS e no E2E;
- três contas de teste/seed do painel (domínios `.local`/`.teste`) bloqueadas em produção.

### Removido

- escopo PWA: manifest de instalação, ícones de app e `appleWebApp` (o portal é um site responsivo comum);
- fallbacks de runtime Vercel/R2/S3, scripts legados de Neon/R2/Coolify/Vercel, `vercel.json` e a dependência `@payloadcms/storage-s3` (com o AWS SDK);
- secrets antigos da Vercel e de deploy no GitHub.

### Alterado

- CI com PostgreSQL 17, igual à produção; testes de responsividade 320–1440 px;
- pacote renomeado para `cmdca-pindamonhangaba`, `private` e `UNLICENSED` (a licença MIT declarada não tinha arquivo nem verificação de titularidade dos assets);
- documentação atual reescrita (`HANDOFF.md`, `docs/ARQUITETURA.md`, `docs/OPERACOES.md`, `DEPLOY.md`); versões antigas em `docs/historico/`.

### Operação

- VPS reinstalada em 06/11 (plataforma 1.0); o CMDCA voltou com banco e mídia idênticos aos de antes e domínio, HTTPS e redirecionamentos restaurados;
- backup off-site provado com restauração completa fora da VPS (ver `docs/OPERACOES.md`).

## [2.1.0] — 2026-10-28

### Adicionado

- troca de senha obrigatória no primeiro acesso e depois de uma redefinição pelo administrador: o painel mostra uma tela de bloqueio e o servidor recusa qualquer gravação até a troca (mínimo 10 caracteres). Contas antigas não são afetadas (migration `20261027_235800_trocar_senha`, só adiciona coluna);
- `manifest.webmanifest`, ícones PNG (192, 512, maskable e Apple) e `/.well-known/security.txt` (RFC 9116);
- ícones nos telefones, ferramentas de acessibilidade, rodapé e atribuições do conselho; cartões que respondem ao mouse e ao toque; entrada animada da capa; contador do "6%"; botões de copiar CNPJ e dados bancários; botão "voltar ao topo". Tudo desliga com movimento reduzido e no alto contraste.

### Corrigido

- e-mails longos no texto das notícias estouravam a tela de 320 px.

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
