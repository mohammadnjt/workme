import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Discover how they take their needs to new heights
            </h1>
            
            <div className="space-y-4 text-lg">
              <p>
                We're more than a platform—we're where innovation and collaboration thrive. 
                Rental helps you save money.
              </p>
              <p>
                Those who use our services get their work done at the lowest cost.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/business" className="flex items-center space-x-2">
                  <span>Explore Businesses</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500" asChild>
                <Link href="/services" className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-orange-300">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">10,000+</span>
                </div>
                <p className="text-orange-100">Active Users</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-orange-100">Businesses Listed</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main illustration container */}
              <div className="relative bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                {/* Person with laptop */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  
                  {/* Speech bubbles */}
                  <div className="relative">
                    {/* Bubble 1 */}
                    <div className="absolute -top-8 -left-4 bg-white text-orange-500 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Innovation
                    </div>
                    
                    {/* Bubble 2 */}
                    <div className="absolute -top-8 -right-4 bg-white text-orange-500 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Growth
                    </div>
                    
                    {/* Bubble 3 */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-500 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Success
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 left-2 w-3 h-3 bg-green-300 rounded-full animate-bounce delay-500"></div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -z-10 -top-4 -left-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-12 h-12 border-2 border-white/30 rounded-full"></div>
              <div className="absolute -z-10 top-1/3 -right-8 w-6 h-6 border-2 border-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;