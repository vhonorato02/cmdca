import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

const CONFIRMAR = '[A CONFIRMAR]'

export const Configuracoes: GlobalConfig = {
  slug: 'configuracoes',
  label: 'Configurações',
  admin: {
    group: 'Configuração',
    description:
      'Contatos, redes, parâmetros do FMDCA e base legal. Visível somente a administradores.',
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== 'admin',
  },
  versions: true,
  hooks: revalidateGlobal(['/']),
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'nomeConselho', label: 'Nome do conselho', type: 'text', defaultValue: 'CMDCA Pindamonhangaba' },
    { name: 'municipio', label: 'Município', type: 'text', defaultValue: 'Pindamonhangaba/SP' },
    {
      name: 'diretoria',
      label: 'Diretoria',
      type: 'group',
      fields: [
        { name: 'gestaoLabel', label: 'Gestão (rótulo)', type: 'text', defaultValue: 'Gestão 2025–2027' },
        { name: 'presidenteNome', label: 'Presidente', type: 'text', defaultValue: 'Dr. Rodolfo Brockhof' },
        { name: 'presidenteCargo', label: 'Cargo (presidência)', type: 'text', defaultValue: 'Presidente' },
        { name: 'viceNome', label: 'Vice-presidente', type: 'text', defaultValue: 'Andrea Campos Sales Martins' },
        { name: 'viceCargo', label: 'Cargo (vice)', type: 'text', defaultValue: 'Vice-presidente' },
      ],
    },
    {
      name: 'contato',
      label: 'Contato',
      type: 'group',
      fields: [
        { name: 'email', label: 'E-mail oficial', type: 'text', defaultValue: 'cmdca@pindamonhangaba.sp.gov.br' },
        { name: 'telefone', label: 'Telefone/Fax', type: 'text', defaultValue: '(12) 3642-1249' },
        { name: 'cep', label: 'CEP', type: 'text', defaultValue: '12420-070' },
        {
          name: 'casaConselhosTelefone',
          label: 'Telefone da Casa dos Conselhos',
          type: 'text',
          defaultValue: '(12) 3643-1607 / 3643-1609',
        },
        {
          name: 'casaConselhosEndereco',
          label: 'Endereço da Casa dos Conselhos',
          type: 'textarea',
          defaultValue: `${CONFIRMAR} — endereço exato da Casa dos Conselhos`,
        },
        { name: 'assessora', label: 'Assessora responsável', type: 'text', defaultValue: 'Simone Braça' },
      ],
    },
    {
      name: 'redes',
      label: 'Redes sociais',
      type: 'group',
      fields: [
        { name: 'instagramHandle', label: 'Instagram (@)', type: 'text', defaultValue: '@cmdca_pindamonhangaba' },
        {
          name: 'instagramUrl',
          label: 'Instagram (URL)',
          type: 'text',
          defaultValue: 'https://www.instagram.com/cmdca_pindamonhangaba',
        },
      ],
    },
    {
      name: 'fmdca',
      label: 'FMDCA',
      type: 'group',
      fields: [
        { name: 'cnpj', label: 'CNPJ do FMDCA', type: 'text', defaultValue: CONFIRMAR },
        { name: 'conta', label: 'Conta bancária', type: 'text', defaultValue: CONFIRMAR },
        {
          name: 'percentualDeducaoIR',
          label: 'Percentual dedutível do IR (%)',
          type: 'number',
          defaultValue: 6,
          admin: {
            description:
              'Percentual ILUSTRATIVO usado no simulador. Confirme os limites legais com seu contador.',
          },
        },
        {
          name: 'comoDestinar',
          label: 'Como destinar (texto)',
          type: 'textarea',
          defaultValue:
            'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.',
        },
      ],
    },
    {
      name: 'baseLegal',
      label: 'Base legal',
      type: 'group',
      fields: [
        { name: 'leiCMDCA', label: 'Lei municipal do CMDCA (nº/ano)', type: 'text', defaultValue: CONFIRMAR },
        { name: 'leiFMDCA', label: 'Lei municipal do FMDCA (nº/ano)', type: 'text', defaultValue: CONFIRMAR },
        { name: 'regimento', label: 'Regimento interno', type: 'text', defaultValue: CONFIRMAR },
      ],
    },
    {
      name: 'tribunaUrl',
      label: 'Tribuna do Norte (URL)',
      type: 'text',
      defaultValue: 'https://www.jornaltribunadonorte.com.br',
      admin: { description: 'Onde os atos oficiais do conselho são publicados.' },
    },
  ],
}
