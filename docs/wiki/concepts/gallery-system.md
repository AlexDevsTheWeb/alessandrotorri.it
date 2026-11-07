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
> Phases 3 and 4 are done: `/` and `/gallery` render the shared static `CollectionGrid` with the 9 CDN covers, and `/gallery/:slug` renders a Masonry photo feed with captions that appear on hover/focus and a keyboard lightbox. The favorite collection has its full 24 photos; all 9 collections have real CDN URLs (89 photos total).

## Implemented

### GalleryPage (`/gallery`) and HomePage (`/`)

- Both render `CollectionGrid`.
- `Container maxWidth="lg"`.
- 9 covers from `COLLECTIONS`, 4:3, 1 column on mobile / 2 from `sm` up, 8px gap on mobile and 16px from `md` ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Title hidden by default; on hover or focus it fades in at the center over a dark gradient ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Links to `/gallery/:slug`; pointer cursor across the whole cover.
- No entrance animation; hover dims the image slightly.
- Home renders the grid directly, with no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)).

### CollectionPage (`/gallery/:slug`) — implemented

- Masonry feed with `columns={{ xs: 1, sm: 2, md: 3 }}`, `maxWidth="lg"`.
- No in-page breadcrumb: on desktop the navbar shows `Gallerie / {title}`; on mobile it is hidden and the H1 carries the title ([decision 0010](/decisions/0010-navbar-breadcrumb.md)).
- Centered uppercase H1.
- Each image keeps its own aspect ratio.
- Caption is hidden by default; on hover or keyboard focus a ~50% black gradient fades in and the caption slides up to the center.
- MUI Masonry's negative root margin is neutralized (`margin: 0 !important`) so the mobile single column has equal left/right gutters.
- Each image is a keyboard-accessible button wrapping `ProgressiveImage` (`loading="lazy"`), with a pointer cursor and the copy guard ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Unknown slugs show `Collezione non trovata` with a link back to `/gallery`.

## Components

### CollectionGrid (`src/components/CollectionGrid.component.tsx`)

- Renders `COLLECTIONS` as a responsive `Grid` (`xs: 12`, `sm: 6`).
- Used by both `/` and `/gallery`.

### CollectionCover (`src/components/CollectionCover.component.tsx`)

- `ProgressiveImage` 4:3 cover with a centered uppercase title, hidden until hover or focus.
- On hover or focus: the title fades in and rises into place over a 0.6–0.85 black gradient.
- Hover: `brightness(0.86)` on the image; no scale, no entrance animation, no border/outline.

### PhotoLightbox (`src/components/PhotoLightbox.component.tsx`)

- Fullscreen dark `Dialog` with blurred backdrop.
- Image `contain` at up to 75vh; caption only. The EXIF placeholder was removed ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Image is not draggable and its context menu is cancelled.
- Prev/next buttons, Esc and arrow keys.
- Side arrows on desktop, arrows below the caption on mobile.
- MUI `Dialog` handles body scroll lock.

### PhotoGallery (`src/components/PhotoGallery.component.tsx`)

- Masonry demo with hardcoded Unsplash data; no longer imported by any route.
- Retained only as a reference for the old dialog pattern; safe to remove in the phase 5 cleanup.

### ProgressiveImage (`src/components/ProgressiveImage.component.tsx`)

- Blur-up pattern when a placeholder exists; otherwise a neutral background until the high-res image loads.
- Configurable `aspect-ratio`, `srcset`/`sizes`, `loading="lazy"` (the first feed image can be eager/high-priority), `decoding="async"`.
- Inherits the cursor when not clickable; the `preventCopy` prop adds `draggable={false}`, `user-select: none` and a cancelled context menu ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
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
