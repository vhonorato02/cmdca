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
const LAI = 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm'
const ECA = 'https://www.planalto.gov.br/ccivil_03/leis/l8069.htm'
const OSM = 'https://www.openstreetmap.org/copyright'
const OFL = 'https://openfontlicense.org'
const FOTO_CAPA = 'https://commons.wikimedia.org/wiki/File:Panor%C3%A2mica_de_Pindamonhangaba_02.jpg'
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br'

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
      'Quais dados pessoais o portal trata, para quê, com base em qual lei, por quanto tempo, com quem compartilha e como você exerce seus direitos.',
    atualizadoEm: '2026-11-08T12:00:00.000Z',
    contato: 'encarregado',
    blocos: [
      [
        'p',
        'Este aviso atende à [Lei Geral de Proteção de Dados Pessoais (LGPD)](' +
          LGPD +
          '), em especial aos arts. 9º, 14, 18 e 23. Ele vale para este portal. Atendimentos presenciais, processos e documentos do conselho seguem as regras do Município.',
      ],
      ['h2', 'Quem é responsável'],
      [
        'p',
        'O controlador dos dados é o Município de Pindamonhangaba, por meio do Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA), criado pela Lei Municipal nº 2.626/1991. O encarregado pelo tratamento de dados pessoais é o do Município, indicado na [página de proteção de dados da Prefeitura](' +
          MUNICIPIO_LGPD +
          ') e no quadro ao final deste aviso.',
      ],
      ['h2', 'O que o portal não faz'],
      [
        'ul',
        [
          'Não pede cadastro para ler nada.',
          'Não tem formulário público: nenhum dado é enviado ao portal pelo visitante.',
          'Não usa cookies nas páginas públicas, publicidade, ferramentas de estatística ou rastreamento.',
          'Não vende nem cede dados pessoais.',
          'Não recebe denúncias. Para isso, use os canais oficiais da página [Buscar ajuda](/ajuda).',
        ],
      ],
      ['h2', 'Quais dados são tratados, para quê e com qual base legal'],
      [
        'ul',
        [
          'Registros técnicos de acesso (endereço IP, data e hora, endereço da página, navegador e resposta do servidor): para manter o portal seguro, conter abusos e investigar falhas. Base: execução das competências legais do órgão público (LGPD, art. 7º, III, e art. 23) e garantia da segurança do serviço (art. 46).',
          'Mensagens que você envia ao e-mail do conselho (nome, endereço de e-mail, texto e anexos): para responder e dar andamento ao pedido. Base: art. 7º, III, e art. 23 da LGPD, e a [Lei nº 13.460/2017](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm), que garante ao usuário do serviço público o direito de se manifestar.',
          'Dados de quem usa o painel administrativo (nome, e-mail, papel, senha guardada só em forma cifrada e histórico de edições): para autenticar, controlar permissões e registrar quem publicou cada conteúdo. Base: art. 7º, II e III, da LGPD.',
          'Dados que fazem parte de atos públicos (nomes de conselheiros, membros da diretoria, signatários de resoluções e editais, entidades registradas): publicados por dever de transparência. Base: art. 7º, II, e art. 23 da LGPD, combinados com a [Lei de Acesso à Informação](/acesso-a-informacao) e o art. 37 da Constituição.',
          'Depoimentos e imagens de pessoas: só com autorização registrada, conforme a [política de publicação e uso de imagem](/uso-de-imagem).',
        ],
      ],
      [
        'p',
        'Não mande ao e-mail do conselho detalhes sobre a saúde, a vida sexual ou situações de violência de crianças e adolescentes que não sejam necessários. Esses são dados sensíveis (LGPD, art. 11). Situações de risco devem ir ao Conselho Tutelar, ao Disque 100 ou ao 190.',
      ],
      ['h2', 'Crianças e adolescentes'],
      [
        'p',
        'Todo tratamento de dados de crianças e adolescentes segue o melhor interesse deles (LGPD, art. 14, e o [enunciado da ANPD](' +
          ANPD_CRIANCAS +
          ')) e o direito ao respeito, que inclui a preservação da imagem e da identidade (Estatuto da Criança e do Adolescente, arts. 17 e 18). O portal nunca publica dados que identifiquem crianças ou adolescentes vítimas, em acolhimento, em situação de risco ou a quem se atribua ato infracional, nem com autorização. O sistema de publicação bloqueia esses casos.',
      ],
      ['h2', 'Armazenamento no seu aparelho'],
      [
        'p',
        'As páginas públicas não gravam cookies. As preferências de tamanho de letra e de alto contraste ficam só no armazenamento local do seu navegador (chaves “cmdca-fs” e “cmdca-contrast”), não são enviadas a ninguém e podem ser apagadas a qualquer momento nas configurações do navegador. O painel administrativo usa um cookie técnico de sessão, só para quem faz login.',
      ],
      ['h2', 'Serviços de terceiros, sempre por escolha sua'],
      [
        'ul',
        [
          'Tradução para Libras (VLibras, do Governo Federal): só é carregada quando você toca no botão “Libras”. A partir daí, o seu navegador se conecta aos servidores do VLibras e de distribuição de arquivos (jsDelivr), que recebem dados técnicos como o endereço IP.',
          'Mapa da rede de proteção (OpenStreetMap): só é carregado quando você toca em “Ver os endereços no mapa”. Os blocos do mapa vêm dos servidores da Fundação OpenStreetMap, que podem ficar fora do Brasil e recebem dados técnicos como o endereço IP.',
          'Links para outros órgãos (Receita Federal, Prefeitura, Governo Federal) levam a sites com políticas de privacidade próprias.',
        ],
      ],
      ['h2', 'Onde os dados ficam e com quem são compartilhados'],
      [
        'p',
        'O portal, o banco de dados e os arquivos publicados ficam em servidor contratado no Brasil. Cópias de segurança diárias são cifradas antes de sair do servidor e guardadas também em serviço de armazenamento em nuvem, que só recebe os arquivos já cifrados, sem a chave. As fontes tipográficas e as imagens são entregues pelo próprio portal.',
      ],
      [
        'p',
        'Dados podem ser repassados a autoridades quando houver obrigação legal ou ordem válida, e ao Município quando necessário ao serviço público (LGPD, arts. 26 e 27).',
      ],
      ['h2', 'Por quanto tempo'],
      [
        'ul',
        [
          'Registros técnicos de acesso: arquivos de tamanho limitado, substituídos automaticamente, em geral em poucos dias, e registros do sistema por até 30 dias.',
          'Cópias de segurança: 7 diárias, 4 semanais e 6 mensais. Depois disso são apagadas.',
          'Contas do painel: enquanto a pessoa tiver função no conselho. O histórico de quem publicou o quê é mantido como registro do ato público.',
          'Mensagens e documentos recebidos: pelos prazos das normas de arquivo público e da tabela de temporalidade do Município (Lei nº 8.159/1991).',
          'Conteúdo publicado: enquanto for de interesse público. Atos oficiais não são apagados; quando revogados ou suspensos, ficam marcados assim.',
        ],
      ],
      ['h2', 'Segurança'],
      [
        'p',
        'O portal usa conexão cifrada (HTTPS com HSTS), política de segurança de conteúdo, permissões por papel no painel, bloqueio após tentativas erradas de senha, senhas guardadas só em forma cifrada, revisão antes de cada publicação e cópias de segurança cifradas e testadas. Se houver incidente de segurança que possa causar risco ou dano relevante, o Município comunica a Autoridade Nacional de Proteção de Dados (ANPD) e as pessoas afetadas no prazo da LGPD (art. 48) e da Resolução CD/ANPD nº 15/2024.',
      ],
      ['h2', 'Seus direitos e como exercê-los'],
      [
        'p',
        'Você pode pedir: confirmação de que tratamos seus dados, acesso a eles, correção de dados incompletos ou errados, informação sobre com quem foram compartilhados e, quando cabível, anonimização, bloqueio ou eliminação de dados desnecessários (LGPD, art. 18). Alguns registros não podem ser apagados porque são atos públicos ou têm guarda obrigatória por lei (art. 16).',
      ],
      [
        'p',
        'Faça o pedido ao encarregado do Município (quadro abaixo) ou pelo [protocolo eletrônico da Prefeitura](https://pindamonhangaba.1doc.com.br/atendimento), informando que se trata do portal do CMDCA. A confirmação e o acesso em formato simplificado são imediatos quando possível; a declaração completa sai em até 15 dias (art. 19). Se o pedido não for atendido, você pode peticionar à [ANPD](https://www.gov.br/anpd/pt-br).',
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
    resumo: 'Regras para usar o portal do CMDCA, o valor das informações publicadas e como reproduzir o conteúdo.',
    atualizadoEm: '2026-11-08T12:00:00.000Z',
    contato: 'institucional',
    blocos: [
      ['h2', 'Para que serve o portal'],
      [
        'p',
        'O portal é o canal oficial de informação do Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba (CMDCA): canais de proteção, reuniões, resoluções, editais, Fundo Municipal e notícias. O uso é livre e gratuito, sem cadastro. Ao usar o portal, você concorda com estes termos e com o [aviso de privacidade](/privacidade).',
      ],
      ['h2', 'O portal não recebe denúncias nem pedidos de socorro'],
      [
        'p',
        'Nenhuma página ou e-mail deste portal substitui os canais de proteção, que funcionam por telefone e pessoalmente. Em perigo imediato, ligue 190. Para denunciar violações de direitos, use o Disque 100 ou procure o Conselho Tutelar. O CMDCA formula e acompanha a política de direitos; o atendimento de casos é do Conselho Tutelar e da rede de proteção. Veja todos os canais em [Buscar ajuda](/ajuda).',
      ],
      ['h2', 'Valor das informações'],
      [
        'p',
        'Resoluções, editais e demais atos valem na forma publicada na imprensa oficial do Município. O portal reproduz esses atos para facilitar a consulta. Se houver diferença, prevalece a publicação oficial. Prazos de editais contam pela publicação oficial e pelas regras de cada edital.',
      ],
      [
        'p',
        'Orientações sobre Imposto de Renda e outros temas são gerais e não substituem a análise do seu caso pela Receita Federal ou por profissional habilitado. Telefones e endereços de serviços são conferidos periodicamente, mas podem mudar: confirme antes de se deslocar.',
      ],
      ['h2', 'Reprodução do conteúdo'],
      [
        'p',
        'Textos e documentos públicos podem ser reproduzidos com citação da fonte e do endereço da página, sem alterar o sentido. Fotos, marcas e materiais de terceiros seguem os créditos e as licenças indicados em cada caso ([Créditos](/creditos)). O logotipo do CMDCA só pode ser usado para se referir ao conselho, sem sugerir apoio ou parceria que não exista.',
      ],
      [
        'p',
        'Imagens e relatos de crianças e adolescentes publicados aqui não podem ser copiados, editados ou reutilizados fora do contexto original. A divulgação que identifique criança ou adolescente vítima ou a quem se atribua ato infracional é proibida pelo Estatuto da Criança e do Adolescente (arts. 17, 18, 143 e 247).',
      ],
      ['h2', 'Uso proibido'],
      [
        'p',
        'É proibido tentar acessar áreas restritas sem autorização, testar senhas, sobrecarregar o servidor, copiar o conteúdo em massa de forma que prejudique o serviço ou explorar falhas de segurança. Essas condutas podem configurar crime (Código Penal, art. 154-A, incluído pela Lei nº 12.737/2012) e são comunicadas às autoridades. Se você encontrou uma falha, comunique-a de forma responsável pelo contato indicado em [/.well-known/security.txt](/.well-known/security.txt).',
      ],
      ['h2', 'Links para outros sites'],
      [
        'p',
        'O portal indica páginas de outros órgãos, como Receita Federal, Prefeitura e Governo Federal. Esses sites têm regras e políticas próprias, e o CMDCA não controla o seu conteúdo nem a sua disponibilidade.',
      ],
      ['h2', 'Período eleitoral'],
      [
        'p',
        'Nos três meses anteriores às eleições, a publicidade institucional segue as restrições da legislação eleitoral (Lei nº 9.504/1997, art. 73). Nesse período, notícias e destaques podem ser retirados ou suspensos. Informações de utilidade pública, canais de proteção e atos oficiais continuam disponíveis.',
      ],
      ['h2', 'Disponibilidade e correções'],
      [
        'p',
        'Trabalhamos para manter o portal no ar e as informações corretas. Interrupções para manutenção ou por falhas de terceiros podem acontecer. Se encontrar um erro ou uma informação desatualizada, avise pelo contato abaixo, informando a página. Correções relevantes de atos publicados são feitas por retificação, que fica registrada.',
      ],
      ['h2', 'Mudanças nestes termos'],
      [
        'p',
        'Os termos podem mudar para acompanhar a lei ou o funcionamento do portal. A data da última atualização fica sempre nesta página.',
      ],
    ],
  },
  {
    titulo: 'Acesso à informação',
    slug: 'acesso-a-informacao',
    resumo:
      'O que o CMDCA publica por iniciativa própria e como pedir qualquer outra informação pela Lei de Acesso à Informação.',
    atualizadoEm: '2026-11-08T12:00:00.000Z',
    contato: 'institucional',
    blocos: [
      [
        'p',
        'A [Lei de Acesso à Informação](' +
          LAI +
          ') (Lei nº 12.527/2011) garante a qualquer pessoa o direito de receber informações públicas, sem precisar explicar o motivo. Em Pindamonhangaba, ela é regulamentada pelo Decreto Municipal nº 5.099/2014, que criou o Serviço de Informação ao Cidadão (SIC).',
      ],
      ['h2', 'O que já está publicado'],
      [
        'p',
        'O CMDCA publica por iniciativa própria (transparência ativa, art. 8º da lei):',
      ],
      [
        'ul',
        [
          'Competências, composição e base legal do conselho: [Sobre o CMDCA](/conselho).',
          'Calendário, pautas e atas das reuniões: [Reuniões](/reunioes).',
          'Decisões do conselho, com número, data e situação: [Resoluções](/resolucoes).',
          'Chamamentos, seleções e processos de escolha, com prazos e anexos: [Editais](/editais).',
          'Organizações e programas registrados: [Entidades](/entidades).',
          'Fundo Municipal dos Direitos da Criança e do Adolescente e como destinar o Imposto de Renda: [Fundo Municipal](/fmdca).',
          'Plano de aplicação e prestação de contas do Fundo Municipal: [Transparência](/transparencia).',
        ],
      ],
      [
        'p',
        'Receitas, despesas, contratos e convênios do Município, inclusive os do Fundo Municipal, estão no [Portal da Transparência da Prefeitura](https://pindamonhangaba.sp.gov.br/portal-da-transparencia).',
      ],
      ['h2', 'Como pedir uma informação'],
      [
        'ul',
        [
          'Pela internet: no [protocolo eletrônico da Prefeitura (1Doc)](https://pindamonhangaba.1doc.com.br/atendimento), escolha a opção “Acesso à Informação” e informe que o pedido é sobre o CMDCA.',
          'Pessoalmente: no Serviço de Informação ao Cidadão, no Paço Municipal (Av. Nossa Senhora do Bom Sucesso, 1400, Alto do Cardoso), das 8h às 16h. Telefone (12) 3644-5600.',
          'Orientações completas sobre o serviço, com os contatos atualizados, estão na [página de acesso à informação da Prefeitura](https://pindamonhangaba.sp.gov.br/servicos-ao-cidadao/acesso-a-informacao).',
        ],
      ],
      [
        'p',
        'Basta se identificar e dizer qual informação você quer, da forma mais específica possível. Não é preciso justificar o pedido (art. 10). O serviço é gratuito, exceto o custo de cópias em papel ou mídia, quando você pedir.',
      ],
      ['h2', 'Prazos e recursos'],
      [
        'ul',
        [
          'A resposta vem em até 20 dias, prorrogáveis por mais 10 com justificativa comunicada a você (art. 11).',
          'Se o acesso for negado, a resposta precisa dizer por quê e como recorrer.',
          'Você pode recorrer em até 10 dias da ciência da decisão, à autoridade superior, que tem 5 dias para responder (art. 15). O decreto municipal prevê mais instâncias.',
        ],
      ],
      ['h2', 'O que pode ser restrito'],
      [
        'p',
        'Informações pessoais, em especial de crianças, adolescentes e famílias atendidas pela rede de proteção, têm acesso restrito e não são entregues a terceiros (Lei de Acesso à Informação, art. 31, e Estatuto da Criança e do Adolescente, arts. 17, 18 e 143). Quando um documento tiver uma parte restrita, o restante é entregue com essa parte ocultada (art. 7º, § 2º). Reuniões reservadas seguem a mesma regra: a ata pública é divulgada sem os dados protegidos.',
      ],
      ['h2', 'Reclamações, sugestões e elogios'],
      [
        'p',
        'Manifestações sobre os serviços públicos podem ser feitas à [Ouvidoria do Município](https://pindamonhangaba.eouve.com.br), conforme a Lei nº 13.460/2017. Dados pessoais seguem o [aviso de privacidade](/privacidade).',
      ],
    ],
  },
  {
    titulo: 'Publicação e uso de imagem',
    slug: 'uso-de-imagem',
    resumo:
      'Como o CMDCA decide o que publica sobre crianças, adolescentes e famílias, e como pedir a retirada de um conteúdo.',
    atualizadoEm: '2026-11-08T12:00:00.000Z',
    contato: 'institucional',
    blocos: [
      [
        'p',
        'O CMDCA existe para proteger direitos de crianças e adolescentes. Por isso, o que o portal publica sobre eles segue regras mais rígidas do que as de um site comum, baseadas no [Estatuto da Criança e do Adolescente](' +
          ECA +
          ') (ECA), na [LGPD](' +
          LGPD +
          ') e na Constituição.',
      ],
      ['h2', 'O que nunca é publicado'],
      [
        'ul',
        [
          'Nome, foto, voz, apelido, escola, endereço, parentesco ou qualquer detalhe que permita reconhecer criança ou adolescente vítima de violência, em acolhimento institucional ou familiar, em situação de risco ou a quem se atribua ato infracional. Essa proibição vale mesmo com autorização dos responsáveis (ECA, arts. 17, 18, 143 e 247).',
          'Relatos de casos atendidos pela rede de proteção, ainda que sem nomes, quando o contexto permitir identificar a pessoa ou a família.',
          'Documentos com dados pessoais de crianças, adolescentes ou famílias, inclusive termos de autorização.',
          'Imagens que exponham crianças ou adolescentes a situação vexatória ou constrangedora (ECA, art. 232).',
        ],
      ],
      ['h2', 'Quando uma imagem pode ser publicada'],
      [
        'p',
        'Fotos de eventos públicos, conferências e atividades só são publicadas quando atendem a todas estas condições:',
      ],
      [
        'ul',
        [
          'Há finalidade de interesse público, e a foto é necessária para ela (por exemplo, registrar uma conferência).',
          'Se aparece criança ou adolescente identificável, há autorização escrita dos pais ou responsáveis, específica para o portal, guardada pelo conselho fora do site. Quando possível, a própria criança ou adolescente também é ouvido.',
          'A imagem não mostra a pessoa em situação de vulnerabilidade, e o enquadramento prefere grupos, mãos, costas ou detalhes a rostos em primeiro plano.',
          'Os metadados do arquivo (como localização por GPS) são removidos automaticamente no envio.',
        ],
      ],
      [
        'p',
        'O sistema de publicação do portal exige, antes de publicar, o registro dessas conferências: a indicação de criança ou adolescente identificável, a referência do termo de autorização e a declaração de quem publica. Arquivos marcados como situação protegida pelo ECA ficam bloqueados.',
      ],
      ['h2', 'Autoridades e conselheiros'],
      [
        'p',
        'Nomes de conselheiros e membros da diretoria aparecem porque fazem parte de atos públicos. A comunicação do portal é institucional e informativa, sem promoção pessoal de autoridades ou servidores (Constituição, art. 37, § 1º).',
      ],
      ['h2', 'Retirada de conteúdo'],
      [
        'p',
        'Se você, seu filho ou alguém sob sua responsabilidade aparece em algum conteúdo e quer a retirada, ou se a autorização dada foi revogada, escreva ao contato abaixo indicando o endereço da página. Pedidos que envolvam criança ou adolescente têm prioridade: o conteúdo é retirado do ar enquanto o pedido é analisado. Você também pode usar os direitos do [aviso de privacidade](/privacidade).',
      ],
      [
        'p',
        'Se encontrar em qualquer site conteúdo que exponha criança ou adolescente a violência ou exploração, denuncie pelo Disque 100 ou pelo canal da [SaferNet Brasil](https://new.safernet.org.br/denuncie).',
      ],
    ],
  },
  {
    titulo: 'Acessibilidade',
    slug: 'acessibilidade',
    resumo:
      'Recursos do portal, referências adotadas, limitações conhecidas e como relatar uma barreira.',
    atualizadoEm: '2026-11-08T12:00:00.000Z',
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
          '), nível AA, como exige o art. 63 da Lei Brasileira de Inclusão para sites de órgãos públicos. Usar essas referências não equivale a um selo de conformidade: a cada mudança, o portal passa por verificações automáticas de acessibilidade (axe, WCAG 2.2 AA) em todas as páginas, em computador e celular, e por testes de leitura com zoom de 400%.',
      ],
      ['h2', 'Recursos disponíveis'],
      [
        'ul',
        [
          'Barra no topo de todas as páginas com: diminuir e aumentar o tamanho da letra (A- e A+), alto contraste e tradução para Libras (VLibras). As preferências ficam salvas no seu navegador.',
          'Link “Pular para o conteúdo”, o primeiro item ao usar a tecla Tab.',
          'Navegação completa pelo teclado, com indicação de foco sempre visível.',
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
    atualizadoEm: '2026-11-08T12:00:00.000Z',
    contato: 'nenhum',
    blocos: [
      ['h2', 'Identidade visual'],
      [
        'p',
        'Logotipo oficial do CMDCA Pindamonhangaba, cedido pelo conselho. O emblema do cabeçalho é um redesenho vetorial desse logotipo, nas cores medidas no original.',
      ],
      ['h2', 'Imagens'],
      [
        'p',
        'O portal evita fotos que identifiquem crianças e adolescentes. Quando uma imagem é publicada, o crédito aparece junto dela.',
      ],
      [
        'p',
        'Foto da página inicial: [Panorâmica de Pindamonhangaba 02](' + FOTO_CAPA + '), de Facs90, via Wikimedia Commons, sob a licença [CC BY-SA 4.0](' + CC_BY_SA + '). Imagem redimensionada para o portal.',
      ],
      ['h2', 'Mapa'],
      ['p', 'Mapas e dados geográficos do [OpenStreetMap e colaboradores](' + OSM + ').'],
      ['h2', 'Tipografia'],
      [
        'p',
        'Bricolage Grotesque, de Mathieu Triay, nos títulos, e Public Sans, do programa U.S. Web Design System, no texto. As duas usam a [licença SIL Open Font](' + OFL + ') e são entregues pelo próprio portal.',
      ],
      ['h2', 'Ícones'],
      ['p', 'Ícones da [Lucide](https://lucide.dev), sob a licença ISC.'],
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
  'pesquisa',
  'resolucoes',
  'reunioes',
  'transparencia',
]
