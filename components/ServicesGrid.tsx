'use client';

import React, {useRef} from 'react';
import { useInView } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, GraduationCap, DollarSign, Users, Package, TrendingUp, Trophy } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
}

interface ServicesGridProps {
  title: string;
  items: Service[];
  viewAllHref: string;
}

const iconMap = {
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Trophy,
};

const ServicesGrid: React.FC<ServicesGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section ref={ref}  style={{
          transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-50 dark:bg-primary-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
        <Button
          variant="outline"
          asChild
          className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
        >
          <Link href={viewAllHref} className="flex items-center space-x-2">
            <span>View all Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((service) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Briefcase;

          return (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                </div>

                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors duration-300">
                  {service.name}
                </h3>

                <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center text-primary-500 dark:text-primary-300 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesGrid;