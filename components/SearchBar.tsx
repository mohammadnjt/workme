'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Animation variants for the section
const sectionVariants:Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Animation variants for the title
const titleVariants:Variants = {
  hidden: { opacity: 0, width: 0 },
  visible: {
    opacity: 1,
    width: 'auto',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.05,
    },
  },
};

// Animation variants for individual characters in the title
const charVariants:Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Animation variants for the description
const descriptionVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.8 } },
};

// Animation variants for the search bar
const searchBarVariants:Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

// Animation variants for dropdowns and button
const inputVariants:Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const SearchBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const router = useRouter();

  // Split the title into two parts for animation
  const titleLines = ['Plans That Work', 'Growth That Lasts'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full py-8 sm:py-12 lg:py-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Title with Typing Effect */}
        <motion.h1
          variants={titleVariants}
          className="font-semibold text-[#0d0d12] dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight [font-family:'Poppins',Helvetica] mb-6 sm:mb-8"
        >
          {titleLines.map((line, index) => (
            <div key={index} className="overflow-hidden">
              {line.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={charVariants}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.h1>

        {/* Animated Description */}
        <motion.p
          variants={descriptionVariants}
          className="font-normal text-[#808897] text-sm sm:text-base md:text-lg leading-relaxed [font-family:'Poppins',Helvetica] mb-8 sm:mb-12 max-w-2xl mx-auto"
        >
          Access ready-made strategies and exclusive opportunities to kickstart
          your journey today.
        </motion.p>

        {/* Animated Search Bar */}
        <motion.div
          variants={searchBarVariants}
          className="w-full max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white dark:bg-slate-600 rounded-lg border border-solid border-[#a4abb866] p-2 sm:p-3">
            {/* Country Select */}
            <motion.div variants={inputVariants} className="flex-1 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[160px] h-12 sm:h-14 border-none dark:bg-slate-600 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <div className="flex w-full px-3 justify-between items-center">
                      <div className="flex flex-col items-start">
                        <span className="text-gray-500 dark:text-slate-300 text-xs">Select Country</span>
                        <span className="text-gray-900 dark:text-white text-sm">Norway</span>
                      </div>
                      <ChevronDown color="black" className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-2 rounded-lg">
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Türkiye
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    United States
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    United Kingdom
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Germany
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            {/* City Select */}
            <motion.div variants={inputVariants} className="flex-1 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[160px] h-12 sm:h-14 border-none dark:bg-slate-600 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <div className="flex w-full px-3 justify-between items-center">
                      <div className="flex flex-col items-start">
                        <span className="text-gray-500 dark:text-slate-300 text-xs">Select City</span>
                        <span className="text-gray-900 dark:text-white text-sm">Haugesund</span>
                      </div>
                      <ChevronDown color="black" className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-2 rounded-lg">
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Oslo
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Bergen
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Stavanger
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Haugesund
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            {/* Business Type Select */}
            <motion.div variants={inputVariants} className="flex-1 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[160px] h-12 sm:h-14 border-none dark:bg-slate-600 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <div className="flex w-full px-3 justify-between items-center">
                      <div className="flex flex-col items-start">
                        <span className="text-gray-500 dark:text-slate-300 text-xs">Business Type/Name</span>
                        <span className="text-gray-900 dark:text-white text-sm">All</span>
                      </div>
                      <ChevronDown color="black" className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-2 rounded-lg">
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Sole Proprietorship
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Partnership
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Limited Liability Company
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                    Franchise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            {/* Search Button */}
            <motion.div variants={inputVariants} className="w-full sm:w-auto px-2">
              <Button
                type="submit"
                className="w-full sm:w-[120px] h-12 sm:h-14 bg-java-500 rounded-lg hover:bg-java-500/90 flex items-center justify-center gap-2"
              >
                <SearchIcon color="white" className="w-5 h-5" />
                <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-sm sm:text-base leading-6">
                  Search
                </span>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SearchBar;