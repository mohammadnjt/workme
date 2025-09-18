"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mic, MicOff, Search } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { cn } from '@/lib/utils';

const WorkMeLogoBig = () => (
  <div className="flex items-center justify-center space-x-3 mb-6">
    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
      <div className="text-white font-bold text-2xl">W</div>
    </div>
    <h2 className="text-4xl font-bold text-primary">Work ME</h2>
  </div>
);

const SearchBar = () => {
  const [country, setCountry] = useState('turkey');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('');
  const router = useRouter();

  const { isListening, transcript, startListening, stopListening, isSupported, error } = useVoiceSearch({
    onTranscript: (transcript) => {
      setBusinessType(transcript);
    },
    continuous: false,
    interimResults: true,
    language: 'tr-TR'
  });

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (country) searchParams.set('country', country);
    if (city) searchParams.set('city', city);
    if (businessType) searchParams.set('business', businessType);
    
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find your need here</h2>
        <p className="text-gray-600">Discover businesses, services, and opportunities across Turkey</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Selector */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="turkey">Türkiye</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City Input */}
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              id="city"
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Business Type Input with Voice Search */}
          <div className="space-y-2">
            <label htmlFor="business-type" className="text-sm font-medium text-gray-700">
              Business Type/Name
            </label>
            <div className="relative">
              <Input
                id="business-type"
                type="text"
                placeholder="Enter business type or name"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full pr-12"
              />
              {isSupported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceSearch}
                  className={cn(
                    "absolute right-1 top-1/2 transform -translate-y-1/2 p-2",
                    isListening && "voice-search-active"
                  )}
                  aria-label="Voice search"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Voice Search Status */}
        {isListening && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening... Speak now</span>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="text-center">
          <Button type="submit" size="lg" className="px-8 py-3">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Logo */}
      <WorkMeLogoBig />
    </div>
  );
};

export default SearchBar;