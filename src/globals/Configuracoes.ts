import type { FieldAccess, GlobalConfig } from 'payload'

import { canManageContent, isAuthenticated, publishedOrLoggedIn, roleOf } from '../access'
import {
  EDITORIAL_VERSIONS,
  GLOBAL_EDITORIAL_COMPONENTS,
  editorialControlField,
} from '../fields/editorial'
import { validateGlobalPublication } from '../hooks/editorialPolicy'
import { CONFIGURACOES_PADRAO } from '../content/defaults'
import { validateEmail, validateExternalURL } from '../utilities/validation'
import { revalidateNavigation } from './Navegacao'

const readConfirmedBankData: FieldAccess = ({ doc, req }) =>
  Boolean(roleOf(req.user)) ||
  Boolean((doc as { fmdca?: { dadosBancariosConfirmados?: boolean } } | undefined)?.fmdca?.dadosBancariosConfirmados)

// Contatos e base legal aparecem no rodapé: a publicação revalida o site inteiro.

export const Configuracoes: GlobalConfig = {
  slug: 'configuracoes',
  label: 'Configurações institucionais',
  admin: {
    group: 'Configuração',
    description:
      'Dados institucionais e legais. Alterações são salvas como rascunho e só entram no site depois da publicação.',
    components: GLOBAL_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  hooks: {
    beforeChange: [
      validateGlobalPublication([
        { path: 'nomeConselho', label: 'nome do conselho' },
        { path: 'municipio', label: 'município' },
        { path: 'contato.email', label: 'e-mail oficial' },
        { path: 'baseLegal.leiCMDCA', label: 'Lei Municipal nº 2.626/1991', rejectPlaceholder: true },
        { path: 'baseLegal.leiFMDCA', label: 'Lei Municipal nº 4.140/2004', rejectPlaceholder: true },
        { path: 'controleEditorial.fonte', label: 'fonte oficial', rejectPlaceholder: true },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
      ]),
    ],
    afterChange: [revalidateNavigation],
  },
  access: {
    read: publishedOrLoggedIn,
    readVersions: isAuthenticated,
    // Editor geral resolve as pendências (XXXX) daqui; usuários seguem só com o administrador.
    update: canManageContent,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'nomeConselho',
          label: 'Nome do conselho',
          type: 'text',
          required: true,
          defaultValue: 'CMDCA Pindamonhangaba',
          admin: { width: '50%' },
        },
        {
          name: 'municipio',
          label: 'Município',
          type: 'text',
          required: true,
          defaultValue: 'Pindamonhangaba/SP',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'diretoria',
      label: 'Diretoria',
      type: 'group',
      fields: [
        { name: 'gestaoLabel', label: 'Gestão', type: 'text', defaultValue: 'Gestão 2025–2027' },
        { name: 'presidenteNome', label: 'Presidente', type: 'text' },
        { name: 'presidenteCargo', label: 'Cargo da presidência', type: 'text', defaultValue: 'Presidente' },
        { name: 'viceNome', label: 'Vice-presidente', type: 'text' },
        { name: 'viceCargo', label: 'Cargo da vice-presidência', type: 'text', defaultValue: 'Vice-presidente' },
      ],
    },
    {
      name: 'contato',
      label: 'Contato',
      type: 'group',
      fields: [
        {
          name: 'email',
          label: 'E-mail oficial',
          type: 'email',
          required: true,
          defaultValue: 'cmdca@pindamonhangaba.sp.gov.br',
          validate: validateEmail,
        },
        { name: 'telefone', label: 'Telefone/Fax', type: 'text' },
        {
          name: 'endereco',
          label: 'Endereço de atendimento do CMDCA',
          type: 'textarea',
          defaultValue: CONFIGURACOES_PADRAO.contato.endereco,
          admin: { description: 'Use XXXX enquanto não houver confirmação oficial. O site não exibe XXXX.' },
        },
        {
          name: 'horario',
          label: 'Horário de atendimento',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.contato.horario,
          admin: { description: 'Ex.: segunda a sexta, das 8h às 17h. Use XXXX enquanto não for confirmado.' },
        },
        { name: 'cep', label: 'CEP', type: 'text' },
        { name: 'casaConselhosTelefone', label: 'Telefone da Casa dos Conselhos', type: 'text' },
        { name: 'casaConselhosEndereco', label: 'Endereço da Casa dos Conselhos', type: 'textarea' },
        { name: 'assessora', label: 'Assessoria responsável', type: 'text' },
      ],
    },
    {
      name: 'redes',
      label: 'Redes sociais',
      type: 'group',
      fields: [
        { name: 'instagramHandle', label: 'Instagram (@)', type: 'text' },
        {
          name: 'instagramUrl',
          label: 'Instagram (URL)',
          type: 'text',
          validate: validateExternalURL,
        },
      ],
    },
    {
      name: 'fmdca',
      label: 'FMDCA',
      type: 'group',
      admin: {
        description: 'Dados bancários ficam ocultos da API pública enquanto não forem confirmados.',
      },
      fields: [
        {
          name: 'dadosBancariosConfirmados',
          label: 'Dados bancários conferidos e autorizados para publicação',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'cnpj',
          label: 'CNPJ do FMDCA',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.fmdca.cnpj,
          access: { read: readConfirmedBankData },
        },
        {
          name: 'conta',
          label: 'Banco, agência e conta do FMDCA',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.fmdca.conta,
          access: { read: readConfirmedBankData },
          admin: { description: 'Ex.: Banco do Brasil, agência 0000-0, conta 00000-0. Use XXXX até haver ato oficial.' },
        },
        {
          name: 'percentualDeducaoIR',
          label: 'Limite informado no simulador (%)',
          type: 'number',
          min: 0,
          max: 6,
          defaultValue: 6,
          admin: { description: 'Confirme a regra aplicável e a data de verificação antes de publicar.' },
        },
        { name: 'comoDestinar', label: 'Como destinar', type: 'textarea' },
      ],
    },
    {
      name: 'lgpd',
      label: 'Proteção de dados (LGPD)',
      type: 'group',
      admin: { description: 'Exibido no quadro de contato do aviso de privacidade.' },
      fields: [
        {
          name: 'controlador',
          label: 'Controlador dos dados',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.lgpd.controlador,
        },
        {
          name: 'encarregado',
          label: 'Encarregado de dados (nome ou cargo)',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.lgpd.encarregado,
          admin: { description: 'Confirme com a Prefeitura. Use XXXX até a confirmação formal.' },
        },
        {
          name: 'encarregadoContato',
          label: 'Contato do encarregado (e-mail ou link)',
          type: 'text',
          defaultValue: CONFIGURACOES_PADRAO.lgpd.encarregadoContato,
        },
      ],
    },
    {
      name: 'baseLegal',
      label: 'Base legal confirmada',
      type: 'group',
      fields: [
        {
          name: 'leiCMDCA',
          label: 'Lei municipal do CMDCA',
          type: 'text',
          required: true,
          defaultValue: 'Lei Municipal nº 2.626, de 19/12/1991',
        },
        {
          name: 'leiFMDCA',
          label: 'Lei municipal do FMDCA',
          type: 'text',
          required: true,
          defaultValue: 'Lei Municipal nº 4.140, de 23/03/2004',
        },
        { name: 'regimento', label: 'Regimento interno', type: 'text' },
      ],
    },
    {
      name: 'tribunaUrl',
      label: 'Tribuna do Norte (URL)',
      type: 'text',
      defaultValue: 'https://www.jornaltribunadonorte.com.br',
      validate: validateExternalURL,
      admin: { description: 'Endereço usado para consultar publicações oficiais.' },
    },
    editorialControlField(),
  ],
}
