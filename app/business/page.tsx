import React from 'react';
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

export const metadata = {
  title: 'Business Discovery | Work ME',
  description: 'Discover business opportunities across Turkey. Explore categories, view interactive maps, and access business information forms.',
};

const BusinessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Categories</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {categoriesData.map((category) => (
                    <AccordionItem key={category.id} value={category.slug}>
                      <AccordionTrigger className="text-left">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-600 mb-3">
                          {category.description}
                        </p>
                        <Link
                          href={`/business/${category.slug}`}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Business Discovery
                </h1>
                <p className="text-xl text-gray-600">
                  Explore business opportunities across Turkey and discover your ideal venture
                </p>
              </div>

              {/* Interactive Map Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Business Map of Turkey
                  </h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Click on Ankara (highlighted in pink) to explore detailed business information, 
                  advantages, and opportunities in Turkey's capital city.
                </p>
                
                <BusinessMap />
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Interactive map showing business opportunities across Turkey. 
                    More cities coming soon!
                  </p>
                </div>
              </div>

              {/* Business Information Form Link */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Business Information Form
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Ready to start your business journey? Fill out our comprehensive 
                      business information form to get detailed insights, requirements, 
                      and guidance for your specific business idea.
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Our form covers everything from capital requirements and equipment 
                      needs to licensing procedures and market analysis.
                    </p>
                    <Button size="lg" asChild>
                      <Link href="/business/form" className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Access Business Form</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">13</div>
                  <div className="text-gray-700">Business Categories</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">81</div>
                  <div className="text-gray-700">Cities in Turkey</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                  <div className="text-gray-700">Business Opportunities</div>
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