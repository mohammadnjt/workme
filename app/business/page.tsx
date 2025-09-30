'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessMap from '@/components/BusinessMap';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FileText, MapPin } from 'lucide-react';
import categoriesData from '@/data/categories.json';
import useAxios from '@/hooks/useAxios';

const metadata = {
  title: 'Business Discovery | Work ME',
  description: 'Discover business opportunities across Turkey. Explore categories, view interactive maps, and access business information forms.',
};

const BusinessPage = () => {
  const [categories, setCategories] = useState(categoriesData);
  
  useEffect(() => {
    useAxios.get('business/categories')
    .then((res) => setCategories(res.data))
    .catch((err) => console.error('err categories', err))
    // .finally(() => )
  }, [])

  console.log('categories', categories)
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6">
                <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Business Categories</h2>

                <Accordion type="single" collapsible className="w-full">
                  {categories.map((category) => (
                    <AccordionItem key={category.id} value={category.slug}>
                      <AccordionTrigger className="text-left text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                          {category.description}
                        </p>
                        <Link
                          href={`/business/${category.slug}`}
                          className="text-sm text-primary-500 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                        >
                          Explore {category.name} →
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Page Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
                  Business Discovery
                </h1>
                <p className="text-xl text-secondary-600 dark:text-secondary-400">
                  Explore business opportunities across Turkey and discover your ideal venture
                </p>
              </div>

              {/* Interactive Map Section */}
              <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-6 w-6 text-primary-500 dark:text-primary-300" />
                  <h2 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-200">
                    Business Map of Turkey
                  </h2>
                </div>

                <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                  Click on Ankara (highlighted in pink) to explore detailed business information,
                  advantages, and opportunities in Turkey's capital city.
                </p>

                <BusinessMap />

                <div className="mt-6 text-center">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                    Interactive map showing business opportunities across Turkey.
                    More cities coming soon!
                  </p>
                </div>
              </div>

              {/* Business Information Form Link */}
              {/* <div className="bg-primary-100 dark:bg-secondary-800 border border-primary-200 dark:border-secondary-700 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                      Business Information Form
                    </h3>
                    <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                      Ready to start your business journey? Fill out our comprehensive
                      business information form to get detailed insights, requirements,
                      and guidance for your specific business idea.
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                      Our form covers everything from capital requirements and equipment
                      needs to licensing procedures and market analysis.
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 text-center m-auto"
                    >
                        <FileText className="h-5 w-5" />
                        <span>Access Business Form</span>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <Link href="/business/form" className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Access Business Form</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div> */}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6 text-center">
                  <div className="text-3xl font-bold text-primary-500 dark:text-primary-300 mb-2">13</div>
                  <div className="text-secondary-700 dark:text-secondary-300">Business Categories</div>
                </div>
                <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6 text-center">
                  <div className="text-3xl font-bold text-accent-500 dark:text-accent-400 mb-2">81</div>
                  <div className="text-secondary-700 dark:text-secondary-300">Cities in Turkey</div>
                </div>
                <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-6 text-center">
                  <div className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">500+</div>
                  <div className="text-secondary-700 dark:text-secondary-300">Business Opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessPage;