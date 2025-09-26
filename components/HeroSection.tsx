'use client';

import React, {useRef} from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Users, TrendingUp } from 'lucide-react';
import CounterNumber from './ui/counterNumber';

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  console.log('number', )
  return (
    <section ref={ref}  style={{
          transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }} className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-secondary-100 dark:text-secondary-200">
              Discover how they take their needs to new heights
            </h1>

            <div className="space-y-4 text-lg text-secondary-200 dark:text-secondary-300">
              <p>
                We're more than a platform—we're where innovation and collaboration thrive.
                Rental helps you save money.
              </p>
              <p>
                Those who use our services get their work done at the lowest cost.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-secondary-100 dark:bg-secondary-800 text-primary-500 dark:text-primary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
              >
                <Link href="/business" className="flex items-center space-x-2">
                  <span>Explore Businesses</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-200 dark:border-primary-300 text-primary-200 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-200"
              >
                <Link href="/services" className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-primary-300 dark:border-secondary-700">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-secondary-200 dark:text-secondary-300" />
                  <span className="text-2xl font-bold text-secondary-100 dark:text-secondary-200">
                    {isInView && <CounterNumber number={10000} duration={10} />}
                  </span>
                </div>
                <p className="text-secondary-200 dark:text-secondary-300">Active Users</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-secondary-200 dark:text-secondary-300" />
                  <span className="text-2xl font-bold text-secondary-100 dark:text-secondary-200">
                    {isInView && <CounterNumber number={50000} duration={10} />}
                  </span>
                </div>
                <p className="text-secondary-200 dark:text-secondary-300">Businesses Listed</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main illustration container */}
              <div className="relative bg-white/10 dark:bg-secondary-900/20 rounded-3xl p-8 backdrop-blur-sm">
                {/* Person with laptop */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-primary-200 dark:bg-primary-300 rounded-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-primary-500 dark:text-primary-200" />
                  </div>

                  {/* Speech bubbles */}
                  <div className="relative">
                    {/* Bubble 1 */}
                    <div className="absolute -top-8 -left-4 bg-white dark:bg-secondary-800 text-primary-500 dark:text-primary-300 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Innovation
                    </div>

                    {/* Bubble 2 */}
                    <div className="absolute -top-8 -right-4 bg-white dark:bg-secondary-800 text-primary-500 dark:text-primary-300 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Growth
                    </div>

                    {/* Bubble 3 */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-secondary-800 text-primary-500 dark:text-primary-300 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Success
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-accent-300 dark:bg-accent-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-accent-200 dark:bg-accent-500 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 left-2 w-3 h-3 bg-accent-400 dark:bg-accent-300 rounded-full animate-bounce delay-500"></div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -z-10 -top-4 -left-4 w-8 h-8 border-2 border-primary-200 dark:border-secondary-700 rounded-full"></div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-12 h-12 border-2 border-primary-200 dark:border-secondary-700 rounded-full"></div>
              <div className="absolute -z-10 top-1/3 -right-8 w-6 h-6 border-2 border-primary-200 dark:border-secondary-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;