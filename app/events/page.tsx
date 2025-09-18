import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users, Building, ArrowRight } from 'lucide-react';
import eventsData from '@/data/events.json';

export const metadata = {
  title: 'Events | Work ME',
  description: 'Discover upcoming business events, exhibitions, and tours. Network with professionals and explore new opportunities.',
};

const EventsPage = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events & Activities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay connected with the business community through our curated events, 
              exhibitions, and educational tours designed to foster networking and learning.
            </p>
          </div>

          {/* Event Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {eventsData.map((category) => {
              const IconComponent = getIconForEventType(category.slug);
              
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                    <p className="text-gray-600">{category.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {category.upcoming.map((event) => (
                      <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                        
                        <Button size="sm" variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Calendar View Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Event Calendar</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Today</Button>
                <Button variant="outline" size="sm">Week</Button>
                <Button variant="outline" size="sm">Month</Button>
              </div>
            </div>
            
            {/* Calendar Placeholder */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = i - 5; // Start from a Sunday offset
                const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                const hasEvent = [15, 20, 28].includes(dayNumber); // Sample event dates
                
                return (
                  <div
                    key={i}
                    className={`aspect-square border rounded-lg p-2 text-center ${
                      isCurrentMonth 
                        ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCurrentMonth && (
                      <>
                        <span className="text-sm">{dayNumber}</span>
                        {hasEvent && (
                          <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Events */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Upcoming</Badge>
                  <h3 className="text-xl font-semibold mb-2">Annual Business Summit 2025</h3>
                  <p className="text-gray-600 mb-4">
                    Join industry leaders and entrepreneurs for a day of networking, 
                    learning, and innovation at Turkey's premier business event.
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 15, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Ankara Convention Center</span>
                  </div>
                  <Button className="w-full">
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Building className="h-16 w-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">Early Bird</Badge>
                  <h3 className="text-xl font-semibold mb-2">Manufacturing Expo Turkey</h3>
                  <p className="text-gray-600 mb-4">
                    Explore the latest in manufacturing technology, equipment, 
                    and innovations from leading companies worldwide.
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>April 10-12, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Istanbul Expo Center</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't Miss Out on Networking Opportunities
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest events and be the first to know about 
              exclusive networking opportunities in your industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Subscribe to Updates
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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