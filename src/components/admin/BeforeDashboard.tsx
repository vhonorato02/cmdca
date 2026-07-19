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
    description: 'Escreva o texto, confirme a fonte e salve como rascunho.',
  },
  {
    href: '/admin/collections/reunioes/create',
    title: 'Cadastrar reunião',
    description: 'Informe data, horário, acesso, modalidade, local e pauta.',
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
    description: 'Valide documento, prazo, situação e eventuais retificações.',
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
    description: 'Revise contatos, FMDCA e base legal antes de tornar dados públicos.',
    roles: ['admin', 'juridico'],
  },
  {
    href: '/admin/globals/indicadores',
    title: 'Conferir indicadores',
    description: 'Só publique números com período, fonte, método e verificação.',
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
        <div><b>1. Preparar</b><span>Escreva com base em uma fonte identificada.</span></div>
        <div><b>2. Conferir</b><span>Revise datas, nomes, links e anexos.</span></div>
        <div><b>3. Revisar</b><span>O jurídico registra a decisão de publicação.</span></div>
        <div><b>4. Publicar</b><span>Confira a prévia antes de liberar ao público.</span></div>
      </div>

      <p className="cmdca-dashboard__notice" role="note">
        {canPublish
          ? 'Antes de publicar, confira fonte, data de verificação, status jurídico e prévia. Marcadores como “a confirmar” e “texto de teste” bloqueiam a publicação.'
          : 'Seu acesso cria rascunhos. Quando terminar, registre a fonte, confira a prévia e encaminhe para a revisão jurídica. Publicar e excluir permanecem bloqueados.'}
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
