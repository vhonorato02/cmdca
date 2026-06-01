import Image from 'next/image'
import React from 'react'

/**
 * Logo do CMDCA na tela de login do painel (substitui a marca do Payload).
 * Usa o logo institucional servido de /public/brand (liberado em next.config localPatterns).
 */
export default function AdminLogo() {
  return (
    <Image
      src="/brand/logo-cmdca.jpg"
      alt="CMDCA Pindamonhangaba"
      width={260}
      height={62}
      priority
      style={{ height: 'auto', width: 'auto', maxWidth: 260 }}
    />
  )
}
