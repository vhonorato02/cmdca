'use client'

import { UnpublishButton, useAuth } from '@payloadcms/ui'
import type { UnpublishButtonClientProps } from 'payload'

export default function RoleAwareUnpublishButton(props: UnpublishButtonClientProps) {
  const { user } = useAuth()
  const role = (user as { role?: string } | null)?.role
  if (role !== 'admin' && role !== 'juridico') return null
  return <UnpublishButton {...props} />
}
