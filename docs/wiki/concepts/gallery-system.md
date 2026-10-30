---
type: Reference
title: Gallery System
description: Public gallery, collection feed, lightbox, and progressive image loading — current state and rebuild target.
tags: [gallery, lightbox, progressive-image, ui, rebuild]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
  - id: decision-0003
    resource: /decisions/0003-exact-look-and-feel.md
    title: Exact look & feel, modern implementation
---

# Gallery System

> [!NOTE] Current state
> Phases 3 and 4 are done: `/` and `/gallery` render the shared static `CollectionGrid` with the 9 CDN covers, and `/gallery/:slug` renders the static photo feed with captions and a keyboard lightbox. The favorite collection has its full 24 photos; all 9 collections have real CDN URLs (89 photos total).

## Implemented

### GalleryPage (`/gallery`) and HomePage (`/`)

- Both render `CollectionGrid`.
- `Container maxWidth="lg"`.
- 9 covers from `COLLECTIONS`, 16:9, 1 column on mobile / 2 from `sm` up.
- Title inside the cover, centered at the bottom over a dark gradient.
- Links to `/gallery/:slug`.
- No entrance animation; hover only dims the image slightly.
- Home renders the grid directly, with no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)).

### CollectionPage (`/gallery/:slug`) — implemented

- Single-column feed, `maxWidth="md"` (~900px).
- Breadcrumb `Gallerie / {title}`, centered uppercase H1.
- Full-width image with a centered caption below.
- Each image is a keyboard-accessible button wrapping `ProgressiveImage` (`loading="lazy"`).
- Unknown slugs show `Collezione non trovata` with a link back to `/gallery`.

## Components

### CollectionGrid (`src/components/CollectionGrid.component.tsx`)

- Renders `COLLECTIONS` as a responsive `Grid` (`xs: 12`, `sm: 6`).
- Used by both `/` and `/gallery`.

### CollectionCover (`src/components/CollectionCover.component.tsx`)

- `ProgressiveImage` 16:9 cover with a centered uppercase title inside the image.
- Bottom gradient for legibility.
- Hover: `brightness(0.86)` only; no scale, no entrance animation, no border/outline.

### PhotoLightbox (`src/components/PhotoLightbox.component.tsx`)

- Fullscreen dark `Dialog` with blurred backdrop.
- Image `contain` at up to 75vh; caption + “Dati EXIF non disponibili”.
- Prev/next buttons, Esc and arrow keys.
- Side arrows on desktop, arrows below the caption on mobile.
- MUI `Dialog` handles body scroll lock.

### PhotoGallery (`src/components/PhotoGallery.component.tsx`)

- Masonry demo with hardcoded Unsplash data; no longer imported by any route.
- Retained only as a reference for the old dialog pattern; safe to remove in the phase 5 cleanup.

### ProgressiveImage (`src/components/ProgressiveImage.component.tsx`)

- Blur-up pattern when a placeholder exists; otherwise a neutral background until the high-res image loads.
- Configurable `aspect-ratio`, `loading="lazy"`, `decoding="async"`.
- Used by the covers and the public feed.

## Image optimization

- No WebP pipeline yet.
- No responsive `srcset` yet (the CDN URLs support `carw_*` variants).
- Firebase Storage migration is phase 6; until then the public site uses Adobe CDN URLs.

## Related

- [Design System](/concepts/design-system.md)
- [Photo Management](/concepts/photo-management.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0003](/decisions/0003-exact-look-and-feel.md)
