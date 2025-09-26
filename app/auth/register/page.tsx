'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import useAxios from '@/hooks/useAxios';
import { useToast } from '@/components/ToastProvider';
import { useDataStore } from '@/store/dataStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { success, warning } = useToast();
  const { setUser } = useDataStore.getState();
  const [loading, setLoading] = useState(false);
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await useAxios.post('auth/register', { name, email, password })
      .then((res) => {
        success({ title: 'Success!', body: 'Wellcome to Workme.' })
        setUser(res.data.user);
        localStorage.setItem('accessToken', res.data.token);
        router.push('/');
      })
      .catch((err) => {
        warning({ title: 'Warning!', body: 'Email is Existed.' })
        console.error('err::::>>', err)
      })
      .finally(() => setLoading(false))
    // router.push('/dashboard');
  };

  return (
    <div className="mt-16 min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />
      <main className="pt-16 py-12">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-secondary-900 rounded-lg shadow-lg border border-primary-200 dark:border-secondary-700 transition-colors duration-300">
          <div className="text-center mb-6">
            <Image src="/ISLIO-Blue.png" alt="ISLIO" width={150} height={60} />
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">Register</h2>
            <p className="text-secondary-600 dark:text-secondary-400">Create your Work ME account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-secondary-800 dark:text-secondary-200">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-secondary-800 dark:text-secondary-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-secondary-800 dark:text-secondary-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
            >
              Register
            </Button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary-500 dark:text-primary-300 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}