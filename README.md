# EcoModern Living

AI-powered sustainable living platform for [ecomodernliving.ai](https://ecomodernliving.ai).

## Features

- **Mega-menu navigation** with 6 top-level sections and 60+ mapped routes
- **Mobile drawer** with accordion submenus
- **Glassmorphism sticky header** with scroll effects
- **Passive house build journey** section (featured in nav)
- **Business pillar mapping**: Marketplace, AI Tools, Guides, Services, Community

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Navigation Structure

| Menu | Purpose |
|------|---------|
| Marketplace | Affiliate product categories (solar, heat pumps, furniture, etc.) |
| AI Tools | Home advisor, product recommender, interior design, energy audit |
| Guides | SEO content — passive house, reviews, tax credits |
| Our Passive House | Your future build — journal, materials, timeline |
| Services | Consulting, B2B, digital products, courses |
| Community | Newsletter, YouTube, eco homes marketplace |

Navigation config lives in `src/config/navigation.ts` — edit there to add or reorder menu items.

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Framer Motion
- Lucide Icons
- TypeScript

## Deploy

Deploy to Vercel, Netlify, or any Node.js host. Point your `ecomodernliving.ai` domain to the deployment.
