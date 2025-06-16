import { ArrowUpDown, CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type Referrer = {
    userId: {
        username: string
        sessionClientID: {
            profile: string;
        }
    };
    friends: Array<any>;
    points: number;
    activityStatus: string;
    token: string;
};

export const refColumns = (setSelectedReferrer: (user: any) => void) => [
    {
        id: "select",
        header: ({ table }: any) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }: any) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "username",
        header: ({ column }: { column: any }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Username
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: "userId.username",
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2 font-semibold">{getValue()}</div>
        ),
    },
    {
        header: () => <div className="px-4 py-2">Referral Count</div>,
        accessorKey: "friends",
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">{getValue().length}</div>
        ),
    },
    {
        header: () => <div className="px-4 py-2">Points</div>,
        accessorKey: "points",
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">{getValue()}</div>
        ),
    },
    {
        id: "referal count",
        header: () => (
            <div className="px-4 py-2 text-center w-full">
                Status
            </div>
        ),
        accessorKey: "referredCount",
        cell: ({ row }) => {
            const isVerified = row.original.activityStatus;

            return (
                <div className="w-full flex justify-center">
                    <Badge
                        variant="outline"
                        className={`px-2 gap-1 items-center ${isVerified
                            ? "text-green-600 border-green-300 dark:text-green-400"
                            : "text-red-600 border-red-300 dark:text-red-400"
                            }`}
                    >
                        {isVerified ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        {isVerified ? "Yes" : "No"}
                    </Badge>
                </div>
            );
        },
    },
    {
        header: () => <div className="px-4 py-2">Token Id</div>,
        accessorKey: "token",
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">{getValue()}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }: { row: any }) => {
            const user = row.original;

            return (
                <div className="flex justify-end w-full pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedReferrer(user)}>
                                View Referrer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }

];
