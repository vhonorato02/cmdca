'use client'

import { PublishButton, useAuth } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export default function RoleAwarePublishButton(props: PublishButtonClientProps) {
  const { user } = useAuth()
  const role = (user as { role?: string } | null)?.role
  if (role !== 'admin' && role !== 'juridico') return null
  return <PublishButton {...props} />
}
