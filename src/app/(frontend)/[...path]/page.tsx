import { notFound } from 'next/navigation'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Página não encontrada | CMDCA de Pindamonhangaba',
  description: 'O endereço solicitado não foi encontrado. Acesse o início ou o mapa do site.',
  path: '/404',
  noIndex: true,
})

export default function UnmatchedPage() {
  notFound()
}
