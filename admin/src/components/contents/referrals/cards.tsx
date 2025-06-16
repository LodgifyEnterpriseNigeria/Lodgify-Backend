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

export function ReferealCards() {
    return (
        <div className="flex flex-wrap gap-4">
            <Card className="@container/card flex-2 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Total Refferals Made</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        1250
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                    New referrals in total
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Active Agents</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        125
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                    Users actively referring in total
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}