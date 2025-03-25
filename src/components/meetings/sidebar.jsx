import React from "react";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";

// 3D Card Effect
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

const Sidebar = ({ currentDate = new Date(), selectedDate = new Date(), setSelectedDate, weekDates = [] }) => {
    const getShortMonthName = (month) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month];
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const miniDaysInMonth = getDaysInMonth(year, month);
    const miniFirstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    let miniDays = [];
    let weekRows = [];

    // Empty cells for days before the 1st of the month
    for (let i = 0; i < miniFirstDay; i++) {
        miniDays.push(null); // Placeholder for empty spaces
    }

    // Generate days in the month
    for (let day = 1; day <= miniDaysInMonth; day++) {
        miniDays.push(day);
    }

    // Break days into weeks (rows)
    while (miniDays.length) {
        weekRows.push(miniDays.splice(0, 7)); // Each row contains 7 days
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
                        </div>

                        {/* Render week rows with blur effect */}
                        {weekRows.map((week, rowIndex) => {
                            const isHighlighted = week.some(day => weekDates.includes(day));

                            return (
                                <div
                                    key={`week-row-${rowIndex}`}
                                    className={cn(
                                        "grid grid-cols-7 gap-1 p-1 rounded-md transition-all duration-300",
                                        isHighlighted ? "bg-[#E6D7F5]/50 dark:bg-[#556B2F]/50 backdrop-blur-lg text-black dark:text-white font-bold" : "" // ✅ Blur effect
                                    )}
                                >
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={`mini-${dayIndex}`}
                                            className={`h-6 w-6 flex items-center justify-center text-xs rounded-md cursor-pointer transition-all duration-300
                                            ${day ? "hover:bg-gray-100 dark:hover:bg-zinc-700" : ""}`} // Prevent hover effect on empty spaces
                                            onClick={() => day && setSelectedDate(new Date(year, month, day))}
                                        >
                                            {day || ""}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card3dEffect>
        </BackgroundGradient>
    );
};

export default Sidebar;
