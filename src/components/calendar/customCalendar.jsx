import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Bookmark } from 'lucide-react';

const CustomCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Days of the week
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Function to go to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    // Function to go to next month
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Function to get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Function to generate the calendar days for mini calendar
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

        // Get days from previous month to fill the first week
        const daysFromPrevMonth = firstDayOfMonth;
        const prevMonthDays = [];

        if (daysFromPrevMonth > 0) {
            const prevMonthDaysCount = getDaysInMonth(currentYear, currentMonth - 1);
            for (let i = prevMonthDaysCount - daysFromPrevMonth + 1; i <= prevMonthDaysCount; i++) {
                prevMonthDays.push({
                    day: i,
                    isCurrentMonth: false,
                    date: new Date(currentYear, currentMonth - 1, i)
                });
            }
        }

        // Current month days
        const currentMonthDays = [];
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push({
                day: i,
                isCurrentMonth: true,
                isToday: new Date().getDate() === i &&
                    new Date().getMonth() === currentMonth &&
                    new Date().getFullYear() === currentYear,
                date: new Date(currentYear, currentMonth, i)
            });
        }

        // Next month days to complete the grid
        const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
        const daysNeeded = Math.ceil(totalDaysSoFar / 7) * 7 - totalDaysSoFar;
        const nextMonthDays = [];

        for (let i = 1; i <= daysNeeded; i++) {
            nextMonthDays.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(currentYear, currentMonth + 1, i)
            });
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    // Function to generate month grid data
    const generateMonthGridData = () => {
        // Start with the last Sunday of the previous month if the 1st isn't a Sunday
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startDate = new Date(firstDayOfMonth);
        const dayOfWeek = startDate.getDay();

        if (dayOfWeek > 0) {
            startDate.setDate(startDate.getDate() - dayOfWeek);
        }

        // Get total days in the current month
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);

        // Calculate how many weeks we need to display
        // We need to make sure we display all days of the current month
        const lastDayOfMonth = new Date(currentYear, currentMonth, daysInMonth);
        const diffDays = Math.ceil((lastDayOfMonth - startDate) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.ceil((diffDays + 1) / 7);

        // Create grid (5 or 6 weeks depending on the month)
        const weeks = [];
        let currentDate = new Date(startDate);

        for (let week = 0; week < totalWeeks; week++) {
            const weekDates = [];

            for (let day = 0; day < 7; day++) {
                const date = new Date(currentDate);
                weekDates.push({
                    day: date.getDate(),
                    month: date.getMonth(),
                    isCurrentMonth: date.getMonth() === currentMonth,
                    isToday: date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear(),
                    date: date
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            weeks.push(weekDates);
        }

        return weeks;
    };

    // Generate month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get calendar days for mini calendar
    const calendarDays = generateCalendarDays();

    // Get data for the main month grid
    const monthGridData = generateMonthGridData();

    // Function to format date as "Day, Month Date" (e.g., "Sunday, February 23")
    const formatSelectedDate = (date) => {
        if (!date) return '';

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];
        const monthName = monthNames[date.getMonth()];
        const dayNumber = date.getDate();

        return `${dayName}, ${monthName} ${dayNumber}`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center p-4 border-b">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Calendar</h1>
                </div>

                <div className="ml-8 space-x-2">
                    <button className="px-4 py-1 rounded border">
                        Today
                    </button>
                    <button onClick={goToPreviousMonth} className="p-1 rounded hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={goToNextMonth} className="p-1 rounded hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>
                </div>

                <div className="ml-auto">
                    <button
                        className="flex items-center space-x-2 rounded-full border px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        <Plus size={20} />
                        <span>Create</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex">
                {/* Mini Calendar */}
                <div className="w-64 p-4 border-r">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-medium">{monthNames[currentMonth]} {currentYear}</h3>
                        <div className="flex">
                            <button className="p-1 hover:bg-gray-100 rounded" onClick={goToPreviousMonth}>
                                <ChevronLeft size={16} />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded" onClick={goToNextMonth}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs mb-1">
                        {daysOfWeek.map((day, index) => (
                            <div key={index}>{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {calendarDays.map((day, index) => (
                            <div
                                key={index}
                                className={`w-6 h-6 flex items-center justify-center rounded-full text-sm
                                    ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                                    ${day.isToday ? 'bg-[#85769f] text-white dark:bg-[#7A8960]' : ''}
                                    hover:bg-gray-100 hover:text-black cursor-pointer
                                `}
                                onClick={() => handleDateClick(day.date)}
                            >
                                {day.day}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-md font-medium mb-2">Label</h3>
                        {/* Add label content here if needed */}
                    </div>
                </div>

                {/* Main Calendar Grid */}
                <div className="flex-1">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
                            <div key={index} className="p-2 text-center font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Date Grid - First Row */}
                    <div className="grid grid-cols-7">
                        {monthGridData[0].map((date, index) => (
                            <div
                                key={index}
                                className="p-2 text-center border-t border-r last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
                                onClick={() => handleDateClick(date.date)}
                            >
                                <div className={`font-medium ${!date.isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}`}>
                                    {date.day}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Week rows */}
                    {monthGridData.slice(1).map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7">
                            {week.map((date, dateIndex) => (
                                <div
                                    key={dateIndex}
                                    className="min-h-24 p-2 border-t border-r last:border-r-0 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    onClick={() => handleDateClick(date.date)}
                                >
                                    <div className={`
                                        ${!date.isCurrentMonth ? 'text-gray-400' : 'font-medium'}
                                        ${date.isToday ? 'bg-[#85769f] text-white dark:bg-[#7A8960] rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}
                                    `}>
                                        {date.day}
                                    </div>
                                    {/* Event placeholders would go here */}
                                </div>
                            ))}
                        </div>
                    ))}


                </div>
            </div>
        </div>
    );
};

export default CustomCalendar;