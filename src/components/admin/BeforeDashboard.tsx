'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

type Role = 'admin' | 'editor' | 'juridico'
type Shortcut = { href: string; title: string; description: string }

const shortcuts: Shortcut[] = [
  {
    href: '/admin/collections/noticias/create',
    title: 'Preparar notícia',
    description: 'Escreva o texto, confirme a fonte e salve como rascunho.',
  },
  {
    href: '/admin/collections/reunioes/create',
    title: 'Cadastrar reunião',
    description: 'Informe data, horário, acesso, modalidade, local e pauta.',
  },
  {
    href: '/admin/collections/resolucoes',
    title: 'Gerenciar resoluções',
    description: 'Confira número, data, PDF e situação antes de publicar.',
  },
  {
    href: '/admin/collections/editais',
    title: 'Gerenciar editais',
    description: 'Valide documento, prazo, situação e eventuais retificações.',
  },
  {
    href: '/admin/collections/rede-protecao',
    title: 'Atualizar rede de proteção',
    description: 'Confirme contatos, endereço, horário e fonte oficial.',
  },
  {
    href: '/admin/globals/configuracoes',
    title: 'Dados institucionais',
    description: 'Atualize contatos, FMDCA e base legal quando necessário.',
  },
  {
    href: '/admin/globals/indicadores',
    title: 'Atualizar indicadores',
    description: 'Registre período, fonte e método quando essas informações estiverem disponíveis.',
  },
]

export default function BeforeDashboard() {
  const { user } = useAuth()
  const role = ((user as { role?: Role } | null)?.role ?? 'editor') as Role
  const visibleShortcuts = shortcuts

  return (
    <section className="cmdca-dashboard" aria-labelledby="cmdca-dashboard-title">
      <div className="cmdca-dashboard__header">
        <div>
          <span className="cmdca-dashboard__eyebrow">Painel de conteúdo</span>
          <h2 id="cmdca-dashboard-title">CMDCA Pindamonhangaba</h2>
        </div>
        <span className={`cmdca-dashboard__role cmdca-dashboard__role--${role}`}>
          {role === 'admin' ? 'Administração' : role === 'juridico' ? 'Conteúdo jurídico' : 'Editor'}
        </span>
      </div>

      <div className="cmdca-workflow" aria-label="Fluxo editorial">
        <div><b>1. Criar</b><span>Escreva ou atualize o conteúdo.</span></div>
        <div><b>2. Conferir</b><span>Use a prévia para verificar a apresentação.</span></div>
        <div><b>3. Publicar</b><span>Quem edita decide quando liberar ao público.</span></div>
      </div>

      <p className="cmdca-dashboard__notice" role="note">
        Você pode salvar rascunhos ou publicar diretamente. Os campos de fonte e conferência são opcionais e não bloqueiam a publicação.
      </p>

      <nav className="cmdca-shortcuts" aria-label="Atalhos do painel">
        {visibleShortcuts.map((shortcut) => (
          <Link className="cmdca-shortcut" key={shortcut.href} href={shortcut.href}>
            <strong>{shortcut.title}</strong>
            <span>{shortcut.description}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
