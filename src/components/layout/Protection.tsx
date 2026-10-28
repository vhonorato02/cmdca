import { Fragment, type CSSProperties } from 'react'

import { Phone } from '@/components/ui/icons'
import type { Canal } from '@/lib/content'

import { A11yTools } from './A11yTools'

/** Os canais da faixa: até três marcados no CMS, sempre com número discável. */
export function canaisDaFaixa(canais: Canal[]): Canal[] {
  return canais.filter((canal) => canal.naFaixa && canal.href).slice(0, 3)
}

/** Complemento lido por leitores de tela depois do texto visível do canal. */
const callHint = (canal: Canal) => `: ligar${canal.observacao ? `. ${canal.observacao}` : ''}`

/**
 * Faixa anil do topo (assinatura 1). No computador mostra os telefones de
 * proteção; no celular, eles ficam na barra fixa inferior.
 */
export function ProtectionBar({ chamada, canais }: { chamada: string; canais: Canal[] }) {
  return (
    <aside className="protection-bar" aria-label="Proteção e acessibilidade">
      <div className="wrap protection-bar__inner">
        <p className="protection-bar__label">{chamada}</p>
        <ul className="protection-bar__channels" aria-label="Telefones de proteção">
          {canais.map((canal) => (
            <li key={`${canal.tipo}-${canal.numero}`}>
              <a className="channel-link" href={canal.href}>
                <Phone className="channel-link__icon" />
                <span className="channel-link__label">{canal.rotulo}</span>{' '}
                <span className="channel-link__number">{canal.numero}</span>
                <span className="sr-only">{callHint(canal)}</span>
              </a>
            </li>
          ))}
        </ul>
        <A11yTools />
      </div>
    </aside>
  )
}

/** Barra fixa do celular: cada canal a um toque. */
export function ProtectionDock({ canais }: { canais: Canal[] }) {
  if (!canais.length) return null
  return (
    <nav
      className="protection-dock"
      aria-label="Ligar para um canal de proteção"
      style={{ '--dock-cols': canais.length } as CSSProperties}
    >
      {canais.map((canal) => (
        <a
          key={`${canal.tipo}-${canal.numero}`}
          className={`dock-link dock-link--${canal.tipo}`}
          href={canal.href}
        >
          <span className="dock-link__number">
            {/* Quebra só entre as partes ("(12)" e "3550-0513"), nunca no hífen. */}
            {canal.numero.split(' ').map((parte, index) => (
              <Fragment key={index}>
                {index > 0 && ' '}
                <span>{parte}</span>
              </Fragment>
            ))}
          </span>{' '}
          <span className="dock-link__label">{canal.rotulo}</span>
          <span className="sr-only">{callHint(canal)}</span>
        </a>
      ))}
    </nav>
  )
}
