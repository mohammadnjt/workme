import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <Button variant="outline" asChild>
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
            className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
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