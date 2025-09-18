import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, BookOpen, FileText } from 'lucide-react';

interface SectionItem {
  title: string;
  href: string;
  icon: 'calendar' | 'book' | 'file';
  description: string;
}

interface SectionGridProps {
  title: string;
  items: SectionItem[];
  viewAllHref?: string;
}

const iconMap = {
  calendar: Calendar,
  book: BookOpen,
  file: FileText,
};

const SectionGrid: React.FC<SectionGridProps> = ({ title, items, viewAllHref }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {viewAllHref && (
          <Button variant="outline" asChild>
            <Link href={viewAllHref} className="flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          
          return (
            <Link
              key={index}
              href={item.href}
              className="group bg-gray-200 hover:bg-gray-100 border border-gray-300 rounded-lg p-8 h-32 flex flex-col items-center justify-center text-center transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-1">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionGrid;