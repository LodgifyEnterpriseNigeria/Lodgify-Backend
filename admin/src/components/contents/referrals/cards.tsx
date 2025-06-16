import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  data: {
    totalReferralsMade: number
    activeAgents: number
    trendingChange?: number // e.g. +12.5 or -3.2
  }
}

export function ReferealCards({ data }: Props) {
  const { totalReferralsMade, activeAgents, trendingChange = 0 } = data

  const isTrendingUp = trendingChange >= 0
  const TrendIcon = isTrendingUp ? IconTrendingUp : IconTrendingDown
  const trendColor = isTrendingUp ? "text-green-600" : "text-red-500"

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="@container/card flex-2 min-w-[250px] max-w-full">
        <CardHeader>
          <CardDescription>Total Referrals Made</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalReferralsMade}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon className={trendColor} />
              {trendingChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending {isTrendingUp ? "up" : "down"} this month
            <TrendIcon className={`size-4 ${trendColor}`} />
          </div>
          <div className="text-muted-foreground">
            Referrals added this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card flex-1 min-w-[250px] max-w-full">
        <CardHeader>
          <CardDescription>Active Agents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeAgents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="text-green-600" />
              {/* Optional static increase */}
              +8.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month
            <IconTrendingUp className="size-4 text-green-600" />
          </div>
          <div className="text-muted-foreground">
            Users actively referring in total
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
