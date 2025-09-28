'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Building, Filter } from 'lucide-react';
import Image from 'next/image';
import categoriesData from '@/data/categories.json';
import servicesData from '@/data/services.json';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

function SearchResults() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country') || '';
  const city = searchParams.get('city') || '';
  const business = searchParams.get('business') || '';

  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isLoaderInView = useInView(loaderRef, { once: false, amount: 0.1 });

  const PAGE_SIZE = 6; // Number of results per page

  // Function to fetch results (simulated with filtering and pagination)
  const fetchResults = (currentPage: number) => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let allResults: any[] = [];

      // Add matching categories
      if (business) {
        const matchingCategories = categoriesData.filter((category) =>
          category.name.toLowerCase().includes(business.toLowerCase()) ||
          category.description.toLowerCase().includes(business.toLowerCase())
        );
        allResults.push(...matchingCategories.map((cat) => ({ ...cat, type: 'category' })));
      }

      // Add matching services
      if (business) {
        const matchingServices = servicesData.filter((service) =>
          service.name.toLowerCase().includes(business.toLowerCase()) ||
          service.description.toLowerCase().includes(business.toLowerCase())
        );
        allResults.push(...matchingServices.map((serv) => ({ ...serv, type: 'service' })));
      }

      // If no specific matches, use all data
      if (allResults.length === 0) {
        allResults = [
          ...categoriesData.map((cat) => ({ ...cat, type: 'category' })),
          ...servicesData.map((serv) => ({ ...serv, type: 'service' })),
        ];
      }

      // Paginate results
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const paginatedResults = allResults.slice(startIndex, startIndex + PAGE_SIZE);

      setResults((prev) => [...prev, ...paginatedResults]);
      setHasMore(paginatedResults.length === PAGE_SIZE);
      setIsLoading(false);
    }, 1000); // Simulated delay
  };

  // Initial load
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1);
  }, [country, city, business]);

  // Infinite scroll effect
  useEffect(() => {
    if (isLoaderInView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage);
    }
  }, [isLoaderInView, hasMore, isLoading, page]);

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Summary */}
          <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-primary-500 dark:text-primary-300" />
              <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">Search Results</h1>
            </div>

            <div className="space-y-2">
              {country && (
                <p className="text-secondary-600 dark:text-secondary-400">
                  <span className="font-medium">Country:</span> {country}
                </p>
              )}
              {city && (
                <p className="text-secondary-600 dark:text-secondary-400">
                  <span className="font-medium">City:</span> {city}
                </p>
              )}
              {business && (
                <p className="text-secondary-600 dark:text-secondary-400">
                  <span className="font-medium">Business Type:</span> {business}
                </p>
              )}
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-4">
              Found {results.length} results matching your criteria
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Filter by:</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
            >
              All Types
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
            >
              Business Categories
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
            >
              Services
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
            >
              Location
            </Button>
          </div>

          {/* Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <motion.div
                key={`${result.type}-${result.id}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="bg-white dark:bg-secondary-900 border-primary-200 dark:border-secondary-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={result.image}
                      alt={result.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={result.type === 'category' ? 'default' : 'secondary'}
                        className={
                          result.type === 'category'
                            ? 'bg-primary-500 dark:bg-primary-600 text-white'
                            : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200'
                        }
                      >
                        {result.type === 'category' ? 'Business Category' : 'Service'}
                      </Badge>
                      {result.type === 'category' ? (
                        <Building className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                      ) : (
                        <Search className="h-5 w-5 text-accent-500 dark:text-accent-400" />
                      )}
                    </div>
                    <CardTitle className="text-lg text-secondary-800 dark:text-secondary-200 mt-2">
                      {result.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-3">
                      {result.description}
                    </p>

                    {city && (
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Available in {city}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      {result.type === 'category' ? 'Explore Category' : 'View Service'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Infinite Scroll Loader */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 dark:border-primary-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* No Results State */}
          {!hasMore && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                No results found
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Try adjusting your search criteria or explore our categories and services.
              </p>
              <div className="space-x-4">
                <Button
                  variant="outline"
                  className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  View All Categories
                </Button>
                <Button className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700">
                  Browse Services
                </Button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!hasMore && results.length > 0 && (
            <div className="mt-12 bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6">
              <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
                You might also be interested in
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 dark:bg-secondary-800 rounded-lg">
                  <h3 className="font-medium text-secondary-800 dark:text-secondary-200 mb-2">Business Information Form</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                    Get detailed guidance for your business idea with our comprehensive form.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    Fill Out Form
                  </Button>
                </div>

                <div className="p-4 bg-primary-50 dark:bg-secondary-800 rounded-lg">
                  <h3 className="font-medium text-secondary-800 dark:text-secondary-200 mb-2">Upcoming Events</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                    Network with other entrepreneurs at our business events and exhibitions.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    View Events
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-50 dark:bg-primary-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-500 dark:border-primary-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-secondary-600 dark:text-secondary-400">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}