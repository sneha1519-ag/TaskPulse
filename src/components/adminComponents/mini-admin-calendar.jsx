import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const MiniAdminCalendar = ({ userId, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [currentDate, selectedDate]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatMonth = (month) =>
      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const hasEvents = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.some((event) => {
      const eventStart = event.startTime || event.start?.dateTime || event.start?.date;
      return eventStart && new Date(eventStart).toDateString() === date.toDateString();
    });
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => {
      const eventStart = event.startTime || event.start?.dateTime || event.start?.date;
      return eventStart && new Date(eventStart).toDateString() === selectedDate.toDateString();
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasEvent = hasEvents(day);

      days.push(
          <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(date)}
              className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm cursor-pointer
          transition-colors duration-200 relative
          ${isToday ? "bg-primary text-white" : ""}
          ${isSelected && !isToday ? "bg-muted text-primary" : ""}
          hover:bg-accent dark:hover:bg-muted/70
          `}
          >
            {day}
            {hasEvent && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
          </motion.div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {formatMonth(currentDate.getMonth())} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-3">
            <motion.button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-muted dark:hover:bg-muted/60 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
              &lt;
            </motion.button>
            <motion.button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-muted dark:hover:bg-muted/60 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
              &gt;
            </motion.button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
              <div key={idx} className="text-center">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>

        {/* Events Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-2xl" />)}
              </div>
          ) : (
              selectedDateEvents.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {selectedDateEvents.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-muted dark:bg-muted/60 p-4 rounded-2xl shadow hover:shadow-lg transition-shadow"
                        >
                          <div className="font-medium text-primary">
                            {event.title || event.summary}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.location}
                          </div>
                        </motion.div>
                    ))}
                  </div>
              ) : (
                  <p className="text-sm text-muted-foreground">No events today.</p>
              )
          )}
        </div>
      </motion.div>
  );
};

export default MiniAdminCalendar;
