'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, BookOpen, FileText } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useInView
} from "framer-motion";

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
    const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
   const [index, setIndex] = useState(0);
  return (
    <section ref={ref}  style={{
          transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
        {viewAllHref && (
          <Button
            variant="outline"
            asChild
            className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
          >
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
            <motion.div key={index + 1} style={{ width: 150, height: 150, position: "relative" }}>
              <AnimatePresence initial={false}>
                <Card  frontCard={false} />
                <Card
                    key={index}
                    frontCard={true}
                    index={index}
                    setIndex={setIndex}
                    drag="x"
                />
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default SectionGrid;

function Card(props) {
    const [exitX, setExitX] = useState(0);

    const x = useMotionValue(0);
    const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
        clamp: false
    });

    const variantsFrontCard = {
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: (custom) => ({
            x: custom,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 }
        })
    };
    const variantsBackCard = {
        initial: { scale: 0, y: 105, opacity: 0 },
        animate: { scale: 0.75, y: 30, opacity: 0.5 }
    };

    function handleDragEnd(_, info) {
        if (info.offset.x < -100) {
            setExitX(-250);
            props.setIndex(props.index + 1);
        }
        if (info.offset.x > 100) {
            setExitX(250);
            props.setIndex(props.index + 1);
        }
    }

    return (
        <motion.div
            style={{
                width: 150,
                height: 150,
                position: "absolute",
                top: 0,
                x,
                rotate,
                cursor: "grab"
            }}
            whileTap={{ cursor: "grabbing" }}
            // Dragging
            drag={props.drag}
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onDragEnd={handleDragEnd}
            // Animation
            variants={props.frontCard ? variantsFrontCard : variantsBackCard}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={exitX}
            transition={
                props.frontCard
                    ? { type: "spring", stiffness: 300, damping: 20 }
                    : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }
            }
        >
            <motion.div
                style={{
                    width: 150,
                    height: 150,
                    backgroundColor: "#fff",
                    borderRadius: 30,
                    scale
                }}
            />
        </motion.div>
    );
}

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