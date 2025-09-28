'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Users, TrendingUp } from 'lucide-react';
import CounterNumber from './ui/counterNumber';
import { Card, CardContent } from './ui/card';

// Animation variants for the card
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Animation variants for the text content
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.2 },
  },
};

// Animation variants for individual text elements
const textChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Animation variants for the pattern image
const patternVariants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Animation variants for the group image
const groupVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
  },
};

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="flex justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6 sm:py-8">
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="w-full max-w-5xl h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[500px]"
      >
        <Card className="h-full">
          <CardContent className="relative p-0 h-full flex flex-col md:flex-row items-center justify-between">
            {/* Pattern Image */}
            <motion.img
              variants={patternVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="absolute top-8 sm:top-10 md:top-12 left-4 sm:left-6 md:left-8 w-6 sm:w-7 h-6 sm:h-7 object-contain"
              alt="Pattern"
              src="/pattren.png"
            />

            {/* Text Content */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="relative z-10 w-full md:w-1/2 text-center md:text-left px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 md:pt-20"
            >
              <motion.h1
                variants={textChildVariants}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
              >
                Discover How They Take
                <br />
                Their Needs to{' '}
                <span className="text-java-500 underline">New Heights</span>
              </motion.h1>
              <motion.p
                variants={textChildVariants}
                className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-[#808897] font-normal leading-relaxed [font-family:'Poppins',Helvetica] tracking-normal"
              >
                Behind every successful business is a clear, actionable plan. With
                our ready-made business plans and exclusive resources,
                entrepreneurs and companies of all sizes can move beyond
                limitations and achieve greater heights. Whether you&apos;re
                launching a startup, expanding an existing business, or seeking
                fresh opportunities, our expertly crafted plans and inspiring events
                are designed to help you take the next step with confidence and
                clarity.
              </motion.p>
            </motion.div>

            {/* Group Image */}
            <motion.img
              variants={groupVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="relative w-full md:w-[40%] h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[400px] object-contain mt-8 md:mt-0"
              alt="Group"
              src="/group-14.png"
            />
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default HeroSection;