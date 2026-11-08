import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

// Só conteúdo: redação na linguagem simples do gov.br (07/11/2026). Cada linha é
// [global, caminho, texto antigo, texto novo]. Um campo só é trocado se ainda tiver o
// texto antigo; o que alguém já editou no painel fica como está. A ordem padrão dos
// blocos da página inicial também muda (ajuda e serviços logo depois da capa).
const TROCAS: [global: 'textos' | 'pagina-inicial', caminho: string, antes: string, depois: string][] = [
  ['textos', 'protecao.canais.0.situacao', 'Há perigo agora', 'Alguém corre perigo agora'],
  ['textos', 'protecao.canais.1.situacao', 'Quero denunciar uma violação de direitos', 'Denunciar violação de direitos'],
  ['textos', 'protecao.canais.2.situacao', 'Preciso do Conselho Tutelar', 'Falar com o Conselho Tutelar'],
  ['textos', 'protecao.canais.3.situacao', 'Sou criança ou adolescente e preciso falar com alguém', 'Sou criança ou adolescente e preciso de ajuda'],
  ['textos', 'ajuda.titulo', 'Uma criança ou adolescente precisa de ajuda?', 'Pedir ajuda para uma criança ou adolescente'],
  ['textos', 'ajuda.introducao', 'Escolha a situação mais parecida com a sua e ligue. Se houver perigo agora, ligue 190 antes de qualquer outra coisa.', 'Escolha a situação mais parecida com a sua e ligue para o canal indicado. Se alguém corre perigo agora, ligue 190.'],
  ['textos', 'ajuda.redeTexto', 'CRAS e CREAS atendem famílias e acompanham situações de risco. Confirme endereço e horário antes de sair de casa.', 'O CRAS e o CREAS atendem famílias e acompanham situações de risco. Confirme o endereço e o horário de atendimento antes de ir.'],
  ['textos', 'fmdca.titulo', 'Destine parte do seu Imposto de Renda à infância de Pinda', 'Destinar parte do Imposto de Renda ao Fundo Municipal'],
  ['textos', 'fmdca.introducao', 'O Fundo Municipal dos Direitos da Criança e do Adolescente recebe parte do imposto devido e financia projetos aprovados pelo CMDCA. Você não paga nada a mais: só escolhe onde parte do imposto será aplicada.', 'Você pode direcionar parte do Imposto de Renda devido ao Fundo Municipal dos Direitos da Criança e do Adolescente (FMDCA). O valor é abatido do imposto: você não paga nada a mais, e o dinheiro financia projetos aprovados pelo CMDCA.'],
  ['textos', 'fmdca.oQueETitulo', 'O que é o Fundo', 'O que é o Fundo Municipal'],
  ['textos', 'fmdca.passos.0.titulo', 'Faça a declaração completa', 'Preencha a declaração completa'],
  ['textos', 'fmdca.passos.1.titulo', 'Abra “Doações Diretamente na Declaração”', 'Informe a doação na ficha própria'],
  ['textos', 'fmdca.passos.1.texto', 'Na ficha Criança e Adolescente, escolha o fundo municipal de Pindamonhangaba (SP) e informe o valor. O programa mostra o limite disponível.', 'Em “Doações Diretamente na Declaração”, na ficha Criança e Adolescente, escolha o fundo municipal de Pindamonhangaba (SP) e informe o valor. O programa mostra o limite disponível.'],
  ['textos', 'fmdca.passos.2.titulo', 'Pague o DARF no prazo', 'Pague o DARF até o prazo'],
  ['textos', 'fmdca.simuladorTitulo', 'Faça uma estimativa', 'Simular o valor da doação'],
  ['textos', 'fmdca.bancarioTitulo', 'Doação fora da declaração', 'Doar fora da declaração'],
  ['textos', 'conselho.titulo', 'O que é o CMDCA', 'Sobre o CMDCA'],
  ['textos', 'conselho.introducao', 'O Conselho Municipal dos Direitos da Criança e do Adolescente decide e fiscaliza a política para a infância em Pindamonhangaba. Metade das cadeiras é da Prefeitura, metade da sociedade civil.', 'O Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA) define as prioridades da política para a infância em Pindamonhangaba e acompanha sua execução. Metade dos conselheiros representa a Prefeitura e metade, a sociedade civil.'],
  ['textos', 'conselho.composicaoLinkRotulo', 'Ver a posse da gestão atual', 'Ler a notícia da posse da gestão atual'],
  ['textos', 'conselho.atribuicoesTitulo', 'O que o conselho faz', 'Atribuições do conselho'],
  ['textos', 'conselho.atribuicoes.0.titulo', 'Define a política municipal', 'Definir a política municipal'],
  ['textos', 'conselho.atribuicoes.1.titulo', 'Decide sobre o Fundo Municipal', 'Decidir sobre o Fundo Municipal'],
  ['textos', 'conselho.atribuicoes.2.titulo', 'Registra entidades e programas', 'Registrar entidades e programas'],
  ['textos', 'conselho.atribuicoes.3.titulo', 'Conduz a escolha do Conselho Tutelar', 'Conduzir a escolha do Conselho Tutelar'],
  ['textos', 'participe.titulo', 'Participe das decisões', 'Participar do CMDCA'],
  ['textos', 'participe.introducao', 'As reuniões do CMDCA são abertas, salvo quando a pauta exige sigilo. Veja como acompanhar, opinar e colaborar.', 'As reuniões do conselho são abertas ao público, exceto quando a pauta envolve informações protegidas. Veja como acompanhar, opinar e colaborar.'],
  ['textos', 'participe.caminhos.0.titulo', 'Assista a uma reunião', 'Assistir a uma reunião'],
  ['textos', 'participe.caminhos.1.titulo', 'Acompanhe as decisões', 'Acompanhar as decisões'],
  ['textos', 'participe.caminhos.2.titulo', 'Registre sua entidade', 'Registrar uma entidade'],
  ['textos', 'participe.caminhos.3.titulo', 'Destine seu Imposto de Renda', 'Destinar Imposto de Renda'],
  ['textos', 'participe.caminhos.4.titulo', 'Vá a uma conferência', 'Participar de uma conferência'],
  ['textos', 'participe.contatoTitulo', 'Fale com o conselho', 'Falar com o conselho'],
  ['textos', 'transparencia.introducao', 'O que o CMDCA decide e como o Fundo Municipal é aplicado, com documento, data e fonte.', 'Consulte as decisões do CMDCA e a aplicação dos recursos do Fundo Municipal, com documento, data e fonte.'],
  ['textos', 'atos.reunioesIntro', 'Calendário, pautas e atas das reuniões do colegiado. As atas entram depois de aprovadas.', 'Consulte o calendário, as pautas e as atas das reuniões do conselho. As atas são publicadas depois de aprovadas.'],
  ['textos', 'atos.resolucoesIntro', 'Decisões do colegiado com número, data e situação. Abra o documento ou, quando houver, a publicação oficial.', 'Consulte as decisões do conselho por número, data e situação, com o documento ou a publicação oficial.'],
  ['textos', 'atos.editaisIntro', 'Chamamentos, processos de escolha e seleções, com prazo, situação, anexos e retificações.', 'Consulte chamamentos, seleções e processos de escolha, com prazos, situação, anexos e retificações.'],
  ['textos', 'atos.entidadesIntro', 'Organizações e programas com registro no CMDCA, com número e validade quando informados.', 'Consulte as organizações e os programas registrados no CMDCA, com número e validade do registro quando informados.'],
  ['textos', 'atos.entidadesOrientacaoTitulo', 'Registro ou renovação', 'Como registrar ou renovar'],
  ['textos', 'publicacoes.noticiasIntro', 'Comunicados, campanhas e o que acontece no conselho. Atos oficiais ficam em Resoluções e Editais.', 'Comunicados, campanhas e ações do conselho. Os atos oficiais estão em Resoluções e Editais.'],
  ['textos', 'publicacoes.conferenciasIntro', 'Encontros abertos em que a cidade avalia a política para a infância e vota prioridades.', 'Encontros abertos em que a cidade avalia a política para a infância e define prioridades.'],
  ['textos', 'geral.naoEncontradaTitulo', 'Esta página não existe', 'Página não encontrada'],
  ['textos', 'geral.naoEncontradaTexto', 'O endereço pode ter mudado ou sido digitado errado. Escolha um dos caminhos abaixo.', 'O endereço pode estar errado ou a página foi removida. Use um dos caminhos abaixo para continuar.'],
  ['pagina-inicial', 'capa.titulo', 'Direitos de crianças e adolescentes, decididos em público.', 'Proteção e direitos de crianças e adolescentes em Pindamonhangaba'],
  ['pagina-inicial', 'capa.texto', 'O CMDCA reúne Prefeitura e sociedade civil para cuidar da política da infância em Pindamonhangaba: define prioridades, aplica o Fundo Municipal e fiscaliza a rede de proteção.', 'O CMDCA define as prioridades da política para a infância, decide como usar o Fundo Municipal e acompanha os serviços de proteção da cidade.'],
  ['pagina-inicial', 'sobre.titulo', 'Quem decide e como', 'Sobre o CMDCA'],
  ['pagina-inicial', 'sobre.texto', 'O CMDCA é paritário: metade dos conselheiros representa a Prefeitura, metade a sociedade civil. As decisões saem de reuniões abertas e viram resoluções publicadas.', 'O conselho reúne representantes da Prefeitura e da sociedade civil em número igual. As decisões são tomadas em reuniões e publicadas como resoluções.'],
  ['pagina-inicial', 'rotas.protecaoTitulo', 'Proteger agora', 'Precisa de ajuda agora?'],
  ['pagina-inicial', 'rotas.protecaoTexto', 'Emergência, denúncia e Conselho Tutelar, com telefones de um toque.', 'Escolha o canal de acordo com a situação. Em caso de perigo imediato, ligue 190.'],
  ['pagina-inicial', 'rotas.fundoTitulo', 'Destinar seu IR', 'Destinar Imposto de Renda'],
  ['pagina-inicial', 'rotas.fundoTexto', 'Parte do imposto que você já paga pode financiar projetos da cidade.', 'Direcione parte do imposto devido ao Fundo Municipal, sem pagar nada a mais.'],
  ['pagina-inicial', 'rotas.atosTitulo', 'Acompanhar o conselho', 'Acompanhar reuniões'],
  ['pagina-inicial', 'rotas.atosTexto', 'Reuniões, resoluções e editais, com data e documento.', 'Calendário, pautas e atas das reuniões do conselho.'],
]

