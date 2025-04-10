import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const MiniAdminCalendar = ({ userId, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Debug received events
  useEffect(() => {
    console.log('MiniAdminCalendar received events:', events);
  }, [events]);
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const formatMonth = (month) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Check if a date has events
  const hasEvents = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    console.log(`Checking for events on ${dateStr} (day ${day})`);
    
    return events.some(event => {
      let eventStartTime = event.startTime || event.start?.dateTime || event.start?.date;
      if (!eventStartTime) return false;
      
      try {
        const eventDate = new Date(eventStartTime);
        const eventDateStr = eventDate.toISOString().split('T')[0];
        
        const match = (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
        
        if (match) {
          console.log(`Found event match: ${event.title} on ${eventDateStr}`);
        }
        
        return match;
      } catch (e) {
        console.error('Error checking event date:', e);
        return false;
      }
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      let eventStartTime = event.startTime || event.start?.dateTime || event.start?.date;
      if (!eventStartTime) return false;
      
      try {
        const eventDate = new Date(eventStartTime);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      } catch (e) {
        return false;
      }
    });
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before the 1st of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8 w-8"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      const isSelected = date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      const hasEventsToday = hasEvents(day);
      const dayEvents = getEventsForDay(day);
      
      days.push(
        <motion.div 
          key={day}
          whileHover={{ scale: 1.05 }}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer 
            ${isToday ? 'bg-[#A69BC1] dark:bg-[#59643E] text-black dark:text-white' : ''}
            ${isSelected && !isToday ? 'bg-gray-300 dark:bg-neutral-700' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100 dark:hover:bg-neutral-600' : ''}
            ${hasEventsToday ? 'font-bold' : ''}
            relative transition-all duration-200`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
          {hasEventsToday && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </motion.div>
      );
    }
    
    return days;
  };
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    console.log('Getting events for selected date:', selectedDate.toISOString().split('T')[0]);
    
    const filteredEvents = events.filter(event => {
      let eventStartTime = event.startTime || event.start?.dateTime || event.start?.date;
      if (!eventStartTime) return false;
      
      try {
        const eventDate = new Date(eventStartTime);
        const match = (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
        
        if (match) {
          console.log('Found event for selected date:', event.title);
        }
        
        return match;
      } catch (e) {
        console.error('Error parsing date for selected date:', e);
        return false;
      }
    });
    
    console.log('Filtered events for selected date:', filteredEvents);
    return filteredEvents;
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  // Calculate events for selected date
  const selectedDateEvents = getEventsForSelectedDate();
  
  return (
    <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">
          {formatMonth(currentDate.getMonth())} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <motion.button 
            onClick={prevMonth} 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            &lt;
          </motion.button>
          <motion.button 
            onClick={nextMonth} 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            &gt;
          </motion.button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div 
            key={index} 
            className="h-8 w-8 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
      
      {/* Selected date events */}
      <div className="mt-4">
        <h4 className="font-medium text-sm mb-2">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h4>
        
        {/* Debug info */}
        <div className="text-xs text-gray-500 mb-1">
          Events count: {selectedDateEvents.length}
        </div>
        
        <div className="mt-2 max-h-40 overflow-y-auto">
          {selectedDateEvents && selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-2 p-2 rounded bg-white dark:bg-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-sm">
                  <p className="font-medium">{event.title || event.summary}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(event.startTime || event.start?.dateTime)} - 
                    {formatTime(event.endTime || event.end?.dateTime)}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No events for this day
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniAdminCalendar; 