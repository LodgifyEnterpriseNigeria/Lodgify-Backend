import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/blocks/header'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_admin/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header title='Airdrop Tasks' subText="Manage and create new airdrop tasks.">
        <Button>Create Task</Button>
      </Header>
    </>
  )
}
