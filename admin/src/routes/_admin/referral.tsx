import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/blocks/header'
import { ReferealCards } from '@/components/contents/referrals/cards'
import RefTable from '@/components/contents/referrals/dataTable'
import { refColumns } from '@/components/contents/referrals/columns'
import Endpoint from '@/api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LucideUser } from 'lucide-react'

export const Route = createFileRoute('/_admin/referral')({
	component: RouteComponent,
})


function RouteComponent() {
	const [selectedReferrer, setSelectedReferrer] = useState(null)
	const { data, isLoading, isError } = useQuery({
		queryKey: ['referrals-analytics'],
		queryFn: Endpoint.getReferrals,
	})

	const header = (
		<Header
			title="Referral List"
			subText="Activity overview on your referral campaign"
		/>
	)

	if (isError) {
		return (
			<>
				{header}
				<div className="text-red-500">Failed to load referral data.</div>
			</>
		)
	}

	if (isLoading || !data?.data) {
		return (
			<>
				{header}
				<div className="space-y-6">
					<Skeleton className="h-40 w-full" />
					<Skeleton className="h-96 w-full" />
				</div>
			</>
		)
	}

	const {
		referrals,
		totalReferralsMade,
		activeAgents,
		topReferrers,
	} = data.data

	return (
		<>
			<Sheet open={!!selectedReferrer} onOpenChange={() => setSelectedReferrer(null)}>
				<>
					{header}
					<ReferealCards
						data={{
							totalReferralsMade,
							activeAgents,
							trendingChange: 2.5,
						}}
					/>
					<RefTable data={referrals} columns={refColumns(setSelectedReferrer)} />
				</>
				<SheetContent side="right" className="w-full sm:max-w-md">
					{selectedReferrer && (
						<ReferrerPanel data={selectedReferrer} />
					)}
				</SheetContent>
			</Sheet>
		</>
	)
}


export default function ReferrerPanel({ data }: { data: any }) {
	const user = data.userId
	const session = user?.sessionClientId || {}


	return (
		<div className="p-4 space-y-6">
			<h2 className="text-xl font-semibold">Referrer Details</h2>

			<Card className=" p-0 shadow-md border-none md:max-w-md w-full">
				<CardContent className="space-y-6 py-6">
					{/* Avatar */}
					<div className="flex flex-col items-start gap-2">
						<Avatar className="w-20 h-20">
							<AvatarImage
								src={session.avatarUrl || undefined}
								alt={session.fullName}
							/>
							<AvatarFallback>
								<LucideUser className="w-8 h-8 text-muted-foreground" />
							</AvatarFallback>
						</Avatar>
						<div className="">
							<p className="text-lg font-semibold">{session.fullName}</p>
							<p className="text-sm text-muted-foreground">{session.email}</p>
						</div>
					</div>

					{/* Info Sections */}
					<div className="grid gap-4 text-sm">
						<div className="grid grid-cols-2 gap-8">
							<div className="grid gap-1">
								<p className="text-muted-foreground">Username</p>
								<p className="font-medium">{user.username}</p>
							</div>
							<div className="grid gap-1">
								<p className="text-muted-foreground">Phone Number</p>
								<p className="font-medium">{user.phoneNumber}</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-8">
							<div>
								<p className="text-muted-foreground">Gender</p>
								<p className="font-medium capitalize">{user.gender}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Date of Birth</p>
								<p className="font-medium">
									{format(new Date(user.dateOfBirth), "dd MMM yyyy")}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Separator />
			<Card className="p-0 shadow-md border-none md:max-w-md w-full">
				<CardContent className="space-y-6 py-6">

					<div className="grid grid-cols-2 gap-y-4 gap-x-8">
						<div className="flex flex-col">
							<p className="text-muted-foreground text-sm">Points</p>
							<p className="font-bold text-lg">{data.points.toLocaleString()}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-muted-foreground text-sm">Token ID</p>
							<p className="font-mono text-sm">{data.token}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-muted-foreground text-sm">Total Referrals</p>
							<p className="font-bold text-lg">{data.friends.length}</p>
						</div>
						<div className="flex flex-col gap-y-2">
							<p className="text-muted-foreground text-sm">Status</p>
							<Badge
								variant="outline"
								className={
									data.activityStatus
										? "text-green-600 border-green-300 dark:text-green-400"
										: "text-red-600 border-red-300 dark:text-red-400"
								}
							>
								{data.activityStatus ? "Active" : "Inactive"}
							</Badge>
						</div>
					</div>
				</CardContent>

			</Card>

		</div>
	)
}