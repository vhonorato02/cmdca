import { ListPageSkeleton } from '@/components/ui/states'

// Só nesta rota: ela nunca responde 404, então o streaming não troca o status HTTP.
export default function Loading() {
  return <ListPageSkeleton label="Carregando as resoluções…" />
}
