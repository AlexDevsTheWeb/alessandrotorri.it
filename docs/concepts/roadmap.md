---
type: Roadmap
title: Project Roadmap
description: Phased development plan for the photography portfolio — features, bugs, and milestones.
tags: [roadmap, plan, phases, milestones, features]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: superseded
---

# Project Roadmap

> [!WARNING] Superseded
> For public-site work, follow [Rebuild Plan](/rebuild-plan.md) instead. This roadmap is kept as history of the original plan.

Personal photography portfolio focused on long exposure photography. React 19 + MUI 7 + Firebase.

**Tech stack**: React + Vite + TypeScript + MUI + Zustand + Firebase
**Pages**: Home, Gallery (by collections), About
**Content**: Placeholder images first, real long exposure photos later
**Photo management**: Via existing /admin dashboard

---

## Phase 1: Fix Foundations

> Get the existing code working correctly before building new features.

### 1.1 — Fix TypeScript types

- **File**: `src/types/image.types.tsx`
- Add missing fields to `IImage`: `metadata`, `isFavorite`, `isLatestWork`, `isVisible`, `order`, `createdAt`
- Rename file to `image.types.ts` (not `.tsx` — no JSX)
- Fix any other type errors across the codebase

### 1.2 — Clean up dead code

- Delete `src/components/Navbar.tsx` (unused, superseded by `layout/Navbar.layout.tsx`)
- Delete or clean `src/App.css` and `src/index.css` (Vite boilerplate conflicting with MUI)
- Remove commented-out code blocks in `HomePage.tsx` and `GalleryPage.tsx`

### 1.3 — Fix routing & auth guard

- **File**: `src/App.tsx`
- Uncomment and wire up `ProtectedRoute` for `/admin` and `/admin/collection/:collectionName`
- Remove non-existent routes (`/projects`, `/about`) from navbar until built

### 1.4 — Fix hero background

- **File**: `src/pages/HomePage.tsx`
- Replace `https://source.unsplash.com/random?art,abstract` with a local placeholder or a Firebase Storage URL
- Use `ProgressiveImage` component for the hero background

---

## Phase 2: Public Gallery (Core Feature)

> Connect the public gallery to Firestore data and build the collection browsing experience.

### 2.1 — Build `GalleryPage` with real Firestore data

- **File**: `src/pages/GalleryPage.tsx`
- Query Firestore `images` collection where `isVisible == true`
- Group images by `collection` field
- Display each collection as a card with its `isCoverImage` as the thumbnail
- Link each card to `/gallery/:collectionName`
- Use Framer Motion for staggered entrance animations

### 2.2 — Upgrade `CollectionPage`

- **File**: `src/pages/CollectionPage.tsx`
- Already works — verify responsive grid + modal lightbox
- Add collection title/description at the top
- Add breadcrumb navigation: Gallery > Collection Name
- Ensure images load with `ProgressiveImage` (blur-up effect)

### 2.3 — Upgrade `PhotoGallery` component

- **File**: `src/components/PhotoGallery.component.tsx`
- Remove hardcoded Unsplash data
- Accept `images: IImage[]` as a prop (or query Firestore directly)
- Keep masonry layout + lightbox keyboard navigation
- Wire up to real collection data

### 2.4 — Placeholder content strategy

- Create a `seed/` folder with a script or instructions for uploading placeholder images
- Use free long exposure photos from Unsplash/Pexels for initial content
- Create 3-4 sample collections: "Seascapes", "City Lights", "Star Trails", "Waterfalls"

---

## Phase 3: Home Page

> Build a compelling landing page that showcases long exposure work.

### 3.1 — Redesign hero section

- Full-viewport hero with a stunning long exposure background
- Animated title: "Alessandro Torri" with subtitle "Long Exposure Photography"
- "Explore Gallery" CTA button
- Subtle parallax or Ken Burns effect on background

### 3.2 — "Latest Work" section

- Query Firestore images where `isLatestWork == true`
- Display in a horizontal scroll or grid (3-5 featured images)
- Each links to its collection page
- Use `ProgressiveImage` for lazy loading

### 3.3 — "Featured Collections" section

- Show 2-3 collections with cover images
- Brief description or image count
- "View Collection" link

### 3.4 — About preview section

- Short bio snippet: "I'm Alessandro, a photographer specializing in long exposure..."
- "Read More" link to `/about`
- Small portrait or signature image

---

## Phase 4: About Page

> Tell your story and showcase your approach to long exposure photography.

### 4.1 — Build `AboutPage`

- **New file**: `src/pages/AboutPage.tsx`
- **Route**: `/about`
- Sections:
  - Hero/intro with portrait
  - Bio: who you are, your approach to long exposure
  - Gear/equipment list (optional)
  - Contact info or contact form
  - Social links (Instagram, etc.)

### 4.2 — Add route + navbar link

- **File**: `src/App.tsx` — add `/about` route
- **File**: `src/layout/Navbar.layout.tsx` — ensure About link works

---

## Phase 5: Polish & Performance

> Make it feel like a premium photography portfolio.

### 5.1 — SEO & meta tags

- Add `<title>` and `<meta description>` per page
- Add Open Graph tags for social sharing
- Add `robots.txt` and `sitemap.xml`

### 5.2 — Responsive audit

- Test all pages on mobile/tablet/desktop
- Fix any layout breaks
- Ensure touch-friendly lightbox navigation

### 5.3 — Performance

- Implement lazy loading for route-level code splitting (`React.lazy`)
- Optimize image loading: blur-up placeholders, `loading="lazy"`
- Audit bundle size — consider tree-shaking MUI imports

### 5.4 — Error handling

- Add React error boundary around routes
- Handle Firestore query errors gracefully (loading states, error messages)
- Handle image load failures (fallback placeholder)

---

## Phase 6: Deployment

> Get it live.

### 6.1 — Firebase hosting setup

- Add `firebase.json` with hosting config
- Add `firestore.rules` and `storage.rules` for security
- Configure `firebase.json` to rewrite SPA routes

### 6.2 — Deploy

- Build production bundle: `npm run build`
- Deploy: `firebase deploy`
- Verify all routes work on live site

---

## Relevant Files

| File | Purpose |
|------|---------|
| `src/types/image.types.tsx` | Fix IImage interface |
| `src/App.tsx` | Routing + auth guard |
| `src/pages/HomePage.tsx` | Landing page |
| `src/pages/GalleryPage.tsx` | Public gallery |
| `src/pages/CollectionPage.tsx` | Single collection view |
| `src/pages/AboutPage.tsx` | About page (new) |
| `src/components/PhotoGallery.component.tsx` | Masonry gallery + lightbox |
| `src/components/ProgressiveImage.component.tsx` | Blur-up image loading |
| `src/layout/Navbar.layout.tsx` | Navigation bar |
| `src/layout/Footer.layout.tsx` | Footer |
| `src/layout/Shared.layout.tsx` | Page shell |
| `src/store/authStore.ts` | Auth state |
| `src/store/themeStore.ts` | Theme state |
| `src/style/theme.ts` | MUI theme (light/dark) |
| `src/firebase.ts` | Firebase config |

---

## Commit Strategy

- One commit per phase (or per sub-step if changes are large)
- Conventional commits: `fix:`, `feat:`, `chore:`, `refactor:`
- Example: `fix: complete IImage type definitions and clean dead code`
