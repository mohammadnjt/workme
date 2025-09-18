"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Bell, 
  Mail, 
  User, 
  Globe, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

const WorkMeLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
      <div className="text-white font-bold text-lg">W</div>
    </div>
    <h1 className="text-2xl font-bold text-primary">Work ME</h1>
  </div>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const navItems = [
    { name: 'Business', href: '/business' },
    { name: 'Services', href: '/services' },
    { name: 'Events', href: '/events' },
    { name: 'Research', href: '/research' },
    { name: 'Support', href: '/support' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <WorkMeLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <ul className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-primary relative ${
                        isActive(item.href) 
                          ? 'text-primary' 
                          : 'text-gray-700 hover:text-primary'
                      }`}
                    >
                      {item.name}
                      {isActive(item.href) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Messages */}
              <Button variant="ghost" size="sm">
                <Mail className="h-5 w-5" />
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Türkiye</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Türkiye</DropdownMenuItem>
                  <DropdownMenuItem>English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signin">Sign In</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth Buttons */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t space-y-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Theme</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;