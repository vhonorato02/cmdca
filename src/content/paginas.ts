import type { Bloco } from './lexical'

/**
 * Conteúdo inicial das páginas institucionais (coleção `paginas`). Publicado
 * pela migration que cria a coleção; depois disso, o texto vive no CMS.
 */

const LGPD = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'
const MUNICIPIO_LGPD =
  'https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018'
const ANPD_CRIANCAS =
  'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes'
const EMAG =
  'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade'
const WCAG = 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/'
const LBI = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm'
const OSM = 'https://www.openstreetmap.org/copyright'
const OFL = 'https://openfontlicense.org'

export type PaginaPadrao = {
  titulo: string
  slug: string
  resumo: string
  atualizadoEm: string
  contato: 'nenhum' | 'encarregado' | 'institucional'
  blocos: Bloco[]
}

export const PAGINAS_PADRAO: PaginaPadrao[] = [
  {
    titulo: 'Aviso de privacidade',
    slug: 'privacidade',
    resumo:
      'Quais dados o portal trata, para quê, com quem compartilha e como você exerce seus direitos pela LGPD.',
    atualizadoEm: '2026-10-26T12:00:00.000Z',
    contato: 'encarregado',
    blocos: [
      ['h2', 'Quem é responsável pelos dados'],
      [
        'p',
        'O tratamento de dados deste portal é feito pelo Município de Pindamonhangaba, por meio do CMDCA. O canal do encarregado municipal de dados está na [página de proteção de dados da Prefeitura](' +
          MUNICIPIO_LGPD +
          ') e no quadro ao final deste aviso.',
      ],
      ['h2', 'Quais dados podem ser tratados'],
      [
        'p',
        'Navegar pelo portal não exige cadastro. O servidor registra dados técnicos de acesso, como endereço IP, data e hora, página visitada, navegador e respostas do sistema, para manter o serviço seguro e investigar falhas.',
      ],
      [
        'p',
        'Quando você escreve ao conselho, tratamos o que você enviar: nome, e-mail, a mensagem e os anexos. Não mande por e-mail detalhes sobre crianças, adolescentes, saúde ou violência que não sejam necessários. Para denúncias e emergências, use os canais da página [Buscar ajuda](/ajuda).',
      ],
      [
        'p',
        'Pessoas autorizadas a usar o painel administrativo têm dados de identificação, acesso e atividade tratados para autenticação, segurança e registro das publicações.',
      ],
      ['h2', 'Para que usamos e com qual base legal'],
      [
        'p',
        'Os dados servem para entregar e proteger o portal, responder a solicitações, publicar conteúdo oficial, cumprir obrigações legais e executar políticas públicas. As bases legais são as previstas na [Lei Geral de Proteção de Dados](' +
          LGPD +
          '), como cumprimento de obrigação legal, execução de política pública e exercício regular de direitos.',
      ],
      ['h2', 'Cookies e armazenamento no seu aparelho'],
      [
        'p',
        'O portal não usa publicidade nem ferramentas de rastreamento. As preferências de contraste e tamanho de letra ficam guardadas só no seu navegador. O painel administrativo usa cookies técnicos de sessão.',
      ],
      ['h2', 'Com quem os dados são compartilhados'],
      [
        'p',
        'O portal funciona em servidor contratado pelo projeto, onde ficam a aplicação, o banco de dados e os arquivos publicados. O tradutor VLibras, do Governo Federal, e os mapas do OpenStreetMap recebem dados técnicos quando você os utiliza. As fontes tipográficas são entregues pelo próprio portal.',
      ],
      [
        'p',
        'Dados podem ser repassados a autoridades quando houver obrigação legal, ordem válida ou necessidade de proteger direitos. O Município não vende dados pessoais.',
      ],
      ['h2', 'Por quanto tempo e com que cuidado'],
      [
        'p',
        'Guardamos os dados pelo tempo necessário à finalidade, aos prazos legais e às regras de arquivo público. Usamos controle de acesso, autenticação e cópias de segurança. Incidentes relevantes são tratados e comunicados conforme a LGPD e as orientações da ANPD.',
      ],
      ['h2', 'Crianças e adolescentes'],
      [
        'p',
        'Qualquer tratamento de dados de crianças e adolescentes segue o melhor interesse deles, como determina o art. 14 da LGPD e o [entendimento da ANPD](' +
          ANPD_CRIANCAS +
          '). Imagens e relatos só são publicados depois de avaliar finalidade, exposição, riscos e autorizações.',
      ],
      ['h2', 'Seus direitos'],
      [
        'p',
        'Você pode pedir confirmação do tratamento, acesso, correção, informação sobre compartilhamento e, quando cabível, anonimização, bloqueio ou eliminação. Alguns registros precisam ser mantidos por obrigação legal ou interesse público, mesmo após um pedido de exclusão.',
      ],
      ['h2', 'Mudanças neste aviso'],
      [
        'p',
        'Este aviso muda quando a lei, a tecnologia ou a operação do portal mudarem. A versão em vigor e a data da última atualização ficam sempre nesta página.',
      ],
    ],
  },
  {
    titulo: 'Termos de uso',
    slug: 'termos',
    resumo: 'Regras para usar o portal do CMDCA e reproduzir o seu conteúdo.',
    atualizadoEm: '2026-10-26T12:00:00.000Z',
    contato: 'institucional',
    blocos: [
      ['h2', 'Para que serve o portal'],
      [
        'p',
        'O portal informa sobre o CMDCA de Pindamonhangaba: canais de proteção, reuniões, resoluções, editais, Fundo Municipal e notícias. O uso é livre e gratuito, sem cadastro.',
      ],
      ['h2', 'O portal não recebe denúncias'],
      [
        'p',
        'Nenhum formulário ou e-mail deste portal substitui os canais de proteção. Em perigo imediato, ligue 190. Para denunciar violações de direitos, use o Disque 100 ou procure o Conselho Tutelar. Veja todos os canais em [Buscar ajuda](/ajuda).',
      ],
      ['h2', 'Valor das informações'],
      [
        'p',
        'Resoluções, editais e demais atos valem na forma publicada na imprensa oficial do Município. O portal reproduz esses atos para facilitar a consulta. Se houver diferença, prevalece a publicação oficial.',
      ],
      [
        'p',
        'Orientações sobre Imposto de Renda e outros temas são gerais e não substituem a análise do seu caso pela Receita Federal ou por profissional habilitado.',
      ],
      ['h2', 'Reprodução do conteúdo'],
      [
        'p',
        'Textos e documentos públicos podem ser reproduzidos com citação da fonte e do endereço da página. Fotos e materiais de terceiros seguem os créditos e as licenças indicados em cada caso. Imagens de crianças e adolescentes não podem ser reutilizadas fora do contexto original.',
      ],
      ['h2', 'Links para outros sites'],
      [
        'p',
        'O portal indica páginas de outros órgãos, como Receita Federal, Prefeitura e Governo Federal. Esses sites têm regras e políticas próprias.',
      ],
      ['h2', 'Disponibilidade e correções'],
      [
        'p',
        'Trabalhamos para manter o portal no ar e as informações corretas. Se encontrar um erro ou uma informação desatualizada, avise pelo contato abaixo, informando a página.',
      ],
      ['h2', 'Mudanças nestes termos'],
      [
        'p',
        'Os termos podem mudar para acompanhar a lei ou o funcionamento do portal. A data da última atualização fica sempre nesta página.',
      ],
    ],
  },
  {
    titulo: 'Acessibilidade',
    slug: 'acessibilidade',
    resumo:
      'Recursos do portal, referências adotadas, limitações conhecidas e como relatar uma barreira.',
    atualizadoEm: '2026-10-26T12:00:00.000Z',
    contato: 'institucional',
    blocos: [
      [
        'p',
        'Este portal segue a [Lei Brasileira de Inclusão](' +
          LBI +
          '), o [Modelo de Acessibilidade em Governo Eletrônico (eMAG)](' +
          EMAG +
          ') e as [Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2](' +
          WCAG +
          '), nível AA. Usar essas referências não equivale a um selo de conformidade: o portal passa por verificações automáticas e manuais a cada mudança.',
      ],
      ['h2', 'Recursos disponíveis'],
      [
        'ul',
        [
          'Barra no topo de todas as páginas com: diminuir e aumentar o tamanho da letra (A- e A+), alto contraste e tradução para Libras (VLibras). As preferências ficam salvas no seu navegador.',
          'Link “Pular para o conteúdo”, o primeiro item ao usar a tecla Tab.',
          'Navegação completa pelo teclado, com indicação de foco visível em amarelo e anil.',
          'Telefones de proteção sempre visíveis e tocáveis: no topo do computador e na barra inferior do celular.',
          'Textos alternativos nas imagens, títulos em ordem e páginas que funcionam com zoom de até 400%.',
          'Animações reduzidas quando o sistema pede menos movimento.',
        ],
      ],
      ['h2', 'Atalhos úteis'],
      [
        'p',
        'Use Tab e Shift+Tab para avançar e voltar entre links e botões, Enter para abrir e Esc para fechar o menu no celular. O [mapa do site](/mapa-do-site) lista todas as páginas.',
      ],
      ['h2', 'Limitações conhecidas'],
      [
        'p',
        'Documentos antigos em PDF podem não ter estrutura adequada para leitores de tela. O VLibras e o mapa da rede de proteção são serviços de terceiros, com comportamento próprio. Se um documento ou recurso não estiver acessível, peça uma alternativa pelo contato abaixo.',
      ],
      ['h2', 'Encontrou uma barreira?'],
      [
        'p',
        'Conte qual página ou documento, o que aconteceu e, se puder, qual navegador e tecnologia assistiva você usa. Cada relato é analisado e, quando possível, respondido com uma alternativa de acesso.',
      ],
    ],
  },
  {
    titulo: 'Créditos',
    slug: 'creditos',
    resumo: 'Identidade visual, imagens, mapas, tipografia e tecnologias usadas neste portal.',
    atualizadoEm: '2026-10-26T12:00:00.000Z',
    contato: 'nenhum',
    blocos: [
      ['h2', 'Identidade visual'],
      [
        'p',
        'Logotipo oficial do CMDCA Pindamonhangaba, cedido pelo conselho. O emblema do cabeçalho e o pictograma da página inicial são redesenhos vetoriais desse logotipo, nas cores medidas no original.',
      ],
      ['h2', 'Imagens'],
      [
        'p',
        'O portal evita fotos que identifiquem crianças e adolescentes. Quando uma imagem é publicada, o crédito aparece junto dela.',
      ],
      ['h2', 'Mapa'],
      ['p', 'Mapas e dados geográficos do [OpenStreetMap e colaboradores](' + OSM + ').'],
      ['h2', 'Tipografia'],
      [
        'p',
        'Archivo, da Omnibus-Type, nos títulos, e Atkinson Hyperlegible Next, do Braille Institute, no texto. As duas usam a [licença SIL Open Font](' + OFL + ') e são entregues pelo próprio portal.',
      ],
      ['h2', 'Tecnologia'],
      [
        'p',
        'Portal construído com Next.js e Payload CMS. Veja também o [aviso de privacidade](/privacidade) e a [declaração de acessibilidade](/acessibilidade).',
      ],
    ],
  },
]

/** Endereços que já são rotas do site e não podem ser usados por páginas do CMS. */
export const RESERVED_SLUGS = [
  'admin',
  'ajuda',
  'api',
  'conferencias',
  'conselho',
  'editais',
  'entidades',
  'fmdca',
  'mapa-do-site',
  'noticias',
  'participe',
  'resolucoes',
  'reunioes',
  'transparencia',
]
