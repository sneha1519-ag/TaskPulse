import React from 'react';
import { cn } from '@/lib/utils';
import {BackgroundGradient} from "@/components/ui/aceternity/background-gradient";

const Card3dEffect = ({ children }) => {
    return (
        <div className="group perspective-1000">
            <div className="preserve-3d transition-transform duration-300 ease-out group-hover:rotate-y-6 group-hover:rotate-x-6">
                <div className="backface-hidden bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg p-4 shadow-sm transition-all duration-300 group-hover:shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

const MiniCalendar = ({
                          currentDate,
                          selectedDate,
                          setSelectedDate,
                          calendarTypes = [
                              { name: "Personal", color: "bg-blue-500" },
                              { name: "Work", color: "bg-green-500" },
                              { name: "Important", color: "bg-red-500" }
                          ]
                      }) => {
    // Function to get month name
    const getShortMonthName = (month) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month];
    };

    // Function to get days in a month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to get the first day of the month
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const miniDaysInMonth = getDaysInMonth(year, month);
    const miniFirstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    let miniDays = [];

    // Empty cells for days before the 1st of month
    for (let i = 0; i < miniFirstDay; i++) {
        miniDays.push(<div key={`mini-empty-${i}`} className="h-6 w-6"></div>);
    }

    // Days of the month
    for (let day = 1; day <= miniDaysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();

        miniDays.push(
            <div
                key={`mini-${day}`}
                className={cn(
                    "h-6 w-6 flex items-center justify-center text-xs rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110",
                    isToday ? "bg-[#9a88b4] dark:bg-[#A6AD8A] text-white shadow-md" : "",
                    isSelected && !isToday ? "bg-gray-200 dark:bg-zinc-700" : "",
                    !isToday && !isSelected ? "hover:bg-gray-100 dark:hover:bg-zinc-700" : ""
                )}
                onClick={() => setSelectedDate(new Date(year, month, day))}
            >
                {day}
            </div>
        );
    }

    return (
        <BackgroundGradient>
        <Card3dEffect>
            <div className="space-y-6">
                <div>
                    <div className="text-sm font-medium mb-2">
                        {getShortMonthName(month)} {year}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                            <div key={`mini-header-${index}`} className="h-6 w-6 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                {day}
                            </div>
                        ))}
                        {miniDays}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Labels</h3>
                        <div className="space-y-2">
                            {calendarTypes.map((calendar, index) => (
                                <div key={`calendar-type-${index}`} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${calendar.color} mr-2`}></div>
                                    <span className="text-xs">{calendar.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </Card3dEffect>
        </BackgroundGradient>
    );
};

export default MiniCalendar;

