import { TemplateRef } from "@angular/core";
import { CalendarEvent, CalendarView } from "angular-calendar";

export interface CalendarProps {
    showNavigation?: boolean;
    showViewSwitcher?: boolean;
    showEditBtn?: boolean;
    showDeleteBtn?: boolean;
    tooltip?: (event: CalendarEvent) => string;
    defaultView?: CalendarView;
    events?: CalendarEvent[];
  }
  

  // = [
  //   // {
  //   //   start: startOfDay(new Date()),
  //   //   end: endOfDay(new Date()),
  //   //   title: translations['calendar.todaySchedule'],
  //   //   color: { primary: '#ad2121', secondary: '#FAE3E3' },
  //   //   allDay: true,
  //   // },
  //   // {
  //   //   start: addDays(startOfDay(new Date()), 1),
  //   //   end: addDays(endOfDay(new Date()), 1),
  //   //   title: translations['calendar.tomorrowSchedule'],
  //   //   color: { primary: '#1e90ff', secondary: '#D1E7DD' },
  //   //   allDay: true,
  //   // },
  //   {
  //     start: addDays(new Date(), 2),
  //     title: translations['calendar.mathClass'],
  //     color: { primary: '#e3bc08', secondary: '#FDF1BA' },
  //   },
  //   {
  //     start: addDays(new Date(), 2),
  //     title: translations['calendar.mathClass'],
  //     color: { primary: '#1e90ff', secondary: '#FDF1BA' },
  //   },
  // ]