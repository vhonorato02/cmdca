import type { Field, GlobalConfig, Tab } from 'payload'

import { canManageContent, isAuthenticated, publishedOrLoggedIn } from '../access'
import { TEXTOS_PADRAO } from '../content/defaults'
import { EDITORIAL_VERSIONS, GLOBAL_EDITORIAL_COMPONENTS } from '../fields/editorial'
import { validateGlobalPublication } from '../hooks/editorialPolicy'
import { revalidateNavigation } from './Navegacao'
import { validateExternalURL, validatePublicHref } from '../utilities/validation'

const T = TEXTOS_PADRAO

const text = (name: string, label: string, defaultValue: string, maxLength = 160): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  maxLength,
  defaultValue,
})

const area = (name: string, label: string, defaultValue: string, maxLength = 700): Field => ({
  name,
  label,
  type: 'textarea',
  required: true,
  maxLength,
  defaultValue,
})

const fontes = (defaultValue: { rotulo: string; url: string }[]): Field => ({
  name: 'fontes',
  label: 'Fontes oficiais citadas',
  type: 'array',
  labels: { singular: 'Fonte', plural: 'Fontes' },
  maxRows: 8,
  defaultValue,
  admin: { description: 'Links exibidos no fim da página como referência.', initCollapsed: true },
  fields: [
    { name: 'rotulo', label: 'Texto do link', type: 'text', required: true, maxLength: 120 },
    { name: 'url', label: 'Endereço (https://)', type: 'text', required: true, validate: validateExternalURL },
  ],
})

const tab = (name: string, label: string, description: string, fields: Field[]): Tab => ({
  name,
  label,
  description,
  fields,
})

