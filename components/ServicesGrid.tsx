'use client';

import React, { useRef } from 'react';
import { useInView } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, GraduationCap, DollarSign, Users, Package, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

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

const serviceCards = [
  {
    id: 1,
    image: "/rectangle-34624278-3.png",
    category: "Bussiness",
  },
  {
    id: 2,
    image: "/rectangle-34624278-3.png",
    category: "Bussiness",
  },
  {
    id: 3,
    image: "/rectangle-34624278-3.png",
    category: "Bussiness",
  },
];


const ServicesGrid: React.FC<ServicesGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section className="mx-40 py-5">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-[#0d0d12] text-[28px] leading-[39.2px] [font-family:'Poppins',Helvetica] tracking-[0]">
          Services
        </h2>

        <Button
          variant="outline"
          className="h-[52px] w-[196px] bg-white border-[#a4abb866] rounded-[10px] [font-family:'Poppins',Helvetica] font-normal text-[#808897] text-base tracking-[0] leading-[22.4px]"
        >
          View All Services
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {serviceCards.map((card) => (
          <Card
            key={card.id}
            className="w-[368px] border-[#a4abb866] rounded-[10px] overflow-hidden"
          >
            <CardContent className="p-0 relative">
              <img
                className="w-full h-full object-cover"
                alt="Rectangle"
                src={card.image}
              />

              <div className="absolute top-[18px] left-[18px]">
                <Badge
                  variant="secondary"
                  className="w-[108px] h-[42px] bg-white rounded-[10px] border border-solid border-[#a4abb866] flex items-center justify-center"
                >
                  <span className="text-[#01c4c6] [font-family:'Poppins',Helvetica] font-medium text-sm tracking-[0] leading-[19.6px]">
                    {card.category}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;