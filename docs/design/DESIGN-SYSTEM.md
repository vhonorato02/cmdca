# Design system "Sinal amarelo"

Referência rápida do que existe no código. A direção (conceito, paleta medida e assinaturas) está em `DIRECAO.md`.

## CSS (`src/app/(frontend)/styles/`)
`globals.css` só declara a ordem das camadas: `@layer tokens, base, layout, components, pages`.

| Arquivo | Conteúdo |
|---|---|
| `tokens.css` | Cores da marca e **papéis semânticos** (`--c-bg`, `--c-text`, `--c-heading`, `--c-primary`, `--c-signal`, `--c-dark`, `--c-danger`, foco), tipo (`--fs-xs` a `--fs-4xl`), espaço (`--s-1` a `--s-10`), raio, sombra e movimento. O alto contraste (`html.contrast`) troca só os papéis. |
| `base.css` | Reset, tipografia de títulos (Archivo condensada), links, foco anil com halo amarelo, `.skip-link`, `.sr-only` e movimento reduzido. |
| `layout.css` | `.wrap`, `.section`, `.grid-2`, faixa de proteção, cabeçalho e menu, barra fixa do celular, `.page-header`, `.breadcrumb` e rodapé. |
| `components.css` | Botões, cartões, `.callout`, estados, selos, `.act-list`, filtros, paginação, notícias, `.prose`, FAQ, passos, limites do Fundo, simulador, listas com régua e quadro de contato. |
| `pages.css` | Capa da home, rotas, Ajuda (cartões e "Sair rápido"), rede, mapa do site, 404/500 e notícia. |

Regras:
- Use os papéis semânticos (`--c-*`), não as cores cruas, para o alto contraste funcionar.
- O amarelo nunca é texto sobre branco (1,24:1). Ele é campo de cor com texto anil, halo de foco ou marca.
- Sem `style={{}}` inline (exceções: `--dock-cols` na barra móvel e a largura das linhas do `Skeleton`). Espaços pontuais usam `.mt-4`, `.mt-6` e `.mt-7`.
- Numerais (datas, números de atos, limites) usam `--font-display`. Numeração 1, 2, 3 só em sequência real (`.steps`).

## Fontes
- Títulos: Archivo, instância local condensada (pesos 760–860, 25 KB) em `src/app/(frontend)/fonts/`, com `display: optional`. Veja o README da pasta para regerar.
- Texto: Atkinson Hyperlegible Next (`next/font/google`).

## Componentes (`src/components/`)
| Componente | Uso |
|---|---|
| `ui/PageHeader` (+ `Breadcrumb`) | Cabeçalho das páginas internas: trilha, h1 único, apresentação e órbita. |
| `ui/Section` | Seção com h2, apresentação e ação; `alt` alterna o fundo. |
| `ui/Button` (`ButtonLink`, `Button`, `SmartLink`) | Variantes `primary`, `secondary`, `signal` e `danger`. Links externos abrem em nova aba com aviso. |
| `ui/AppLink` | `next/link` sem pré-busca automática. Use sempre no site público. |
| `ui/states` | `EmptyState`, `ErrorState`, `Skeleton` e `Callout`. |
| `ui/ActList` (`ActItem`, `StatusPill`, `Tag`) | Lista de reuniões, resoluções, editais e entidades com numeral. |
| `ui/Pagination`, `ActFilters` | Paginação e filtros por formulário GET (estado na URL, sem JS). |
| `ui/brand` | `Orbit`, `Emblem` (cabeçalho) e `HeroMark` (capa). |
| `ui/icons` | Ícones de traço e `Pictogram` por tema de notícia. |
| `NewsCard`, `FaqList`, `SourceList` | Notícia (com capa ou tipográfica), FAQ com `<details>` e fontes citadas. |
| `layout/*` | `ProtectionBar`, `ProtectionDock`, `SiteHeader`, `MainNav` (cliente), `A11yTools` (cliente) e `SiteFooter`. |
| `SimuladorIR`, `MapaRede`, `QuickExit` | Ilhas de cliente: estimativa do IR, mapa sob demanda e "Sair rápido". |

Server Components por padrão. Só são cliente: `MainNav`, `A11yTools`, `SimuladorIR`, `MapaRede`/`RedeMapInner`, `QuickExit`, `error.tsx` e `global-error.tsx`.

## Conteúdo
- Texto institucional vem do CMS. `src/lib/content.ts` lê `textos`, `pagina-inicial` e `configuracoes` e completa com `src/content/defaults.ts`, que também alimenta os `defaultValue` e a migration.
- Rótulos de interface (botões, títulos de seção genéricos, estados de erro) ficam no código.
- Dado não confirmado fica `XXXX` no CMS. `publicText` o esconde do site e `src/lib/pendencias.ts` o lista no painel.

## Acessibilidade embutida
Skip link, h1 único por página, foco visível em qualquer fundo, alvos de pelo menos 24 px (44 px nos controles principais) e menu móvel com foco preso e Esc. Também há `prefers-reduced-motion`, `forced-colors`, alto contraste e tamanho de letra (90–130%) persistentes, VLibras sob demanda e nomes acessíveis que começam pelo texto visível (WCAG 2.5.3).
