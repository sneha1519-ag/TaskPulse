import React from 'react';
import CalendarDay from './calendar-day';

const CalendarBody = ({
                          currentDate,
                          selectedDate,
                          setSelectedDate,
                          events
                      }) => {
    // Function to get day name
    const getDayName = (day) => {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayNames[day];
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
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    let days = [];

    // Empty cells for days before the 1st of month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();

        days.push(
            <CalendarDay
                key={day}
                day={day}
                month={month}
                year={year}
                events={events}
                isToday={isToday}
                isSelected={isSelected}
                setSelectedDate={setSelectedDate}
            />
        );
    }

    return (
        <div className="grid grid-cols-7 gap-0">
            {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <div key={day} className="h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-medium">
                    {getDayName(day)}
                </div>
            ))}
            {days}
        </div>
    );
};

export default CalendarBody;