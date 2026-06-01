import Link from 'next/link'
import React from 'react'

/**
 * Painel de boas-vindas exibido no topo do dashboard do Payload.
 * Atalhos para as tarefas mais comuns da coordenação/comunicação.
 * Todos os destinos são acessíveis tanto a Administrador quanto a Editor.
 */

type Atalho = { href: string; titulo: string; desc: string }

const atalhos: Atalho[] = [
  {
    href: '/admin/collections/noticias/create',
    titulo: 'Criar notícia',
    desc: 'Escrever e publicar uma nova notícia.',
  },
  {
    href: '/admin/collections/reunioes/create',
    titulo: 'Cadastrar reunião',
    desc: 'Nova reunião com pauta e ata em PDF.',
  },
  {
    href: '/admin/collections/resolucoes/create',
    titulo: 'Enviar resolução',
    desc: 'Adicionar uma resolução do colegiado.',
  },
  {
    href: '/admin/collections/editais/create',
    titulo: 'Publicar edital',
    desc: 'Novo edital ou chamamento público.',
  },
  {
    href: '/admin/collections/rede-protecao',
    titulo: 'Rede de proteção',
    desc: 'Conselhos Tutelares, CRAS e CREAS do mapa.',
  },
  {
    href: '/admin/globals/indicadores',
    titulo: 'Editar indicadores',
    desc: 'Números e gráficos da página inicial.',
  },
]

export default function BeforeDashboard() {
  return (
    <section
      aria-label="Boas-vindas e atalhos"
      style={{
        marginBottom: 'var(--base, 1.5rem)',
        padding: '1.25rem 1.5rem',
        borderRadius: 8,
        border: '1px solid var(--theme-elevation-100)',
        borderLeft: '4px solid #C9A227',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>
        Bem-vindo(a) ao painel do CMDCA Pindamonhangaba
      </h2>
      <p style={{ margin: '0 0 1rem', color: 'var(--theme-elevation-650)', maxWidth: '60ch' }}>
        Use os atalhos abaixo para as tarefas mais comuns. Salve como{' '}
        <strong>rascunho</strong> enquanto revisa — o site público mostra apenas o que está{' '}
        <strong>publicado</strong>. Há histórico e possibilidade de reverter cada documento.
      </p>
      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
      >
        {atalhos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              borderRadius: 6,
              border: '1px solid var(--theme-elevation-100)',
              background: 'var(--theme-elevation-0)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <strong style={{ display: 'block', marginBottom: 2 }}>{a.titulo}</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--theme-elevation-650)' }}>{a.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
