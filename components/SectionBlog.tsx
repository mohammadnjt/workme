'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SectionBlog: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
    const data = [
        {
            category: "Business",
            date: '30 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Business Growth Strategies",
            description: "Behind every successful business is a clear, actionable plan for sustainable growth and development."
        },
        {
            category: "Marketing",
            date: '28 Jan 2025 - 4 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Digital Marketing Trends",
            description: "Explore the latest digital marketing trends that are shaping the future of business promotion."
        },
        {
            category: "Finance",
            date: '25 Jan 2025 - 6 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Financial Planning Tips",
            description: "Essential financial planning strategies to ensure your business remains profitable and sustainable."
        },
        {
            category: "Technology",
            date: '22 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Tech Innovations",
            description: "How emerging technologies are transforming business operations and customer experiences."
        },
        {
            category: "Leadership",
            date: '20 Jan 2025 - 7 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Leadership Development",
            description: "Building effective leadership skills to drive your team and business towards success."
        },
        {
            category: "Startup",
            date: '18 Jan 2025 - 5 mins read',
            img: '/rectangle-34624278-3.png',
            title: "Startup Essentials",
            description: "Key considerations and steps for launching and scaling a successful startup business."
        }
    ];

    // انیمیشن‌ها
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
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

    const hoverVariants = {
        hover: {
            y: -8,
            scale: 1.03,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <section 
            ref={ref}
            className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-20"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.h2 
                        className="font-semibold text-[#0d0d12] text-2xl sm:text-3xl lg:text-[28px] leading-[1.2] [font-family:'Poppins',Helvetica] tracking-[0] mb-3 sm:mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Blog
                    </motion.h2>
                    <motion.p 
                        className="font-normal text-[#808897] text-base sm:text-lg lg:text-xl text-center leading-relaxed max-w-2xl mx-auto [font-family:'Poppins',Helvetica] tracking-[0]"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Here, We share business tips and other useful information
                    </motion.p>
                </motion.div>

                {/* Swiper for Mobile & Tablet */}
                <div className="block lg:hidden mb-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1.1}
                            pagination={{ 
                                clickable: true,
                                el: '.blog-pagination',
                            }}
                            autoplay={{ 
                                delay: 4000,
                                disableOnInteraction: false 
                            }}
                            breakpoints={{
                                480: { 
                                    slidesPerView: 1.3,
                                    spaceBetween: 24
                                },
                                640: { 
                                    slidesPerView: 1.8,
                                    spaceBetween: 24
                                },
                                768: { 
                                    slidesPerView: 2.2,
                                    spaceBetween: 28
                                }
                            }}
                            className="blog-swiper"
                        >
                            {data.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <BlogCard item={item} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Pagination */}
                        <div className="blog-pagination flex justify-center gap-2 mt-6"></div>
                    </motion.div>
                </div>

                {/* Grid for Desktop */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                >
                    {data.slice(0, 3).map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <motion.div
                                variants={hoverVariants}
                                className="h-full"
                            >
                                <BlogCard item={item} index={index} />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Load More Button for Mobile */}
                <motion.div 
                    className="text-center mt-8 lg:mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <Button
                        variant="outline"
                        className="h-12 px-8 border-[#01c4c6] text-[#01c4c6] hover:bg-[#01c4c6] hover:text-white transition-all duration-300 lg:hidden"
                    >
                        View All Posts
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

// کامپوننت BlogCard
const BlogCard = ({ item, index }: { item: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-full"
        >
            <Card className="w-full h-full border-none bg-transparent shadow-none group cursor-pointer">
                <CardContent className="p-0 relative h-full">
                    {/* Image Container */}
                    <motion.div 
                        className="relative overflow-hidden rounded-2xl"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            className="w-full h-48 sm:h-56 lg:h-60 object-cover rounded-2xl border border-solid border-[#a4abb866]"
                            alt="Blog post"
                            src={item.img}
                        />
                        
                        {/* Gradient Overlay */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />

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
                                className="h-8 sm:h-10 px-3 sm:px-4 bg-white rounded-xl border border-solid border-[#a4abb866] flex items-center justify-center backdrop-blur-sm"
                            >
                                <span className="[font-family:'Poppins',Helvetica] font-medium text-xs sm:text-sm text-[#0d0d12] tracking-[0] leading-normal">
                                    {item.category}
                                </span>
                            </Badge>
                        </motion.div>

                        {/* Read More Button */}
                        <motion.div
                            className="absolute bottom-4 right-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 10
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                size="sm"
                                className="bg-white/90 hover:bg-white text-[#01c4c6] backdrop-blur-sm shadow-lg"
                            >
                                Read More
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.div 
                        className="mt-6 space-y-3"
                        animate={{ 
                            y: isHovered ? -4 : 0 
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Date and Read Time */}
                        <motion.div 
                            className="flex items-center gap-2 text-[#808897]"
                            animate={{ opacity: isHovered ? 0.8 : 1 }}
                        >
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="[font-family:'Poppins',Helvetica] font-normal text-xs sm:text-sm tracking-[0]">
                                    {item.date.split(' - ')[0]}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="[font-family:'Poppins',Helvetica] font-normal text-xs sm:text-sm tracking-[0]">
                                    {item.date.split(' - ')[1]}
                                </span>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h3 
                            className="[font-family:'Poppins',Helvetica] font-semibold text-[#0d0d12] text-lg sm:text-xl lg:text-[22px] tracking-[0] leading-tight"
                            animate={{ color: isHovered ? "#01c4c6" : "#0d0d12" }}
                            transition={{ duration: 0.3 }}
                        >
                            {item.title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p 
                            className="[font-family:'Poppins',Helvetica] font-normal text-[#808897] text-sm sm:text-base tracking-[0] leading-relaxed line-clamp-3"
                            animate={{ opacity: isHovered ? 0.9 : 1 }}
                        >
                            {item.description}
                        </motion.p>
                    </motion.div>

                    {/* Hover Indicator */}
                    <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#01c4c6] rounded-full"
                        animate={{ 
                            width: isHovered ? "80%" : "0%"
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SectionBlog;