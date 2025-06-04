import { Link, useLocation } from "@tanstack/react-router"
import type { Icon } from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
    items,
    ...props
}: {
    items: Array<{
        title: string
        url: string
        icon: Icon
    }>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

    const currentUrl = useLocation()

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild
                                tooltip={item.title}
                                className={currentUrl.pathname.includes(item.url) ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""}
                                aria-current={currentUrl.pathname === item.url ? "page" : undefined}
                            >
                                <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
