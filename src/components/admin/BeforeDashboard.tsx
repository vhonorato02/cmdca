'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

type Role = 'admin' | 'editor' | 'juridico'
type Shortcut = { href: string; title: string; description: string; roles?: Role[] }

const shortcuts: Shortcut[] = [
  {
    href: '/admin/collections/noticias/create',
    title: 'Preparar notícia',
    description: 'Crie o texto, indique a fonte e salve como rascunho.',
  },
  {
    href: '/admin/collections/reunioes/create',
    title: 'Cadastrar reunião',
    description: 'Informe natureza, acesso, horário, modalidade e pauta.',
  },
  {
    href: '/admin/collections/resolucoes',
    title: 'Revisar resoluções',
    description: 'Confira número, data, PDF, situação e revisão jurídica.',
    roles: ['admin', 'juridico'],
  },
  {
    href: '/admin/collections/editais',
    title: 'Revisar editais',
    description: 'Valide arquivo, prazo, situação e eventual retificação.',
    roles: ['admin', 'juridico'],
  },
  {
    href: '/admin/collections/rede-protecao',
    title: 'Atualizar rede de proteção',
    description: 'Confirme contatos, endereço, horário e fonte oficial.',
  },
  {
    href: '/admin/globals/configuracoes',
    title: 'Dados institucionais',
    description: 'Revise contatos, FMDCA e base legal antes de publicar.',
    roles: ['admin', 'juridico'],
  },
  {
    href: '/admin/globals/indicadores',
    title: 'Conferir indicadores',
    description: 'Só libere números com período, fonte e verificação.',
    roles: ['admin', 'juridico'],
  },
]

export default function BeforeDashboard() {
  const { user } = useAuth()
  const role = ((user as { role?: Role } | null)?.role ?? 'editor') as Role
  const canPublish = role === 'admin' || role === 'juridico'
  const visibleShortcuts = shortcuts.filter((shortcut) => !shortcut.roles || shortcut.roles.includes(role))

  return (
    <section className="cmdca-dashboard" aria-labelledby="cmdca-dashboard-title">
      <div className="cmdca-dashboard__header">
        <div>
          <span className="cmdca-dashboard__eyebrow">Painel editorial seguro</span>
          <h2 id="cmdca-dashboard-title">CMDCA Pindamonhangaba</h2>
        </div>
        <span className={`cmdca-dashboard__role cmdca-dashboard__role--${role}`}>
          {role === 'admin' ? 'Administração' : role === 'juridico' ? 'Revisão jurídica' : 'Editor de rascunhos'}
        </span>
      </div>

      <div className="cmdca-workflow" aria-label="Fluxo editorial">
        <div><b>1. Preparar</b><span>Preencha conteúdo e fonte.</span></div>
        <div><b>2. Conferir</b><span>Elimine pendências e anexos errados.</span></div>
        <div><b>3. Revisar</b><span>Jurídico registra a aprovação.</span></div>
        <div><b>4. Publicar</b><span>Somente após a conferência final.</span></div>
      </div>

      <p className="cmdca-dashboard__notice" role="note">
        {canPublish
          ? 'Antes de publicar, confira a fonte, a data de verificação e a prévia. Campos marcados como pendentes bloqueiam a publicação.'
          : 'Seu acesso prepara rascunhos. Quando terminar, registre a fonte e avise o jurídico; publicar e excluir ficam bloqueados para editores.'}
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
