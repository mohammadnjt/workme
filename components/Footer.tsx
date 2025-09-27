'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
  Globe,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

const Footer = () => {
  const aboutLinks = [
    { name: 'About', href: '/about' },
    { name: 'Our Platform', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Trust Center', href: '/trust-center' },
  ];

  const partnershipLinks = [
    { name: "Partnerships", href: '/Partnerships' },
    { name: 'Investors', href: '/partnerships/investors' },
    { name: 'Business Owners', href: '/partnerships/business-owners' },
    { name: 'Event Planners', href: '/partnerships/event-planners' },
  ];

  const supportLinks = [
    { name: 'Support', href: '/support' },
    { name: 'Contact Us', href: '/support' },
    { name: 'Member Login', href: '/signin' },
    { name: 'Help Center', href: '/support/help' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie', href: '/cookies' },
    { name: 'Policy', href: '/Policy' },
    { name: 'Cookies Settings', href: '/CookiesSettings' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Sitemap', href: '/sitemap' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'linkedin', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-java-500 dark:bg-secondary-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <div className='grid grid-cols-3' >

            {/* About Section */}
            <div>
              {/* <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">About</h3> */}
              <ul className="space-y-8">
                {aboutLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partnerships Section */}
            <div>
              {/* <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Partnerships</h3> */}
              <ul className="space-y-8">
                {partnershipLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div>
              {/* <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Support</h3> */}
              <ul className="space-y-8">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className='flex items-end flex-col'>
            {/* <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Connect With Us</h3> */}
            <div className="flex   space-x-6 mb-8">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className=" border-2 rounded-full p-3 border-white text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent color='white' className="h-6 w-6" />
                  </a>
                );
              })}
            </div>

            {/* Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size='lg'
                  className="flex w-[197px] h-[74px] p-0 dark:bg-slate-600 dark:border-slate-800 border-primary-400 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  <div className='flex w-full px-4 justify-between' >
                    <div className='flex flex-col items-start' >
                      <span className='text-gray-500 dark:text-slate-300 text-xs' >Select Country</span>
                      <span className='text-gray-900 dark:text-white' >Türkiye</span>
                    </div>
                    <div className='flex items-center justify-end'>
                      <ChevronDown color='black' className="h-3 w-3" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-4 rounded-lg">
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Türkiye
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United Kingdom
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Germany
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Legal Links */}
        <div >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-8">
              <div className='flex flex-col' >
                <Image src="/ISLIO.White.png" alt="ISLIO" width={200} height={60} />
                <p className="text-sm text-secondary-100 dark:text-secondary-400">
                  Copyright © 2025 ISLIO rights reserved
                </p>
              </div>
              <p className="text-md w-[395px] h-[103px] text-secondary-100 dark:text-secondary-400">
                Whether you’re launching a startup, expanding an existing business, or seeking fresh opportunities, our expertly crafted plans and inspiring events are designed to help you take the next step with confidence and clarity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-10">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;