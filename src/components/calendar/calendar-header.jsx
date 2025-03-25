import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateEventDialog from "@/components/calendar/create-event-dialog";

// Removed the SparklesEffect as requested

const CalendarHeader = ({
                            currentDate,
                            prevMonth,
                            nextMonth,
                            goToToday,
                            showSidebar,
                            setShowSidebar
                        }) => {
    // Function to get month name
    const getMonthName = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[month];
    };

    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-10 bg-gray-50 dark:bg-zinc-900 backdrop-blur-sm">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="mr-2"
                >
                    {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                <h2 className="text-xl font-bold mr-4">
                    {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                </h2>

                <div className="flex">
                    <Button variant="outline" size="sm" onClick={prevMonth} className="rounded-r-none">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth} className="rounded-l-none">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={goToToday} className="ml-2">
                    Today
                </Button>
            </div>

            <div className="flex items-center">
                <CreateEventDialog/>
            </div>
        </div>
    );
};

export default CalendarHeader;