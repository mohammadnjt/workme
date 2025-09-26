interface Event {
  _id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  location: string;
  attendees: any[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  events: { id: string; title: string }[];
}

interface GenerateCalendarDaysParams {
  calendarView: 'today' | 'week' | 'month';
  today: Date;
  startOfWeek: Date;
  currentMonth: number;
  currentYear: number;
  data: Event[];
}

const generateCalendarDays = ({
  calendarView,
  today,
  startOfWeek,
  currentMonth,
  currentYear,
  data,
}: GenerateCalendarDaysParams): CalendarDay[] | undefined => {
    console.log('data',data)
    if(!data) return;

  // Helper function to get date string in YYYY-MM-DD format
  const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };


  // Extract unique event dates and their events in YYYY-MM-DD format
  const eventMap = new Map<string, { id: string; title: string }[]>();
  data.forEach((event) => {
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    const existingEvents = eventMap.get(eventDate) || [];
    eventMap.set(eventDate, [...existingEvents, { id: event._id, title: event.title }]);
  });

  if (calendarView === 'today') {
    const todayString = getDateString(today);
    return [
      {
        date: today,
        isCurrentMonth: true,
        hasEvent: eventMap.has(todayString),
        events: eventMap.get(todayString) || [],
      },
    ];
  } else if (calendarView === 'week') {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayString = getDateString(day);
      days.push({
        date: day,
        isCurrentMonth: day.getMonth() === currentMonth,
        hasEvent: eventMap.has(dayString),
        events: eventMap.get(dayString) || [],
      });
    }
    return days;
  } else {
    // Month view
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    const days: CalendarDay[] = [];

    // Add days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = new Date(currentYear, currentMonth, -i);
      const dayString = getDateString(day);
      days.push({
        date: day,
        isCurrentMonth: false,
        hasEvent: eventMap.has(dayString),
        events: eventMap.get(dayString) || [],
      });
    }

    // Add current month days
    for (let i = 1; i <= totalDays; i++) {
      const day = new Date(currentYear, currentMonth, i);
      const dayString = getDateString(day);
      days.push({
        date: day,
        isCurrentMonth: true,
        hasEvent: eventMap.has(dayString),
        events: eventMap.get(dayString) || [],
      });
    }

    // Add remaining days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 columns
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(currentYear, currentMonth + 1, i);
      const dayString = getDateString(day);
      days.push({
        date: day,
        isCurrentMonth: false,
        hasEvent: eventMap.has(dayString),
        events: eventMap.get(dayString) || [],
      });
    }
    console.log('days',days)

    return days;
  }
};

export default generateCalendarDays;