'use client';

import React, { useRef, useState } from 'react';
import { useInView } from "framer-motion";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import { Card, CardContent } from './ui/card';

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
const businessTypes = [
  {
    id: 1,
    title: "Sole\nProprietorship",
    icon1: "/shape-6.svg",
    iconActive: "/shape.svg",
    icon2: "/shape-1.svg",
  },
  {
    id: 2,
    title: "Partnership",
    icon1: "/shape-6.svg",
    iconActive: "/shape.svg",
    icon2: "/shape-1.svg",
  },
  {
    id: 3,
    title: "Limited Liability\nCompany - LLC",
    icon1: "/shape-6.svg",
    iconActive: "/shape.svg",
    icon2: "/shape-1.svg",
  },
  {
    id: 4,
    title: "Franchise",
    icon1: "/shape-6.svg",
    iconActive: "/shape.svg",
    icon2: "/shape-1.svg",
  },
  {
    id: 5,
    title: "Nonprofit\nOrganization",
    icon1: "/shape-6.svg",
    iconActive: "/shape.svg",
    icon2: "/shape-1.svg",
  },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[28px] font-semibold text-[#0d0d12] leading-[39.2px] [font-family:'Poppins',Helvetica] tracking-[0] mb-16">
          Find your Ideal Business Type
        </h2>

        <div className="flex justify-center gap-6 mb-16">
          {businessTypes.map((businessType) => (
            <Card
              key={businessType.id}
              className='w-[174px] h-[172px] rounded-[10px] cursor-pointer transition-all duration-200 hover:bg-[#01c4c6] hover:shadow-[0px_8px_35px_#01c4c640] hover:border-0 bg-white border border-solid border-[#a4abb866] group'
            >
              <CardContent className="p-0 h-full flex flex-col items-center justify-between">
                <div className="relative w-[33.33%] h-[34.30%] mt-[28px]">
                  {/* آیکون معمولی */}
                  <img
                    className="absolute w-[66.67%] h-[75.00%] top-[20.83%] left-[25.00%] group-hover:hidden"
                    alt="Shape"
                    src={businessType.isActive ? businessType.iconActive : businessType.icon1}
                  />
                  {/* آیکون در حالت هاور */}
                  <img
                    className="absolute w-[66.67%] h-[75.00%] top-[20.83%] left-[25.00%] hidden group-hover:block"
                    alt="Shape"
                    src={businessType.iconActive}
                  />
                  <img
                    className="absolute w-[75.00%] h-[91.67%] top-[4.17%] left-[8.33%]"
                    alt="Shape"
                    src={businessType.icon2}
                  />
                </div>

                <div className='px-4 pb-8 text-center'>
                  <span className="group-hover:text-white text-[#0d0d12] [font-family:'Poppins',Helvetica] font-medium text-sm leading-[18.2px] tracking-[0] whitespace-pre-line">
                    {businessType.title}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="font-medium text-[#808897] text-base leading-[22.4px] underline [font-family:'Poppins',Helvetica] tracking-[0] hover:text-[#01c4c6] transition-colors duration-200"
          >
            View All Categories
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;