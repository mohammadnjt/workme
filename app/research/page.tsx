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

export const metadata = {
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
  const categories = [...new Set(researchData.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Research & Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card key={category} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600 mb-4">
                      {categoryArticles.length} articles available
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Explore {category}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Research Articles */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Research Articles</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {researchData.map((article) => {
                const IconComponent = getIconForCategory(article.category);
                
                return (
                  <AccordionItem key={article.id} value={`item-${article.id}`} className="bg-white border rounded-lg shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-start space-x-4 text-left w-full">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                            <Badge variant="secondary">{article.category}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                        <p className="text-gray-700 leading-relaxed">{article.content}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <Button size="sm" asChild>
                            <Link href={`/research/${article.slug}`}>
                              Read Full Article
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
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
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-2">Featured</Badge>
                <h3 className="text-xl font-semibold mb-2">Turkey Business Landscape 2025</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive analysis of the Turkish business environment, emerging 
                  opportunities, and market trends for entrepreneurs and investors.
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>25 min read</span>
                </div>
                <Button className="w-full">
                  Download Report
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Lightbulb className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-2">Case Study</Badge>
                <h3 className="text-xl font-semibold mb-2">Successful Startups in Ankara</h3>
                <p className="text-gray-600 mb-4">
                  Real success stories from Ankara-based startups, analyzing their 
                  journey, challenges overcome, and key factors for success.
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>18 min read</span>
                </div>
                <Button variant="outline" className="w-full">
                  Read Case Study
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Research Tools */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Research Tools & Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Market Analysis Tools</h3>
                <p className="text-gray-600 text-sm">
                  Access industry reports, market size data, and competitive analysis tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Business Plan Templates</h3>
                <p className="text-gray-600 text-sm">
                  Download comprehensive business plan templates and frameworks.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Insights</h3>
                <p className="text-gray-600 text-sm">
                  Connect with industry experts and access exclusive research insights.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Ahead with the Latest Research
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our research newsletter and get weekly insights, 
              reports, and analysis delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Subscribe to Newsletter
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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