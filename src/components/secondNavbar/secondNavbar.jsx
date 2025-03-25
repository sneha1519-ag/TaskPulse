"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Clipboard,
    CalendarIcon,
    Layout,
    Workflow,
    Paperclip,
    Share2,
    Calendar1,
    Video
} from "lucide-react"
import Main from "@/components/kanbanBoard/main"
import CustomCalendar from "@/components/calendar/customCalendar";
import {HoverBorderGradient} from "@/components/ui/aceternity/hover-border-gradient";
import MeetingLayout from "@/components/meetings/meeting-layout";
import Dashboard from "@/components/dashboard/Dashboard.jsx";

const SecondaryNavbar = () => {
    const [activeTab, setActiveTab] = useState("Overview");

    // Menu items for navigation
    const menuItems = [
        { name: "Overview", icon: Clipboard },
        { name: "Board", icon: Layout },
        { name: "Timeline", icon: Calendar1 },
        { name: "Dashboard", icon: Workflow },
        { name: "Calendar", icon: CalendarIcon },
        { name: "Meetings", icon: Video },
        { name: "Files", icon: Paperclip },
    ];

    // Function to render the active component only when needed
    const renderActiveComponent = () => {
        switch (activeTab) {
            case "Board":
                return <Main/>;
            case "Calendar":
                return <CustomCalendar />;
            case "Timeline":
                return <div>Timeline Content</div>;
            case "Dashboard":
                return <Dashboard/>;
            case "Meetings":
                return <MeetingLayout/>
            case "Files":
                return <div>Files Content</div>;
            default:
                return <div>Overview Content</div>;
        }
    };

    return (
        <div className="w-full">
            {/* Project Name & Share Button */}
            <div className="relative flex justify-between items-center px-6 py-3">
                <h1 className="text-lg font-medium">Project Name</h1>
                <div>
                    <HoverBorderGradient
                        containerClassName="rounded-lg"
                        as="button"
                        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    >
                        <Share2/>
                        <span>Share</span>
                    </HoverBorderGradient>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="w-full flex items-center px-6 overflow-x-auto">
                {menuItems.map(({name, icon: Icon}) => (
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
                        <Icon className="h-4 w-4 mr-2"/>
                        {name}
                    </button>
                ))}
            </div>

            {/* Render Active Component */}
            <div className="p-6 border-t border-gray-200 dark:border-zinc-700">{renderActiveComponent()}</div>
        </div>
    );
};

export default SecondaryNavbar;