export const Textos: GlobalConfig = {
  slug: 'textos',
  label: 'Textos das páginas',
  admin: {
    group: 'Configuração',
    description:
      'Títulos, apresentações e orientações exibidos nas páginas do site. Salve como rascunho, confira e publique.',
    components: GLOBAL_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  hooks: {
    beforeChange: [
      validateGlobalPublication([
        { path: 'protecao.canais', label: 'ao menos um canal de proteção' },
        { path: 'protecao.chamada', label: 'chamada da faixa de proteção', rejectPlaceholder: true },
      ]),
    ],
    // Os textos aparecem em todas as páginas (faixa de proteção e rodapé).
    afterChange: [revalidateNavigation],
  },
  access: {
    read: publishedOrLoggedIn,
    readVersions: isAuthenticated,
    update: canManageContent,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        tab('protecao', 'Proteção', 'Telefones da faixa de proteção (topo e barra do celular) e cartões da página Buscar ajuda.', [
          text('chamada', 'Chamada da faixa', T.protecao.chamada, 60),
          text('avisoTitulo', 'Título do aviso em Buscar ajuda', T.protecao.avisoTitulo, 90),
          area('aviso', 'Aviso abaixo dos canais', T.protecao.aviso, 320),
          {
            name: 'canais',
            label: 'Canais de proteção',
            type: 'array',
            labels: { singular: 'Canal', plural: 'Canais' },
            minRows: 1,
            maxRows: 5,
            defaultValue: T.protecao.canais,
            admin: {
              description:
                'A faixa mostra até 3 canais marcados com “Mostrar na faixa”, na ordem desta lista. Confirme cada número antes de publicar.',
            },
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'tipo',
                    label: 'Tipo',
                    type: 'select',
                    required: true,
                    defaultValue: 'denuncia',
                    options: [
                      { label: 'Emergência (destaque vermelho)', value: 'emergencia' },
                      { label: 'Denúncia', value: 'denuncia' },
                      { label: 'Conselho Tutelar', value: 'tutelar' },
                      { label: 'Outro', value: 'outro' },
                    ],
                    admin: { width: '34%' },
                  },
                  { name: 'rotulo', label: 'Rótulo curto', type: 'text', required: true, maxLength: 24, admin: { width: '33%' } },
                  { name: 'numero', label: 'Número exibido', type: 'text', required: true, maxLength: 32, admin: { width: '33%' } },
                ],
              },
              {
                name: 'discagem',
                label: 'Número para discar',
                type: 'text',
                maxLength: 20,
                validate: (value: unknown) =>
                  value == null || value === '' || (typeof value === 'string' && /^\+?\d{3,15}$/.test(value.trim()))
                    ? true
                    : 'Use só dígitos, como 190 ou 1235500513.',
                admin: { description: 'Só dígitos. Vazio: usa os dígitos do número exibido.' },
              },
              { name: 'situacao', label: 'Situação (título do cartão em Buscar ajuda)', type: 'text', required: true, maxLength: 90 },
              { name: 'descricao', label: 'Quando usar', type: 'textarea', required: true, maxLength: 240 },
              { name: 'observacao', label: 'Observação', type: 'text', maxLength: 120 },
              { name: 'naFaixa', label: 'Mostrar na faixa de proteção', type: 'checkbox', defaultValue: true },
            ],
          },
        ]),
        tab('ajuda', 'Buscar ajuda', 'Página /ajuda.', [
          text('titulo', 'Título', T.ajuda.titulo),
          area('introducao', 'Apresentação', T.ajuda.introducao, 320),
          text('conselhosTitulo', 'Título da seção dos Conselhos Tutelares', T.ajuda.conselhosTitulo, 80),
          area('conselhosTexto', 'Texto da seção dos Conselhos Tutelares', T.ajuda.conselhosTexto, 320),
          text('redeTitulo', 'Título da rede de proteção', T.ajuda.redeTitulo, 80),
          area('redeTexto', 'Texto da rede de proteção', T.ajuda.redeTexto, 320),
          fontes(T.ajuda.fontes),
        ]),
        tab('fmdca', 'Fundo e IR', 'Página /fmdca. Os dados bancários ficam em Configurações institucionais.', [
          text('titulo', 'Título', T.fmdca.titulo),
          area('introducao', 'Apresentação', T.fmdca.introducao, 400),
          text('oQueETitulo', 'Título "o que é"', T.fmdca.oQueETitulo, 80),
          area('oQueE', 'O que é o Fundo', T.fmdca.oQueE),
          text('passosTitulo', 'Título do passo a passo', T.fmdca.passosTitulo, 80),
          {
            name: 'passos',
            label: 'Passo a passo na declaração',
            type: 'array',
            labels: { singular: 'Passo', plural: 'Passos' },
            minRows: 1,
            maxRows: 6,
            defaultValue: T.fmdca.passos,
            fields: [
              { name: 'titulo', label: 'Passo', type: 'text', required: true, maxLength: 90 },
              { name: 'texto', label: 'Explicação', type: 'textarea', required: true, maxLength: 320 },
            ],
          },
          text('modalidadesTitulo', 'Título dos limites', T.fmdca.modalidadesTitulo, 80),
          {
            name: 'modalidades',
            label: 'Limites de destinação',
            type: 'array',
            labels: { singular: 'Limite', plural: 'Limites' },
            minRows: 1,
            maxRows: 4,
            defaultValue: T.fmdca.modalidades,
            fields: [
              { name: 'limite', label: 'Limite (ex.: 6%)', type: 'text', required: true, maxLength: 8 },
              { name: 'titulo', label: 'Quem e quando', type: 'text', required: true, maxLength: 80 },
              { name: 'texto', label: 'Regra', type: 'textarea', required: true, maxLength: 320 },
            ],
          },
          area('aviso', 'Aviso sobre as regras', T.fmdca.aviso, 320),
          text('simuladorTitulo', 'Título do simulador', T.fmdca.simuladorTitulo, 80),
          area('simuladorTexto', 'Texto do simulador', T.fmdca.simuladorTexto, 320),
          {
            name: 'simuladorPercentual',
            label: 'Percentual usado no simulador',
            type: 'number',
            required: true,
            min: 0,
            max: 6,
            defaultValue: T.fmdca.simuladorPercentual,
          },
          text('bancarioTitulo', 'Título da doação fora da declaração', T.fmdca.bancarioTitulo, 80),
          area('bancarioAviso', 'Aviso enquanto os dados bancários não forem confirmados', T.fmdca.bancarioAviso, 400),
          fontes(T.fmdca.fontes),
        ]),
        tab('conselho', 'O CMDCA', 'Página /conselho. Diretoria e base legal ficam em Configurações institucionais.', [
          text('titulo', 'Título', T.conselho.titulo),
          area('introducao', 'Apresentação', T.conselho.introducao, 400),
          text('composicaoTitulo', 'Título da composição', T.conselho.composicaoTitulo, 80),
          area('composicaoTexto', 'Texto da composição', T.conselho.composicaoTexto),
          text('composicaoLinkRotulo', 'Texto do link da composição', T.conselho.composicaoLinkRotulo, 80),
          {
            name: 'composicaoLinkUrl',
            label: 'Link da composição publicada',
            type: 'text',
            defaultValue: T.conselho.composicaoLinkUrl,
            validate: validateExternalURL,
          },
          text('atribuicoesTitulo', 'Título das atribuições', T.conselho.atribuicoesTitulo, 80),
          {
            name: 'atribuicoes',
            label: 'Atribuições',
            type: 'array',
            labels: { singular: 'Atribuição', plural: 'Atribuições' },
            minRows: 1,
            maxRows: 8,
            defaultValue: T.conselho.atribuicoes,
            fields: [
              { name: 'titulo', label: 'Atribuição', type: 'text', required: true, maxLength: 90 },
              { name: 'texto', label: 'Explicação', type: 'textarea', required: true, maxLength: 320 },
            ],
          },
          fontes(T.conselho.fontes),
        ]),
        tab('participe', 'Participe', 'Página /participe.', [
          text('titulo', 'Título', T.participe.titulo),
          area('introducao', 'Apresentação', T.participe.introducao, 320),
          {
            name: 'caminhos',
            label: 'Formas de participar',
            type: 'array',
            labels: { singular: 'Forma', plural: 'Formas' },
            minRows: 1,
            maxRows: 8,
            defaultValue: T.participe.caminhos,
            fields: [
              { name: 'titulo', label: 'Título', type: 'text', required: true, maxLength: 80 },
              { name: 'texto', label: 'Explicação', type: 'textarea', required: true, maxLength: 240 },
              {
                name: 'href',
                label: 'Destino',
                type: 'text',
                required: true,
                validate: validatePublicHref,
                admin: { description: 'Caminho interno, como /reunioes, ou URL https://.' },
              },
            ],
          },
          text('contatoTitulo', 'Título do quadro de contato', T.participe.contatoTitulo, 80),
        ]),
        tab('transparencia', 'Transparência', 'Página /transparencia.', [
          text('titulo', 'Título', T.transparencia.titulo),
          area('introducao', 'Apresentação', T.transparencia.introducao, 320),
          text('documentosTitulo', 'Título dos documentos do Fundo', T.transparencia.documentosTitulo, 100),
          area('documentosTexto', 'Texto dos documentos do Fundo', T.transparencia.documentosTexto, 400),
          text('vazio', 'Mensagem quando não houver documentos', T.transparencia.vazio, 200),
        ]),
        tab('atos', 'Atos e reuniões', 'Páginas /reunioes, /resolucoes, /editais e /entidades.', [
          text('reunioesTitulo', 'Reuniões: título', T.atos.reunioesTitulo, 80),
          area('reunioesIntro', 'Reuniões: apresentação', T.atos.reunioesIntro, 320),
          area('reunioesComoAcompanhar', 'Reuniões: como acompanhar', T.atos.reunioesComoAcompanhar),
          text('resolucoesTitulo', 'Resoluções: título', T.atos.resolucoesTitulo, 80),
          area('resolucoesIntro', 'Resoluções: apresentação', T.atos.resolucoesIntro, 320),
          text('editaisTitulo', 'Editais: título', T.atos.editaisTitulo, 80),
          area('editaisIntro', 'Editais: apresentação', T.atos.editaisIntro, 320),
          text('entidadesTitulo', 'Entidades: título', T.atos.entidadesTitulo, 80),
          area('entidadesIntro', 'Entidades: apresentação', T.atos.entidadesIntro, 320),
          text('entidadesOrientacaoTitulo', 'Entidades: título da orientação', T.atos.entidadesOrientacaoTitulo, 80),
          area('entidadesOrientacao', 'Entidades: orientação sobre registro', T.atos.entidadesOrientacao, 500),
        ]),
        tab('publicacoes', 'Notícias e conferências', 'Páginas /noticias e /conferencias.', [
          text('noticiasTitulo', 'Notícias: título', T.publicacoes.noticiasTitulo, 80),
          area('noticiasIntro', 'Notícias: apresentação', T.publicacoes.noticiasIntro, 320),
          text('conferenciasTitulo', 'Conferências: título', T.publicacoes.conferenciasTitulo, 80),
          area('conferenciasIntro', 'Conferências: apresentação', T.publicacoes.conferenciasIntro, 320),
          area('conferenciasTexto', 'Conferências: como funcionam', T.publicacoes.conferenciasTexto),
          text('registroTitulo', 'Registro em destaque: título', T.publicacoes.registroTitulo, 80),
          area('registroTexto', 'Registro em destaque: texto', T.publicacoes.registroTexto, 400),
          text('registroRotulo', 'Registro em destaque: texto do link', T.publicacoes.registroRotulo, 80),
          {
            name: 'registroUrl',
            label: 'Registro em destaque: link',
            type: 'text',
            defaultValue: T.publicacoes.registroUrl,
            validate: validateExternalURL,
          },
        ]),
        tab('geral', 'Rodapé e erros', 'Textos do rodapé e da página não encontrada.', [
          area('rodapeDescricao', 'Descrição no rodapé', T.geral.rodapeDescricao, 240),
          text('naoEncontradaTitulo', 'Página não encontrada: título', T.geral.naoEncontradaTitulo, 80),
          area('naoEncontradaTexto', 'Página não encontrada: texto', T.geral.naoEncontradaTexto, 240),
        ]),
      ],
    },
  ],
}
