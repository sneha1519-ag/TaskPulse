import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import CalendarHeader from './calendar-header';
import CalendarBody from './calendar-body';
import MiniCalendar from './mini-calendar';

// Add these utility functions
const getEventColor = (event) => {
    // Return the colorId if it exists in the event data
    if (event.colorId) return event.colorId;

    // Return the custom color if it exists
    if (event.extendedProperties?.private?.color) {
        return event.extendedProperties.private.color;
    }

    // Default color if none specified
    return "border-blue-500 bg-blue-100 dark:bg-blue-900/30";
};

const formatEventTime = (event) => {
    // Check if the event has dateTime (time-specific) or just date (all-day)
    const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);

    // Format to display only the time (e.g., "9:00 AM")
    return start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function CustomCalendar() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);  // Removed example events as requested
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cachedEvents, setCachedEvents] = useState({});
    const [lastFetchTime, setLastFetchTime] = useState({});


    // Use useCallback to avoid dependency issues
    const fetchEventsForMonth = useCallback(async (year, month, forceRefresh = false) => {
        const cacheKey = `${year}-${month}`;

        // Skip cache if forceRefresh is true
        const now = Date.now();
        if (!forceRefresh &&
            cachedEvents[cacheKey] &&
            lastFetchTime[cacheKey] &&
            now - lastFetchTime[cacheKey] < 5 * 60 * 1000) {
            setEvents(cachedEvents[cacheKey]);
            return cachedEvents[cacheKey];
        }

        // Rest of your fetch code remains the same...
        try {
            setLoading(true);

            // Create start and end of month for query
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);

            const response = await fetch(
                `/api/calendar?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}`
            );

            const data = await response.json();

            // Format events for display
            const formattedEvents = data.events.map(event => ({
                id: event.id,
                title: event.summary,
                start: {
                    dateTime: event.start.dateTime || event.start.date
                },
                end: {
                    dateTime: event.end.dateTime || event.end.date
                },
                color: getEventColor(event),
                description: event.description,
                time: formatEventTime(event)
            }));

            // Update cache
            setCachedEvents(prev => ({
                ...prev,
                [cacheKey]: formattedEvents
            }));

            // Update last fetch time
            setLastFetchTime(prev => ({
                ...prev,
                [cacheKey]: now
            }));

            // Set events immediately to update UI
            setEvents(formattedEvents);
            setError(null);
            return formattedEvents;
        } catch (err) {
            setError('Failed to fetch events');
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [cachedEvents, lastFetchTime]);

    // Fetch events when month changes
    useEffect(() => {
        fetchEventsForMonth(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );
    }, [currentDate, fetchEventsForMonth]);


    // Navigate to previous month
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Navigate to today
    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };


    useEffect(() => {
        // Function to handle event creation
        const handleEventCreated = (e) => {
            // If we have event details in the custom event
            if (e.detail && e.detail.event) {
                // Add the new event to the current events list for immediate display
                setEvents(prevEvents => [...prevEvents, e.detail.event]);

                // Also refresh from the server to ensure everything is in sync
                fetchEventsForMonth(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    true // force refresh
                );
            } else {
                // Just refresh events if no details provided
                fetchEventsForMonth(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    true // force refresh
                );
            }
        };

        // Add event listener
        window.addEventListener('calendar-event-created', handleEventCreated);

        // Clean up
        return () => {
            window.removeEventListener('calendar-event-created', handleEventCreated);
        };
    }, [currentDate, fetchEventsForMonth]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/calendar?timeMin=' + new Date().toISOString());
            const data = await response.json();

            // Format events properly
            const formattedEvents = (data.events || []).map(event => ({
                id: event.id,
                title: event.summary,
                start: {
                    dateTime: event.start.dateTime || event.start.date
                },
                end: {
                    dateTime: event.end.dateTime || event.end.date
                },
                color: getEventColor(event),
                description: event.description,
                time: formatEventTime(event)
            }));

            setEvents(formattedEvents);
        } catch (err) {
            setError('Failed to fetch events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        // Function to handle event creation
        const handleEventCreated = () => {
            fetchEventsForMonth(currentDate.getFullYear(), currentDate.getMonth());
        };

        // Add event listener
        window.addEventListener('calendar-event-created', handleEventCreated);

        // Clean up
        return () => {
            window.removeEventListener('calendar-event-created', handleEventCreated);
        };
    }, [currentDate, fetchEventsForMonth]);


    return (
        <div className="w-full min-h-screen bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex h-screen">
                {/* Sidebar with mini calendar */}
                <div
                    className={cn(
                        "border-r border-gray-200 dark:border-zinc-700 transition-all duration-300 overflow-hidden bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-sm",
                        showSidebar ? "w-64" : "w-0"
                    )}
                >
                    <div className="p-1 rounded-lg m-2">
                        <MiniCalendar
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </div>
                </div>

                {/* Main calendar area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <CalendarHeader
                        currentDate={currentDate}
                        prevMonth={prevMonth}
                        nextMonth={nextMonth}
                        goToToday={goToToday}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />

                    <div className="flex-1 overflow-y-auto">
                        <CalendarBody
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            events={events}
                        />
                    </div>

                    {/* Quick event info at bottom */}
                    <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-medium">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                            </div>

                            <div className="text-xs text-gray-500">
                                Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">←</kbd> <kbd className="px-1 py-0.5 bg-gray-100 rounded border">→</kbd> to change months
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}