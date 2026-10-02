'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

/**
 * Payload labels point to an id that the date picker and select inputs do not
 * carry, so screen readers announce those inputs without a name. Copy the
 * visible label text to the input when no association exists.
 */
function nameUnlabelledInputs() {
  document.querySelectorAll<HTMLLabelElement>('.field-type label.field-label').forEach((label) => {
    // Payload puts the label target id on a wrapper div for date fields.
    const target = label.htmlFor ? document.getElementById(label.htmlFor) : null
    if (target?.matches('input, select, textarea, button')) return
    const field = label.closest('.field-type')
    const input = field?.querySelector<HTMLInputElement>(
      'input:not([type="hidden"]):not([aria-labelledby]):not([aria-label]), input[data-cmdca-label]',
    )
    if (!input || input.labels?.length || input.closest('.field-type') !== field) return
    const text = label.textContent?.replace(/\*/g, '').trim()
    // The marker lets reordered array rows receive their new label.
    if (text && input.getAttribute('aria-label') !== text) {
      input.setAttribute('aria-label', text)
      input.setAttribute('data-cmdca-label', '')
    }
  })
  // Payload renders the document "more options" trigger with three empty divs.
  document
    .querySelectorAll<HTMLButtonElement>('button.popup-button:not([aria-label])')
    .forEach((button) => {
      if (!button.textContent?.trim()) button.setAttribute('aria-label', 'Mais opções')
    })
  // Group labels are h3 directly under the document h1; expose them as level 2.
  document.querySelectorAll('h3.group-field__title:not([aria-level])').forEach((heading) => {
    heading.setAttribute('aria-level', '2')
  })
  // Autosave creates the draft before it has a title, and Payload then shows the
  // numeric ID as the page heading. Show an explicit placeholder in a node we own.
  document.querySelectorAll('h1.render-title').forEach((heading) => {
    const placeholder = heading.querySelector(':scope > .cmdca-untitled')
    if (heading.classList.contains('render-title--has-id')) {
      if (!placeholder) {
        const span = document.createElement('span')
        span.className = 'cmdca-untitled'
        span.textContent = '[Sem título]'
        heading.append(span)
      }
    } else {
      placeholder?.remove()
    }
  })
}

/**
 * Acrescenta o landmark principal que o shell do Payload não fornece.
 * A tela de login também precisa de um h1; nas demais rotas, cada view
 * administrativa continua responsável pelo próprio título.
 */
export default function AdminA11yProvider({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname.endsWith('/login')

  useEffect(() => {
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(nameUnlabelledInputs)
    }
    schedule()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="cmdca-admin-main">
      {isLogin ? <h1 className="cmdca-admin-sr-only">Painel administrativo do CMDCA</h1> : null}
      {children}
    </main>
  )
}
