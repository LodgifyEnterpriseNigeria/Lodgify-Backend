import { createFileRoute } from '@tanstack/react-router'
import { OverviewCards } from '@/components/contents/overview/cards'

export const Route = createFileRoute('/_admin/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <OverviewCards/>
    </>
  )
}
