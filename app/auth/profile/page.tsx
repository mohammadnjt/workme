'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, User } from 'lucide-react';
import axios from 'axios';
import { useDataStore } from '@/store/dataStore';
import { useToast } from '@/components/ToastProvider';

interface ProfileData {
  _id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user, setUser, updateUser } = useDataStore();
  const { success, error } = useToast();
  const [name, setName] = useState(user.name || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/auth/profile');
        const profileData: ProfileData = res.data;
        const userData = {
          id: profileData._id,
          email: profileData.email,
          name: profileData.name,
          location: profileData.location,
          role: profileData.role,
          avatar: profileData.avatar,
        };
        setUser(userData);
        setName(profileData.name);
        setAvatar(profileData.avatar);
      } catch (err) {
        error({ title: 'Error', body: 'Failed to fetch profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    if (!user.id) {
      fetchProfile();
    }
  }, [user.id, setUser, error]);

  // Handle name and avatar update
  const handleProfileUpdate = useCallback(async () => {
    try {
      setIsLoading(true);
      let avatarUrl = avatar;

      // If a file is selected, upload it (assuming an endpoint exists)
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const uploadRes = await axios.post('/auth/upload-avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = uploadRes.data.avatarUrl; // Assume API returns the uploaded avatar URL
      }

      const res = await axios.put('/auth/profile', { name, avatar: avatarUrl });
      const updatedProfile: ProfileData = res.data;
      updateUser({
        name: updatedProfile.name,
        avatar: updatedProfile.avatar,
      });
      success({ title: 'Success', body: 'Profile updated successfully.' });
    } catch (err) {
      error({ title: 'Error', body: 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  }, [name, avatar, avatarFile, updateUser, success, error]);

  // Handle password change
  const handlePasswordChange = useCallback(async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      error({ title: 'Error', body: 'Please fill in both password fields.' });
      return;
    }
    try {
      setIsLoading(true);
      await axios.put('/auth/profile/password', passwordData);
      success({ title: 'Success', body: 'Password updated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      error({ title: 'Error', body: 'Failed to update password.' });
    } finally {
      setIsLoading(false);
    }
  }, [passwordData, success, error]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0])); // Preview the image
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />
      <main className="pt-16 py-12">
        <div className="min-h-screen bg-primary-50 dark:bg-primary-900 p-6 transition-colors duration-300">
        <div className="max-w-2xl mx-auto bg-white dark:bg-secondary-900 rounded-lg shadow-md p-6 border border-primary-200 dark:border-secondary-700">
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">User Profile</h1>

            {isLoading && (
            <div className="text-center text-secondary-600 dark:text-secondary-400">Loading...</div>
            )}

            {!isLoading && (
            <div className="space-y-6">
                {/* Profile Information */}
                <div className="space-y-4">
                <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">Profile Information</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-primary-300 dark:border-primary-600">
                    {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-full h-full p-4 text-primary-500 dark:text-primary-300 bg-primary-100 dark:bg-primary-800" />
                    )}
                    </div>
                    <div className="flex-1 space-y-2">
                    <div>
                        <Label className="text-secondary-800 dark:text-secondary-200">Profile Picture</Label>
                        <Input
                        type="text"
                        placeholder="Enter avatar URL"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                        />
                    </div>
                    <div>
                        <Label className="text-secondary-800 dark:text-secondary-200">Upload Picture</Label>
                        <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                        />
                    </div>
                    </div>
                </div>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">Name</Label>
                    <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    />
                </div>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">Email</Label>
                    <Input
                    type="email"
                    value={user.email || 'N/A'}
                    disabled
                    className="bg-primary-100 dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400"
                    />
                </div>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">Location</Label>
                    <Input
                    type="text"
                    value={user.location || 'N/A'}
                    disabled
                    className="bg-primary-100 dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400"
                    />
                </div>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">Role</Label>
                    <Input
                    type="text"
                    value={user.role || 'N/A'}
                    disabled
                    className="bg-primary-100 dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400"
                    />
                </div>
                <Button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                >
                    {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
                </div>

                {/* Change Password */}
                <div className="space-y-4">
                <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">Change Password</h2>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">Current Password</Label>
                    <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    />
                </div>
                <div>
                    <Label className="text-secondary-800 dark:text-secondary-200">New Password</Label>
                    <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    />
                </div>
                <Button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                >
                    {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
                </div>
            </div>
            )}
        </div>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;