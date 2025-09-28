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
    { name: 'Partnerships', href: '/Partnerships' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">About</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnerships Section */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Partnerships</h3>
            <ul className="space-y-3">
              {partnershipLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media and Country Selector */}
          <div className="flex flex-col items-start sm:items-end">
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="border-2 rounded-full p-2 border-white text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent color="white" className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[180px] h-[60px] p-0 dark:bg-slate-600 dark:border-slate-800 border-primary-400 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  <div className="flex w-full px-3 justify-between items-center">
                    <div className="flex flex-col items-start">
                      <span className="text-gray-500 dark:text-slate-300 text-xs">Select Country</span>
                      <span className="text-gray-900 dark:text-white text-sm">Türkiye</span>
                    </div>
                    <ChevronDown color="black" className="h-3 w-3" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-2 rounded-lg">
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                  Türkiye
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                  United Kingdom
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1 text-sm">
                  Germany
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-primary-200 dark:border-secondary-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-center sm:items-start">
                <Image src="/ISLIO.White.png" alt="ISLIO" width={150} height={45} />
                <p className="text-xs text-secondary-100 dark:text-secondary-400 mt-2 text-center sm:text-left">
                  Copyright © 2025 ISLIO rights reserved
                </p>
              </div>
              <p className="text-sm text-secondary-100 dark:text-secondary-400 text-center sm:text-left max-w-md">
                Whether you’re launching a startup, expanding an existing business, or seeking fresh opportunities, our expertly crafted plans and inspiring events are designed to help you take the next step with confidence and clarity.
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-secondary-100 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;