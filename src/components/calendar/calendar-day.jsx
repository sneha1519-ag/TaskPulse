import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UpdateDeleteEvent from "@/components/calendar/update-delete-event";

const ShimmerEffect = ({ children }) => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-10">
                <div className="absolute -inset-[100%] z-10 animate-[shimmer_2s_infinite]
                from-transparent via-[#E6E6FA]/30 dark:via-[#A6AD8A]/30
                to-transparent bg-gradient-to-r">
                </div>
            </div>
            {children}
        </div>
    );
};

const CalendarDay = ({
                         day,
                         month,
                         year,
                         events,
                         isToday,
                         isSelected,
                         setSelectedDate
                     }) => {
    const date = new Date(year, month, day);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);

    // Filter events for this day
    const dayEvents = events.filter(event => {
        // Handle events with dateTime format
        if (event.start && event.start.dateTime) {
            const eventDate = new Date(event.start.dateTime);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
            );
        }
        return false;
    });

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
    };


    const dayContent = (
        <div
            className={cn(
                "h-32 border border-gray-200 dark:border-zinc-700 p-1 relative transition-all duration-300 hover:shadow-[#9a88b4] dark:hover:shadow-[#D1D2B4] hover:shadow-lg dark:hover:shadow-lg",
                isSelected && !isToday ? "bg-gray-50 dark:bg-zinc-800/70" : ""
            )}
            onClick={() => setSelectedDate(new Date(year, month, day))}
        >
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                    {isToday && (
                        <div className="text-xs font-medium text-[AA98A9] dark:text-[#D1D2B4] mb-1">TODAY</div>
                    )}
                    <div className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-full transition-transform duration-300 hover:scale-110",
                        isToday ? "bg-[#AA98A9] dark:bg-[#BCB09F] text-white shadow-lg" : "",
                        isSelected && !isToday ? "bg-gray-200 dark:bg-zinc-700" : ""
                    )}>
                        <span className="text-sm font-medium">{day}</span>
                    </div>
                </div>
            </div>

            <div className="mt-2 space-y-1 overflow-hidden max-h-20">
                {dayEvents.map(event => (
                    <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${event.color || "border-l-2 border-gray-400 bg-gray-100 dark:bg-zinc-800"} hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105`}
                        title={`${event.title} - ${event.time}`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            handleEventClick(event);
                        }}
                    >
                        {event.title}
                    </div>
                ))}
            </div>


            {isToday && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 h-1
                    bg-gradient-to-r from-[#A76F9D] dark:from-[#A6AD8A]
                    via-[#916488] dark:via-[#A6AD8A]
                    to-[#B084A7] dark:to-[#A6AD8A]">
                    </div>
                    <div className="absolute top-0 left-0 w-1 h-full
                    bg-gradient-to-b from-[#A76F9D] dark:from-[#A6AD8A]
                    to-transparent opacity-50">
                    </div>
                    <div className="absolute top-0 right-0 w-1 h-full
                    bg-gradient-to-b from-[#A76F9D] dark:from-[#A6AD8A]
                    to-transparent opacity-50">
                    </div>
                </div>
            )}

            <UpdateDeleteEvent
                event={selectedEvent}
                isOpen={isEventDialogOpen}
                onOpenChange={setIsEventDialogOpen}
            />

        </div>
    );

    return isToday ? <ShimmerEffect>{dayContent}</ShimmerEffect> : dayContent;
};

export default CalendarDay;