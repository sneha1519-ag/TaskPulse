import React, { useState, useEffect } from 'react';

const MiniAdminCalendar = ({ userId, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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
    
    return events.some(event => {
      // Get event date from startTime
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
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
      
      days.push(
        <div 
          key={day} 
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm cursor-pointer 
            ${isToday ? 'bg-blue-500 text-white' : ''}
            ${isSelected && !isToday ? 'bg-gray-200' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
            ${hasEventsToday ? 'font-bold' : ''}
            relative transition-all duration-200`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
          {hasEventsToday && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedDateEvents = getEventsForSelectedDate();
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">
          {formatMonth(currentDate.getMonth())} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
            &lt;
          </button>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
      
      {/* Selected date events */}
      <div className="mt-4">
        <h4 className="font-medium text-sm">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h4>
        
        <div className="mt-2 max-h-40 overflow-y-auto">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <div key={index} className="text-sm p-2 mb-1 border-l-2 border-blue-500 bg-blue-50">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-500">{event.location}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No events for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniAdminCalendar; 