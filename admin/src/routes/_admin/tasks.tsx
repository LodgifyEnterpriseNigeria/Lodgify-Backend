import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/tasks"!</div>
}
