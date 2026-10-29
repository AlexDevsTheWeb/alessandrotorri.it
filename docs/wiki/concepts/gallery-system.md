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
> Phase 3 is done: `/` and `/gallery` render the shared static `CollectionGrid` with the 9 CDN covers. `CollectionPage` is still the old Firestore view and will be rewritten in phase 4 with the static `PHOTOS` data and the lightbox.

## Implemented

### GalleryPage (`/gallery`) and HomePage (`/`)

- Both render `CollectionGrid`.
- `Container maxWidth="lg"`.
- 9 covers from `COLLECTIONS`, 16:9, 1 column on mobile / 2 from `sm` up.
- Title inside the cover, centered at the bottom over a dark gradient.
- Links to `/gallery/:slug`.
- No entrance animation; hover only dims the image slightly.
- Home renders the grid directly, with no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)).

### CollectionPage (`/gallery/:slug`) — phase 4

- Single-column feed, `maxWidth` ~900px.
- Full-width image with a centered caption below.
- `ProgressiveImage` blur-up plus `loading="lazy"`.
- Lightbox: fullscreen `Dialog`, dark backdrop + blur, image `contain` at `maxHeight: 75vh`, caption + EXIF placeholder, prev/next with Esc/arrows, mobile arrows below the image.

## Components

### CollectionGrid (`src/components/CollectionGrid.component.tsx`)

- Renders `COLLECTIONS` as a responsive `Grid` (`xs: 12`, `sm: 6`).
- Used by both `/` and `/gallery`.

### CollectionCover (`src/components/CollectionCover.component.tsx`)

- `ProgressiveImage` 16:9 cover with a centered uppercase title inside the image.
- Bottom gradient for legibility.
- Hover: `brightness(0.86)` only; no scale, no entrance animation, no border/outline.

### PhotoGallery (`src/components/PhotoGallery.component.tsx`)

- Masonry via `@mui/lab/Masonry`.
- Lightbox dialog with keyboard navigation (arrows, Escape), blurred backdrop, side arrows on desktop and bottom arrows on mobile.
- No longer used by `GalleryPage`; retained as the dialog/keyboard pattern donor for phase 4.

### ProgressiveImage (`src/components/ProgressiveImage.component.tsx`)

- Blur-up pattern: low-res placeholder, fade to high-res on load.
- Configurable `aspect-ratio`, `loading="lazy"`.
- Used by the public feed.

## Image optimization

- No WebP pipeline yet.
- No responsive `srcset` yet (the CDN URLs support `carw_*` variants).
- Firebase Storage migration is phase 6; until then the public site uses Adobe CDN URLs.

## Related

- [Design System](/concepts/design-system.md)
- [Photo Management](/concepts/photo-management.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0003](/decisions/0003-exact-look-and-feel.md)
