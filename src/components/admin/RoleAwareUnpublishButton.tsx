'use client'

import { UnpublishButton } from '@payloadcms/ui'
import type { UnpublishButtonClientProps } from 'payload'

export default function RoleAwareUnpublishButton(props: UnpublishButtonClientProps) {
  return <UnpublishButton {...props} />
}
