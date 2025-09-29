// import type { Config } from 'tailwindcss';

// const config: Config = {
//   darkMode: ['class'],
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: '#0D98BA',   // Blue Green متوسط
//           50:    '#F0FBFD',     // خیلی روشن، مناسب پس‌زمینه‌های subtle
//           100:   '#D6F3F9',     // روشن‌تر، مناسب border یا hover subtle
//           200:   '#ADE7F2',     // روشن، مناسب حالت‌های غیرفعال
//           300:   '#7FD6E8',     // کمی پررنگ‌تر، مناسب hover در تم روشن
//           400:   '#4FC3DC',     // رنگ فعال در تم روشن
//           500:   '#0D98BA',     // رنگ اصلی دکمه یا المان
//           600:   '#0B88A6',     // حالت hover در تم دارک
//           700:   '#097792',     // حالت فعال یا focus در تم دارک
//           800:   '#06667E',     // رنگ تیره‌تر برای حالت‌های خاص
//           900:   '#044F66',     // خیلی تیره، مناسب متن روی پس‌زمینه روشن
//         },
//         secondary: {
//           DEFAULT: '#2C3E50',
//           50: '#F8F9FA',
//           100: '#E9ECEF',
//           200: '#D3D9DF',
//           300: '#BCC5CF',
//           400: '#8A97A5',
//           500: '#58677B',
//           600: '#4A5870',
//           700: '#3C4965',
//           800: '#2C3E50',
//           900: '#24323F',
//         },
//         accent: {
//           DEFAULT: '#3498DB',
//           50: '#EBF8FF',
//           100: '#D1EEFC',
//           200: '#A7D8F0',
//           300: '#7CC1E4',
//           400: '#52AAD8',
//           500: '#3498DB',
//           600: '#2E86C1',
//           700: '#2874A6',
//           800: '#21618C',
//           900: '#1B4F72',
//         },
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         chart: {
//           '1': 'hsl(var(--chart-1))',
//           '2': 'hsl(var(--chart-2))',
//           '3': 'hsl(var(--chart-3))',
//           '4': 'hsl(var(--chart-4))',
//           '5': 'hsl(var(--chart-5))',
//         },
//       },
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'gradient-conic':
//           'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       keyframes: {
//         'accordion-down': {
//           from: {
//             height: '0',
//           },
//           to: {
//             height: 'var(--radix-accordion-content-height)',
//           },
//         },
//         'accordion-up': {
//           from: {
//             height: 'var(--radix-accordion-content-height)',
//           },
//           to: {
//             height: '0',
//           },
//         },
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [
//     require('tailwindcss-animate'),
//     function ({ addBase }) {
//       addBase({
//         '.scrollbar-hide': {
//           'scrollbar-width': 'none',
//           '-ms-overflow-style': 'none',
//         },
//         '.scrollbar-hide::-webkit-scrollbar': {
//           display: 'none',
//         },
//       });
//     },
//   ],
// };
// export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D98BA',   // Blue Green متوسط
          50: '#F0FBFD',     // خیلی روشن، مناسب پس‌زمینه‌های subtle
          100: '#D6F3F9',     // روشن‌تر، مناسب border یا hover subtle
          200: '#ADE7F2',     // روشن، مناسب حالت‌های غیرفعال
          300: '#7FD6E8',     // کمی پررنگ‌تر، مناسب hover در تم روشن
          400: '#4FC3DC',     // رنگ فعال در تم روشن
          500: '#0D98BA',     // رنگ اصلی دکمه یا المان
          600: '#0B88A6',     // حالت hover در تم دارک
          700: '#097792',     // حالت فعال یا focus در تم دارک
          800: '#06667E',     // رنگ تیره‌تر برای حالت‌های خاص
          900: '#044F66',     // خیلی تیره، مناسب متن روی پس‌زمینه روشن
        },
        secondary: {
          DEFAULT: '#2C3E50',
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#D3D9DF',
          300: '#BCC5CF',
          400: '#8A97A5',
          500: '#58677B',
          600: '#4A5870',
          700: '#3C4965',
          800: '#2C3E50',
          900: '#24323F',
        },
        accent: {
          DEFAULT: '#3498DB',
          50: '#EBF8FF',
          100: '#D1EEFC',
          200: '#A7D8F0',
          300: '#7CC1E4',
          400: '#52AAD8',
          500: '#3498DB',
          600: '#2E86C1',
          700: '#2874A6',
          800: '#21618C',
          900: '#1B4F72',
        },
        java: {
          50: '#eefffd',
          100: '#c7fffb',
          200: '#8efff9',
          300: '#4efaf4',
          400: '#1ae7e6',
          500: '#01c4c6',
          600: '#009fa4',
          700: '#037d82',
          800: '#086267',
          900: '#0c5155',
          950: '#002f34',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addComponents }:any) {
      addComponents({
        '.scrollbar-hide': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};

export default config;