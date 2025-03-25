import React from 'react';

const WeekView = ({ currentDate }) => {
    // Generate days of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dates = [];
    const startOfWeek = new Date(currentDate);

    // Adjust to start of week (Sunday)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // Generate array of dates for the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
    }

    // Generate time slots from 8:00 AM to 6:00 PM
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        timeSlots.push(`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
        if (hour < 18) {
            timeSlots.push(`${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour < 12 ? 'AM' : 'PM'}`);
        }
    }

    // Helper to determine if a meeting falls in a specific time slot and day
    const getMeetingForTimeSlot = (dayIndex, timeSlot) => {
        return null;
    };

    // Get today for highlighting
    const today = new Date();

    return (
        <div className="flex-1 overflow-auto border-l">
            <div className="flex">
                {/* Time column */}
                <div className="w-25 shrink-0 border-r border-gray-200 dark:border-zinc-600">
                    <div className="h-14 border-b bg-gray-100 dark:bg-zinc-900">
                        <p className="text-center pt-3 text-lg font-bold">Time</p>
                    </div>
                    {timeSlots.map((timeSlot, index) => (
                        <div key={index}
                             className="h-14 border-b border-gray-200 dark:border-zinc-700 p-4 text-xs text-gray-500 dark:text-gray-100 flex items-center justify-end bg-gray-100 dark:bg-zinc-900">
                            {timeSlot}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="flex-1 grid grid-cols-7 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700">
                    {/* Days header */}
                    {dates.map((date, i) => {
                        const isToday = date.toDateString() === today.toDateString();
                        return (
                            <div key={i}
                                 className="h-14 border-b border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center">
                                <div className="text-xs text-gray-500 ">{days[i]}</div>
                                <div
                                    className={`text-sm flex items-center justify-center ${isToday ? 'bg-[#9a88b4] dark:bg-[#A6AD8A] text-white rounded-full' : ''}`}
                                    style={{width: '28px', height: '28px'}}>
                                    {date.getDate()}
                                </div>
                            </div>
                        );
                    })}

                    {/* Time slots grid */}
                    {timeSlots.map((timeSlot, timeIndex) => (
                        <React.Fragment key={timeIndex}>
                            {dates.map((date, dayIndex) => {
                                const meeting = getMeetingForTimeSlot(dayIndex, timeSlot);

                                return (
                                    <div
                                        key={`${dayIndex}-${timeIndex}`}
                                        className={`h-14 border-b border-r border-gray-200 dark:border-zinc-800 relative`}
                                    >
                                        {meeting && (
                                            <div
                                                className="absolute inset-x-1 top-1 bottom-1 bg-gray-100 rounded p-2 text-xs overflow-hidden">
                                                <div className="font-medium">{meeting.title}</div>
                                                <div className="text-gray-500">{meeting.timeDisplay}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeekView;