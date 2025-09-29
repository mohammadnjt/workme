/* eslint-disable */

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
import { useDataStore } from '@/store/dataStore';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Business {
  _id: string;
  name: string;
  brief: string;
  category: { _id: string; name: string };
  owner: { _id: string; email: string; name: string };
  location: string;
  expertiseLevel: string;
  suitableLocationType: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessResponse {
  success: boolean;
  data: {
    businesses: Business[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
}

export default function BusinessManagement() {
  const {user} = useDataStore();
  const router = useRouter();
  
  const [businesses, setBusinesses] = useState<any>([]);
  // const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    suitableLocationType: '',
    suitableCities: '',
    category: 'all',
    expertiseLevel: 'all',
    location: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [isEditBusinessModalOpen, setIsEditBusinessModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [businessFormData, setBusinessFormData] = useState({
    name: '',
    brief: '',
    category: '',
    owner: '',
    location: '',
    expertiseLevel: '',
    suitableLocationType: '',
  });
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '', image: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryData, setEditingCategoryData] = useState({ name: '', description: '', image: '' });

  // Construct API URL for businesses
  const businessApiUrl = `business/business?page=${currentPage}&limit=${limit}${
    searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
  }${filters.suitableLocationType ? `&suitableLocationType=${filters.suitableLocationType}` : ''}${
    filters.suitableCities ? `&suitableCities=${filters.suitableCities}` : ''
  }${filters.category && filters.category !== 'all' ? `&category=${filters.category}` : ''}${
    filters.expertiseLevel && filters.expertiseLevel !== 'all' ? `&expertiseLevel=${filters.expertiseLevel}` : ''
  }${filters.location ? `&location=${filters.location}` : ''}&sortBy=${
    filters.sortBy
  }&sortOrder=${filters.sortOrder}`;

  // Fetch businesses
  const { data: businessData, error: businessError, isLoading: businessLoading } = useSWR(
    ['getBusinesses', currentPage, searchQuery, filters],
    () =>
      useAxios.get<BusinessResponse>(businessApiUrl)
        .then((res:any) => res.data)
        .catch((err:any) => {
          console.error('error getBusinesses', err);
          throw err;
        }),
  );

  // Fetch categories
  const { data: categoryData, error: categoryError } = useSWR(
    'getCategories',
    () =>
      useAxios.get('business/categories')
        .then((res) => res.data)
        .catch((err) => {
          console.error('error getCategories', err);
          throw err;
        }),
  );

  useEffect(() => {
    if (businessData?.success) {
      setBusinesses(businessData.data.businesses);
      setTotalPages(businessData.data.pagination.pages);
    }
    if (businessError) {
      toast({ title: 'Error', description: 'Failed to fetch businesses', variant: 'destructive' });
    }
    if (categoryData) {
      setCategories(categoryData);
    }
    if (categoryError) {
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    }
  }, [businessData, businessError, categoryData, categoryError]);

  const handleBusinessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessFormData({ ...businessFormData, [e.target.name]: e.target.value });
  };

  const handleBusinessSelectChange = (name: string, value: string) => {
    setBusinessFormData({ ...businessFormData, [name]: value });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
  };

  const handleEditingCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCategoryData({ ...editingCategoryData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddBusiness = async () => {
    try {
      await useAxios.post('/business/business', businessFormData);
      toast({ title: 'Success', description: 'Business added successfully' });
      setIsAddBusinessModalOpen(false);
      setBusinessFormData({
        name: '',
        brief: '',
        category: '',
        owner: '',
        location: '',
        expertiseLevel: '',
        suitableLocationType: '',
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add business', variant: 'destructive' });
    }
  };

  const handleEditBusiness = async () => {
    if (!currentBusiness) return;
    try {
      await useAxios.put(`/business/business/${currentBusiness._id}`, businessFormData);
      toast({ title: 'Success', description: 'Business updated successfully' });
      setIsEditBusinessModalOpen(false);
      setCurrentBusiness(null);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update business', variant: 'destructive' });
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (confirm('Are you sure you want to delete this business?')) {
      try {
        await useAxios.delete(`/business/business/${businessId}`);
        toast({ title: 'Success', description: 'Business deleted successfully' });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete business', variant: 'destructive' });
      }
    }
  };

  const handleAddCategory = async () => {
    try {
      await useAxios.post('/business/categories', categoryFormData);
      toast({ title: 'Success', description: 'Category added successfully' });
      setIsAddCategoryModalOpen(false);
      setCategoryFormData({ name: '', description: '', image: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add category', variant: 'destructive' });
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    try {
      await useAxios.put(`/business/categories/${categoryId}`, editingCategoryData);
      toast({ title: 'Success', description: 'Category updated successfully' });
      setEditingCategoryId(null);
      setEditingCategoryData({ name: '', description: '', image: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await useAxios.delete(`/business/categories/${categoryId}`);
        toast({ title: 'Success', description: 'Category deleted successfully' });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
      }
    }
  };

  const openEditBusinessModal = (business: Business) => {
    setCurrentBusiness(business);
    setBusinessFormData({
      name: business.name,
      brief: business.brief,
      category: business.category._id,
      owner: business.owner._id,
      location: business.location,
      expertiseLevel: business.expertiseLevel,
      suitableLocationType: business.suitableLocationType,
    });
    setIsEditBusinessModalOpen(true);
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
  };

  if(user.role !== 'admin') return router.push('/');

  return (
    <div className="min-h-screen bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md text-secondary-800 dark:text-secondary-200 transition-colors duration-300 p-6">
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        {/* Business Management Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Business Management</h1>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-white/70 dark:bg-secondary-900/70 border-primary-200 dark:border-secondary-700"
              />
                  <Button onClick={() => router.push('/admin/business/form')} className="bg-primary-500 hover:bg-primary-600 text-white">Add Business</Button>
              {/* <Dialog open={isAddBusinessModalOpen} onOpenChange={setIsAddBusinessModalOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border border-primary-200 dark:border-secondary-700">
                  <DialogHeader>
                    <DialogTitle>Add New Business</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      name="name"
                      placeholder="Business Name"
                      value={businessFormData.name}
                      onChange={handleBusinessInputChange}
                      className="bg-white/70 dark:bg-secondary-900/70"
                    />
                    <Input
                      name="brief"
                      placeholder="Brief Description"
                      value={businessFormData.brief}
                      onChange={handleBusinessInputChange}
                      className="bg-white/70 dark:bg-secondary-900/70"
                    />
                    <Select
                      value={businessFormData.category}
                      onValueChange={(value) => handleBusinessSelectChange('category', value)}
                    >
                      <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      name="owner"
                      placeholder="Owner ID"
                      value={businessFormData.owner}
                      onChange={handleBusinessInputChange}
                      className="bg-white/70 dark:bg-secondary-900/70"
                    />
                    <Input
                      name="location"
                      placeholder="Location"
                      value={businessFormData.location}
                      onChange={handleBusinessInputChange}
                      className="bg-white/70 dark:bg-secondary-900/70"
                    />
                    <Select
                      value={businessFormData.expertiseLevel}
                      onValueChange={(value) => handleBusinessSelectChange('expertiseLevel', value)}
                    >
                      <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                        <SelectValue placeholder="Select Expertise Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={businessFormData.suitableLocationType}
                      onValueChange={(value) => handleBusinessSelectChange('suitableLocationType', value)}
                    >
                      <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                        <SelectValue placeholder="Select Location Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private_house_apartment">Private House/Apartment</SelectItem>
                        <SelectItem value="shed">Shed</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddBusiness}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Add Business
                    </Button>
                  </div>
                </DialogContent>
              </Dialog> */}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Input
              name="suitableCities"
              placeholder="Suitable Cities (e.g., Ankara)"
              value={filters.suitableCities}
              onChange={(e) => handleFilterChange('suitableCities', e.target.value)}
              className="bg-white/70 dark:bg-secondary-900/70"
            />
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.expertiseLevel}
              onValueChange={(value) => handleFilterChange('expertiseLevel', value)}
            >
              <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                <SelectValue placeholder="Select Expertise Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Businesses Table */}
          <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md rounded-lg shadow overflow-x-auto border border-primary-200 dark:border-secondary-700">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-100/70 dark:bg-secondary-800/70">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Brief</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Owner</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Expertise</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businessLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">No businesses found</td>
                  </tr>
                ) : (
                  businesses.map((business:any) => (
                    <tr
                      key={business._id}
                      className="border-t border-primary-200 dark:border-secondary-700 hover:bg-primary-50/50 dark:hover:bg-secondary-800/50"
                    >
                      <td className="p-4">{business.name}</td>
                      <td className="p-4">{business.brief}</td>
                      <td className="p-4">{business.category.name}</td>
                      <td className="p-4">{business.owner.name}</td>
                      <td className="p-4">{business.location}</td>
                      <td className="p-4">{business.expertiseLevel}</td>
                      <td className="p-4 flex gap-2">
                        <Button
                          variant="outline"
                          className="border-primary-500 text-primary-500 hover:bg-primary-100"
                          onClick={() => openEditBusinessModal(business)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDeleteBusiness(business._id)}
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
              className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>

          {/* Edit Business Modal */}
          <Dialog open={isEditBusinessModalOpen} onOpenChange={setIsEditBusinessModalOpen}>
            <DialogContent className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border border-primary-200 dark:border-secondary-700">
              <DialogHeader>
                <DialogTitle>Edit Business</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  name="name"
                  placeholder="Business Name"
                  value={businessFormData.name}
                  onChange={handleBusinessInputChange}
                  className="bg-white/70 dark:bg-secondary-900/70"
                />
                <Input
                  name="brief"
                  placeholder="Brief Description"
                  value={businessFormData.brief}
                  onChange={handleBusinessInputChange}
                  className="bg-white/70 dark:bg-secondary-900/70"
                />
                <Select
                  value={businessFormData.category}
                  onValueChange={(value) => handleBusinessSelectChange('category', value)}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="owner"
                  placeholder="Owner ID"
                  value={businessFormData.owner}
                  onChange={handleBusinessInputChange}
                  className="bg-white/70 dark:bg-secondary-900/70"
                />
                <Input
                  name="location"
                  placeholder="Location"
                  value={businessFormData.location}
                  onChange={handleBusinessInputChange}
                  className="bg-white/70 dark:bg-secondary-900/70"
                />
                <Select
                  value={businessFormData.expertiseLevel}
                  onValueChange={(value) => handleBusinessSelectChange('expertiseLevel', value)}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                    <SelectValue placeholder="Select Expertise Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={businessFormData.suitableLocationType}
                  onValueChange={(value) => handleBusinessSelectChange('suitableLocationType', value)}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                    <SelectValue placeholder="Select Location Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private_house_apartment">Private House/Apartment</SelectItem>
                    <SelectItem value="shed">Shed</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleEditBusiness}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Update Business
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Management Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Category Management</h1>
            <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">Add Category</Button>
              </DialogTrigger>
              <DialogContent className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border border-primary-200 dark:border-secondary-700">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Category Name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Input
                    name="description"
                    placeholder="Description"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Input
                    name="image"
                    placeholder="Image URL"
                    value={categoryFormData.image}
                    onChange={handleCategoryInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Add Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories Table */}
          <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md rounded-lg shadow overflow-x-auto border border-primary-200 dark:border-secondary-700">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-100/70 dark:bg-secondary-800/70">
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">No categories found</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-t border-primary-200 dark:border-secondary-700 hover:bg-primary-50/50 dark:hover:bg-secondary-800/50"
                      onDoubleClick={() => startEditingCategory(category)}
                    >
                      <td className="p-4">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                        />
                      </td>
                      <td className="p-4">
                        {editingCategoryId === category._id ? (
                          <div className="space-y-2">
                            <Input
                              name="name"
                              value={editingCategoryData.name}
                              onChange={handleEditingCategoryChange}
                              className="bg-white/70 dark:bg-secondary-900/70"
                              placeholder="Category Name"
                            />
                            <Input
                              name="description"
                              value={editingCategoryData.description}
                              onChange={handleEditingCategoryChange}
                              className="bg-white/70 dark:bg-secondary-900/70"
                              placeholder="Description"
                            />
                            <Input
                              name="image"
                              value={editingCategoryData.image}
                              onChange={handleEditingCategoryChange}
                              className="bg-white/70 dark:bg-secondary-900/70"
                              placeholder="Image URL"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditCategory(category._id)}
                                className="bg-primary-500 hover:bg-primary-600 text-white"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingCategoryId(null)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span>{category.name}</span>
                        )}
                      </td>
                      <td className="p-4">{category.description}</td>
                      <td className="p-4 flex gap-2">
                        <Button
                          variant="outline"
                          className="border-primary-500 text-primary-500 hover:bg-primary-100"
                          onClick={() => startEditingCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDeleteCategory(category._id)}
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
        </div>
      </div>
    </div>
  );
}