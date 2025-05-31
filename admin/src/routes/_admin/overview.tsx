import { createFileRoute } from '@tanstack/react-router'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '@/components/section-cards'

export const Route = createFileRoute('/_admin/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      {/* <SectionCards /> */}
      <div className="px-4 lg:px-6">
        {/* <ChartAreaInteractive /> */}
      </div>
      {/* <DataTable data={data} /> */}
    </>
  )
}
