// 'use client';

// import React, { useState, useRef } from 'react';
// import { useInView } from "framer-motion";
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import { Mic, MicOff, Search } from 'lucide-react';
// import { useVoiceSearch } from '@/hooks/useVoiceSearch';
// import { cn } from '@/lib/utils';
// import Image from 'next/image';

// const SearchBar = () => {
//   const ref = useRef(null);
//    const isInView = useInView(ref, { once: true });

//   const [country, setCountry] = useState('turkey');
//   const [city, setCity] = useState('');
//   const [businessType, setBusinessType] = useState('');
//   const router = useRouter();

//   const { isListening, transcript, startListening, stopListening, isSupported, error } = useVoiceSearch({
//     onTranscript: (transcript) => {
//       setBusinessType(transcript);
//     },
//     continuous: false,
//     interimResults: true,
//     language: 'tr-TR',
//   });

//   const handleVoiceSearch = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const searchParams = new URLSearchParams();

//     if (country) searchParams.set('country', country);
//     if (city) searchParams.set('city', city);
//     if (businessType) searchParams.set('business', businessType);

//     router.push(`/search?${searchParams.toString()}`);
//   };

//   return (
//     <div ref={ref}  style={{
//           transform: isInView ? "none" : "translateY(-200px)",
//           opacity: isInView ? 1 : 0.5,
//           transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
//         }}
//          className="max-w-7xl mx-auto my-8 p-8 bg-transparent dark:bg-transparent border-2 border-primary-200 dark:border-secondary-700 rounded-lg shadow-lg transition-colors duration-300">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
//           Find your need here
//         </h2>
//         <p className="text-secondary-600 dark:text-secondary-400">
//           Discover businesses, services, and opportunities across Turkey
//         </p>
//       </div>

//       <form onSubmit={handleSearch} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Country Selector */}
//           <div className="space-y-2">
//             <label htmlFor="country" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
//               Country
//             </label>
//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger className="bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200">
//                 <SelectValue placeholder="Select country" />
//               </SelectTrigger>
//               <SelectContent className="bg-white dark:bg-secondary-900 border-primary-200 dark:border-secondary-700">
//                 <SelectItem value="turkey" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
//                   Türkiye
//                 </SelectItem>
//                 <SelectItem value="usa" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
//                   United States
//                 </SelectItem>
//                 <SelectItem value="uk" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
//                   United Kingdom
//                 </SelectItem>
//                 <SelectItem value="germany" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800">
//                   Germany
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* City Input */}
//           <div className="space-y-2">
//             <label htmlFor="city" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
//               City
//             </label>
//             <Input
//               id="city"
//               type="text"
//               placeholder="Enter city name"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="w-full bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
//             />
//           </div>

//           {/* Business Type Input with Voice Search */}
//           <div className="space-y-2">
//             <label htmlFor="business-type" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
//               Business Type/Name
//             </label>
//             <div className="relative">
//               <Input
//                 id="business-type"
//                 type="text"
//                 placeholder="Enter business type or name"
//                 value={businessType}
//                 onChange={(e) => setBusinessType(e.target.value)}
//                 className="w-full pr-12 bg-white dark:bg-secondary-800 border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
//               />
//               {isSupported && (
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   disableMotion
//                   onClick={handleVoiceSearch}
//                   className={cn(
//                     "absolute right-1 top-1/2 transform -translate-y-1/2 p-2",
//                     isListening ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20" : "text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800"
//                   )}
//                   aria-label="Voice search"
//                 >
//                   {isListening ? (
//                     <MicOff className="h-4 w-4" />
//                   ) : (
//                     <Mic className="h-4 w-4" />
//                   )}
//                 </Button>
//               )}
//             </div>
//             {error && (
//               <p className="text-sm text-destructive dark:text-destructive-foreground">{error}</p>
//             )}
//           </div>
//         </div>

//         {/* Voice Search Status */}
//         {isListening && (
//           <div className="text-center">
//             <div className="inline-flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
//               <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
//               <span>Listening... Speak now</span>
//             </div>
//           </div>
//         )}

//         {/* Search Button */}
//         <div className="text-center">
//           <Button
//             type="submit"
//             size="lg"
//             className="px-8 py-3 bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700"
//           >
//             <Search className="h-5 w-5 mr-2" />
//             Search
//           </Button>
//         </div>
//       </form>

//       {/* Logo */}
//       <div className="flex justify-center mt-6">
//         <Image src="/ISLIO-Blue.png" alt="ISLIO" width={150} height={60} />
//       </div>
//     </div>
//   );
// };

// export default SearchBar;

'use client';
import React, { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
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
import Image from 'next/image';

const SearchBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    language: 'tr-TR',
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
    <div
      ref={ref}
      style={{
        transform: isInView ? 'none' : 'translateY(-200px)',
        opacity: isInView ? 1 : 0.5,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
      }}
      className="max-w-7xl mx-auto my-8 p-8 bg-primary-50/50 dark:bg-primary-900/50 dark:backdrop-blur-md border-2 border-primary-200 dark:border-secondary-700 rounded-lg shadow-lg transition-colors duration-300"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          Find your need here
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Discover businesses, services, and opportunities across Turkey
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Selector */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
              Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-primary-50/70 dark:bg-secondary-800/70 backdrop-blur-sm border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring-primary-300 dark:focus:ring-primary-600">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-primary-50/70 dark:bg-secondary-900/70 backdrop-blur-sm border-primary-200 dark:border-secondary-700">
                <SelectItem value="turkey" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70">
                  Türkiye
                </SelectItem>
                <SelectItem value="usa" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70">
                  United States
                </SelectItem>
                <SelectItem value="uk" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70">
                  United Kingdom
                </SelectItem>
                <SelectItem value="germany" className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70">
                  Germany
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City Input */}
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
              City
            </label>
            <Input
              id="city"
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-primary-50/70 dark:bg-secondary-800/70 backdrop-blur-sm border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
            />
          </div>

          {/* Business Type Input with Voice Search */}
          <div className="space-y-2">
            <label htmlFor="business-type" className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
              Business Type/Name
            </label>
            <div className="relative">
              <Input
                id="business-type"
                type="text"
                placeholder="Enter business type or name"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full pr-12 bg-primary-50/70 dark:bg-secondary-800/70 backdrop-blur-sm border-primary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 focus:ring focus:ring-primary-300 dark:focus:ring-primary-600"
              />
              {isSupported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disableMotion
                  onClick={handleVoiceSearch}
                  className={cn(
                    "absolute right-1 top-1/2 transform -translate-y-1/2 p-2",
                    isListening ? "text-red-500 dark:text-red-400 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm" : "text-secondary-800 dark:text-secondary-200 hover:bg-primary-100/70 dark:hover:bg-secondary-800/70 backdrop-blur-sm"
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
              <p className="text-sm text-destructive dark:text-destructive-foreground">{error}</p>
            )}
          </div>
        </div>

        {/* Voice Search Status */}
        {isListening && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm px-3 py-2 rounded-md">
              <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
              <span>Listening... Speak now</span>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="text-center">
          <Button
            type="submit"
            size="lg"
            className="px-8 py-3 bg-primary-500/90 dark:bg-primary-600/90 backdrop-blur-sm text-white hover:bg-primary-600/90 dark:hover:bg-primary-700/90"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Logo */}
      <div className="flex justify-center mt-6">
        <Image src="/ISLIO-Blue.png" alt="ISLIO" width={150} height={60} />
      </div>
    </div>
  );
};

export default SearchBar;