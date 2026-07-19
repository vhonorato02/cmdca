import type { FieldAccess, GlobalConfig } from 'payload'

import { isAdminOrJuridico, publishedOrLoggedIn } from '../access'
import {
  EDITORIAL_VERSIONS,
  GLOBAL_EDITORIAL_COMPONENTS,
  editorialControlField,
} from '../fields/editorial'
import { validateGlobalPublication } from '../hooks/editorialPolicy'
import { revalidateGlobal } from '../hooks/revalidate'
import { validateEmail, validateExternalURL } from '../utilities/validation'

const readConfirmedBankData: FieldAccess = ({ doc, req }) =>
  Boolean(req.user) ||
  Boolean((doc as { fmdca?: { dadosBancariosConfirmados?: boolean } } | undefined)?.fmdca?.dadosBancariosConfirmados)

const revalidation = revalidateGlobal([
  '/',
  '/conselho',
  '/transparencia',
  '/resolucoes',
  '/editais',
  '/fmdca',
  '/participe',
  '/acessibilidade',
  '/privacidade',
])

export const Configuracoes: GlobalConfig = {
  slug: 'configuracoes',
  label: 'Configurações institucionais',
  admin: {
    group: 'Configuração',
    description:
      'Dados institucionais e legais. Alterações são salvas como rascunho e só entram no site depois da publicação.',
    hidden: ({ user }) => !['admin', 'juridico'].includes((user as { role?: string } | null)?.role ?? ''),
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
        {
          path: 'controleEditorial.statusRevisao',
          label: 'aprovação jurídica',
          validate: (value) => value === 'aprovada',
        },
      ]),
    ],
    ...revalidation,
  },
  access: { read: publishedOrLoggedIn, update: isAdminOrJuridico },
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
        { name: 'cnpj', label: 'CNPJ do FMDCA', type: 'text', access: { read: readConfirmedBankData } },
        { name: 'conta', label: 'Conta bancária', type: 'text', access: { read: readConfirmedBankData } },
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
