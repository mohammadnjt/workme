import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Youtube, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronDown,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const WorkMeLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <div className="text-white font-bold text-sm">W</div>
    </div>
    <span className="text-lg font-bold text-primary">Work ME</span>
  </div>
);

const Footer = () => {
  const aboutLinks = [
    { name: 'Our Platform', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Trust Center', href: '/trust-center' },
  ];

  const partnershipLinks = [
    { name: 'Investors', href: '/partnerships/investors' },
    { name: 'Business Owners', href: '/partnerships/business-owners' },
    { name: 'Event Planners', href: '/partnerships/event-planners' },
  ];

  const supportLinks = [
    { name: 'Contact Us', href: '/support' },
    { name: 'Member Login', href: '/signin' },
    { name: 'Help Center', href: '/support/help' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Sitemap', href: '/sitemap' },
  ];

  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <footer className="bg-gray-100 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnerships Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnerships</h3>
            <ul className="space-y-3">
              {partnershipLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
            
            {/* Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Türkiye</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Türkiye</DropdownMenuItem>
                <DropdownMenuItem>United States</DropdownMenuItem>
                <DropdownMenuItem>United Kingdom</DropdownMenuItem>
                <DropdownMenuItem>Germany</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-300">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <WorkMeLogo />
              <p className="text-sm text-gray-600">
                Work Me is a platform where innovation and collaboration thrive.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Copyright © 2025 Work ME. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;