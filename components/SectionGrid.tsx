'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, FileText, CalendarIcon } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useInView
} from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
    },
    {
      id: 2,
      image: "/rectangle-34624278-3.png",
      title: "Nonprofit Organization",
      date: "20/02/2025 - 18:30",
    },
    {
      id: 3,
      image: "/rectangle-34624278-3.png",
      title: "Nonprofit Organization",
      date: "20/02/2025 - 18:30",
    },
    {
      id: 4,
      image: "/rectangle-34624278-3.png",
      title: "Nonprofit Organization",
      date: "20/02/2025 - 18:30",
    },
  ];


const SectionGrid: React.FC<SectionGridProps> = ({ title, items, viewAllHref }) => {
    const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
   const [index, setIndex] = useState(0);
  return (
    <section className="w-full bg-[#01c4c6] relative">
      <div className="mx-40 px-4 py-[60px]">
        <div className="flex justify-between items-center mb-[44px]">
          <div className="flex-1 flex justify-center">
            <Button
              variant="outline"
              className="w-[168px] h-[60px] border-[#ffffff66] bg-transparent text-white text-2xl font-semibold [font-family:'Poppins',Helvetica] hover:bg-white/10"
            >
              Events
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Button
              variant="outline"
              className="w-[168px] h-[60px] border-[#ffffff66] bg-transparent text-white text-2xl font-semibold [font-family:'Poppins',Helvetica] hover:bg-white/10"
            >
              Research
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {eventCards.map((card) => (
            <Card
              key={card.id}
              className="w-[270px] h-[372px] bg-white rounded-[10px] overflow-hidden"
            >
              <CardContent className="p-0 relative h-full">
                <img
                  className="w-full h-72 object-cover rounded-t-[10px]"
                  alt="Event"
                  src={card.image}
                />
                <div className="p-4 space-y-2">
                  <div className="text-[#0d0d12] text-sm font-medium [font-family:'Poppins',Helvetica] text-center">
                    {card.title}
                  </div>
                  <div className="flex justify-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#808897]" />
                    <span className="text-[#808897]  text-sm [font-family:'Poppins',Helvetica]">
                      {card.date}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionGrid;

// function Card(props) {
//     const [exitX, setExitX] = useState(0);

//     const x = useMotionValue(0);
//     const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
//     const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
//         clamp: false
//     });

//     const variantsFrontCard = {
//         animate: { scale: 1, y: 0, opacity: 1 },
//         exit: (custom) => ({
//             x: custom,
//             opacity: 0,
//             scale: 0.5,
//             transition: { duration: 0.2 }
//         })
//     };
//     const variantsBackCard = {
//         initial: { scale: 0, y: 105, opacity: 0 },
//         animate: { scale: 0.75, y: 30, opacity: 0.5 }
//     };

//     function handleDragEnd(_, info) {
//         if (info.offset.x < -100) {
//             setExitX(-250);
//             props.setIndex(props.index + 1);
//         }
//         if (info.offset.x > 100) {
//             setExitX(250);
//             props.setIndex(props.index + 1);
//         }
//     }

//     return (
//         <motion.div
//             style={{
//                 width: 150,
//                 height: 150,
//                 position: "absolute",
//                 top: 0,
//                 x,
//                 rotate,
//                 cursor: "grab"
//             }}
//             whileTap={{ cursor: "grabbing" }}
//             // Dragging
//             drag={props.drag}
//             dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
//             onDragEnd={handleDragEnd}
//             // Animation
//             variants={props.frontCard ? variantsFrontCard : variantsBackCard}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             custom={exitX}
//             transition={
//                 props.frontCard
//                     ? { type: "spring", stiffness: 300, damping: 20 }
//                     : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }
//             }
//         >
//             <motion.div
//                 style={{
//                     width: 150,
//                     height: 150,
//                     backgroundColor: "#fff",
//                     borderRadius: 30,
//                     scale
//                 }}
//             />
//         </motion.div>
//     );
// }

{/* <Link
                 key={index}
                 href={item.href}
                 className="group bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 rounded-lg p-8 h-32 flex flex-col items-center justify-center text-center transition-all duration-300"
               >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-primary-500 dark:text-primary-300" />
                  </div>

                  <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors duration-300 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                    {item.description}
                  </p>
                 
               </Link> */}