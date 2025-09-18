import { z } from 'zod';

// Business form validation schema
export const businessFormSchema = z.object({
  // Basic Business Information
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessBrief: z.string().min(10, 'Business brief must be at least 10 characters'),
  
  // Skills and Training
  skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
  expertiseLevel: z.enum(['Elementary', 'Intermediate', 'Advanced'], {
    required_error: 'Please select an expertise level',
  }),
  trainingHours: z.number().min(0, 'Training hours must be positive'),
  trainingDays: z.number().min(0, 'Training days must be positive'),
  trainingMonths: z.number().min(0, 'Training months must be positive'),
  
  // Education and Qualifications
  educationLevel: z.string().min(1, 'Education level is required'),
  qualifications: z.string().optional(),
  experienceSkills: z.string().optional(),
  
  // Health and Safety
  healthSafety: z.string().optional(),
  
  // Capital Requirements
  fixedCapital: z.number().min(0, 'Fixed capital must be positive'),
  workingCapital: z.number().min(0, 'Working capital must be positive'),
  
  // Equipment and Materials
  equipmentRequired: z.string().optional(),
  rawMaterials: z.string().optional(),
  
  // Space Requirements
  totalArea: z.number().min(0, 'Total area must be positive'),
  width: z.number().min(0, 'Width must be positive'),
  length: z.number().min(0, 'Length must be positive'),
  height: z.number().min(0, 'Height must be positive'),
  
  // Location
  suitableCities: z.array(z.string()).min(1, 'At least one city must be selected'),
  locationType: z.enum(['Private House Apartment', 'Villa', 'Empty Land', 'Shed'], {
    required_error: 'Please select a location type',
  }),
  
  // Requirements
  basicRequirements: z.string().optional(),
  fuelEnergy: z.string().optional(),
  performanceStandards: z.string().optional(),
  
  // Stakeholders and Permits
  stakeholders: z.array(z.string()).optional(),
  authorities: z.string().optional(),
  licenseSteps: z.array(z.object({
    step: z.number(),
    description: z.string(),
  })).optional(),
  
  // Personnel
  supervisorNeeded: z.boolean(),
  employeeCount: z.number().min(0, 'Employee count must be positive'),
  
  // Financial Projections
  weeklyRevenue: z.number().min(0, 'Weekly revenue must be positive'),
  monthlyRevenue: z.number().min(0, 'Monthly revenue must be positive'),
  annualRevenue: z.number().min(0, 'Annual revenue must be positive'),
  weeklyProfit: z.number().min(0, 'Weekly profit must be positive'),
  monthlyProfit: z.number().min(0, 'Monthly profit must be positive'),
  annualProfit: z.number().min(0, 'Annual profit must be positive'),
  
  // Banking and Finance
  bankingFacilities: z.string().optional(),
  repaymentSchedule: z.string().optional(),
  
  // Product Information
  productDescription: z.string().optional(),
  productImages: z.array(z.string()).optional(),
  educationalVideos: z.array(z.string()).optional(),
  sitePlan: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof businessFormSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Authentication schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignInData = z.infer<typeof signInSchema>;
export type RegisterData = z.infer<typeof registerSchema>;