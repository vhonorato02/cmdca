# Crítica do site anterior (26/10/2026)

Base: navegação real em 390 px e 1280 px (capturas em `Z:\Dev\sandbox\cmdca-shots\antes\`) e leitura do código.

## Hierarquia
- A home abre com um título genérico ("CMDCA de Pindamonhangaba") e uma foto de banco. O canal de proteção fica numa caixa pequena abaixo da dobra no celular, e o Disque 100 não aparece como número tocável na home.
- No celular, a barra de acessibilidade ocupa 52 px com quatro botões enormes e empurra o conteúdo. O botão "Buscar ajuda" quebra em duas linhas no cabeçalho.
- Há dois carrosséis: destaques e depoimentos. Ambos escondem conteúdo atrás de setas, e o primeiro ocupa a tela inteira sem levar a uma ação principal.
- Todas as seções têm o mesmo peso: faixa, rótulo dourado, título serifado e texto. Nada indica o que vem primeiro, que deveria ser: proteção, depois Fundo/IR, depois atos públicos.

## Tipografia
- Newsreader serifada com Public Sans e rótulos em caixa alta espaçada com um traço dourado em todas as seções: esse é o padrão de template genérico.
- Não há escala tipográfica. Os tamanhos ficam em estilos inline (1.8rem, 1.12rem, 1.2rem, clamp diversos), com 83 `style={{…}}` em páginas e componentes.

## Cor
- O amarelo do logo (#F6EC27) foi trocado por um dourado apagado (#C9A227) sobre fundo creme (#F4F2EB). O resultado perde a identidade e lembra a paleta "IA padrão".
- O índigo do logo (#271A58) aparece só em blocos. Um botão vermelho contornado ("Buscar ajuda") compete com tudo.
- O emblema é um recorte JPG de baixa resolução do logo.

## Componentes
- `globals.css` tem 2.949 linhas e 42 `!important`. Os mesmos padrões aparecem com nomes diferentes (`.about`, `.lead-box`, `.panel`, `.links`, `.hc`), e `.meet` serve ao mesmo tempo para reuniões, resoluções e editais.
- Notícias sem foto recebem ilustrações SVG com gradiente, quase idênticas entre si: três cartões iguais lado a lado.
- `Reveal` anima a entrada de cada seção, o `GrainFilter` aplica um filtro SVG global, e `Charts` e `StatsBand` são código morto.
- `ReunioesLista` envia o renderizador de rich text ao cliente só para filtrar, e o filtro não fica na URL.
- Os estados vazios são uma frase cinza ("Não há resoluções publicadas nesta página no momento."), sem orientar o próximo passo. Não há paginação.

## Microcopy
- O texto é defensivo e repetitivo ("quando publicados", "consulte a publicação oficial"), com parágrafos jurídicos longos onde caberia um passo a passo.
- Títulos vagos ("Encontre o que você precisa") e um "Ops" na página de erro.

## Código e conteúdo
- Telefones (190, 100, Conselho Tutelar), URLs de fontes, textos institucionais e o rodapé estão fixos no TSX. O CMS não consegue editá-los.
- Não existe `/termos`. Privacidade e acessibilidade são TSX estático com datas fixas.
- O cabeçalho é todo client-side por causa do menu. O rodapé busca as configurações separadamente do layout.
