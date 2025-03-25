import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateMeetingDialog from "@/components/meetings/create-meeting";

const MeetingHeader = ({
                           currentDate,
                           onPrevious,
                           onNext,
                           goToToday,
                           sidebarOpen,
                           toggleSidebar
                       }) => {
    const getMonthName = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[month];
    };

    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 backdrop-blur-sm">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar} // Use the function passed as prop
                    className="mr-2"
                >
                    {sidebarOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                </Button>

                <h2 className="text-xl font-bold mr-4">
                    {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                </h2>

                <div className="flex">
                    <Button variant="outline" size="sm" onClick={onPrevious} className="rounded-r-none">
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="sm" onClick={onNext} className="rounded-l-none">
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={goToToday} className="ml-2">
                    Today
                </Button>
            </div>

            <div className="flex items-center">
                <CreateMeetingDialog/>
            </div>
        </div>
    );
};

export default MeetingHeader;
