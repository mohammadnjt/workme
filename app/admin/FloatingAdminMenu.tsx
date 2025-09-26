'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { Settings, Users, Calendar, Microscope, Wrench, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: 'Users Management', icon: Users, href: '/admin/users' },
  { name: 'Business Management', icon: BarChart3, href: '/admin/business' },
  { name: 'Event Management', icon: Calendar, href: '/messages' },
  { name: 'Research Management', icon: Microscope, href: '/email' },
  { name: 'Service Management', icon: Wrench, href: '/settings' },
];
const targetPoints = [
  { top: 40, left: 60 },
  { top: 80, left: 115 },
  { top: 132, left: 140 },
  { top: 180, left: 115 },
  { top: 220, left: 60 }
];
const FloatingAdminMenu = () => {
  const {user} = useDataStore();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const radialRef = useRef<HTMLDivElement>(null);
  // const menuRadius = 150; // Half of --width (300px)
  // const buttonSize = 80;


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (radialRef.current && !radialRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - (isOpen ? 150 + 40 : 40);
        const maxY = window.innerHeight - 40;
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
      });
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);



  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  if(user.role !== 'admin') return null;

  return (
    <div className="fixed top-1/3 inset-0 pointer-events-none">
    <Draggable defaultClassName='' position={position} onStop={handleDrag} bounds={{ left: 0, top: 0, right: window.innerWidth - 48, bottom: window.innerHeight - 48 }}>
      <div
        className={`relative w-[300px] h-[300px] ${isOpen ? 'active' : ''}`}
        ref={radialRef}
        
      > 
        <Button
          className="absolute pointer-events-auto drag-handle w-16 h-16 left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 dark:bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle Radial Menu"
          disableMotion
        >
          <Settings className={`h-6 w-6 transition-all duration-200 ${isOpen ? 'rotate-[180deg] -translate-x-[0px] translate-y-[0px]' : ''}`} />
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute w-[100px] h-[100px] p-0 m-0 -translate-x-1/2 -translate-y-1/2 list-none"
            >
              {menuItems.map((item, index) => {
                const x = targetPoints[index].left;
                const y = targetPoints[index].top;

                return (
                  <motion.li
                    key={item.name}
                    className="absolute w-[10px] h-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      top: `calc(${y}px)`,
                      left: `calc(${x}px)`,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <Link href={item.href}>
                      <Button
                        className="w-full h-full rounded-full bg-gradient-to-br from-[#25aae1] to-[#2bb673] text-white shadow-md hover:from-[#1E8BC3] hover:to-[#249F5F] hover:scale-110 transition-transform duration-250"
                        title={item.name}
                        aria-label={item.name}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Draggable>
    </div>
  );
};

export default FloatingAdminMenu;
