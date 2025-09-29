'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useAxios from '@/hooks/useAxios';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface Attendee {
  _id: string;
  email: string;
  name: string;
}

interface Event {
  _id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: Attendee[];
  image: string;
  createdAt: string;
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    type: 'business_tour',
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
  });

  const apiUrl = `/business/events?page=${currentPage}&limit=${limit}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(
    ['getEvents2', currentPage, searchQuery],
    () =>
      useAxios.get<Event[]>(apiUrl)
        .then((res) => res.data)
        .catch((err) => {
          console.error('error getEvents', err);
          throw err;
        })
  );

  useEffect(() => {
    if (data) {
      setEvents(data); // چون ریسپانس مستقیم لیست هست
      setTotalPages(5); // 🔹 باید API تعداد کل رویدادها رو بده. موقتا ثابت گذاشتم
    }
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch events', variant: 'destructive' });
    }
  }, [data, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddEvent = async () => {
    try {
      await useAxios.post('/business/events', formData);
      toast({ title: 'Success', description: 'Event added successfully' });
      setIsAddModalOpen(false);
      setFormData({ type: 'business_tour', title: '', description: '', date: '', location: '', image: '' });
      mutate(); // ریفرش دیتا
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add event', variant: 'destructive' });
    }
  };

  const handleEditEvent = async () => {
    if (!currentEvent) return;
    try {
      await useAxios.put(`/business/events/${currentEvent._id}`, formData);
      toast({ title: 'Success', description: 'Event updated successfully' });
      setIsEditModalOpen(false);
      setCurrentEvent(null);
      mutate();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await useAxios.delete(`/business/events/${eventId}`);
        toast({ title: 'Success', description: 'Event deleted successfully' });
        mutate();
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
      }
    }
  };

  const openEditModal = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      type: event.type,
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16), // برای input datetime-local
      location: event.location,
      image: event.image,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-primary-50/70 dark:bg-primary-900/70 p-6">
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Event Management</h1>
          <div className="flex items-center gap-4">
            <Input placeholder="Search events..." value={searchQuery} onChange={handleSearchChange} />
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">Add Event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business_tour">Business Tour</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
                  <Input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                  <Input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} />
                  <Input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
                  <Input name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} />
                  <Button onClick={handleAddEvent} className="w-full bg-primary-500 hover:bg-primary-600 text-white">Add Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 dark:bg-secondary-900/70 rounded-lg shadow overflow-x-auto border">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-100/70 dark:bg-secondary-800/70">
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Attendees</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center">No events found</td></tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="border-t hover:bg-primary-50/50">
                    <td className="p-4">{event.title}</td>
                    <td className="p-4">{event.type}</td>
                    <td className="p-4">{new Date(event.date).toLocaleString()}</td>
                    <td className="p-4">{event.location}</td>
                    <td className="p-4">{event.attendees.length}</td>
                    <td className="p-4 flex gap-2">
                      <Button variant="outline" onClick={() => openEditModal(event)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_tour">Business Tour</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
              <Input name="description" value={formData.description} onChange={handleInputChange} />
              <Input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} />
              <Input name="location" value={formData.location} onChange={handleInputChange} />
              <Input name="image" value={formData.image} onChange={handleInputChange} />
              <Button onClick={handleEditEvent} className="w-full bg-primary-500 hover:bg-primary-600 text-white">Update Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
