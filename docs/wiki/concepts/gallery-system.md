---
type: Reference
title: Gallery System
description: Public grid, collection feed, lightbox, and progressive image loading — Firestore galleries with a static fallback.
tags: [gallery, lightbox, progressive-image, ui, firestore]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
---

# Gallery System

> [!NOTE] Current state
> `/` and `/gallery` render the shared `CollectionGrid`; `/gallery/:slug` renders a Masonry feed with hover captions and a keyboard lightbox. Since 2026-11-16 the content comes from Firestore `galleries` when present, with the captured Adobe CDN dataset as the fallback.

## Data source

- `usePublicGalleries` dynamically imports `src/services/galleries.service.ts` after mount, so Firestore and the SDK stay off the critical path and in their own chunk.
- The static dataset paints first; when Firestore returns at least one gallery it replaces the covers. A slow or failed query never blocks or blanks the page.
- If Firestore has galleries, it is authoritative for slugs: an unknown slug shows `Collezione non trovata` instead of resurrecting a deleted static collection.
- Mapping lives in `src/data/galleries.mapper.ts`: `Gallery` → `CollectionCover` (name uppercase, cover = cover path or first image) and `Gallery` → `CollectionPhoto` (caption = title, alt = alt, ratio preserved).
- Fallback data: `src/data/collections.data.ts` (9 covers) and `src/data/collections.photos.ts` (89 photos).

## Implemented

### GalleryPage (`/gallery`) and HomePage (`/`)

- Both render `CollectionGrid` with the Firestore covers or, when empty, the static `COLLECTIONS`.
- `Container maxWidth="lg"`.
- 4:3 covers, 1 column on mobile / 2 from `sm` up, 8px gap on mobile and 16px from `md` ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Title hidden by default; on hover or focus it fades in at the center over a dark gradient.
- Links to `/gallery/:slug`; pointer cursor across the whole cover.
- No entrance animation; hover dims the image slightly.
- Home renders the grid directly, with no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)).

### CollectionPage (`/gallery/:slug`)

- Masonry feed with `columns={{ xs: 1, sm: 2, md: 3 }}`, `maxWidth="lg"`.
- No in-page breadcrumb: on desktop the navbar shows `Gallerie / {title}`; on mobile it is hidden and the H1 carries the title ([decision 0010](/decisions/0010-navbar-breadcrumb.md)).
- Centered uppercase H1.
- Each image keeps its own aspect ratio (`ratio` from the gallery document; `3/2` default).
- Caption is hidden by default; on hover or keyboard focus a ~50% black gradient fades in and the caption slides up to the center.
- MUI Masonry's negative root margin is neutralized (`margin: 0 !important`) so the mobile single column has equal left/right gutters.
- Each image is a keyboard-accessible button wrapping `ProgressiveImage` (`loading="lazy"`), with a pointer cursor and the copy guard ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- `alt` comes from the image entry, falling back to the caption.
- If the slug is unknown and the Firestore query has not resolved yet, a `PageLoader` renders; once resolved, `Collezione non trovata` links back to `/gallery`.

## Components

### CollectionGrid (`src/components/CollectionGrid.component.tsx`)

- Renders a `CollectionCoverData[]` prop (default: the static `COLLECTIONS`) as a responsive `Grid` (`xs: 12`, `sm: 6`).
- Used by both `/` and `/gallery`.

### CollectionCover (`src/components/CollectionCover.component.tsx`)

- `ProgressiveImage` 4:3 cover with a centered uppercase title, hidden until hover or focus.
- On hover or focus: the title fades in and rises into place over a 0.6–0.85 black gradient.
- Hover: `brightness(0.86)` on the image; no scale, no entrance animation, no border/outline.

### PhotoLightbox (`src/components/PhotoLightbox.component.tsx`)

- Fullscreen dark `Dialog` with blurred backdrop.
- Image `contain` at up to 75vh; caption only. The EXIF placeholder was removed ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Image is not draggable and its context menu is cancelled; `alt` uses the photo alt text.
- Prev/next buttons, Esc and arrow keys.
- Side arrows on desktop, arrows below the caption on mobile.
- MUI `Dialog` handles body scroll lock.

### ProgressiveImage (`src/components/ProgressiveImage.component.tsx`)

- Blur-up pattern when a placeholder exists; otherwise a neutral background until the high-res image loads.
- Configurable `aspect-ratio`, `srcset`/`sizes`, `loading="lazy"` (the first feed image can be eager/high-priority), `decoding="async"`.
- Inherits the cursor when not clickable; the `preventCopy` prop adds `draggable={false}`, `user-select: none` and a cancelled context menu ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Used by the covers and the public feed.

## Image optimization

- Files in `public/galleries/` are pre-optimized by the owner: WebP/JPEG, ~1600 px long edge. There is no on-the-fly transform service.
- No responsive `srcset` is generated for repository assets yet; `ProgressiveImage` accepts one but the mapper does not produce variants.
- The static CDN dataset keeps its `carw_*` variants and 600w/1200w `srcset`.
- `ratio` is recorded per image so the feed reserves space and avoids layout shift.

## Related

- [Design System](/concepts/design-system.md)
- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0016](/decisions/0016-gallery-management.md)
