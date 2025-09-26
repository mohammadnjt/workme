import { Calendar, MapPin } from 'lucide-react'
import React from 'react'
import { Button } from './button'

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export default function EventCard({event}:any) {
  return (
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
  )
}
