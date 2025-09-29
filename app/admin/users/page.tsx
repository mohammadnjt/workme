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

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  // location: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export default function UserManagement() {
  const {user} = useDataStore();
  const router = useRouter();
    
  const [users, setUsers] = useState<any>([]);
  // const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Adjusted to match your API example
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    // location: '',
    avatar: '',
  });

  // Construct the API URL with search query
  const apiUrl = `admin/users?page=${currentPage}&limit=${limit}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;

  const { data, error, isLoading } = useSWR(
    ['getUsers', currentPage, searchQuery],
    () =>
      useAxios.get<UserResponse>(apiUrl)
        .then((res) => res.data)
        .catch((err) => {
          console.error('error getUsers', err);
          throw err;
        }),
  );

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      setTotalPages(data.totalPages);
    }
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  }, [data, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddUser = async () => {
    try {
      await useAxios.post('/admin/users', formData);
      toast({ title: 'Success', description: 'User added successfully' });
      setIsAddModalOpen(false);
      setFormData({ email: '', name: '', role: '', 
        // location: '',
         avatar: '' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add user', variant: 'destructive' });
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;
    try {
      await useAxios.put(`/admin/users/${currentUser._id}`, formData);
      toast({ title: 'Success', description: 'User updated successfully' });
      setIsEditModalOpen(false);
      setCurrentUser(null);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await useAxios.delete(`/admin/users/${userId}`);
        toast({ title: 'Success', description: 'User deleted successfully' });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
      }
    }
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      // location: user.location,
      avatar: user.avatar || '',
    });
    setIsEditModalOpen(true);
  };

  if(user.role !== 'admin') return router.push('/');

  return (
    <div className="min-h-screen bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md text-secondary-800 dark:text-secondary-200 transition-colors duration-300 p-6">
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white/70 dark:bg-secondary-900/70 border-primary-200 dark:border-secondary-700"
            />
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">Add User</Button>
              </DialogTrigger>
              <DialogContent className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border border-primary-200 dark:border-secondary-700">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="business_owner">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    name="location"
                    placeholder="Location"
                    // value={formData.location}
                    onChange={handleInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Input
                    name="avatar"
                    placeholder="Avatar URL (optional)"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="bg-white/70 dark:bg-secondary-900/70"
                  />
                  <Button
                    onClick={handleAddUser}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Add User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md rounded-lg shadow overflow-x-auto border border-primary-200 dark:border-secondary-700">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-100/70 dark:bg-secondary-800/70">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">No users found</td>
                </tr>
              ) : (
                users.map((user:any) => (
                  <tr key={user._id} className="border-t border-primary-200 dark:border-secondary-700 hover:bg-primary-50/50 dark:hover:bg-secondary-800/50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">location</td>
                    {/* <td className="p-4">{user.location}</td> */}
                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="border-primary-500 text-primary-500 hover:bg-primary-100"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => handleDeleteUser(user._id)}
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

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border border-primary-200 dark:border-secondary-700">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/70 dark:bg-secondary-900/70"
              />
              <Input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white/70 dark:bg-secondary-900/70"
              />
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="bg-white/70 dark:bg-secondary-900/70">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="business_owner">Business Owner</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="location"
                placeholder="Location"
                // value={formData.location}
                onChange={handleInputChange}
                className="bg-white/70 dark:bg-secondary-900/70"
              />
              <Input
                name="avatar"
                placeholder="Avatar URL (optional)"
                value={formData.avatar}
                onChange={handleInputChange}
                className="bg-white/70 dark:bg-secondary-900/70"
              />
              <Button
                onClick={handleEditUser}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
              >
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}