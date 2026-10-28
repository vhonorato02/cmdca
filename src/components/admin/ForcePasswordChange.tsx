'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

const MIN = 10

type Account = { id?: number | string; email?: string; trocarSenha?: boolean | null }

/**
 * Bloqueia o painel até a pessoa criar a própria senha quando a conta está com
 * "Trocar a senha no próximo acesso". O servidor também recusa qualquer escrita
 * nesse estado (src/security/passwordGate.ts); esta tela só mostra o caminho.
 */
export default function ForcePasswordChange({ children }: { children?: ReactNode }) {
  const { user, fetchFullUser, logOut } = useAuth<Account>()
  const router = useRouter()
  const id = useId()
  const first = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const blocked = Boolean(user?.trocarSenha)

  useEffect(() => {
    if (blocked) first.current?.focus()
  }, [blocked])

  if (!blocked || !user?.id) return <>{children}</>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (password.length < MIN) return setError(`Use pelo menos ${MIN} caracteres.`)
    if (password !== confirm) return setError('As duas senhas não são iguais.')
    setSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { errors?: { message?: string }[] } | null
        throw new Error(body?.errors?.[0]?.message || 'Não foi possível salvar a senha. Tente de novo.')
      }
      const fresh = await fetchFullUser()
      if (!fresh) {
        router.push('/admin/login')
        return
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a senha. Tente de novo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="cmdca-pw" aria-hidden="true" inert>
        {children}
      </div>
      <div className="cmdca-pw__backdrop">
        <form
          className="cmdca-pw__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-t`}
          aria-describedby={`${id}-d`}
          onSubmit={submit}
          noValidate
        >
          <h1 id={`${id}-t`}>Crie a sua senha</h1>
          <p id={`${id}-d`}>
            Esta conta ainda usa uma senha provisória. Escolha uma senha só sua, com pelo menos {MIN}{' '}
            caracteres. Depois disso o painel abre normalmente.
          </p>
          {user.email ? (
            <p className="cmdca-pw__account">
              Conta: <b>{user.email}</b>
            </p>
          ) : null}
          <label htmlFor={`${id}-p`}>Nova senha</label>
          <input
            ref={first}
            id={`${id}-p`}
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            minLength={MIN}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor={`${id}-c`}>Repita a nova senha</label>
          <input
            id={`${id}-c`}
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            minLength={MIN}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <label className="cmdca-pw__show">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Mostrar as senhas
          </label>
          {error ? (
            <p className="cmdca-pw__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="cmdca-pw__actions">
            <button type="submit" className="btn btn--style-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar e entrar no painel'}
            </button>
            <button type="button" className="btn btn--style-secondary" onClick={() => void logOut()}>
              Sair
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
