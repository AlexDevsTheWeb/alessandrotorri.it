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

> [!WARNING] Current code is mid-rebuild
> `GalleryPage` still renders the demo `PhotoGallery` with hardcoded Unsplash images, and `CollectionPage` still queries Firestore. The target is the static CDN dataset in `src/data/collections.data.ts`. Do not describe the demo as the final gallery.

## Rebuild target

### GalleryPage (`/gallery`)

- `Container maxWidth="lg"`.
- 9 covers from `COLLECTIONS`, 16:9, responsive 1 column on mobile / 2 from `sm` up.
- Title below the cover, centered and uppercase.
- Links to `/gallery/:slug`.
- Framer Motion stagger (`0.6s + i * 0.08`).

### HomePage (`/`)

- Same cover grid as `/gallery`, or a redirect — decide once in phase 3 and document.
- Remove the Unsplash hero, commented Firestore blocks, and the `height: 3000px` hack.

### CollectionPage (`/gallery/:slug`)

- Single-column feed, `maxWidth` ~900px.
- Full-width image with a centered caption below.
- `ProgressiveImage` blur-up plus `loading="lazy"`.
- Lightbox: fullscreen `Dialog`, dark backdrop + blur, image `contain` at `maxHeight: 75vh`, caption + EXIF placeholder, prev/next with Esc/arrows, mobile arrows below the image.

## Components

### PhotoGallery (`src/components/PhotoGallery.component.tsx`)

- Masonry via `@mui/lab/Masonry`.
- Lightbox dialog with keyboard navigation (arrows, Escape), blurred backdrop, side arrows on desktop and bottom arrows on mobile.
- Currently holds demo data; reuse the dialog/keyboard pattern in phase 4, then wire it to real data.

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
