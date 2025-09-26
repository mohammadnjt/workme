# Work ME - Business Discovery Platform

A comprehensive Next.js application for business discovery, services, events, and research, primarily targeting Turkey with emphasis on Ankara.

## Features

- 🔍 **Business Discovery**: Explore business opportunities across 13 industry categories
- 🗺️ **Interactive Map**: Interactive Turkey map with detailed Ankara business information
- 📋 **Business Form**: Comprehensive business information form with validation
- 🌐 **Bilingual Support**: English and Turkish language support
- 🎨 **Modern UI**: Responsive design with dark/light theme support
- 🗣️ **Voice Search**: Voice-enabled search functionality
- 📱 **Mobile Responsive**: Fully responsive across all devices

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Maps**: React Leaflet for interactive maps
- **Voice**: Web Speech API integration

## Project Structure

```
workme/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── business/          # Business discovery pages
│   │   ├── services/          # Services pages
│   │   ├── events/            # Events pages
│   │   ├── research/          # Research pages
│   │   └── support/           # Support pages
│   ├── components/            # Reusable React components
│   │   ├── ui/               # UI components (Button, etc.)
│   │   ├── Header.tsx        # Main navigation
│   │   ├── Footer.tsx        # Site footer
│   │   ├── SearchBar.tsx     # Voice-enabled search
│   │   └── ...
│   ├── data/                 # Static JSON data
│   │   ├── categories.json   # Business categories
│   │   ├── services.json     # Available services
│   │   ├── events.json       # Events data
│   │   ├── research.json     # Research articles
│   │   └── ankara-data.json  # Ankara-specific info
│   ├── hooks/                # Custom React hooks
│   │   └── useVoiceSearch.ts # Voice search functionality
│   └── lib/                  # Utility functions
│       └── utils.ts
├── public/                   # Static assets
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository** (or create new project):
```bash
npx create-next-app@latest workme --typescript --tailwind --eslint --app --src-dir --import-alias "../*"
cd workme
```

2. **Install dependencies**:
```bash
npm install react-hook-form @hookform/resolvers zod lucide-react react-leaflet leaflet @types/leaflet clsx tailwind-merge class-variance-authority @radix-ui/react-accordion @radix-ui/react-button @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-form @radix-ui/react-label @radix-ui/react-select @radix-ui/react-tabs next-themes
```

3. **Copy all provided code files** into the appropriate directories

4. **Run the development server**:
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Building for Production

```bash
npm run build
npm run start
```

## Key Features

### 🌐 Bilingual Support
- English and Turkish language support
- Dynamic language switching
- Persistent language preference

### 🗺️ Interactive Map
- Turkey map with clickable regions
- Detailed Ankara business opportunities
- Modal with comprehensive regional data

### 📋 Comprehensive Business Form
- Multi-section form with validation
- File upload placeholders
- Skills and stakeholder management
- Revenue projection tables

### 🔍 Voice Search
- Web Speech API integration
- Real-time voice recognition
- Visual feedback during listening

### 🎨 Modern Design
- Dark/light theme support
- Responsive design
- Clean, professional UI
- Smooth animations and transitions

## Data Structure

### Business Categories (13 categories)
- Recycling Industries
- Plastic Industries  
- Automobile/Motorcycle/Boat
- Cellulose/Clothing
- Pharmaceutical/Health
- Food Industry
- Metal/Wood Industries
- Mineral/Construction
- Agricultural/Animal Husbandry/Fisheries
- Tourism/Recreation/Service
- Online Businesses
- Chemical/Petrochemical
- Information Technology

### Services (7 services)
- Business Consulting
- Training & Development
- Capital Financing
- Management & Supervision
- Supply of Equipment & Raw Materials
- Marketing & Sales
- Workme Competition

## Configuration

### Environment Variables
Create a `.env.local` file for any environment-specific configurations.

### Customization
- Update `src/data/*.json` files to modify static content
- Customize colors in `tailwind.config.js`
- Modify language translations in components using the `t()` function

## Browser Support

- Modern browsers with ES6+ support
- Speech Recognition API support for voice features
- Responsive design for mobile/tablet/desktop

## Performance Features

- Next.js Image optimization
- Lazy loading for map components
- Optimized bundle size
- SEO-friendly structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Work ME platform.

## Support

For support and questions, contact the Work ME development team.

---

**Work ME - Where innovation and collaboration thrive**