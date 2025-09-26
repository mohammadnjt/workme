'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-md p-8 border border-primary-200 dark:border-secondary-700">
          <div className="text-8xl font-bold text-primary-500 dark:text-primary-300 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-secondary-600 dark:text-secondary-400 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
              asChild
            >
              <Link href="/business">
                <Search className="h-4 w-4 mr-2" />
                Explore Business
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}