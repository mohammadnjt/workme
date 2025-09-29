'use client';

import React, { useRef, useState } from 'react';
import { useInView, motion, Variants } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, GraduationCap, DollarSign, Users, Package, TrendingUp, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    category: "Business",
    title: "Business Consulting",
    description: "Expert guidance for your business growth"
  },
  {
    id: 2,
    image: "/rectangle-34624278-3.png",
    category: "Business",
    title: "Strategic Planning",
    description: "Comprehensive business strategies"
  },
  {
    id: 3,
    image: "/rectangle-34624278-3.png",
    category: "Business",
    title: "Market Analysis",
    description: "In-depth market research and insights"
  },
  {
    id: 4,
    image: "/rectangle-34624278-3.png",
    category: "Finance",
    title: "Financial Advisory",
    description: "Professional financial guidance"
  },
  {
    id: 5,
    image: "/rectangle-34624278-3.png",
    category: "Marketing",
    title: "Digital Marketing",
    description: "Online presence optimization"
  },
  {
    id: 6,
    image: "/rectangle-34624278-3.png",
    category: "Technology",
    title: "IT Solutions",
    description: "Modern technology implementation"
  },
];

// انیمیشن‌ها
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const hoverVariants: Variants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const ServicesGrid: React.FC<ServicesGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeSlide, setActiveSlide] = useState(0);
  
  // رفرنس‌های navigation برای Swiper
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-20" ref={ref}>
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* هدر بخش */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 lg:mb-16 gap-4">
          <motion.h2 
            className="font-semibold text-[#0d0d12] text-2xl sm:text-3xl lg:text-[28px] leading-[1.2] [font-family:'Poppins',Helvetica] tracking-[0] text-center sm:text-left"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Services
          </motion.h2>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="h-12 sm:h-[52px] w-full sm:w-[196px] bg-white border-[#a4abb866] rounded-[10px] [font-family:'Poppins',Helvetica] font-normal text-[#808897] text-sm sm:text-base tracking-[0] leading-normal hover:bg-[#01c4c6] hover:text-white hover:border-[#01c4c6] transition-all duration-300"
            >
              View All Services
            </Button>
          </motion.div>
        </div>

        {/* Swiper برای موبایل و تبلت */}
        <div className="block lg:hidden mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              pagination={{ 
                clickable: true,
                el: '.services-pagination',
                type: 'bullets'
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              autoplay={{ 
                delay: 4000,
                disableOnInteraction: false 
              }}
              breakpoints={{
                480: { 
                  slidesPerView: 1.5,
                  spaceBetween: 20
                },
                640: { 
                  slidesPerView: 2.2,
                  spaceBetween: 20
                },
                768: { 
                  slidesPerView: 2.5,
                  spaceBetween: 24
                }
              }}
              onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
              className="services-swiper"
            >
              {serviceCards.map((card, index) => (
                <SwiperSlide key={card.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="h-full"
                  >
                    <motion.div
                      variants={hoverVariants}
                      className="h-full"
                    >
                      <ServiceCard card={card} index={index} />
                    </motion.div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                ref={navigationPrevRef}
                className="w-10 h-10 rounded-full bg-white border border-[#a4abb866] flex items-center justify-center hover:bg-[#01c4c6] hover:text-white hover:border-[#01c4c6] transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="services-pagination flex gap-2"></div>
              
              <button
                ref={navigationNextRef}
                className="w-10 h-10 rounded-full bg-white border border-[#a4abb866] flex items-center justify-center hover:bg-[#01c4c6] hover:text-white hover:border-[#01c4c6] transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Grid برای دسکتاپ */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {serviceCards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover="hover"
              className="h-full"
            >
              <motion.div
                variants={hoverVariants}
                className="h-full"
              >
                <ServiceCard card={card} index={index} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

// کامپوننت کارت سرویس
const ServiceCard = ({ card, index }: { card: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full h-full border-[#a4abb866] rounded-[10px] overflow-hidden group cursor-pointer bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-[#01c4c6]/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        {/* تصویر */}
        <motion.div 
          className="relative overflow-hidden"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
            alt={card.title}
            src={card.image}
          />
          
          {/* Overlay روی هاور */}
          <motion.div 
            className="absolute inset-0 bg-[#01c4c6] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 0.2 : 0 }}
          />
        </motion.div>

        {/* Badge */}
        <motion.div 
          className="absolute top-4 left-4"
          animate={{ 
            y: isHovered ? -2 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Badge
            variant="secondary"
            className="h-8 sm:h-10 px-3 sm:px-4 bg-white rounded-[10px] border border-solid border-[#a4abb866] flex items-center justify-center backdrop-blur-sm"
          >
            <motion.span 
              className="text-[#01c4c6] [font-family:'Poppins',Helvetica] font-medium text-xs sm:text-sm tracking-[0] leading-normal"
              animate={{ color: isHovered ? "#01c4c6" : "#01c4c6" }}
            >
              {card.category}
            </motion.span>
          </Badge>
        </motion.div>

        {/* محتوای متنی */}
        <motion.div 
          className="p-4 sm:p-6"
          initial={false}
          animate={{ 
            backgroundColor: isHovered ? "rgba(1, 196, 198, 0.02)" : "rgba(255, 255, 255, 1)" 
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            className="font-semibold text-lg sm:text-xl text-[#0d0d12] mb-2 [font-family:'Poppins',Helvetica]"
            animate={{ color: isHovered ? "#01c4c6" : "#0d0d12" }}
            transition={{ duration: 0.3 }}
          >
            {card.title}
          </motion.h3>
          
          <motion.p 
            className="text-[#808897] text-sm sm:text-base leading-relaxed [font-family:'Poppins',Helvetica]"
            animate={{ opacity: isHovered ? 0.8 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {card.description}
          </motion.p>

          {/* دکمه مخفی در حالت هاور */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              className="w-full bg-[#01c4c6] hover:bg-[#00a8a9] text-white transition-all duration-300"
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Indicator برای اسلاید */}
        <motion.div
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#01c4c6] opacity-0 group-hover:opacity-100"
          animate={{ 
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ 
            duration: 1,
            repeat: isHovered ? Infinity : 0
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ServicesGrid;