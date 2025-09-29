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

interface Research {
  _id: string;
  topic: string;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  mainFile?: string;
  previewFile?: string;
}

export default function ResearchManagement() {
  const [researches, setResearches] = useState<Research[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResearch, setCurrentResearch] = useState<Research | null>(null);

  const [formData, setFormData] = useState({
    topic: '',
    title: '',
    content: '',
  });

  const [mainFile, setMainFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const apiUrl = `/research/research?page=${currentPage}&limit=${limit}${
    searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
  }${filterTopic !== 'all' ? `&topic=${encodeURIComponent(filterTopic)}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(
    ['getResearch', currentPage, searchQuery, filterTopic],
    () =>
      useAxios
        .get<Research[]>(apiUrl)
        .then((res) => res.data)
        .catch((err) => {
          console.error('error getResearch', err);
          throw err;
        })
  );

  useEffect(() => {
    if (data) {
      setResearches(data);
      setTotalPages(5); // 🔹 فعلاً ثابت، بهتره API تعداد صفحات رو بده
    }
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch research articles',
        variant: 'destructive',
      });
    }
  }, [data, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddResearch = async () => {
    try {
      const fd = new FormData();
      fd.append('topic', formData.topic);
      fd.append('title', formData.title);
      fd.append('content', formData.content);
      if (mainFile) fd.append('mainFile', mainFile);
      if (previewFile) fd.append('previewFile', previewFile);

      await useAxios.post('/research/research', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({ title: 'Success', description: 'Research article added successfully' });
      setIsAddModalOpen(false);
      setFormData({ topic: '', title: '', content: '' });
      setMainFile(null);
      setPreviewFile(null);
      mutate();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add article', variant: 'destructive' });
    }
  };

  const handleEditResearch = async () => {
    if (!currentResearch) return;
    try {
      const fd = new FormData();
      fd.append('topic', formData.topic);
      fd.append('title', formData.title);
      fd.append('content', formData.content);
      if (mainFile) fd.append('mainFile', mainFile);
      if (previewFile) fd.append('previewFile', previewFile);

      await useAxios.put(`/research/research/${currentResearch._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({ title: 'Success', description: 'Research article updated successfully' });
      setIsEditModalOpen(false);
      setCurrentResearch(null);
      setMainFile(null);
      setPreviewFile(null);
      mutate();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update article', variant: 'destructive' });
    }
  };

  const handleDeleteResearch = async (researchId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await useAxios.delete(`/research/research/${researchId}`);
        toast({ title: 'Success', description: 'Article deleted successfully' });
        mutate();
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete article', variant: 'destructive' });
      }
    }
  };

  const openEditModal = (research: Research) => {
    setCurrentResearch(research);
    setFormData({
      topic: research.topic,
      title: research.title,
      content: research.content,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-primary-50/70 dark:bg-primary-900/70 p-6">
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Research Management</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Research</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    name="topic"
                    placeholder="Topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="content"
                    placeholder="Content"
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="file"
                    onChange={(e) => setMainFile(e.target.files?.[0] || null)}
                  />
                  <Input
                    type="file"
                    onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    onClick={handleAddResearch}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Add Article
                  </Button>
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
                <th className="p-4 text-left">Topic</th>
                <th className="p-4 text-left">Views</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : researches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    No articles found
                  </td>
                </tr>
              ) : (
                researches.map((r) => (
                  <tr key={r._id} className="border-t hover:bg-primary-50/50">
                    <td className="p-4">{r.title}</td>
                    <td className="p-4">{r.topic}</td>
                    <td className="p-4">{r.views}</td>
                    <td className="p-4">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button variant="outline" onClick={() => openEditModal(r)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteResearch(r._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Research</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input name="topic" value={formData.topic} onChange={handleInputChange} />
              <Input name="title" value={formData.title} onChange={handleInputChange} />
              <Input name="content" value={formData.content} onChange={handleInputChange} />
              <Input
                type="file"
                onChange={(e) => setMainFile(e.target.files?.[0] || null)}
              />
              <Input
                type="file"
                onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleEditResearch}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
              >
                Update Article
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
