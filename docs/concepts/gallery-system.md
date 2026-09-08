---
type: Reference
title: Gallery System
description: Public-facing gallery with masonry layout, lightbox, and progressive image loading.
tags: [gallery, masonry, lightbox, progressive-image, ui]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Gallery System

## GalleryPage (`/gallery`)

- Queries Firestore for all `isVisible == true` images
- Groups by `collection` field
- Each collection displayed as a card with `isCoverImage` thumbnail
- Links to `/gallery/:collectionName`
- Framer Motion staggered entrance animations

## CollectionPage (`/gallery/:collectionName`)

- Queries Firestore: `collection == :name`, `isVisible == true`, `orderBy('order')`
- Responsive grid layout
- Click opens modal lightbox with full-size image
- Framer Motion page transitions

## PhotoGallery Component

- Masonry layout via `@mui/lab/Masonry`
- Accepts `images: IImage[]` prop
- Progressive image loading (blur-up effect)
- Fullscreen lightbox dialog with:
  - Keyboard navigation (arrow keys, Escape)
  - Blur backdrop
  - Previous/next arrows (desktop: sides, mobile: bottom)
  - Italian-language EXIF placeholder text

## ProgressiveImage Component

- Blur-up lazy loading pattern
- Shows blurred low-res placeholder
- Fades to high-res image via opacity transition
- Configurable aspect ratio via CSS `aspect-ratio`
- Supports `loading="lazy"` attribute

## Image Optimization (Planned)

- No WebP conversion pipeline yet
- No responsive `srcset` implementation
- No image CDN (direct Firebase Storage URLs)
- Future: consider image optimization on upload
