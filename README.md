# PhysioFix — Website Redesign

A Next.js 14 (App Router) + TypeScript + Tailwind CSS rebuild of physiofix.net,
adapted from the "We.care" healthcare UI reference, applied to a
physiotherapy-booking brand (PhysioFix).

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Project structure

```
app/
  layout.tsx          # Root layout, fonts, metadata
  page.tsx            # Home page — assembles all sections
  globals.css         # Tailwind + global styles, font imports
  components/
    Navbar.tsx         # Sticky header with mobile menu
    Footer.tsx         # Multi-column footer
  sections/
    Hero.tsx            # Hero with search bar + quick filters
    PopularSearches.tsx # Specialty category grid
    FindPhysio.tsx      # "Find the right physio" search widget
    WhyChooseUs.tsx     # Why PhysioFix benefits list
    MeetSpecialists.tsx # Physiotherapist grid/cards
    Testimonials.tsx    # Patient feedback carousel
    Newsletter.tsx      # Email subscribe banner
```

## Notes

- All images currently use Unsplash/randomuser placeholder URLs — swap these
  for real PhysioFix photography and team headshots.
- Colors, type, and copy are tuned for a physiotherapy brand (blue/sky
  palette, "PhysioFix" branding, India-localized testimonials). Adjust
  `tailwind.config.ts` to match your exact brand colors/fonts.
- The Testimonials and Newsletter sections are interactive client components
  (`"use client"`).
- Update `app/layout.tsx` metadata (title/description) and add a favicon in
  `app/` for SEO/branding.
