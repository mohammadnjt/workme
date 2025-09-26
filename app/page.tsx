// 'use client';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import SearchBar from '@/components/SearchBar';
// import CategoryGrid from '@/components/CategoryGrid';
// import HeroSection from '@/components/HeroSection';
// import ServicesGrid from '@/components/ServicesGrid';
// import SectionGrid from '@/components/SectionGrid';

// import categoriesData from '@/data/categories.json';
// import servicesData from '@/data/services.json';

// const sectionItems = [
//   {
//     title: 'Events',
//     href: '/events',
//     icon: 'calendar' as const,
//     description: 'Discover upcoming business events and networking opportunities',
//   },
//   {
//     title: 'Research',
//     href: '/research',
//     icon: 'book' as const,
//     description: 'Access business research, insights, and industry analysis',
//   },
//   {
//     title: 'Blog',
//     href: '/blog',
//     icon: 'file' as const,
//     description: 'Read latest articles on business trends and success stories',
//   },
// ];

// export default function Home() {
//   const featuredCategories = categoriesData.slice(0, 4);
//   const featuredServices = servicesData.slice(0, 4);

//   return (
//       <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
//         <Header />

//         <main className="pt-16">
//           {/* Search Section */}
//           <section className="py-8 bg-white dark:bg-secondary-900" style={{backgroundImage: "url('/siteCover.jpg')"}}>
//             <SearchBar />
//           </section>

//           {/* Categories Section */}
//           <section className="py-8 bg-primary-100 dark:bg-secondary-800">
//             <CategoryGrid
//               title="Find your ideal business type"
//               items={featuredCategories}
//               viewAllHref="/business/categories"
//             />
//           </section>

//           {/* Hero Section */}
//           <section className="py-12 bg-gradient-to-r from-primary-50 to-primary-200 dark:from-primary-800 dark:to-primary-900">
//             <HeroSection />
//           </section>

//           {/* Services Section */}
//           <section className="py-8 bg-white dark:bg-secondary-900">
//             <ServicesGrid
//               title="Our Services"
//               items={featuredServices}
//               viewAllHref="/services"
//             />
//           </section>

//           {/* Additional Sections */}
//           <section className="py-8 bg-primary-100 dark:bg-secondary-800">
//             <SectionGrid title="Explore More" items={sectionItems} />
//           </section>
//         </main>

//         <Footer />
//       </div>
//   );
// }


'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import SectionGrid from '@/components/SectionGrid';

import categoriesData from '@/data/categories.json';
import servicesData from '@/data/services.json';

const sectionItems = [
  {
    title: 'Events',
    href: '/events',
    icon: 'calendar' as const,
    description: 'Discover upcoming business events and networking opportunities',
  },
  {
    title: 'Research',
    href: '/research',
    icon: 'book' as const,
    description: 'Access business research, insights, and industry analysis',
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: 'file' as const,
    description: 'Read latest articles on business trends and success stories',
  },
];

export default function Home() {
  const featuredCategories = categoriesData.slice(0, 4);
  const featuredServices = servicesData.slice(0, 4);

  return (
    <div className="min-h-screen bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        {/* Search Section with Glassmorphism and Overlay */}
        <section
          className="py-8 bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md relative border-b border-primary-200 dark:border-secondary-700"
          style={{ backgroundImage: "url('/siteCover.jpg')", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >
          <div className="absolute inset-0 bg-primary-900/50 dark:bg-primary-900/70"></div>
          <div className="relative z-10">
            <SearchBar />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-y border-primary-200 dark:border-secondary-700">
          <CategoryGrid
            title="Find your ideal business type"
            items={featuredCategories}
            viewAllHref="/business/categories"
          />
        </section>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-primary-100/70 to-primary-200/70 dark:from-primary-800/70 dark:to-primary-700/70 backdrop-blur-md border-y border-primary-200 dark:border-secondary-700">
          <HeroSection />
        </section>

        {/* Services Section */}
        <section className="py-8 bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md border-y border-primary-200 dark:border-secondary-700">
          <ServicesGrid
            title="Our Services"
            items={featuredServices}
            viewAllHref="/services"
          />
        </section>

        {/* Additional Sections */}
        <section className="py-8 bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-y border-primary-200 dark:border-secondary-700">
          <SectionGrid title="Explore More" items={sectionItems} />
        </section>
      </main>

      <Footer />
    </div>
  );
}