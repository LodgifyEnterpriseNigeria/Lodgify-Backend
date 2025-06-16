import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export type User = {
    fullName: string;
    username: string;
    verified: boolean;
    refCount: number;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
}

export const taskColumns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
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
        header: ({ column }: { column: any }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: 'fullName',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Username
            </div>
        ),
        accessorKey: 'username',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Verified
            </div>
        ),
        accessorKey: 'verified',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue() ? 'Yes' : 'No'}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Ref Count
            </div>
        ),
        accessorKey: 'refCount',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Email
            </div>
        ),
        accessorKey: 'email',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Phone Number
            </div>
        ),
        accessorKey: 'phoneNumber',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: () => (
            <div className="px-4 py-2">
                Date of Birth
            </div>
        ),
        accessorKey: 'dateOfBirth',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]