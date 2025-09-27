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
import { ChevronDown, ChevronRightIcon, Mic, MicOff, Search, SearchIcon } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

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
    <>
      <div className="text-center mt-16 mb-16">
        <h1 className="font-semibold text-[#0d0d12] dark:text-white text-7xl leading-[86.4px] [font-family:'Poppins',Helvetica] mb-8">
          Plans That Work
          <br />
          Growth That Lasts
        </h1>

        <p className="font-normal text-[#808897] text-lg leading-[25.2px] [font-family:'Poppins',Helvetica] mb-16">
          Access ready-made strategies and exclusive opportunities to kickstart
          your journey today.
        </p>
      </div>

      <div className="max-w-[796px] mx-auto">
        <div className="bg-white dark:bg-slate-600 rounded-[10px] border border-solid border-[#a4abb866] p-0 h-[74px] flex items-center">
          {/* Country Select */}
          <div className="flex-1 px-[18px] border-r border-[#a4abb866]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size='lg'
                  className="flex w-[180px] border-none p-0 dark:bg-slate-600 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  <div className='flex w-full px-4 justify-between' >
                    <div className='flex flex-col items-start' >
                      <span className='text-gray-500 text-xs dark:text-slate-300' >Select Country</span>
                      <span className='text-gray-900  dark:text-white' >Norway</span>
                    </div>
                    <div className='flex items-center justify-end'>
                      <ChevronDown color='black' className="h-3 w-3" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-4 rounded-xl">
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Türkiye
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United Kingdom
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Germany
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* City Select */}
           <div className="flex-1 px-[18px] border-r border-[#a4abb866]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size='lg'
                  className="flex w-[180px] border-none p-0 dark:bg-slate-600 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  <div className='flex w-full px-4 justify-between' >
                    <div className='flex flex-col items-start' >
                      <span className='text-gray-500 text-xs dark:text-slate-300' >Select City</span>
                      <span className='text-gray-900  dark:text-white' >Haugesund</span>
                    </div>
                    <div className='flex items-center justify-end'>
                      <ChevronDown color='black' className="h-3 w-3" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-4 rounded-xl">
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Türkiye
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United Kingdom
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Germany
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Business Type Select */}
         <div className="flex-1 px-[18px] border-r border-[#a4abb866]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size='lg'
                  className="flex w-[180px] border-none dark:bg-slate-600 p-0 text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-secondary-800"
                >
                  <div className='flex w-full px-4 justify-between' >
                    <div className='flex flex-col items-start' >
                      <span className='text-gray-500 dark:text-slate-300 text-xs' >Business Type/Name</span>
                      <span className='text-gray-900 dark:text-white ' >Haugesund</span>
                    </div>
                    <div className='flex items-center justify-end'>
                      <ChevronDown color='black' className="h-3 w-3" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-secondary-900 border border-primary-200 dark:border-secondary-700 p-4 rounded-xl">
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Türkiye
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  United Kingdom
                </DropdownMenuItem>
                <DropdownMenuItem className="text-secondary-800 dark:text-secondary-200 hover:bg-primary-100 dark:hover:bg-secondary-800 p-1">
                  Germany
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* SearchIcon Button */}
          <div className="px-2">
            <Button className="w-[115px] h-[58px] bg-[#01c4c6] rounded-[10px] hover:bg-[#01c4c6]/90 flex items-center gap-2">
              <SearchIcon color='white' className="w-5 h-5" />
              <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-[15px] leading-6">
                Search
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;