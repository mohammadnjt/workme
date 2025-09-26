import React from 'react'
import BusinessPlanView from './BusinessPlanView';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const planData = {
  business_name: 'کافه کتاب',
  business_brief: 'کافه‌ای با تمرکز بر کتاب‌های آموزشی',
  skills_required: 'مدیریت، فروش، حسابداری',
  training_duration: '3 ماه',
  education_level: 'متوسط',
  work_experience: '1 سال',
  health_safety: 'رعایت پروتکل‌های بهداشتی',
  fixed_capital: '100 میلیون تومان',
  working_capital: '50 میلیون تومان',
  raw_materials: 'کتاب، قهوه، مبلمان',
  space_required: '50 متر مربع',
  suitable_cities: 'تهران، اصفهان',
  location_type: 'خانه خصوصی',
  basic_requirements: 'اینترنت، برق',
  fuel_energy: 'برق شهری',
  performance_standards: 'رعایت استانداردهای غذایی',
  support_stakeholders: 'شهرداری، وزارت بهداشت',
  work_permits: 'مجوز کسب‌وکار',
  license_steps: 'ثبت‌نام، بررسی، صدور مجوز',
  market_targets: 'دانشجویان، کتاب‌خوان‌ها',
  supervisor_requirements: 'ناظر مالی',
  special_requirements: 'هیچ',
  number_employees: '5 نفر',
  sales_revenue: 'ماهانه 50 میلیون تومان',
  net_profit: 'سالانه 200 میلیون تومان',
  banking_facilities: 'وام بانکی',
  product_shape_size: ['/images/shape1.jpg', '/images/shape2.jpg'], // آرایه URL تصاویر
  product_photo: ['/images/photo1.jpg', '/images/photo2.jpg'], // آرایه URL تصاویر
  educational_video: '/videos/educational.mp4', // URL ویدیو
  production_site_plan: '/plans/site_plan.pdf', // URL تصویر یا PDF
};

export default function page() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />
      <BusinessPlanView plan={planData} />
      <Footer />
    </div>
  )
}
