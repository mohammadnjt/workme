'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { businessFormSchema, BusinessFormData } from '@/lib/validations';
import { Plus, Minus, Upload, Download, FileText, Save } from 'lucide-react';

const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 
  'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 
  'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 
  'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'Istanbul', 'İzmir', 'Kars', 'Kastamonu',
  'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya',
  'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun',
  'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon',
  'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
  'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',
  'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

export default function BusinessFormPage() {
  const [step, setStep] = useState(1);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [licenseSteps, setLicenseSteps] = useState<Array<{step: number, description: string}>>([]);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      businessBrief: '',
      skillsRequired: [],
      expertiseLevel: undefined,
      trainingHours: 0,
      trainingDays: 0,
      trainingMonths: 0,
      educationLevel: '',
      qualifications: '',
      experienceSkills: '',
      healthSafety: '',
      fixedCapital: 0,
      workingCapital: 0,
      equipmentRequired: '',
      rawMaterials: '',
      totalArea: 0,
      width: 0,
      length: 0,
      height: 0,
      suitableCities: [],
      locationType: undefined,
      basicRequirements: '',
      fuelEnergy: '',
      performanceStandards: '',
      stakeholders: [],
      authorities: '',
      licenseSteps: [],
      supervisorNeeded: false,
      employeeCount: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
      weeklyProfit: 0,
      monthlyProfit: 0,
      annualProfit: 0,
      bankingFacilities: '',
      repaymentSchedule: '',
      productDescription: '',
      productImages: [],
      educationalVideos: [],
      sitePlan: '',
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    console.log('Business Form Data:', data);
    alert('Form submitted successfully! Check console for details.');
  };

  const addSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      const updatedSkills = [...selectedSkills, newSkill.trim()];
      setSelectedSkills(updatedSkills);
      form.setValue('skillsRequired', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updatedSkills);
    form.setValue('skillsRequired', updatedSkills);
  };

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      const updatedCities = [...selectedCities, city];
      setSelectedCities(updatedCities);
      form.setValue('suitableCities', updatedCities);
    }
  };

  const removeCity = (city: string) => {
    const updatedCities = selectedCities.filter(c => c !== city);
    setSelectedCities(updatedCities);
    form.setValue('suitableCities', updatedCities);
  };

  const addLicenseStep = () => {
    const newStep = {
      step: licenseSteps.length + 1,
      description: ''
    };
    setLicenseSteps([...licenseSteps, newStep]);
  };

  const updateLicenseStep = (index: number, description: string) => {
    const updated = [...licenseSteps];
    updated[index].description = description;
    setLicenseSteps(updated);
    form.setValue('licenseSteps', updated);
  };

  const removeLicenseStep = (index: number) => {
    const updated = licenseSteps.filter((_, i) => i !== index);
    setLicenseSteps(updated);
    form.setValue('licenseSteps', updated);
  };

  const totalSteps = 8;

  const renderStepContent = () => {
  switch (step) {
    case 1:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Basic Business Information</h3>

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Business Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your business name"
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessBrief"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Business Brief *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description of your business"
                    rows={4}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
        </div>
      );

    case 2:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Skills and Training Requirements</h3>

          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">Skills Required *</FormLabel>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
              />
              <Button
                type="button"
                onClick={addSkill}
                className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="expertiseLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Expertise Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300">
                      <SelectValue placeholder="Select expertise level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-secondary-900 border-primary-200 dark:border-secondary-700">
                    <SelectItem value="Elementary" className="text-secondary-800 dark:text-secondary-200">Elementary</SelectItem>
                    <SelectItem value="Intermediate" className="text-secondary-800 dark:text-secondary-200">Intermediate</SelectItem>
                    <SelectItem value="Advanced" className="text-secondary-800 dark:text-secondary-200">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="trainingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Training Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainingDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Training Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainingMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Training Months</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 3:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Education and Qualifications</h3>

          <FormField
            control={form.control}
            name="educationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Education Level *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., High School, Bachelor's, Master's"
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Additional Qualifications</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any additional qualifications, certifications, or licenses"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Experience & Skills</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe relevant experience and skills"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="healthSafety"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Health & Safety Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any health and safety requirements or considerations"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
        </div>
      );

    case 4:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Capital and Equipment Requirements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fixedCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Fixed Capital (TL) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workingCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Working Capital (TL) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="equipmentRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Equipment Required</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List all equipment, machinery, and tools needed"
                    rows={4}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rawMaterials"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Raw Materials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List all raw materials and supplies needed"
                    rows={4}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
        </div>
      );

    case 5:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Space and Location Requirements</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="totalArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Total Area (m²) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Width (m) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Length (m) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Height (m) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">Suitable Cities *</FormLabel>
            <Select onValueChange={addCity}>
              <SelectTrigger className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300">
                <SelectValue placeholder="Select cities" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-secondary-900 border-primary-200 dark:border-secondary-700">
                {turkishCities.map((city) => (
                  <SelectItem key={city} value={city} className="text-secondary-800 dark:text-secondary-200">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCities.map((city) => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                >
                  {city}
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="ml-1 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Location Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-secondary-900 border-primary-200 dark:border-secondary-700">
                    <SelectItem value="Private House Apartment" className="text-secondary-800 dark:text-secondary-200">Private House Apartment</SelectItem>
                    <SelectItem value="Villa" className="text-secondary-800 dark:text-secondary-200">Villa</SelectItem>
                    <SelectItem value="Empty Land" className="text-secondary-800 dark:text-secondary-200">Empty Land</SelectItem>
                    <SelectItem value="Shed" className="text-secondary-800 dark:text-secondary-200">Shed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
        </div>
      );

    case 6:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Requirements and Permits</h3>

          <FormField
            control={form.control}
            name="basicRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Basic Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List basic requirements for the business"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelEnergy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Fuel & Energy Requirements</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Electricity, Natural Gas, Diesel"
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="performanceStandards"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Performance Standards</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe performance standards and quality requirements"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorities"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Authorities for Permits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List relevant authorities and permit requirements"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">License Requirements & Steps</FormLabel>
            <div className="space-y-2">
              {licenseSteps.map((step, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mt-2 min-w-[60px]">
                    Step {step.step}:
                  </span>
                  <Textarea
                    placeholder="Describe this licensing step"
                    value={step.description}
                    onChange={(e) => updateLicenseStep(index, e.target.value)}
                    rows={2}
                    className="flex-1 bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLicenseStep(index)}
                    className="mt-1 border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addLicenseStep}
                variant="outline"
                size="sm"
                className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add License Step
              </Button>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Personnel and Financial Projections</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="supervisorNeeded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 focus:ring-primary-500 dark:focus:ring-primary-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-secondary-800 dark:text-secondary-200">Supervisor Needed</FormLabel>
                    <FormDescription className="text-secondary-600 dark:text-secondary-400">
                      Check if a supervisor is required for this business
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary-800 dark:text-secondary-200">Number of Employees *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">Financial Projections</FormLabel>
            <Table className="mt-4 border border-primary-200 dark:border-secondary-700">
              <TableHeader>
                <TableRow className="bg-primary-100 dark:bg-secondary-800">
                  <TableHead className="text-secondary-800 dark:text-secondary-200">Period</TableHead>
                  <TableHead className="text-secondary-800 dark:text-secondary-200">Revenue (TL)</TableHead>
                  <TableHead className="text-secondary-800 dark:text-secondary-200">Net Profit (TL)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-white dark:bg-secondary-900">
                  <TableCell className="text-secondary-800 dark:text-secondary-200">Weekly</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="weeklyRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="weeklyProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:bg-secondary-900">
                  <TableCell className="text-secondary-800 dark:text-secondary-200">Monthly</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="monthlyRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="monthlyProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-white dark:bg-secondary-900">
                  <TableCell className="text-secondary-800 dark:text-secondary-200">Annual</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="annualRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="annualProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      );

    case 8:
      return (
        <div className="form-section bg-white dark:bg-secondary-900 p-6 rounded-lg border border-primary-200 dark:border-secondary-700">
          <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">Banking and Product Information</h3>

          <FormField
            control={form.control}
            name="bankingFacilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Banking Facilities</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe banking facilities and financial services needed"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repaymentSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Repayment Schedule</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe expected repayment schedule for loans or investments"
                    rows={3}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Product Shape/Size Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the product shape, size, and specifications"
                    rows={4}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Product Images Upload Placeholder */}
          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">Product Photos</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-primary-200 dark:border-secondary-700 rounded-lg p-6 text-center bg-white dark:bg-secondary-900"
                >
                  <Upload className="h-8 w-8 text-primary-500 dark:text-primary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Product Photo {i}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Videos Placeholder */}
          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">Educational Videos (YouTube Links)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-primary-200 dark:border-secondary-700 rounded-lg p-6 text-center bg-white dark:bg-secondary-900"
                >
                  <FileText className="h-8 w-8 text-primary-500 dark:text-primary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Educational Video {i}</p>
                  <Input
                    placeholder="YouTube URL"
                    className="mb-2 bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="sitePlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-secondary-800 dark:text-secondary-200">Production Unit Site Plan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the site plan and layout of the production unit"
                    rows={4}
                    className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-500 dark:focus:ring-primary-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />

          {/* Site Plan Images Placeholder */}
          <div>
            <FormLabel className="text-secondary-800 dark:text-secondary-200">Site Plan Images</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-primary-200 dark:border-secondary-700 rounded-lg p-6 text-center bg-white dark:bg-secondary-900"
                >
                  <Upload className="h-8 w-8 text-primary-500 dark:text-primary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">Site Plan {i}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 text-secondary-800 dark:text-secondary-200 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-200 mb-4">
              Business Information Form
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400">
              Provide detailed information about your business to receive comprehensive guidance
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                {Math.round((step / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-primary-200 dark:bg-secondary-800 rounded-full h-2">
              <div 
                className="bg-primary-500 dark:bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-primary-200 dark:border-secondary-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="border-primary-400 dark:border-primary-300 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  Previous
                </Button>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => console.log('Draft saved')}
                    className="text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>

                  {step === totalSteps ? (
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Submit Form
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setStep(Math.min(totalSteps, step + 1))}
                      className="bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}