const BLOCOS_ANTES = ['slider', 'sobre', 'atalhos', 'indicadores', 'vozes', 'noticias']
const BLOCOS_DEPOIS = ['atalhos', 'slider', 'noticias', 'sobre', 'indicadores', 'vozes']

type Node = Record<string, unknown> | unknown[]

function trocar(doc: Node, caminho: string, antes: string, depois: string): boolean {
  const partes = caminho.split('.')
  let alvo: unknown = doc
  for (const parte of partes.slice(0, -1)) {
    if (alvo === null || typeof alvo !== 'object') return false
    alvo = (alvo as Record<string, unknown>)[parte]
  }
  if (alvo === null || typeof alvo !== 'object') return false
  const chave = partes[partes.length - 1]
  const registro = alvo as Record<string, unknown>
  if (registro[chave] !== antes) return false
  registro[chave] = depois
  return true
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['textos', 'pagina-inicial'] as const) {
    const doc = (await payload.findGlobal({ slug, depth: 0, req })) as unknown as Record<string, unknown>
    let mudou = false
    for (const [global, caminho, antes, depois] of TROCAS) {
      if (global === slug && trocar(doc, caminho, antes, depois)) mudou = true
    }
    if (slug === 'pagina-inicial' && Array.isArray(doc.blocos)) {
      const linhas = doc.blocos as { tipo?: string }[]
      if (JSON.stringify(linhas.map((l) => l.tipo)) === JSON.stringify(BLOCOS_ANTES)) {
        doc.blocos = BLOCOS_DEPOIS.map((tipo) => linhas.find((l) => l.tipo === tipo))
        mudou = true
      }
    }
    if (!mudou) continue
    const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...data } = doc
    await payload.updateGlobal({
      slug,
      data: { ...data, _status: 'published' } as never,
      depth: 0,
      req,
    })
  }
}

// Sem volta automática: os textos anteriores continuam no histórico de versões.
export async function down(_args: MigrateDownArgs): Promise<void> {}
