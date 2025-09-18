"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Building, Filter } from 'lucide-react';
import categoriesData from '@/data/categories.json';
import servicesData from '@/data/services.json';

function SearchResults() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country') || '';
  const city = searchParams.get('city') || '';
  const business = searchParams.get('business') || '';

  // Mock search results based on query parameters
  const getSearchResults = () => {
    const results: any[] = [];

    // Add matching categories
    if (business) {
      const matchingCategories = categoriesData.filter(category => 
        category.name.toLowerCase().includes(business.toLowerCase()) ||
        category.description.toLowerCase().includes(business.toLowerCase())
      );
      results.push(...matchingCategories.map(cat => ({ ...cat, type: 'category' })));
    }

    // Add matching services
    if (business) {
      const matchingServices = servicesData.filter(service => 
        service.name.toLowerCase().includes(business.toLowerCase()) ||
        service.description.toLowerCase().includes(business.toLowerCase())
      );
      results.push(...matchingServices.map(serv => ({ ...serv, type: 'service' })));
    }

    // If no specific matches, return some default results
    if (results.length === 0) {
      results.push(
        ...categoriesData.slice(0, 3).map(cat => ({ ...cat, type: 'category' })),
        ...servicesData.slice(0, 2).map(serv => ({ ...serv, type: 'service' }))
      );
    }

    return results;
  };

  const searchResults = getSearchResults();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            </div>
            
            <div className="space-y-2">
              {country && (
                <p className="text-gray-600">
                  <span className="font-medium">Country:</span> {country}
                </p>
              )}
              {city && (
                <p className="text-gray-600">
                  <span className="font-medium">City:</span> {city}
                </p>
              )}
              {business && (
                <p className="text-gray-600">
                  <span className="font-medium">Business Type:</span> {business}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Found {searchResults.length} results matching your criteria
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <Button variant="outline" size="sm">
              All Types
            </Button>
            <Button variant="outline" size="sm">
              Business Categories
            </Button>
            <Button variant="outline" size="sm">
              Services
            </Button>
            <Button variant="outline" size="sm">
              Location
            </Button>
          </div>

          {/* Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant={result.type === 'category' ? 'default' : 'secondary'}>
                      {result.type === 'category' ? 'Business Category' : 'Service'}
                    </Badge>
                    {result.type === 'category' ? (
                      <Building className="h-5 w-5 text-primary" />
                    ) : (
                      <Search className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{result.name}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {result.description}
                  </p>
                  
                  {city && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Available in {city}</span>
                    </div>
                  )}
                  
                  <Button size="sm" className="w-full">
                    {result.type === 'category' ? 'Explore Category' : 'View Service'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results State */}
          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No results found
              </h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or explore our categories and services.
              </p>
              <div className="space-x-4">
                <Button variant="outline">
                  View All Categories
                </Button>
                <Button>
                  Browse Services
                </Button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              You might also be interested in
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Business Information Form</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get detailed guidance for your business idea with our comprehensive form.
                </p>
                <Button size="sm" variant="outline">
                  Fill Out Form
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Upcoming Events</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Network with other entrepreneurs at our business events and exhibitions.
                </p>
                <Button size="sm" variant="outline">
                  View Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}