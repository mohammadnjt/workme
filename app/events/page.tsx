'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users, Building, ArrowRight } from 'lucide-react';
import eventsData from '@/data/events.json';
import useAxios from '@/hooks/useAxios';
import { AxiosResponse } from 'axios';
import generateCalendarDays from './generateCalendarDays';
import Loading from '../loading';

const metadata = {
  title: 'Events | Work ME',
  description: 'Discover upcoming business events, exhibitions, and tours. Network with professionals and explore new opportunities.',
};

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

const EventsPage = () => {
  const [calendarView, setCalendarView] = useState<'today' | 'week' | 'month'>('month');

  const { data, error, isLoading } = useSWR('getEvents', 
    () => useAxios.get('events/events')
    .then((res) => {
      console.log('res',res.data)
      return res.data;
    })
    .catch((error) => console.error('error getEvents', error))
  ) 

  console.log('data',data)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getIconForEventType = (slug: string) => {
    switch (slug) {
      case 'events':
        return Calendar;
      case 'exhibitions':
        return Building;
      case 'tours':
        return MapPin;
      default:
        return Calendar;
    }
  };

  // Get current date for calendar calculations
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  // Calculate the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Collect all event dates from eventsData
  const eventDates = eventsData
    .flatMap(category => category.upcoming)
    .map(event => new Date(event.date).toDateString());

  // Generate calendar days based on the view
  // const generateCalendarDays = () => {
  //   if (calendarView === 'today') {
  //     return [{ date: today, isCurrentMonth: true, hasEvent: data.includes(today.toDateString()) }];
  //   } else if (calendarView === 'week') {
  //     const days = [];
  //     for (let i = 0; i < 7; i++) {
  //       const day = new Date(startOfWeek);
  //       day.setDate(startOfWeek.getDate() + i);
  //       days.push({
  //         date: day,
  //         isCurrentMonth: day.getMonth() === currentMonth,
  //         hasEvent: eventDates.includes(day.toDateString()),
  //       });
  //     }
  //     return days;
  //   } else {
  //     // Month view
  //     const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  //     const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  //     const startOffset = firstDayOfMonth.getDay();
  //     const totalDays = lastDayOfMonth.getDate();
  //     const days = [];

  //     // Add days from previous month
  //     for (let i = startOffset - 1; i >= 0; i--) {
  //       const day = new Date(currentYear, currentMonth, -i);
  //       days.push({ date: day, isCurrentMonth: false, hasEvent: data.includes(day.toDateString()) });
  //     }

  //     // Add current month days
  //     for (let i = 1; i <= totalDays; i++) {
  //       const day = new Date(currentYear, currentMonth, i);
  //       days.push({ date: day, isCurrentMonth: true, hasEvent: data.includes(day.toDateString()) });
  //     }

  //     // Add remaining days to fill the grid
  //     const remainingDays = 42 - days.length; // 6 rows * 7 columns
  //     for (let i = 1; i <= remainingDays; i++) {
  //       const day = new Date(currentYear, currentMonth + 1, i);
  //       days.push({ date: day, isCurrentMonth: false, hasEvent: data.includes(day.toDateString()) });
  //     }

  //     return days;
  //   }
  // };

  if(isLoading && !data) return (<Loading />)

  const calendarDays = generateCalendarDays({
    calendarView,
    today,
    startOfWeek,
    currentMonth,
    currentYear,
    data
  });

  // console.log('eventsData',eventsData)

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Events & Activities
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Stay connected with the business community through our curated events,
              exhibitions, and educational tours designed to foster networking and learning.
            </p>
          </div>

          {/* Event Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {eventsData.map((category) => {
              const IconComponent = getIconForEventType(category.slug);

              return (
                <Card
                  key={category.id}
                  className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                    </div>
                    <CardTitle className="text-2xl text-secondary-800 dark:text-secondary-200">{category.name}</CardTitle>
                    <p className="text-secondary-600 dark:text-secondary-400">{category.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {!isLoading && data && (
                      (() => {
                        const filteredEvents = data.filter((event: any) => event.type === category.slug);
                        if (filteredEvents.length === 0) {
                          return (
                            <div className="p-4 text-center text-secondary-500 dark:text-secondary-400 bg-primary-50 dark:bg-secondary-900 rounded-lg border border-primary-200 dark:border-secondary-700">
                              No events in this category
                            </div>
                          );
                        }
                        return filteredEvents.map((event: any) => (
                          <div key={event.id} className="p-4 bg-primary-100 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">{event.title}</h4>

                            <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{formatDate(event.date)}</span>
                            </div>

                            <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.location}</span>
                            </div>

                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">{event.description}</p>

                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                            >
                              Learn More
                            </Button>
                          </div>
                        ));
                      })()
                    )}
                    {/* {!isLoading && !data.find((e:any) => e.type === category.slug) && (<div>No Data</div>)}
                    {!isLoading && data.map((event:any) => event.type === category.slug && (
                      <div key={event.id} className="p-4 bg-primary-100 dark:bg-secondary-800 rounded-lg">
                        <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">{event.title}</h4>

                        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>

                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">{event.description}</p>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Learn More
                        </Button>
                      </div>
                    ))} */}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Event Categories */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {eventsData.map((category) => {
              const IconComponent = getIconForEventType(category.slug);

              return (
                <Card
                  key={category.id}
                  className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                    </div>
                    <CardTitle className="text-2xl text-secondary-800 dark:text-secondary-200">{category.name}</CardTitle>
                    <p className="text-secondary-600 dark:text-secondary-400">{category.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {category.upcoming.map((event) => (
                      <div key={event.id} className="p-4 bg-primary-100 dark:bg-secondary-800 rounded-lg">
                        <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">{event.title}</h4>

                        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>

                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">{event.description}</p>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div> */}

          {/* Calendar View Section */}
          <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200">Event Calendar</h2>
              <div className="flex space-x-2">
                <Button
                  variant={calendarView === 'today' ? 'default' : 'outline'}
                  size="sm"
                  className={`${
                    calendarView === 'today'
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800'
                  }`}
                  onClick={() => setCalendarView('today')}
                >
                  Today
                </Button>
                <Button
                  variant={calendarView === 'week' ? 'default' : 'outline'}
                  size="sm"
                  className={`${
                    calendarView === 'week'
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800'
                  }`}
                  onClick={() => setCalendarView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === 'month' ? 'default' : 'outline'}
                  size="sm"
                  className={`${
                    calendarView === 'month'
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800'
                  }`}
                  onClick={() => setCalendarView('month')}
                >
                  Month
                </Button>
              </div>
            </div>

            {/* Calendar Display */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {calendarView !== 'today' &&
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-secondary-700 dark:text-secondary-300 py-2">
                    {day}
                  </div>
                ))}
            </div>

            <div className={`grid ${calendarView === 'today' ? 'grid-cols-1' : 'grid-cols-7'} gap-4`}>
              {calendarDays && calendarDays.map(({ date, isCurrentMonth, hasEvent, events }, index) => (
                <div
                  key={index}
                  className={`aspect-square border border-primary-200 dark:border-secondary-700 rounded-lg p-2 text-center scroll-container overflow-auto scrollbar-hide ${
                    isCurrentMonth
                      ? 'bg-white dark:bg-secondary-900 hover:bg-primary-100 dark:hover:bg-secondary-800 cursor-pointer'
                      : 'bg-primary-100 dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400'
                  } ${
                    calendarView === 'today' ? 'py-4' : ''
                  }`}
                >
                  <span className="text-sm">{date.getDate()}</span>
                  {hasEvent && (
                    <div className="w-2 h-2 bg-primary-500 dark:bg-primary-300 rounded-full mx-auto mt-1"></div>
                  )}
                  {events && events.map((e) => (
                    <p 
                      key={e.id} 
                      className="p-1 m-1 text-center text-secondary-500 dark:text-secondary-400 bg-primary-50 dark:bg-secondary-900 rounded-lg border border-primary-200 dark:border-secondary-700">
                        {e.title}
                      </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Events */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-primary-500 dark:bg-primary-600 text-white">Upcoming</Badge>
                  <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Annual Business Summit 2025</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    Join industry leaders and entrepreneurs for a day of networking,
                    learning, and innovation at Turkey's premier business event.
                  </p>
                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 15, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Ankara Convention Center</span>
                  </div>
                  <Button
                    className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-accent-500 to-accent-600 dark:from-accent-400 dark:to-accent-500 flex items-center justify-center">
                  <Building className="h-16 w-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <Badge
                    variant="secondary"
                    className="mb-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                  >
                    Early Bird
                  </Badge>
                  <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Manufacturing Expo Turkey</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    Explore the latest in manufacturing technology, equipment,
                    and innovations from leading companies worldwide.
                  </p>
                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>April 10-12, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Istanbul Expo Center</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold text-secondary-100 dark:text-secondary-200 mb-4">
              Don't Miss Out on Networking Opportunities
            </h2>
            <p className="text-xl text-secondary-200 dark:text-secondary-300 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest events and be the first to know about
              exclusive networking opportunities in your industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary-100 dark:bg-secondary-800 text-primary-500 dark:text-primary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
              >
                Subscribe to Updates
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-200 dark:border-primary-300 text-primary-200 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-200"
              >
                View All Events
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
