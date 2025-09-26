'use client';

import React, { useRef } from 'react';
import { useInView } from "framer-motion";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CategoryGridProps {
  title: string;
  items: Category[];
  viewAllHref: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <section ref={ref}  style={{
          transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
        <Button
          variant="outline"
          asChild
          className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
        >
          <Link href={viewAllHref} className="flex items-center space-x-2">
            <span>View all Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((category) => (
          <Link
            key={category.id}
            href={`/business/${category.slug}`}
            className="group bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-black/20 dark:group-hover:bg-black/30 transition-colors duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors duration-300 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;