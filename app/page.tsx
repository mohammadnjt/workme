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
    description: 'Discover upcoming business events and networking opportunities'
  },
  {
    title: 'Research',
    href: '/research',
    icon: 'book' as const,
    description: 'Access business research, insights, and industry analysis'
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: 'file' as const,
    description: 'Read latest articles on business trends and success stories'
  }
];

export default function Home() {
  const featuredCategories = categoriesData.slice(0, 4);
  const featuredServices = servicesData.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Search Section */}
        <section className="py-8">
          <SearchBar />
        </section>

        {/* Categories Section */}
        <CategoryGrid
          title="Find your ideal business type"
          items={featuredCategories}
          viewAllHref="/business/categories"
        />

        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <ServicesGrid
          title="Our Services"
          items={featuredServices}
          viewAllHref="/services"
        />

        {/* Additional Sections */}
        <SectionGrid
          title="Explore More"
          items={sectionItems}
        />
      </main>

      <Footer />
    </div>
  );
}