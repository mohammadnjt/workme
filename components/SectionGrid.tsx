'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, FileText, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useInView,
  Variants
} from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const eventCards = [
  {
    id: 1,
    image: "/rectangle-34624278-3.png",
    title: "Nonprofit Organization",
    date: "20/02/2025 - 18:30",
    description: "Learn about nonprofit management and funding strategies"
  },
  {
    id: 2,
    image: "/rectangle-34624278-3.png",
    title: "Business Startup Workshop",
    date: "22/02/2025 - 14:00",
    description: "Essential steps for launching your business successfully"
  },
  {
    id: 3,
    image: "/rectangle-34624278-3.png",
    title: "Digital Marketing Summit",
    date: "25/02/2025 - 09:30",
    description: "Latest trends in digital marketing and social media"
  },
  {
    id: 4,
    image: "/rectangle-34624278-3.png",
    title: "Financial Planning Seminar",
    date: "28/02/2025 - 16:00",
    description: "Investment strategies and financial management"
  },
  {
    id: 5,
    image: "/rectangle-34624278-3.png",
    title: "Leadership Conference",
    date: "02/03/2025 - 10:00",
    description: "Developing leadership skills for business growth"
  },
  {
    id: 6,
    image: "/rectangle-34624278-3.png",
    title: "Tech Innovation Expo",
    date: "05/03/2025 - 11:00",
    description: "Exploring the latest technological advancements"
  },
];

// انیمیشن‌ها
const containerVariants:Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants:Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 0.8
    }
  }
};

const hoverVariants:Variants = {
  hover: {
    y: -12,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const buttonHoverVariants:Variants = {
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

const SectionGrid: React.FC<SectionGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<'Events' | 'Research'>('Events');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  return (
    <section className="w-full bg-[#01c4c6] relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Tab Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex-1 flex justify-center w-full sm:w-auto"
          >
            <Button
              variant="outline"
              className={`w-full sm:w-48 lg:w-64 h-14 lg:h-16 border-2 ${
                activeTab === 'Events' 
                  ? 'bg-white/20 border-white text-white' 
                  : 'border-[#ffffff66] bg-transparent text-white'
              } text-lg sm:text-xl lg:text-2xl font-semibold [font-family:'Poppins',Helvetica] backdrop-blur-sm transition-all duration-300`}
              onClick={() => setActiveTab('Events')}
            >
              Events
            </Button>
          </motion.div>

          <motion.div
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex-1 flex justify-center w-full sm:w-auto"
          >
            <Button
              variant="outline"
              className={`w-full sm:w-48 lg:w-64 h-14 lg:h-16 border-2 ${
                activeTab === 'Research' 
                  ? 'bg-white/20 border-white text-white' 
                  : 'border-[#ffffff66] bg-transparent text-white'
              } text-lg sm:text-xl lg:text-2xl font-semibold [font-family:'Poppins',Helvetica] backdrop-blur-sm transition-all duration-300`}
              onClick={() => setActiveTab('Research')}
            >
              Research
            </Button>
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'Events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Swiper for Mobile & Tablet */}
              <div className="block lg:hidden mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    pagination={{ 
                      clickable: true,
                      el: '.events-pagination',
                    }}
                    navigation={{
                      prevEl: navigationPrevRef.current,
                      nextEl: navigationNextRef.current,
                    }}
                    autoplay={{ 
                      delay: 3500,
                      disableOnInteraction: false 
                    }}
                    breakpoints={{
                      480: { 
                        slidesPerView: 1.5,
                        spaceBetween: 24
                      },
                      640: { 
                        slidesPerView: 2.1,
                        spaceBetween: 24
                      },
                      768: { 
                        slidesPerView: 2.3,
                        spaceBetween: 28
                      }
                    }}
                    className="events-swiper"
                  >
                    {eventCards.map((card, index) => (
                      <SwiperSlide key={card.id}>
                        <EventCard 
                          card={card} 
                          index={index}
                          isHovered={hoveredCard === card.id}
                          onHover={() => setHoveredCard(card.id)}
                          onLeave={() => setHoveredCard(null)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      ref={navigationPrevRef}
                      className="w-12 h-12 rounded-full bg-white/20 border border-white/50 flex items-center justify-center hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    <div className="events-pagination flex gap-2"></div>
                    
                    <button
                      ref={navigationNextRef}
                      className="w-12 h-12 rounded-full bg-white/20 border border-white/50 flex items-center justify-center hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Grid for Desktop */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
              >
                {eventCards.slice(0, 6).map((card, index) => (
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
                      <EventCard 
                        card={card} 
                        index={index}
                        isHovered={hoveredCard === card.id}
                        onHover={() => setHoveredCard(card.id)}
                        onLeave={() => setHoveredCard(null)}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'Research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Research Content Coming Soon
                </h3>
                <p className="text-white/80 text-lg">
                  We're preparing valuable research materials for you.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// کامپوننت کارت ایونت
const EventCard = ({ 
  card, 
  index, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  card: any; 
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  return (
    <motion.div
      className="h-full"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Card className="w-full h-full bg-white rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border-0">
        <CardContent className="p-0 relative h-full">
          {/* Image Container */}
          <motion.div 
            className="relative overflow-hidden"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              className="w-full h-48 sm:h-56 lg:h-60 object-cover rounded-t-2xl"
              alt={card.title}
              src={card.image}
            />
            
            {/* Gradient Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ opacity: isHovered ? 1 : 0 }}
            />
            
            {/* Hover Button */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="sm"
                className="bg-white/90 hover:bg-white text-[#01c4c6] backdrop-blur-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="p-4 sm:p-6 space-y-3"
            animate={{ 
              backgroundColor: isHovered ? "rgba(1, 196, 198, 0.05)" : "rgba(255, 255, 255, 1)" 
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <motion.h3 
              className="text-[#0d0d12] text-lg sm:text-xl font-semibold [font-family:'Poppins',Helvetica] text-center leading-tight"
              animate={{ color: isHovered ? "#01c4c6" : "#0d0d12" }}
              transition={{ duration: 0.3 }}
            >
              {card.title}
            </motion.h3>

            {/* Description */}
            <motion.p 
              className="text-[#808897] text-sm text-center leading-relaxed [font-family:'Poppins',Helvetica]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {card.description}
            </motion.p>

            {/* Date */}
            <motion.div 
              className="flex justify-center items-center gap-2 pt-2"
              animate={{ y: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ scale: isHovered ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarIcon className="w-4 h-4 text-[#808897]" />
              </motion.div>
              <span className="text-[#808897] text-sm [font-family:'Poppins',Helvetica]">
                {card.date}
              </span>
            </motion.div>
          </motion.div>

          {/* Active Indicator */}
          <motion.div
            className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#01c4c6]"
            animate={{ 
              scale: isHovered ? [1, 1.5, 1] : 1,
              opacity: isHovered ? 1 : 0.5
            }}
            transition={{ 
              duration: 1,
              repeat: isHovered ? Infinity : 0
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SectionGrid;