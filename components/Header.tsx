'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ImageISLIO from '../assets/img/ISLIO-Blue.png';
import { Menu, X, Bell, Mail, User, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useDataStore } from '@/store/dataStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useDataStore();
  const { clearUser } = useDataStore.getState();
  const menuRef = useRef(null);

  const { setTheme, theme } = useTheme();

  const navItems = [
    { name: 'Business', href: '/business' },
    { name: 'Services', href: '/services' },
    { name: 'Events', href: '/events' },
    { name: 'Research', href: '/research' },
    { name: 'Support', href: '/support' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const logout = () => {
    localStorage.removeItem('accessToken')
    clearUser();
    router.push('/auth/signin');
  }

  const navItemsMobile = [
    {
      name: "Profile",
      href: "/auth/profile",
      value: "Profile",
      subItems: [
        { name: "LogOut", action: logout },
        { name: "Setting", href: '/' },
      ]
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md shadow-md border-b border-primary-200 dark:border-secondary-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative -top-1">
              <Image src={ImageISLIO} alt="ISLIO" width={100} height={30} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <ul className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition-colors relative ${isActive(item.href)
                        ? 'text-primary-500 dark:text-primary-300'
                        : 'text-secondary-800 dark:text-secondary-200 hover:text-primary-400 dark:hover:text-primary-200'
                        }`}
                    >
                      {item.name}
                      {isActive(item.href) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 dark:bg-primary-300"></span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 dark:bg-accent-400 rounded-full"></span>
              </Button>

              {/* Messages */}
              {/* <Button
                variant="ghost"
                size="sm"
                className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
              >
                <Mail className="h-5 w-5" />
              </Button> */}

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Türkiye</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
                    Türkiye
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Profile */}{/* Auth Buttons */}
              {user && user.id ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth/profile"
                      className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div
                      // href="/auth/signin"
                      onClick={logout}
                      className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
                    >
                      Logout
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> :
                <>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button> */}
                  <div>
                    <Link href="/auth/signin">
                      <Button className="w-[100px] h-[48px] p-0 bg-[#01c4c6] rounded-3xl hover:bg-[#01c4c6]/90 flex items-center">
                        <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-[15px] leading-6">
                          sign in
                        </span>
                      </Button>
                    </Link>
                  </div>
                </>
              }


            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
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
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-primary-50 dark:bg-secondary-900 shadow-xl border-l border-primary-200 dark:border-secondary-700">
            <div className="p-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 px-4 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-primary-200 dark:border-secondary-700 space-y-4">
                {user && user.id ?
                  (
                    <Accordion type="single" collapsible className="w-full">
                      {navItemsMobile.map((item) => (
                        <AccordionItem className='border-none' key={item.value} value={item.value}>
                          <AccordionTrigger
                            className="px-1 py-3 no-underline hover:no-underline bg-primary-50  hover:bg-primary-50 dark:bg-secondary-900 text-right"
                          // onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link
                              href={item.href}
                              className={`block py-2 px-4 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                ? 'bg-primary-500 dark:bg-primary-600 text-white'
                                : 'text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800'
                                }`}
                            >
                              {item.name}
                            </Link>
                          </AccordionTrigger>

                          <AccordionContent className="bg-primary-50 dark:bg-secondary-900">
                            <div className="space-y-1 space-y-reverse">
                              {item.subItems.map((subItem) => {
                                if (subItem.action) {
                                  return (
                                    <button
                                      key={subItem.name}
                                      onClick={subItem.action}
                                      className="block w-full text-left py-2 px-6 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                      {subItem.name}
                                    </button>
                                  );
                                } else {
                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block py-2 px-6 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  );
                                }
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )
                  :
                  (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        asChild
                      >
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button
                        className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                        asChild
                      >

                        <Link href="/auth/register">Register</Link>
                      </Button>
                    </>
                  )
                }

              </div>

              <div className="mt-6 pt-6 border-t border-primary-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-800 dark:text-secondary-200">Theme</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
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