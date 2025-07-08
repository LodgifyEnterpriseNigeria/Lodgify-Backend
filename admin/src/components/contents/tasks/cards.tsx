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

type TaskCardMetrics = {
    ongoingTasks: number;
    totalCompletedTasks: number;
    totalTasks: number;
};

export function TaskCards({ stats }: { stats: TaskCardMetrics }) {
    return (
        <div className="flex flex-wrap gap-4">
            <Card className="@container/card flex-2 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Total Task Created</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalTasks}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Total number of users <IconUser className="size-4" />
                    </div>
                </CardFooter>
            </Card>


            <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Task Completion Count</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalCompletedTasks}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Completed by users <IconCheckbox className="size-4" />
                    </div>
                </CardFooter>
            </Card>

            {/* <Card className="@container/card flex-1 min-w-[250px] max-w-full">
                <CardHeader>
                    <CardDescription>Suspended Accounts</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.suspendedAccounts}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        Banned from the campaign <IconFlag className="size-4" />
                    </div>
                </CardFooter>
            </Card> */}
        </div>
    );
}
