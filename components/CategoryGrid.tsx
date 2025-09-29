'use client';

import React, { useRef, useState } from 'react';
import { useInView, motion, Variants } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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

// انیمیشن‌های مختلف
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants:Variants = {
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

const hoverVariants:Variants = {
  hover: {
    y: -8,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items, viewAllHref }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان با انیمیشن */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl sm:text-3xl lg:text-[28px] font-semibold text-[#0d0d12] leading-[1.2] [font-family:'Poppins',Helvetica] tracking-[0] mb-8 sm:mb-12 lg:mb-16"
        >
          Find your Ideal Business Type
        </motion.h2>

        {/* Grid کارت‌ها */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
        >
          {businessTypes.map((businessType, index) => (
            <motion.div
              key={businessType.id}
              variants={itemVariants}
              whileHover="hover"
              custom={index}
              onHoverStart={() => setActiveCard(businessType.id)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <motion.div
                variants={hoverVariants}
                className="h-full"
              >
                <Card
                  className="w-full h-full min-h-[160px] sm:min-h-[172px] rounded-[10px] cursor-pointer transition-all duration-300 hover:bg-[#01c4c6] hover:shadow-[0px_8px_35px_#01c4c640] hover:border-0 bg-white border border-solid border-[#a4abb866] group relative overflow-hidden"
                >
                  {/* افکت نور پس‌زمینه در حالت هاور */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#01c4c6] to-[#00a8a9] opacity-0 group-hover:opacity-10"
                    initial={false}
                    animate={{ opacity: activeCard === businessType.id ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col items-center justify-between relative z-10">
                    {/* آیکون‌ها */}
                    <motion.div 
                      className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mt-2 sm:mt-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* آیکون معمولی */}
                      <motion.img
                        className="absolute w-2/3 h-3/4 top-1/4 left-1/4 group-hover:opacity-0 transition-opacity duration-300"
                        alt="Shape"
                        src={businessType.icon1}
                        initial={false}
                        animate={{ 
                          opacity: activeCard === businessType.id ? 0 : 1 
                        }}
                      />
                      
                      {/* آیکون در حالت هاور */}
                      <motion.img
                        className="absolute w-2/3 h-3/4 top-1/4 left-1/4"
                        alt="Shape"
                        src={businessType.iconActive}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                          opacity: activeCard === businessType.id ? 1 : 0,
                          scale: activeCard === businessType.id ? 1 : 0.5
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.img
                        className="absolute w-3/4 h-[91.67%] top-[4.17%] left-[8.33%]"
                        alt="Shape"
                        src={businessType.icon2}
                        animate={{
                          rotate: activeCard === businessType.id ? 360 : 0
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </motion.div>

                    {/* متن */}
                    <motion.div 
                      className='px-2 pb-4 sm:pb-6 lg:pb-8 text-center w-full'
                      initial={false}
                      animate={{ 
                        y: activeCard === businessType.id ? -2 : 0 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="group-hover:text-white text-[#0d0d12] [font-family:'Poppins',Helvetica] font-medium text-xs sm:text-sm leading-[1.4] tracking-[0] whitespace-pre-line block">
                        {businessType.title}
                      </span>
                    </motion.div>

                    {/* دکمه کوچک در حالت هاور */}
                    <motion.div
                      className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                      animate={{ 
                        scale: activeCard === businessType.id ? 1 : 0.8,
                        opacity: activeCard === businessType.id ? 1 : 0
                      }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* دکمه View All */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.a
            href={viewAllHref}
            className="inline-block font-medium text-[#808897] text-sm sm:text-base leading-[22.4px] underline [font-family:'Poppins',Helvetica] tracking-[0] hover:text-[#01c4c6] transition-colors duration-200"
            whileHover={{ 
              scale: 1.05,
              color: "#01c4c6"
            }}
            whileTap={{ scale: 0.95 }}
          >
            View All Categories
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;


// 'use client';

// import React, { useRef, useState, useEffect } from 'react';
// import { useInView, motion } from "framer-motion";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Card, CardContent } from './ui/card';

// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   image: string;
// }

// interface CategoryGridProps {
//   title: string;
//   items: Category[];
//   viewAllHref: string;
// }

// const itemVariants = {
//   hidden: { 
//     opacity: 0, 
//     y: 30,
//     scale: 0.9
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 12
//     }
//   }
// };

// const businessTypes = [
//   {
//     id: 1,
//     title: "Sole\nProprietorship",
//     icon1: "/shape-6.svg",
//     iconActive: "/shape.svg",
//     icon2: "/shape-1.svg",
//   },
//   {
//     id: 2,
//     title: "Partnership",
//     icon1: "/shape-6.svg",
//     iconActive: "/shape.svg",
//     icon2: "/shape-1.svg",
//   },
//   {
//     id: 3,
//     title: "Limited Liability\nCompany - LLC",
//     icon1: "/shape-6.svg",
//     iconActive: "/shape.svg",
//     icon2: "/shape-1.svg",
//   },
//   {
//     id: 4,
//     title: "Franchise",
//     icon1: "/shape-6.svg",
//     iconActive: "/shape.svg",
//     icon2: "/shape-1.svg",
//   },
//   {
//     id: 5,
//     title: "Nonprofit\nOrganization",
//     icon1: "/shape-6.svg",
//     iconActive: "/shape.svg",
//     icon2: "/shape-1.svg",
//   },
// ];

// const hoverVariants = {
//   hover: {
//     y: -8,
//     scale: 1.05,
//     transition: {
//       type: "spring",
//       stiffness: 400,
//       damping: 10
//     }
//   }
// };

// // انیمیشن‌های مختلف
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items, viewAllHref }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-50px" });
//   const [activeCard, setActiveCard] = useState<number | null>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const renderCard = (businessType: typeof businessTypes[0], index: number) => (
//     <motion.div
//       key={businessType.id}
//       variants={itemVariants}
//       whileHover="hover"
//       custom={index}
//       onHoverStart={() => setActiveCard(businessType.id)}
//       onHoverEnd={() => setActiveCard(null)}
//       className="h-full px-2"
//     >
//       <motion.div variants={hoverVariants} className="h-full">
//         <Card className="w-full h-full min-h-[160px] rounded-[10px] cursor-pointer transition-all duration-300 hover:bg-[#01c4c6] hover:shadow-[0px_8px_35px_#01c4c640] hover:border-0 bg-white border border-solid border-[#a4abb866] group relative overflow-hidden">
//           {/* Content same as above */}
//           <CardContent className="p-4 h-full flex flex-col items-center justify-between relative z-10">
//             <motion.div className="relative w-12 h-12 mt-2">
//               <motion.img
//                 className="absolute w-2/3 h-3/4 top-1/4 left-1/4 group-hover:opacity-0 transition-opacity duration-300"
//                 alt="Shape"
//                 src={businessType.icon1}
//               />
//               <motion.img
//                 className="absolute w-2/3 h-3/4 top-1/4 left-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 alt="Shape"
//                 src={businessType.iconActive}
//               />
//               <img
//                 className="absolute w-3/4 h-[91.67%] top-[4.17%] left-[8.33%]"
//                 alt="Shape"
//                 src={businessType.icon2}
//               />
//             </motion.div>

//             <div className='px-2 pb-4 text-center w-full'>
//               <span className="group-hover:text-white text-[#0d0d12] [font-family:'Poppins',Helvetica] font-medium text-xs leading-[1.4] tracking-[0] whitespace-pre-line block">
//                 {businessType.title}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );

//   return (
//     <section className="w-full py-8 sm:py-12 lg:py-16" ref={ref}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.h2 
//           initial={{ opacity: 0, y: -20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center text-2xl sm:text-3xl lg:text-[28px] font-semibold text-[#0d0d12] leading-[1.2] mb-8 sm:mb-12 lg:mb-16"
//         >
//           Find your Ideal Business Type
//         </motion.h2>

//         {/* برای موبایل: Swiper - برای دسکتاپ: Grid */}
//         <div className="lg:hidden mb-8">
//           <Swiper
//             modules={[Pagination, Autoplay]}
//             spaceBetween={16}
//             slidesPerView={1.2}
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 3000 }}
//             breakpoints={{
//               480: { slidesPerView: 1.5 },
//               640: { slidesPerView: 2.2 },
//               768: { slidesPerView: 2.5 }
//             }}
//           >
//             {businessTypes.map((businessType, index) => (
//               <SwiperSlide key={businessType.id}>
//                 {renderCard(businessType, index)}
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* برای دسکتاپ: Grid معمولی */}
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           animate={isInView ? "visible" : "hidden"}
//           className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 lg:mb-16"
//         >
//           {businessTypes.map((businessType, index) => renderCard(businessType, index))}
//         </motion.div>

//         <motion.div className="text-center">
//           <motion.a
//             href={viewAllHref}
//             className="inline-block font-medium text-[#808897] text-sm sm:text-base leading-[22.4px] underline hover:text-[#01c4c6] transition-colors duration-200"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             View All Categories
//           </motion.a>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default CategoryGrid;