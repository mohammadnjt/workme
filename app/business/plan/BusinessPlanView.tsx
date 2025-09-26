// 'use client';
// import * as React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { Table } from './Table';
// import { Download, PlayCircle } from 'lucide-react';

// export interface BusinessPlanData {
//   business_name: string;
//   business_brief: string;
//   skills_required: string;
//   training_duration: string;
//   education_level: string;
//   work_experience: string;
//   health_safety: string;
//   fixed_capital: string;
//   working_capital: string;
//   raw_materials: string;
//   space_required: string;
//   suitable_cities: string;
//   location_type: string;
//   basic_requirements: string;
//   fuel_energy: string;
//   performance_standards: string;
//   support_stakeholders: string;
//   work_permits: string;
//   license_steps: string;
//   market_targets: string;
//   supervisor_requirements: string;
//   special_requirements: string;
//   number_employees: string;
//   sales_revenue: string;
//   net_profit: string;
//   banking_facilities: string;
//   product_shape_size: string[]; // آرایه URL تصاویر
//   product_photo: string[]; // آرایه URL تصاویر
//   educational_video: string; // URL ویدیو
//   production_site_plan: string; // URL تصویر یا PDF
// }

// interface BusinessPlanViewProps {
//   plan: BusinessPlanData;
//   className?: string;
// }

// const BusinessPlanView = ({ plan, className }: BusinessPlanViewProps) => {
//   // آماده‌سازی داده برای جدول مشخصات
//   const specHeaders = ['فیلد', 'مقدار'];

//   const specData = [
//     { فیلد: 'نام بیزینس', مقدار: plan.business_name },
//     { فیلد: 'توضیح مختصر', مقدار: plan.business_brief },
//     { فیلد: 'مهارت‌های مورد نیاز', مقدار: plan.skills_required },
//     { فیلد: 'مدت آموزش', مقدار: plan.training_duration },
//     { فیلد: 'سطح آموزشی', مقدار: plan.education_level },
//     { فیلد: 'تجربه کاری', مقدار: plan.work_experience },
//     { فیلد: 'الزامات بهداشت و ایمنی', مقدار: plan.health_safety },
//     { فیلد: 'سرمایه ثابت', مقدار: plan.fixed_capital },
//     { فیلد: 'سرمایه در گردش', مقدار: plan.working_capital },
//     { فیلد: 'مواد خام', مقدار: plan.raw_materials },
//     { فیلد: 'فضای مورد نیاز', مقدار: plan.space_required },
//     { فیلد: 'شهرهای مناسب', مقدار: plan.suitable_cities },
//     { فیلد: 'نوع مکان', مقدار: plan.location_type },
//     { فیلد: 'الزامات پایه', مقدار: plan.basic_requirements },
//     { فیلد: 'سوخت و انرژی', مقدار: plan.fuel_energy },
//     { فیلد: 'استانداردهای عملکرد', مقدار: plan.performance_standards },
//     { فیلد: 'پشتیبانی ذی‌نفعان', مقدار: plan.support_stakeholders },
//     { فیلد: 'مجوزهای کاری', مقدار: plan.work_permits },
//     { فیلد: 'مراحل مجوز', مقدار: plan.license_steps },
//     { فیلد: 'بازار هدف', مقدار: plan.market_targets },
//     { فیلد: 'الزامات ناظر', مقدار: plan.supervisor_requirements },
//     { فیلد: 'الزامات ویژه', مقدار: plan.special_requirements },
//     { فیلد: 'تعداد کارکنان', مقدار: plan.number_employees },
//     { فیلد: 'درآمد فروش', مقدار: plan.sales_revenue },
//     { فیلد: 'سود خالص', مقدار: plan.net_profit },
//     { فیلد: 'تسهیلات بانکی', مقدار: plan.banking_facilities },
//   ];

//   return (
//     <div
//       className={cn(
//         'space-y-8 p-6 bg-primary-50/70 dark:bg-primary-900/70 backdrop-blur-md rounded-lg shadow-lg transition-colors duration-300',
//         className
//       )}
//     >
//       {/* جدول مشخصات */}
//       <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
//             مشخصات بیزینس پلن
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table
//             headers={specHeaders}
//             data={specData}
//             variant="default"
//             size="lg"
//             disableMotion={true}
//             className="text-secondary-800 dark:text-secondary-200"
//           />
//         </CardContent>
//       </Card>

