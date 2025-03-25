import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Users } from 'lucide-react'
import Link from 'next/link'

export const TeamSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href={"/dashboard"}>
                            <SidebarMenuButton className='mt-1'>
                                <Users /> My WorkSpace
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}