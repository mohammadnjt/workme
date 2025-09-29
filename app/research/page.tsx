'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, ArrowRight, TrendingUp, Users, Target, Lightbulb, BarChart, Briefcase } from 'lucide-react';
import researchData from '@/data/research.json';

const metadata = {
  title: 'Research & Insights | Work ME',
  description: 'Access comprehensive business research, insights, and educational resources to enhance your entrepreneurial knowledge and skills.',
};

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'planning':
      return Target;
    case 'entrepreneurship':
      return Lightbulb;
    case 'leadership':
      return Users;
    case 'success':
      return TrendingUp;
    case 'management':
      return Briefcase;
    case 'marketing':
      return BarChart;
    default:
      return BookOpen;
  }
};

const ResearchPage = () => {
  // const categories = [...new Set(researchData.map(item => item.category))];
  const categories = Array.from(new Set(researchData.map(item => item.category)));

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Research & Insights
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Comprehensive business research, case studies, and educational resources
              to empower your entrepreneurial journey with knowledge and insights.
            </p>
          </div>

          {/* Research Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => {
              const categoryArticles = researchData.filter(item => item.category === category);
              const IconComponent = getIconForCategory(category);

              return (
                <Card
                  key={category}
                  className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-primary-500 dark:text-primary-300" />
                    </div>
                    <CardTitle className="text-lg text-secondary-800 dark:text-secondary-200">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-secondary-600 dark:text-secondary-400 mb-4">
                      {categoryArticles.length} articles available
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                    >
                      Explore {category}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Research Articles */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-8">Latest Research Articles</h2>

            <Accordion type="single" collapsible className="space-y-4">
              {researchData.map((article) => {
                const IconComponent = getIconForCategory(article.category);

                return (
                  <AccordionItem
                    key={article.id}
                    value={`item-${article.id}`}
                    className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 rounded-lg shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300">
                      <div className="flex items-start space-x-4 text-left w-full">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mt-1">
                          <IconComponent className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">{article.title}</h3>
                            <Badge
                              variant="secondary"
                              className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                            >
                              {article.category}
                            </Badge>
                          </div>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-2">{article.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-secondary-500 dark:text-secondary-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>Research Article</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="ml-14 space-y-4">
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">{article.content}</p>

                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-primary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button
                            size="sm"
                            asChild
                            className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                          >
                            <Link href={`/research/${article.slug}`}>
                              Read Full Article
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                          >
                            Bookmark
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Featured Research */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-2 bg-primary-500 dark:bg-primary-600 text-white">Featured</Badge>
                <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Turkey Business Landscape 2025</h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Comprehensive analysis of the Turkish business environment, emerging
                  opportunities, and market trends for entrepreneurs and investors.
                </p>
                <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>25 min read</span>
                </div>
                <Button
                  className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                >
                  Download Report
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-accent-500 to-accent-600 dark:from-accent-400 dark:to-accent-500 flex items-center justify-center">
                <Lightbulb className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <Badge
                  variant="secondary"
                  className="mb-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                >
                  Case Study
                </Badge>
                <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Successful Startups in Ankara</h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Real success stories from Ankara-based startups, analyzing their
                  journey, challenges overcome, and key factors for success.
                </p>
                <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>18 min read</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  Read Case Study
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Research Tools */}
          <div className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm border border-primary-200 dark:border-secondary-700 p-8 mb-12">
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-6 text-center">
              Research Tools & Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-accent-500 dark:text-accent-300" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Market Analysis Tools</h3>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                  Access industry reports, market size data, and competitive analysis tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary-500 dark:text-primary-300" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Business Plan Templates</h3>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                  Download comprehensive business plan templates and frameworks.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Expert Insights</h3>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                  Connect with industry experts and access exclusive research insights.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold text-secondary-100 dark:text-secondary-200 mb-4">
              Stay Ahead with the Latest Research
            </h2>
            <p className="text-xl text-secondary-200 dark:text-secondary-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our research newsletter and get weekly insights,
              reports, and analysis delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary-100 dark:bg-secondary-800 text-primary-500 dark:text-primary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
              >
                Subscribe to Newsletter
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-200 dark:border-primary-300 text-primary-200 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-200"
              >
                Browse All Research
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResearchPage;