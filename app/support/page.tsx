'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, HelpCircle, User, Lock } from 'lucide-react';
import { contactFormSchema, ContactFormData, signInSchema, SignInData } from '@/lib/validations';

const metadata = {
  title: 'Support & Help | Work ME',
  description: 'Get support and help for using Work ME platform. Contact us, access help center, or sign in to your member account.',
};

const faqData = [
  {
    question: "How do I register my business on Work ME?",
    answer: "To register your business, navigate to the Business section and fill out our comprehensive business information form. This form will collect all necessary details about your business type, requirements, and goals."
  },
  {
    question: "What services does Work ME provide?",
    answer: "Work ME offers seven key services: Business Consulting, Training & Development, Capital Financing, Management & Supervision, Supply of Equipment & Raw Materials, Marketing & Sales, and Workme Competition opportunities."
  },
  {
    question: "How can I access funding opportunities?",
    answer: "Our Capital Financing service connects you with various funding opportunities including investment funding, loan services, financial planning, and investor matching. Fill out the business form to get personalized recommendations."
  },
  {
    question: "Are the services available across all of Turkey?",
    answer: "Yes, our services are available throughout Turkey, with a special focus on Ankara and other major business centers. Our platform helps you identify suitable cities for your business based on your requirements."
  },
  {
    question: "How do I participate in events and competitions?",
    answer: "Visit our Events section to view upcoming business events, exhibitions, and tours. For competitions, check our Workme Competition service which features innovation contests, startup competitions, and networking events."
  },
  {
    question: "What research resources are available?",
    answer: "Our Research section provides comprehensive articles on business planning, entrepreneurship, management principles, marketing strategies, and success stories specific to the Turkish market."
  },
  {
    question: "How can I get personalized business consulting?",
    answer: "Contact us through the support form or sign up for our Business Consulting service. Our experts provide strategic planning, market analysis, process optimization, and growth strategies tailored to your business."
  },
  {
    question: "Is there a mobile app for Work ME?",
    answer: "Currently, Work ME is accessible through our responsive web platform that works seamlessly on desktop, tablet, and mobile devices. A dedicated mobile app is planned for future release."
  }
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("contact");

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onContactSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  };

  const onSignInSubmit = (data: SignInData) => {
    console.log('Sign in attempt:', data);
    alert('Sign in functionality will be implemented with NextAuth in the next phase.');
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Support & Help Center
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              We're here to help you succeed. Get in touch with our support team,
              access our help resources, or sign in to your member account.
            </p>
          </div>

          {/* Support Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-primary-100 dark:bg-secondary-800">
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-primary-500 data-[state=active]:text-white dark:data-[state=active]:bg-primary-600"
              >
                Contact Us
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="data-[state=active]:bg-primary-500 data-[state=active]:text-white dark:data-[state=active]:bg-primary-600"
              >
                Help Center
              </TabsTrigger>
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-primary-500 data-[state=active]:text-white dark:data-[state=active]:bg-primary-600"
              >
                Member Login
              </TabsTrigger>
            </TabsList>

            {/* Contact Us Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-secondary-800 dark:text-secondary-200">
                      <Mail className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                      <span>Send us a Message</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...contactForm}>
                      <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                        <FormField
                          control={contactForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  type="email"
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What is this regarding?"
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={contactForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your inquiry in detail"
                                  rows={5}
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardHeader>
                      <CardTitle className="text-secondary-800 dark:text-secondary-200">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary-500 dark:text-primary-300 mt-0.5" />
                        <div>
                          <p className="font-medium text-secondary-800 dark:text-secondary-200">Email Support</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">support@workme.com</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">business@workme.com</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-primary-500 dark:text-primary-300 mt-0.5" />
                        <div>
                          <p className="font-medium text-secondary-800 dark:text-secondary-200">Phone Support</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">+90 (312) 123-4567</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Mon-Fri, 9:00 AM - 6:00 PM (GMT+3)</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary-500 dark:text-primary-300 mt-0.5" />
                        <div>
                          <p className="font-medium text-secondary-800 dark:text-secondary-200">Office Address</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Work ME Headquarters</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Çankaya, Ankara, Turkey</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary-500 dark:text-primary-300 mt-0.5" />
                        <div>
                          <p className="font-medium text-secondary-800 dark:text-secondary-200">Business Hours</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm">Sunday: Closed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardHeader>
                      <CardTitle className="text-secondary-800 dark:text-secondary-200">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Business Information Form
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Service Catalog
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Event Registration
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        >
                          Partner Program
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Help Center Tab */}
            <TabsContent value="help" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-secondary-800 dark:text-secondary-200">
                        <HelpCircle className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                        <span>Frequently Asked Questions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-secondary-700 dark:text-secondary-300">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardHeader>
                      <CardTitle className="text-secondary-800 dark:text-secondary-200">Popular Help Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Getting Started Guide
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Business Registration
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Service Information
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Event Participation
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Account Management
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-secondary-800 dark:text-secondary-200 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                          Technical Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardHeader>
                      <CardTitle className="text-secondary-800 dark:text-secondary-200">Need More Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                        onClick={() => setActiveTab("contact")}
                      >
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Member Login Tab */}
            <TabsContent value="signin" className="space-y-8">
              <div className="max-w-md mx-auto">
                <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-center text-secondary-800 dark:text-secondary-200">
                      <User className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                      <span>Member Login</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  type="email"
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your password"
                                  type="password"
                                  className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 space-y-3">
                      <div className="text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-primary-500 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          Forgot your password?
                        </Button>
                      </div>

                      <div className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-primary-500 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          Register here
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">Member Benefits</h3>
                      <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                        <li>• Access to exclusive business opportunities</li>
                        <li>• Priority support and consultation</li>
                        <li>• Early event registration</li>
                        <li>• Personalized business recommendations</li>
                        <li>• Premium research and insights</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}