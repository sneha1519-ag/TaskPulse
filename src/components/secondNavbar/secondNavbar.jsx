"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Clipboard,
    CalendarIcon,
    Layout,
    Plus,
    Workflow,
    MessageCircle,
    Paperclip,
    Share2,
    Calendar1
} from "lucide-react"
import Board from "@/components/kanbanBoard/board";
import NavCalendar from "@/components/calendar/navCalendar"

const SecondaryNavbar = () => {
    const [activeTab, setActiveTab] = useState("Overview");

    // Menu items for navigation
    const menuItems = [
        { name: "Overview", icon: Clipboard, component: <div>Overview Content</div> },
        { name: "Board", icon: Layout, component: <Board/> },
        { name: "Timeline", icon: Calendar1, component: <div>Timeline Content</div> },
        { name: "Dashboard", icon: Workflow, component: <div>Dashboard Content</div> },
        { name: "Calendar", icon: CalendarIcon, component: <NavCalendar/> },
        { name: "Messages", icon: MessageCircle, component: <div>Messages Content</div> },
        { name: "Files", icon: Paperclip, component: <div>Files Content</div> },
    ];

    return (
        <div className="w-full border-b border-gray-200">
            {/* Project Name & Share Button */}
            <div className="relative flex justify-between items-center px-6 py-3">
                <h1 className="text-lg font-medium">Project Name</h1>
                <Button variant="" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="w-full flex items-center px-6 overflow-x-auto">
                {menuItems.map(({ name, icon: Icon }) => (
                    <button
                        key={name}
                        className={`flex items-center px-4 py-3 text-sm transition-all
                        ${
                            activeTab === name
                                ? "border-b-2 border-black dark:border-white font-medium"
                                : ""
                        }`}
                        onClick={() => setActiveTab(name)}
                    >
                        <Icon className="h-4 w-4 mr-2" />
                        {name}
                    </button>
                ))}
            </div>

            {/* Render Active Component */}
            <div className="p-6">
                {menuItems.find((item) => item.name === activeTab)?.component}
            </div>
        </div>
    );
};

export default SecondaryNavbar;