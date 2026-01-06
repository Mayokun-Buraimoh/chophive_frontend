# ChopHive - Food Delivery Website

A modern, mobile-first food delivery website built with React, TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- 🎨 Modern dark theme with red accents
- 📱 Fully responsive mobile-first design
- 🍔 Food menu with category filtering
- ⭐ Customer testimonials
- 🛒 Shopping cart functionality (UI ready)
- 🚀 Fast and optimized with Vite

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Reusable component library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Shadcn UI components (Button, Card, Input, Tabs)
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── FeaturedSalads.tsx
│   ├── AboutFoodex.tsx
│   ├── MostPopularFood.tsx
│   ├── OurDishes.tsx
│   ├── WhyChooseUs.tsx
│   ├── Testimonials.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts     # Utility functions
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Components

- **Header**: Navigation bar with mobile menu
- **Hero**: Main banner section
- **FeaturedSalads**: Horizontal scrolling salad cards
- **AboutFoodex**: About section with features
- **MostPopularFood**: Popular dishes carousel
- **OurDishes**: Menu with category tabs
- **WhyChooseUs**: Feature highlights
- **Testimonials**: Customer reviews
- **Footer**: Newsletter signup and links

## Customization

### Colors

The main color scheme is defined in `src/index.css`:

- Primary orange: `#FF4500`
- Dark background: `#1E1E1E`
- Gray accents: Various shades of gray

### Adding New Components

1. Create component in `src/components/`
2. Import and use in `App.tsx`
3. Follow mobile-first responsive patterns

## License

MIT
