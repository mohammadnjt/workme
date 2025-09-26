'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Briefcase, GraduationCap, DollarSign, Users, Package, TrendingUp, Trophy } from 'lucide-react';
import servicesData from '@/data/services.json';

const metadata = {
  title: 'Services | Work ME',
  description: 'Explore our comprehensive business services including consulting, training, financing, and more. Get the support you need to grow your business.',
};

const iconMap = {
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Trophy,
};

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Our Services
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Comprehensive business solutions designed to support your entrepreneurial journey.
              From initial planning to scaling your operations, we provide the services you need to succeed.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {servicesData.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Briefcase;

              return (
                <div
                  key={service.id}
                  className="group bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                    </div>

                    <h3 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
                      {service.name}
                    </h3>

                    <p className="text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-secondary-800 dark:text-secondary-200 mb-3">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-secondary-200 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800 group-hover:bg-primary-500 dark:group-hover:bg-primary-600 group-hover:text-white dark:group-hover:text-white transition-colors duration-300"
                      asChild
                    >
                      <Link href={`/services/${service.slug}`} className="flex items-center justify-center space-x-2">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="bg-primary-500 dark:bg-primary-600 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold text-secondary-100 dark:text-secondary-200 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-secondary-200 dark:text-secondary-300 mb-8 max-w-2xl mx-auto">
              Contact our expert team to discuss how our services can help accelerate your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-secondary-100 dark:bg-secondary-800 text-primary-500 dark:text-primary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
              >
                <Link href="/support">
                  Contact Us
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-200 dark:border-primary-300 text-primary-200 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-200"
              >
                <Link href="/business/form">
                  Start Business Form
                </Link>
              </Button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 text-center mb-12">
              How We Support Your Business Journey
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-primary-500 dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Learning & Development</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Comprehensive training programs and educational resources to build your skills and expertise.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-10 w-10 text-accent-500 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Financial Support</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Access to funding opportunities, financial planning, and investment matching services.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-secondary-800 dark:text-secondary-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Growth & Scaling</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Strategic guidance and operational support to help you scale and expand your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;