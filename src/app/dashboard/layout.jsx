import React from "react";
import DashBoardSidebar from "@/components/dashboardSidebar/dashboardsidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/dashboardNavbar/navbar";
import SecondaryNavbar from "@/components/secondNavbar/secondNavbar";

export default function DashboardLayout({children}) {
    return (
        <SidebarProvider>
            <div className="w-full">
                <Navbar/>
                <div className="flex min-h-screen pt-[4rem]">
                    <DashBoardSidebar />
                    <main className="flex-1 overflow-y-auto">
                        <SecondaryNavbar/>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}