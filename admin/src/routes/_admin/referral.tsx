import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/blocks/header'
import { ReferealCards } from '@/components/contents/referrals/cards'
import RefTable from '@/components/contents/referrals/dataTable'
import { refColumns } from '@/components/contents/referrals/columns'

export const Route = createFileRoute('/_admin/referral')({
    component: RouteComponent,
})


function RouteComponent() {
    const dummyData: Array<any> = []
    return (
        <>
            <Header title='Referral List' subText="Activity overview on your referal campaign">
            </Header>

            <ReferealCards />

            <RefTable data={dummyData} columns={refColumns} />
        </>
    )
}
