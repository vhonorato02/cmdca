# Direção visual: "Serviço público 2026" (08/11/2026)

Substitui o "Caderno público" de 07/11 ([`DIRECAO-2026-11-07-caderno-publico.md`](DIRECAO-2026-11-07-caderno-publico.md)).
Pedido do Zé: "a copy tá bem ruim; se inspire na linguagem do gov.br, UI/UX, posição das seções, animações, ícones"
e "pode ser mais moderno e cidadão como o gov.br, mas sem esquecer que é 2026".

## Conceito
Clareza de serviço público (o que eu posso fazer aqui, em verbo no infinitivo, linguagem simples) com forma atual:
capa e cabeçalhos em moldura arredondada afastada das bordas, raios que crescem com a hierarquia, sombras tingidas de
azul com anel fino, grade bento nos serviços. Não é cópia do portal federal: a marca é do CMDCA (logo e amarelo).

## Paleta (`src/app/(frontend)/styles/tokens.css`)
| Token | Hex | Uso |
|---|---|---|
| `--azul` | #1351B4 | ação principal, links, ícones (azul do padrão gov.br) |
| `--azul-escuro` / `--azul-noite` | #0C326F / #0A1C3F | títulos, faixa de proteção, rodapé, véu da capa |
| `--azul-claro` / `--azul-palido` | #DBE8FB / #EDF5FF | fundo dos ícones, cabeçalho das páginas, cartões do painel de ajuda |
| `--cinza-fundo` | #F2F5FA | seção alternada (fria) |
| `--amarelo` | #F6EC27 | sinal do CMDCA: telefones na faixa, "Pedir ajuda", "Buscar ajuda", marca |
| `--urgencia` | #B42318 | 190 e alertas |

## Tipografia
**Bricolage Grotesque** (títulos e numerais; eixos `opsz` e `wdth`, peso 700–800, espaçamento negativo e
`text-wrap: balance`) e **Public Sans** (texto e interface; fonte cívica, neutra, com acentuação completa). Ambas SIL
OFL 1.1, por `next/font/google`, servidas pelo próprio site. A Rawline do gov.br foi testada e trocada na mesma rodada,
para a marca não parecer cópia do portal federal. Algarismos alinhados nos telefones.

## Forma
`--r-sm` 10 px (campos), `--r-md` 18 px (cartões), `--r-lg` 24 px (painel de ajuda, cartões grandes), `--r-xl` 32 px (capa, cabeçalho interno), pílula
nos botões. Ícones Lucide (ISC) de traço 1,75 em círculo azul-claro.

## Home (ordem padrão, editável no painel)
1. Capa inset com a foto da cidade e o véu azul-noite; título e duas ações (Pedir ajuda, Destinar Imposto de Renda).
2. "Precisa de ajuda agora?" em vidro fosco sobre a própria foto (à direita no desktop): três canais discáveis, número
   em amarelo, 190 com ícone vermelho.
3. "O que você pode fazer aqui": bento com Imposto de Renda e Reuniões em destaque (cartões azuis) e quatro serviços.
4. Destaques em trilho com rolagem horizontal (preenche a largura com poucos itens).
5. Notícias, Sobre o CMDCA (com a diretoria), indicadores e depoimentos.

## Movimento
Uma abertura orquestrada na capa (texto sobe, foto se aproxima, painel de ajuda assenta); cartões surgem ao rolar
(animação guiada pela rolagem, sem JavaScript; só deslocamento, sem mexer na opacidade, para o texto nunca perder contraste); resposta ao toque nos botões e nos cartões.
Tudo desligado com `prefers-reduced-motion` e no alto contraste.

## Redação
Linguagem simples do gov.br: títulos de serviço com verbo no infinitivo ("Consultar resoluções", "Registrar uma
entidade"), frases curtas, sem jargão ("colegiado" virou "conselho"). Textos do painel trocados por migração só onde
ainda estavam iguais ao original.
