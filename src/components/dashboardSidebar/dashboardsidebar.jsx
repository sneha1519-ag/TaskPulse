"use client"

import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import {Footer} from "@/components/dashboardSidebar/footer";
import {HomeSection} from "@/components/dashboardSidebar/home-section";
import {TeamSection} from "@/components/dashboardSidebar/team-section";

const DashBoardSidebar = () => {

    return (
        <Sidebar className="pt-16 z-40 border-r" collapsible="icon">
            <SidebarContent className="bg-background">
                <HomeSection />
                <Separator />
                <TeamSection/>
                <Separator />
            </SidebarContent>
            <SidebarFooter>
                <Footer />
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashBoardSidebar