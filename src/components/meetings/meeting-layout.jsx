"use client"

import React, { useState } from 'react';
import Sidebar from './sidebar';
import MeetingHeader from './meeting-header';
import WeekView from './week-view';

export default function MeetingLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handlePreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // Function to get the displayed week range (dates shown in WeekView)
    const getDisplayedWeek = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

        let weekDates = [];
        for (let i = 0; i < 7; i++) {
            let newDate = new Date(startOfWeek);
            newDate.setDate(startOfWeek.getDate() + i);
            weekDates.push(newDate.getDate()); // Store day numbers
        }
        return weekDates;
    };

    const weekDates = getDisplayedWeek(currentDate);// Get current displayed week

    return (
        <div className="flex h-screen border-l border-gray-200 dark:border-zinc-700">
            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
                {sidebarOpen && <Sidebar weekDates={weekDates}/>}
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <MeetingHeader
                    currentDate={currentDate}
                    onPrevious={handlePreviousWeek}
                    onNext={handleNextWeek}
                    toggleSidebar={toggleSidebar} // Pass toggle function
                    sidebarOpen={sidebarOpen} // Pass sidebar state
                />
                <WeekView currentDate={currentDate}/>
            </div>
        </div>
    );
}