'use client'

import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export default function RoleAwarePublishButton(props: PublishButtonClientProps) {
  return <PublishButton {...props} />
}