//       {/* شکل و اندازه محصول */}
//       <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
//             شکل و اندازه محصول
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {plan.product_shape_size.length > 0 ? (
//             plan.product_shape_size.map((url, index) => (
//               <div
//                 key={index}
//                 className="relative group overflow-hidden rounded-md border border-primary-200 dark:border-secondary-700"
//               >
//                 <img
//                   src={url}
//                   alt={`شکل و اندازه محصول ${index + 1}`}
//                   className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-primary-900/20 dark:bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
//             ))
//           ) : (
//             <p className="text-secondary-600 dark:text-secondary-400 col-span-full text-center">
//               تصویری برای شکل و اندازه محصول موجود نیست.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* عکس محصول */}
//       <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
//             عکس محصول
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {plan.product_photo.length > 0 ? (
//             plan.product_photo.map((url, index) => (
//               <div
//                 key={index}
//                 className="relative group overflow-hidden rounded-md border border-primary-200 dark:border-secondary-700"
//               >
//                 <img
//                   src={url}
//                   alt={`عکس محصول ${index + 1}`}
//                   className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-primary-900/20 dark:bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
//             ))
//           ) : (
//             <p className="text-secondary-600 dark:text-secondary-400 col-span-full text-center">
//               عکسی برای محصول موجود نیست.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* ویدیوی آموزشی */}
//       <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
//             ویدیوی آموزشی
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {plan.educational_video ? (
//             <div className="relative">
//               <video
//                 src={plan.educational_video}
//                 controls
//                 className="w-full h-auto rounded-md border border-primary-200 dark:border-secondary-700"
//               >
//                 مرورگر شما ویدیو را پشتیبانی نمی‌کند.
//               </video>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="absolute top-2 right-2 text-primary-500 dark:text-primary-300 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70 backdrop-blur-sm"
//                 onClick={() => window.open(plan.educational_video, '_blank')}
//               >
//                 <PlayCircle className="h-5 w-5 mr-2" />
//                 پخش در پنجره جدید
//               </Button>
//             </div>
//           ) : (
//             <p className="text-secondary-600 dark:text-secondary-400 text-center">
//               ویدیوی آموزشی موجود نیست.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* پلن سایت واحد تولید */}
//       <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
//             پلن سایت واحد تولید
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {plan.production_site_plan ? (
//             plan.production_site_plan.endsWith('.pdf') ? (
//               <div className="relative">
//                 <iframe
//                   src={plan.production_site_plan}
//                   className="w-full h-96 rounded-md border border-primary-200 dark:border-secondary-700"
//                   title="پلن سایت واحد تولید"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="absolute top-2 right-2 text-primary-500 dark:text-primary-300 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70 backdrop-blur-sm"
//                   onClick={() => window.open(plan.production_site_plan, '_blank')}
//                 >
//                   <Download className="h-5 w-5 mr-2" />
//                   دانلود PDF
//                 </Button>
//               </div>
//             ) : (
//               <img
//                 src={plan.production_site_plan}
//                 alt="پلن سایت واحد تولید"
//                 className="w-full h-auto rounded-md border border-primary-200 dark:border-secondary-700"
//               />
//             )
//           ) : (
//             <p className="text-secondary-600 dark:text-secondary-400 text-center">
//               پلن سایت واحد تولید موجود نیست.
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BusinessPlanView;


'use client';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table } from './Table';
import { Download, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BusinessPlanData {
  business_name: string;
  business_brief: string;
  skills_required: string;
  training_duration: string;
  education_level: string;
  work_experience: string;
  health_safety: string;
  fixed_capital: string;
  working_capital: string;
  raw_materials: string;
  space_required: string;
  suitable_cities: string;
  location_type: string;
  basic_requirements: string;
  fuel_energy: string;
  performance_standards: string;
  support_stakeholders: string;
  work_permits: string;
  license_steps: string;
  market_targets: string;
  supervisor_requirements: string;
  special_requirements: string;
  number_employees: string;
  sales_revenue: string;
  net_profit: string;
  banking_facilities: string;
  product_shape_size: string[]; // Array of image URLs
  product_photo: string[]; // Array of image URLs
  educational_video: string; // Video URL
  production_site_plan: string; // Image or PDF URL
}

interface BusinessPlanViewProps {
  plan: BusinessPlanData;
  className?: string;
}

const BusinessPlanView = ({ plan, className }: BusinessPlanViewProps) => {
  const [activeView, setActiveView] = React.useState<'table' | 'card'>('card');
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  // Prepare data for table
  const specHeaders = ['Field', 'Value'];

  const specData = [
    { Field: 'Business Name', Value: plan.business_name },
    { Field: 'Business Brief', Value: plan.business_brief },
    { Field: 'Required Skills', Value: plan.skills_required },
    { Field: 'Training Duration', Value: plan.training_duration },
    { Field: 'Education Level', Value: plan.education_level },
    { Field: 'Work Experience', Value: plan.work_experience },
    { Field: 'Health & Safety', Value: plan.health_safety },
    { Field: 'Fixed Capital', Value: plan.fixed_capital },
    { Field: 'Working Capital', Value: plan.working_capital },
    { Field: 'Raw Materials', Value: plan.raw_materials },
    { Field: 'Space Required', Value: plan.space_required },
    { Field: 'Suitable Cities', Value: plan.suitable_cities },
    { Field: 'Location Type', Value: plan.location_type },
    { Field: 'Basic Requirements', Value: plan.basic_requirements },
    { Field: 'Fuel & Energy', Value: plan.fuel_energy },
    { Field: 'Performance Standards', Value: plan.performance_standards },
    { Field: 'Support Stakeholders', Value: plan.support_stakeholders },
    { Field: 'Work Permits', Value: plan.work_permits },
    { Field: 'License Steps', Value: plan.license_steps },
    { Field: 'Market Targets', Value: plan.market_targets },
    { Field: 'Supervisor Requirements', Value: plan.supervisor_requirements },
    { Field: 'Special Requirements', Value: plan.special_requirements },
    { Field: 'Number of Employees', Value: plan.number_employees },
    { Field: 'Sales Revenue', Value: plan.sales_revenue },
    { Field: 'Net Profit', Value: plan.net_profit },
    { Field: 'Banking Facilities', Value: plan.banking_facilities },
  ];

  // Card view data groups (important fields in summary cards)
  const cardGroups = [
    {
      id: 'group1',
      title: 'Basic Information',
      summaryFields: [
        { Field: 'Business Name', Value: plan.business_name },
        { Field: 'Business Brief', Value: plan.business_brief },
        { Field: 'Required Skills', Value: plan.skills_required },
        { Field: 'Training Duration', Value: plan.training_duration },
      ],
      fullFields: [
        { Field: 'Business Name', Value: plan.business_name },
        { Field: 'Business Brief', Value: plan.business_brief },
        { Field: 'Required Skills', Value: plan.skills_required },
        { Field: 'Training Duration', Value: plan.training_duration },
        { Field: 'Education Level', Value: plan.education_level },
        { Field: 'Work Experience', Value: plan.work_experience },
        { Field: 'Health & Safety', Value: plan.health_safety },
      ],
    },
    {
      id: 'group2',
      title: 'Financial Requirements',
      summaryFields: [
        { Field: 'Fixed Capital', Value: plan.fixed_capital },
        { Field: 'Working Capital', Value: plan.working_capital },
        { Field: 'Sales Revenue', Value: plan.sales_revenue },
        { Field: 'Net Profit', Value: plan.net_profit },
      ],
      fullFields: [
        { Field: 'Fixed Capital', Value: plan.fixed_capital },
        { Field: 'Working Capital', Value: plan.working_capital },
        { Field: 'Raw Materials', Value: plan.raw_materials },
        { Field: 'Sales Revenue', Value: plan.sales_revenue },
        { Field: 'Net Profit', Value: plan.net_profit },
        { Field: 'Banking Facilities', Value: plan.banking_facilities },
      ],
    },
    {
      id: 'group3',
      title: 'Location & Requirements',
      summaryFields: [
        { Field: 'Space Required', Value: plan.space_required },
        { Field: 'Suitable Cities', Value: plan.suitable_cities },
        { Field: 'Location Type', Value: plan.location_type },
        { Field: 'Basic Requirements', Value: plan.basic_requirements },
      ],
      fullFields: [
        { Field: 'Space Required', Value: plan.space_required },
        { Field: 'Suitable Cities', Value: plan.suitable_cities },
        { Field: 'Location Type', Value: plan.location_type },
        { Field: 'Basic Requirements', Value: plan.basic_requirements },
        { Field: 'Fuel & Energy', Value: plan.fuel_energy },
        { Field: 'Performance Standards', Value: plan.performance_standards },
        { Field: 'Support Stakeholders', Value: plan.support_stakeholders },
        { Field: 'Work Permits', Value: plan.work_permits },
        { Field: 'License Steps', Value: plan.license_steps },
        { Field: 'Market Targets', Value: plan.market_targets },
        { Field: 'Supervisor Requirements', Value: plan.supervisor_requirements },
        { Field: 'Special Requirements', Value: plan.special_requirements },
        { Field: 'Number of Employees', Value: plan.number_employees },
      ],
    },
  ];

  const renderCardGroup = (group: any) => (
    <Card className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-secondary-800 dark:text-secondary-200">{group.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          headers={specHeaders}
          data={group.summaryFields}
          variant="ghost"
          size="sm"
          disableMotion={true}
        />
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
          onClick={() => setExpandedCard(group.id)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const renderExpandedCard = (group: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setExpandedCard(null)}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full max-w-2xl bg-white dark:bg-secondary-900 rounded-lg shadow-xl overflow-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-secondary-800 dark:text-secondary-200">{group.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            headers={specHeaders}
            data={group.fullFields}
            variant="ghost"
            size="default"
            disableMotion={true}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
            onClick={() => setExpandedCard(null)}
          >
            Close
          </Button>
        </CardContent>
      </motion.div>
    </motion.div>
  );

  return (
    <div className={cn('space-y-8 p-[100px]', className)}>
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'table' | 'card')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-sm rounded-md p-1">
          <TabsTrigger value="card" className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-900 data-[state=active]:shadow-sm">
            Card View
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-white dark:data-[state=active]:bg-secondary-900 data-[state=active]:shadow-sm">
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardGroups.map((group) => renderCardGroup(group))}
          </div>
          <AnimatePresence>
            {expandedCard && (
              renderExpandedCard(cardGroups.find((g) => g.id === expandedCard)!)
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="table">
          <Table
            headers={specHeaders}
            data={specData}
            variant="default"
            size="lg"
            disableMotion={true}
          />
        </TabsContent>
      </Tabs>

      {/* Product Shape & Size */}
      <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Product Shape & Size
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plan.product_shape_size.length > 0 ? (
            plan.product_shape_size.map((url, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-md border border-primary-200 dark:border-secondary-700"
              >
                <img
                  src={url}
                  alt={`Product Shape & Size ${index + 1}`}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary-900/20 dark:bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))
          ) : (
            <p className="text-secondary-600 dark:text-secondary-400 col-span-full text-center">
              No images available for product shape & size.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Product Photos */}
      <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Product Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plan.product_photo.length > 0 ? (
            plan.product_photo.map((url, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-md border border-primary-200 dark:border-secondary-700"
              >
                <img
                  src={url}
                  alt={`Product Photo ${index + 1}`}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary-900/20 dark:bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))
          ) : (
            <p className="text-secondary-600 dark:text-secondary-400 col-span-full text-center">
              No product photos available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Educational Video */}
      <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Educational Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plan.educational_video ? (
            <div className="relative">
              <video
                src={plan.educational_video}
                controls
                className="w-full h-auto rounded-md border border-primary-200 dark:border-secondary-700"
              >
                Your browser does not support the video tag.
              </video>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-primary-500 dark:text-primary-300 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70 backdrop-blur-sm"
                onClick={() => window.open(plan.educational_video, '_blank')}
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Play in New Window
              </Button>
            </div>
          ) : (
            <p className="text-secondary-600 dark:text-secondary-400 text-center">
              No educational video available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Production Site Plan */}
      <Card className="bg-primary-100/70 dark:bg-secondary-800/70 backdrop-blur-md border-primary-200 dark:border-secondary-700 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
            Production Site Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plan.production_site_plan ? (
            plan.production_site_plan.endsWith('.pdf') ? (
              <div className="relative">
                <iframe
                  src={plan.production_site_plan}
                  className="w-full h-96 rounded-md border border-primary-200 dark:border-secondary-700"
                  title="Production Site Plan"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-primary-500 dark:text-primary-300 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70 backdrop-blur-sm"
                  onClick={() => window.open(plan.production_site_plan, '_blank')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
              </div>
            ) : (
              <img
                src={plan.production_site_plan}
                alt="Production Site Plan"
                className="w-full h-auto rounded-md border border-primary-200 dark:border-secondary-700"
              />
            )
          ) : (
            <p className="text-secondary-600 dark:text-secondary-400 text-center">
              No production site plan available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPlanView;