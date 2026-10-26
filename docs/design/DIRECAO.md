# Direção visual: "Sinal amarelo"

## Conceito
Na rua, o amarelo com azul-escuro é a cor da placa de área escolar: avisa que ali há crianças e pede atenção. O logo do CMDCA usa exatamente essa dupla, com o quadrado amarelo, as figuras em anil e a faixa com "PINDAMONHANGABA". O site trata o amarelo como sinal de cuidado. Ele marca o que protege (canais de ajuda, foco do teclado, a capa da home) e nunca serve de enfeite. O anil sustenta a confiança institucional: títulos, botões, números de atos e rodapé.

A frase-guia é "Placa de serviço público feita com carinho": direta como sinalização e calorosa na escrita.

## Paleta (tirada do logo em `public/brand/logo-cmdca.jpg`, cores médias medidas)
| Token | Hex | Uso | Contraste medido |
|---|---|---|---|
| `--anil` | #271A58 | títulos, botões, links, faixas | 15,27:1 sobre branco |
| `--anil-900` | #1A1140 | rodapé, barra de proteção | 17,53:1 com branco |
| `--anil-600` | #4A3D8F | hover de links, detalhes | 8,92:1 sobre branco |
| `--anil-50` | #ECEAF5 | superfícies de apoio | anil sobre ele: 12,84:1 |
| `--amarelo` | #F6EC27 | campos de cor, foco, sinal | anil sobre amarelo: 12,32:1 |
| `--amarelo-50` | #FDF8C2 | destaque suave | anil sobre ele: 14,10:1 |
| `--grafite` | #25242B | texto corrido | 15,37:1 sobre branco |
| `--grafite-2` | #55536A | texto secundário | 7,42:1 sobre branco, 6,23:1 sobre anil-50 |
| `--linha-forte` | #7B7894 | bordas de campos (não-texto ≥ 3:1) | 4,24:1 |
| `--urgencia` | #B42318 | 190 e alertas | branco sobre ela: 6,57:1 |
| `--vigente` | #1D6B3A | situação "vigente" | 5,68:1 sobre o fundo claro do selo |
| `--atencao` | #8A5300 | situação "encerrado/alterada" | 5,61:1 sobre o fundo claro do selo |

Regras: o amarelo **nunca** é texto sobre branco (1,24:1). Ele sempre aparece como campo de cor com texto anil ou como halo de foco. O fundo é branco, não creme.

## Tipografia (`next/font/google`, auto-hospedadas)
- **Archivo** (variável, eixos `wdth` 62–125 e `wght`). É usada em títulos e numerais, a 72–82% de largura e peso 760–850, e ecoa as letras condensadas e pesadas do logo.
- **Atkinson Hyperlegible Next** (variável). É usada em texto, interface e formulários. Foi desenhada pelo Braille Institute para leitores com baixa visão, uma escolha coerente com a LBI e o eMAG.
- Escala clássica (Elements of Typographic Style), em rem com base de 16 px: 14 · 16 · **18 (corpo)** · 21 · 24 · 30 · 36 · 48 · 60 · 72. Os tamanhos de exibição são fluidos com `clamp()`.
- Altura de linha de 1,6 no corpo e 1,05–1,15 nos títulos. Medida máxima de 68 caracteres. Títulos usam `text-wrap: balance`. Sem caixa alta espaçada em rótulos.

## Grade, espaço, forma
- Conteúdo com até 75 rem (1200 px), 12 colunas, calhas de 24 px (mobile) e 32 px (desktop). Tudo alinhado à esquerda.
- Espaçamento em base 4: 4, 8, 12, 16, 24, 32, 48, 64, 96 e 128.
- Raio com hierarquia: 0 nas faixas e campos de cor (sinalização), 4 px em selos e campos, 8 px em botões e cartões, e pílula só nos selos de situação.
- Sombra quase ausente. O desenho é plano, com bordas. Só o menu aberto e a barra fixa móvel ganham uma elevação discreta.
- Movimento só responde a ações: menu (180 ms) e detalhes/sanfona (nativos). Nada anima sozinho, e com `prefers-reduced-motion` todas as durações vão a 0.

## Tom de voz
Segunda pessoa, verbos no imperativo, frases curtas. O botão diz o que acontece ("Ligar para o Disque 100", "Abrir PDF da ata"). Erros explicam a causa e o próximo passo, sem pedir desculpas. Estados vazios convidam a uma ação. Nada de "Ops".

## Assinaturas
1. **Faixa de proteção:** barra anil no topo de todas as páginas com os canais do CMS (190, Disque 100, Conselho Tutelar) em números amarelos tocáveis. No celular, vira uma barra fixa inferior com três botões de um toque.
2. **A órbita:** a elipse do logo, desenhada a traço, aparece em um só lugar por página (capa da home, cabeçalho interno e 404). É a única forma decorativa do site.
3. **Numerais de ato:** datas de reunião e números de resolução e edital em Archivo condensada e grande, como folha de calendário e carimbo. Os limites do Fundo (3%, 6%) seguem a mesma linguagem.

Extra: o foco do teclado é anil com halo amarelo (inspirado no GOV.UK), visível sobre qualquer fundo.

## Revisão contra o padrão genérico
- Eu ia repetir "foto + título + dois botões" na capa. Troquei por um campo amarelo de marca com a órbita e um título forte. A foto só aparece quando o CMS tem uma capa conferida.
- Eu ia usar cartões iguais para atalhos. Troquei por três rotas com pesos distintos: proteção (amarela), Fundo (anil) e atos públicos (contorno).
- Notícias sem foto não recebem ilustração genérica. O cartão é tipográfico, com data em numerais.
