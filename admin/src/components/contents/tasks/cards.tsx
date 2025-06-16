import { IconCheckbox, IconFlag, IconSubtask, IconTrendingDown, IconTrendingUp, IconUser } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function TaskCards() {
    return (
        <div className="flex flex-wrap gap-4">
            <Card className="@container/card flex-2 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Total Users</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        1500
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Total number of task completed by users <IconSubtask className="size-4" />
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Active Tasks</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        124
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 items-center flex gap-2 font-medium">
                        Task currently on by user <IconUser className="size-4" />
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Task Complete Count</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        304
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Completed by users <IconCheckbox className="size-4" />
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Supended Accounts</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        0
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Banned from the campaign<IconFlag className="size-4" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}