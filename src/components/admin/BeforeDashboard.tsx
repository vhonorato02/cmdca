import Link from 'next/link'
import type { Payload } from 'payload'
import React from 'react'

import { listPendencias } from '@/lib/pendencias'

type Role = 'admin' | 'editor' | 'juridico'
type Shortcut = { href: string; title: string; description: string; restrito?: boolean }

const shortcuts: Shortcut[] = [
  {
    href: '/admin/collections/noticias/create',
    title: 'Escrever notícia',
    description: 'Texto, fonte e data. Salve como rascunho e veja a prévia antes de publicar.',
  },
  {
    href: '/admin/collections/reunioes/create',
    title: 'Marcar reunião',
    description: 'Data, horário, acesso, local e pauta.',
  },
  {
    href: '/admin/collections/resolucoes',
    title: 'Publicar resolução',
    description: 'Número, data, PDF e situação.',
  },
  {
    href: '/admin/collections/editais',
    title: 'Publicar edital',
    description: 'Documento, prazo, situação e retificações.',
  },
  {
    href: '/admin/globals/textos',
    title: 'Textos das páginas',
    description: 'Telefones de proteção, passo a passo do IR e apresentações.',
  },
  {
    href: '/admin/globals/configuracoes',
    title: 'Dados institucionais',
    description: 'Contatos, Fundo, LGPD e base legal.',
    restrito: true,
  },
]

/**
 * Topo do painel: atalhos por tarefa e a lista de pendências (dados ainda em
 * XXXX), para quem cuida do conteúdo saber o que falta confirmar.
 */
export default async function BeforeDashboard({
  payload,
  user,
}: {
  payload: Payload
  user?: { role?: Role } | null
}) {
  const role: Role = user?.role ?? 'editor'
  const canSeeRestricted = role === 'admin' || role === 'juridico'
  const pendencias = await listPendencias(payload)
  const visibleShortcuts = shortcuts.filter((s) => !s.restrito || canSeeRestricted)

  return (
    <section className="cmdca-dashboard" aria-labelledby="cmdca-dashboard-title">
      <div className="cmdca-dashboard__header">
        <div>
          <p className="cmdca-dashboard__eyebrow">Painel do portal</p>
          <h1 id="cmdca-dashboard-title">CMDCA Pindamonhangaba</h1>
        </div>
        <span className={`cmdca-dashboard__role cmdca-dashboard__role--${role}`}>
          {role === 'admin' ? 'Administração' : role === 'juridico' ? 'Jurídico' : 'Edição'}
        </span>
      </div>

      <ol className="cmdca-workflow" aria-label="Como publicar">
        <li>
          <b>Escreva</b>
          <span>Salve como rascunho quantas vezes quiser.</span>
        </li>
        <li>
          <b>Confira</b>
          <span>Use a prévia para ver como fica no site.</span>
        </li>
        <li>
          <b>Publique</b>
          <span>O site atualiza em poucos minutos.</span>
        </li>
      </ol>

      <div
        className={`cmdca-pending ${pendencias.length ? 'cmdca-pending--open' : 'cmdca-pending--done'}`}
        role="region"
        aria-labelledby="cmdca-pending-title"
      >
        <h2 id="cmdca-pending-title">
          {pendencias.length
            ? `${pendencias.length} ${pendencias.length === 1 ? 'dado aguarda' : 'dados aguardam'} confirmação`
            : 'Nenhum dado aguardando confirmação'}
        </h2>
        {pendencias.length ? (
          <>
            <p>
              Estes campos estão como <code>XXXX</code> ou sem conferência e não aparecem no site.
              Substitua pelo dado oficial e publique.
            </p>
            <ul>
              {pendencias.map((p, index) => (
                <li key={`${p.href}-${p.item}-${index}`}>
                  <span className="cmdca-pending__area">{p.area}</span>
                  {p.restrito && !canSeeRestricted ? (
                    <span>
                      {p.item} <em>(peça à administração)</em>
                    </span>
                  ) : (
                    <Link href={p.href}>{p.item}</Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

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
