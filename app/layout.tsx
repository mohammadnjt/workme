// "use client";
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ToastProvider';
import FloatingAdminMenu from './admin/FloatingAdminMenu';

const inter = Inter({ subsets: ['latin'] });

console.log('process.env.NEXT_PUBLIC_SITE_URL',process.env.NEXT_PUBLIC_SITE_URL)
export const metadata: Metadata = {
  title: {
    template: '%s | Work ME',
    default: 'Work ME - Business Discovery Platform for Turkey',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  description: 'Discover and connect with businesses, services, and opportunities across Turkey. Find your ideal business type, access services, events, and research on Work ME platform.',
  keywords: ['business', 'Turkey', 'Ankara', 'services', 'events', 'research', 'entrepreneurship'],
  authors: [{ name: 'Work ME Team' }],
  creator: 'Work ME',
  publisher: 'Work ME',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://workme.com',
    title: 'Work ME - Business Discovery Platform',
    description: 'Discover and connect with businesses, services, and opportunities across Turkey.',
    siteName: 'Work ME',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Work ME Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work ME - Business Discovery Platform',
    description: 'Discover and connect with businesses, services, and opportunities across Turkey.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
          {children}
          <FloatingAdminMenu />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}