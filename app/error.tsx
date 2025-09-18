"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified 
            and we're working to fix this issue.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left">
              <h2 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h2>
              <pre className="text-xs text-red-700 overflow-auto">
                {error.message}
              </pre>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </a>
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}