import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// lib/calendar-utils.jsx
export const getMonthDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];

  // Get previous month days that should appear in this month's calendar
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }

  // Next month days to fill out the calendar grid
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isNextMonth: true
    });
  }

  return days;
};

export const getTimeSlots = (startHour = 0, endHour = 24, intervalMinutes = 60) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      const formattedMinute = minute.toString().padStart(2, '0');

      slots.push({
        hour,
        minute,
        label: `${formattedHour}:${formattedMinute} ${period}`,
        value: `${hour}:${formattedMinute}`
      });
    }
  }
  return slots;
};
