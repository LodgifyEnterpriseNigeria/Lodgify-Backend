import { ArrowUpDown, MoreHorizontal, ShieldCheck } from "lucide-react";
import { IconRobot } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export type User = {
    activeFrom: string;
    duration: number;
    name: string;
    platform: string;
    points: number;
    type: string;
    usersOnTask: Array<any>;
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
                Task Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: 'name',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()}
            </div>
        ),
    },
    {
        header: ({ column }: { column: any }) => (
            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center space-x-2"
                >
                    <span>Task Platform</span>
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </div>
        ),
        accessorKey: 'platform',
        cell: ({ getValue }: { getValue: () => string }) => {
            const platform = getValue().toLowerCase();

            const colorMap: Record<string, string> = {
                tiktok: "bg-red-500 text-white",
                instagram: "bg-pink-500 text-white",
                x: "bg-blue-500 text-white",
                twitter: "bg-blue-500 text-white",
                youtube: "bg-red-600 text-white",
                other: "bg-green-500 text-white",
            };

            const colorClass = colorMap[platform] || colorMap["other"];

            return (
                <div className="flex justify-center items-center px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                </div>
            );
        },
    },
    {
        header: ({ column }: { column: any }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Task Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: 'type',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2 capitalize">
                {getValue()}
            </div>
        ),
    },
    {
        header: ({ column }: { column: any }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Task Points
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: 'points',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2">
                {getValue()} LP
            </div>
        ),
    },
    {
        header: ({ column }: { column: any }) => (
            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center space-x-2"
                >
                    <span>Validated By</span>
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </div>
        ),
        accessorKey: 'verifyBy', // assuming name contains either "bot" or "admin"
        cell: ({ getValue }: { getValue: () => string }) => {
            const value = getValue().toLowerCase();
            const isBot = value.includes("bot");

            const Icon = isBot ? IconRobot : ShieldCheck;
            const label = value.charAt(0).toUpperCase() + value.slice(1);

            return (
                <div className="flex justify-center items-center px-4 py-2">
                    <div className="flex items-center space-x-2 bg-muted w-full justify-center px-3 py-1 rounded-full text-sm font-medium text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span className="text-s">{label}</span>
                    </div>
                </div>
            );
        },
    },
    {
        header: ({ column }: { column: any }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Activated At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorKey: 'activeFrom',
        cell: ({ getValue }: { getValue: any }) => (
            <div className="px-4 py-2 capitalize">
                {getValue()}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            const task = row.original;
            const [open, setOpen] = useState(false);
            const [searchTerm, setSearchTerm] = useState("");

            const filteredUsers = task.usersOnTask.filter((user: any) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
                <div className="flex justify-center items-center px-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(task.name || task.id)}
                                >
                                    Copy Task Name
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpen(true)}>
                                    View Participants
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Participants</DialogTitle>
                                <DialogDescription>
                                    List of users working on this task
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                placeholder="Search participants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="my-2"
                            />
                            <div className="max-h-64 overflow-y-auto space-y-3 mt-2">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user: any, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{user.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground mt-4 text-center">
                                        No participants found.
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    }
]