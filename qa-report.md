# PhysioFix Website — QA Test Report

**Date:** July 26, 2026  
**URL Tested:** http://localhost:5167  
**Tester:** Automated QA Agent (Hermes)  
**Browser:** Google Chrome (Windows 10)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 3 |
| **Total** | **8** |

Overall the site is functional and well-structured. No JavaScript errors were found in the console — only performance warnings. The most significant issue is that **all Next.js `<Image>` components using the `fill` prop are missing the required `sizes` prop**, which degrades performance and generates console warnings.

---

## Issue Details

### ISSUE 1 — Missing `sizes` prop on all `fill`-based Next.js Image components

- **Severity:** High
- **Page:** Homepage (and all pages using Image with `fill`)
- **Components:** Hero.tsx, MeetSpecialists.tsx, WhyChooseUs.tsx, Testimonials.tsx, blog/page.tsx, blog/[slug]/page.tsx, SpecializationLayout.tsx
- **Steps to reproduce:** Open homepage → Open DevTools Console (F12) → Observe warnings
- **Expected:** No console warnings; all `<Image fill>` should include a `sizes` prop
- **Actual:** Warnings like: `Image with src "..." has "fill" but is missing "sizes" prop. Please add it to improve page performance.`
- **Fix:** Add `sizes` prop to every `<Image fill>` component, e.g. `sizes="(max-width: 768px) 100vw, 50vw"`

---

### ISSUE 2 — LCP Image priority logic on carousel

- **Severity:** Medium
- **Page:** Homepage
- **Component:** Hero.tsx — hero carousel
- **Expected:** The above-the-fold hero image should always have `priority` set
- **Actual:** Warning: `Image was detected as the Largest Contentful Paint (LCP). Please add the "priority" property.`
- **Note:** Code sets `priority={heroSlide === 0}` which is correct, but carousel rotation may cause the LCP detection to pick up a non-priority slide. Consider preloading all carousel images.

---

### ISSUE 3 — 6 console warnings + 2 Issues tab items

- **Severity:** Medium
- **Page:** Homepage
- **Steps to reproduce:** F12 → Console tab
- **Expected:** Clean console with no warnings
- **Actual:** 6 `warn-once.js` warnings and 2 issues flagged in the Issues panel
- **Impact:** Affects Core Web Vitals scores

---

### ISSUE 4 — No error boundary or not-found page

- **Severity:** Medium
- **Page:** All pages
- **Steps to reproduce:** Navigate to a non-existent route, e.g., `/nonexistent-page`
- **Expected:** Custom 404 page with helpful navigation
- **Actual:** No `not-found.tsx` or `error.tsx` found in the app directory
- **Fix:** Add `app/not-found.tsx` and `app/error.tsx` for branded error handling

---

### ISSUE 5 — No loading states defined for any route

- **Severity:** Low
- **Page:** All pages
- **Steps to reproduce:** Navigate between pages — no skeleton/spinner during transitions
- **Expected:** Loading indicators (skeleton UI or spinners) for slow-loading routes
- **Actual:** No `loading.tsx` files found in the app directory
- **Fix:** Add `loading.tsx` for key routes (blog, specialization, services)

---

### ISSUE 6 — `console.error` left in production code

- **Severity:** Low
- **Page:** `/blog`
- **File:** `app/blog/page.tsx:39`
- **Code:** `console.error("Failed to fetch blog posts:", error);`
- **Note:** Acceptable for debugging but should use a proper error reporting service in production

---

### ISSUE 7 — Image optimization concern with Unsplash URLs

- **Severity:** Medium
- **Page:** Homepage, various sections
- **Details:** Hero images use external Unsplash URLs with query params (`?w=900&q=80`). The `fill` prop without `sizes` means Next.js cannot generate optimal responsive image URLs, potentially serving oversized images on mobile.
- **Fix:** Addressed by adding proper `sizes` prop (see Issue 1)

---

### ISSUE 8 — React DevTools warning (dev only)

- **Severity:** Low
- **Page:** All pages (dev mode only)
- **Console message:** `Download the React DevTools for a better development experience`
- **Note:** Only appears in development mode; not a production issue

---

## Pages Tested

| Page | URL | Status | Notes |
|------|-----|--------|-------|
| Homepage | `/` | ✅ Pass | Hero, search, specializations, testimonials, newsletter, footer all render |
| About | `/about` | ✅ Pass | Page loads |
| Services | `/services` | ✅ Pass | Page loads |
| Contact | `/contact` | ✅ Pass | Page loads |
| Blog | `/blog` | ✅ Pass | Page loads with blog cards |
| Login | `/login` | ✅ Pass | Login form renders |

## Sections Verified on Homepage

| Section | Status | Notes |
|---------|--------|-------|
| Header/Navigation | ✅ | Logo, nav links, Call now, Book visit buttons present |
| Marquee ticker | ✅ | Scrolling text renders correctly |
| Hero section | ✅ | Heading, subtitle, feature badges render |
| Search bar | ✅ | Input field, Search button, clear button, popular searches pills |
| Hero image carousel | ✅ | 4 slides with dots, auto-rotation working |
| Doctor info card | ✅ | Name, credentials, Available status |
| Meet Physiotherapist | ✅ | Bio, experience, specialized treatments |
| Specialization cards | ✅ | Tab filters and 11 treatment cards |
| Expert Treatment | ✅ | Description, care categories grid |
| Why Choose Us | ✅ | Features list, consultation CTA |
| Patient Stories | ✅ | 3 testimonial cards with carousel navigation |
| Newsletter | ✅ | Email input and Subscribe button |
| Footer | ✅ | Logo, contact info, services links, page links, copyright |

## What Was NOT Tested (Due to Tool Limitations)

- Mobile responsive view (375px width)
- Search functionality interaction (type query → verify dropdown)
- Quick link button behavior
- Login authentication flow
- Dashboard pages after login
- Blog post individual page rendering
- Hover states on buttons/links
- Mobile hamburger menu functionality

---

## Recommendations

1. **High Priority:** Add `sizes` prop to all `<Image fill>` components
2. **Medium Priority:** Add `app/not-found.tsx` for branded 404 pages
3. **Medium Priority:** Add `loading.tsx` skeletons for slow routes
4. **Low Priority:** Remove or replace `console.error` with proper error tracking
5. **Low Priority:** Verify LCP `priority` prop logic handles carousel correctly
