'use client';

import React, { useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Users, TrendingUp } from 'lucide-react';
import CounterNumber from './ui/counterNumber';
import { Card, CardContent } from './ui/card';

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  console.log('number',)
  return (
    <section className="flex justify-center px-[140px] py-8">
      <Card className="w-[1164px] h-[543px] relative">
        <CardContent className="p-0 h-full">
          <img
            className="absolute top-[69px] left-[120px] w-[27px] h-7"
            alt="Pattern"
            src="/pattren.png"
          />

          <div className="absolute text-center top-[90px] left-[130px] " >
            <h1 className='text-3xl font-bold'>
              Discover How they Take
              <br />
              their Needs to <span className='text-java-500 underline' >New Heights</span> 
            </h1>
          </div>
          <div className="absolute top-[212px] left-[calc(50%-509px)] w-[537px] h-[238px] flex items-center justify-center">
            <p className="font-normal text-[#808897] text-xl text-center leading-[28.4px] [font-family:'Poppins',Helvetica] tracking-[0]">
              Behind every successful business is a clear, actionable plan.
              With our ready-made business plans and exclusive resources,
              entrepreneurs and companies of all sizes can move beyond
              limitations and achieve greater heights. Whether you&apos;re
              launching a startup, expanding an existing business, or
              seeking fresh opportunities, our expertly crafted plans and
              inspiring events are designed to help you take the next step
              with confidence and clarity.
            </p>
          </div>

          <img
            className="absolute w-[34.59%] h-[67.22%] top-[16.07%] left-[58.76%]"
            alt="Group"
            src="/group-14.png"
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default HeroSection;