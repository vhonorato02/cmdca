# Direção visual: "Caderno público" (07/11/2026)

Substitui a direção "Sinal amarelo" (26/10/2026; `CRITICA.md` e `REFERENCIAS.md` são daquela rodada). O motivo da troca foi a avaliação do Zé ("design tá feio que dói"): bloco amarelo saturado na capa, títulos condensados pesados, cartões com estilos diferentes, ícones sem critério, animações de entrada e nenhuma foto real.

## Conceito
O CMDCA decide em público: reuniões abertas, resoluções numeradas, Fundo com prestação de contas. O site lê como o **caderno de um órgão público bem editado**: serifa nos títulos, texto claro, réguas finas separando assuntos, a cidade de verdade na capa. O amarelo do logo continua, mas só como **sinal**: telefones de proteção, foco do teclado, o botão "Buscar ajuda" e a marca. Ele não preenche áreas.

Frase-guia: "Diário oficial que dá vontade de ler".

## Paleta (tokens em `src/app/(frontend)/styles/tokens.css`)
| Token | Hex | Uso |
|---|---|---|
| `--anil` | #231A5C | títulos, botões, links |
| `--anil-900` | #1A1140 | faixa de proteção, painel "Proteger agora", rodapé |
| `--anil-600` | #4A3D8F | hover, detalhes |
| `--anil-100` / `--anil-50` | #DFE2EE / #EEF0F6 | superfícies de apoio (frias, sem o lilás anterior) |
| `--nevoa` | #F3F5F9 | seção alternada |
| `--amarelo` | #F6EC27 | sinal: números de proteção sobre anil, foco, "Buscar ajuda", marca |
| `--grafite` / `--grafite-2` | #1F1D2B / #4F5163 | texto e texto secundário |
| `--linha` / `--linha-forte` | #DCDFE8 / #767A90 | réguas e bordas de campos (não-texto ≥ 3:1) |
| `--urgencia` | #B42318 | 190 e alertas |

Regras: o amarelo nunca é texto sobre branco. Fundo branco, sem creme. O alto contraste (`html.contrast`) troca só os papéis `--c-*`.

## Tipografia
- **Newsreader** (Production Type, OFL, eixo óptico `opsz`) nos títulos e numerais, peso 560 (títulos) e 620 (numerais). O eixo óptico desenha letra de texto nos tamanhos pequenos e de título nos grandes.
- **Atkinson Hyperlegible Next** (Braille Institute, OFL) no texto e na interface. Mantida por ser desenhada para baixa visão. O zero cortado é dela, de propósito (distingue 0 de O em telefones), e não tem alternativa sem corte.
- Ambas por `next/font/google`, servidas pelo próprio site.

## Capa (home)
1. Título editorial grande ("Direitos de crianças e adolescentes, decididos em público.") com apresentação e dois botões; ao lado, **foto real da cidade** (telhados com a Serra da Mantiqueira, Facs90, CC BY-SA 4.0, crédito na legenda e em `/creditos`). Se o CMS tiver uma capa conferida, ela substitui a foto.
2. **Proteger agora**: painel anil com os canais do CMS como linhas "situação → número", em vez de cartões.
3. **Caminhos**: Destinar o IR e Acompanhar o conselho, como dois blocos tipográficos separados por régua.
4. Destaques, Quem decide (presidência), Quem participa (citações) e Notícias (uma em destaque e três em lista), todos com régua no topo, sem cartão com sombra.

## Movimento
Só o que tem função: menu, copiar, voltar ao topo, detalhes. Saíram as entradas em cascata, os cartões que "sobem" no hover e o contador animado. Com `prefers-reduced-motion`, tudo vai a 0.

## O que saiu
- A **órbita** (elipse do logo usada como enfeite na capa, nos cabeçalhos internos e no 404) e o **pictograma** da capa.
- O cartão de notícia com borda, carimbo de data gigante e pictograma por tema.
- O bloco amarelo da capa, a faixa amarela grossa nos cabeçalhos internos e o item ativo do menu em bloco amarelo (agora sublinhado).
- A Archivo condensada local.

## Mantido
Faixa de proteção no topo (no desktop cabe numa linha a partir de 1280 px), barra fixa de três botões no celular, "Sair rápido" na página de Ajuda, foco anil com halo amarelo, tamanho de letra, alto contraste e VLibras.
