---
type: Reference
title: Gallery System
description: Public grid, collection feed, lightbox, and progressive image loading — Firestore galleries and image catalog with a static fallback.
tags: [gallery, lightbox, progressive-image, ui, firestore, featured, layout]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
  - id: decision-0020
    resource: /decisions/0020-gallery-detach-and-public-cache.md
    title: Detach images directly and cache public gallery reads
  - id: decision-0021
    resource: /decisions/0021-visibility-and-empty-galleries.md
    title: Hide empty galleries and add visibility flags for galleries and images
  - id: decision-0022
    resource: /decisions/0022-cover-spacing-and-photo-ratios.md
    title: Pick the cover from the gallery, split photo and gallery spacing, and let photo ratios drive the feed
---

# Gallery System

> [!NOTE] Current state
> `/` and `/gallery` render the shared `CollectionGrid`; `/gallery/:slug` renders a Masonry feed with hover captions and a keyboard lightbox. Since 2026-11-17 the content comes from Firestore (`galleries` joined with the `images` catalog) when present, with the captured Adobe CDN dataset as the fallback.

## Data source

- `usePublicGalleries` dynamically imports the gallery and image services after mount, so Firestore and the SDK stay off the critical path and in their own chunk.
- `src/services/publicGalleries.service.ts` caches the last successful join in module memory and deduplicates concurrent loads. A page paints the cache instantly when present and refreshes it in the background; a cold load renders `PageLoader` until the first query resolves, so the static dataset never flashes before Firestore ([Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md)).
- The static dataset is the fallback when Firestore returns no galleries or the read fails, not the first paint.
- Admin writes (create/save/delete/reorder/assign/unassign/image save) clear the cache so the next public visit refetches.
- The joined result is filtered before caching: hidden galleries and hidden images are dropped, then galleries with no visible images are dropped. A gallery that was detached down to zero photos, or whose photos are all hidden, disappears from the grid and from direct links ([Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)).
- `hasRemoteGalleries` records whether Firestore returned any gallery before filtering. When true, Firestore is authoritative and the static dataset is never used to fill the gap; the fallback applies only when the read fails or returns nothing.
- If Firestore has galleries, it is authoritative for slugs: an unknown or hidden slug shows `Collezione non trovata` instead of resurrecting a deleted static collection.
- The hook joins `galleries.imageIds` with the `images` catalog (`resolveGalleryImages`); a gallery with legacy embedded `images` and no ids still renders those.
- Mapping lives in `src/data/galleries.mapper.ts`: `Gallery` → `CollectionCover` (name uppercase, cover = `coverImageUrl` or first resolved image, featured flags, layout ratio) and `Gallery` → `CollectionPhoto` (caption = title, alt = alt, ratio from the layout config or the image).
- Fallback data: `src/data/collections.data.ts` (9 covers) and `src/data/collections.photos.ts` (89 photos).

## Implemented

### GalleryPage (`/gallery`) and HomePage (`/`)

- Both render `CollectionGrid` with the Firestore covers or, when empty, the static `COLLECTIONS`; a `PageLoader` renders until the first read resolves.
- `Container maxWidth="lg"`.
- Featured galleries (`isFeatured`) render full-width (both columns) at the top, ordered by `featuredOrder`; the rest stay in the two-column grid. The shared grid means `/gallery` follows the same order.
- Covers use the gallery's `layoutConfig.aspectRatio` (default `3/2`); the static fallback keeps 4:3 ([decision 0018](/decisions/0018-image-catalog-and-layout.md), superseding the fixed 4:3 of [0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)). In `Naturale` the cover uses the resolved cover image's ratio. `layoutConfig.coverSpacing` adds 0/8/16/24 px of padding around the cover inside its grid cell ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- 1 column on mobile / 2 from `sm` up, 8px gap on mobile and 16px from `md`.
- Title hidden by default; on hover or focus it fades in at the center over a dark gradient.
- Links to `/gallery/:slug`; pointer cursor across the whole cover.
- No entrance animation; hover dims the image slightly.
- Home renders the grid directly, with no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)).

### CollectionPage (`/gallery/:slug`)

- Masonry feed with `columns={{ xs: 1, sm: 2, md: 3 }}`, `maxWidth="lg"`.
- No in-page breadcrumb: on desktop the navbar shows `Gallerie / {title}`; on mobile it is hidden and the H1 carries the title ([decision 0010](/decisions/0010-navbar-breadcrumb.md)).
- Centered uppercase H1.
- Each image is cropped by the photo's own ratio when it is set; otherwise by the gallery's `layoutConfig.aspectRatio` (`auto` keeps the 3:2 default). `layoutConfig.padding` sets the Masonry spacing to 0/8/16/24 px ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- Caption is hidden by default; on hover or keyboard focus a ~50% black gradient fades in and the caption slides up to the center.
- MUI Masonry's negative root margin is neutralized (`margin: 0 !important`) so the mobile single column has equal left/right gutters.
- Each image is a keyboard-accessible button wrapping `ProgressiveImage` (`loading="lazy"`), with a pointer cursor and the copy guard ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- `alt` comes from the image entry, falling back to the caption.
- A `PageLoader` renders until the public galleries are ready; after that, an unknown slug shows `Collezione non trovata` and links back to `/gallery`.

## Components

### CollectionGrid (`src/components/CollectionGrid.component.tsx`)

- Renders a `CollectionCoverData[]` prop (default: the static `COLLECTIONS`) as a responsive `Grid` (`xs: 12`, `sm: 6`).
- Featured collections take the full row (`sm: 12`); the page sorts them first by `featuredOrder`.
- Used by both `/` and `/gallery`.

### CollectionCover (`src/components/CollectionCover.component.tsx`)

- `ProgressiveImage` cover with the collection's `aspectRatio` (4:3 for the static fallback), a centered uppercase title, hidden until hover or focus.
- On hover or focus: the title fades in and rises into place over a 0.6–0.85 black gradient.
- Hover: `brightness(0.86)` on the image; no scale, no entrance animation, no border/outline.

### PhotoLightbox (`src/components/PhotoLightbox.component.tsx`)

- Fullscreen dark `Dialog` with blurred backdrop.
- Image `contain` at up to 75vh; caption only, set in `body2` (0.875 rem, 75% white) since 2026-11-18 ([Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)). The EXIF placeholder was removed ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Image is not draggable and its context menu is cancelled; `alt` uses the photo alt text.
- Prev/next buttons, Esc and arrow keys.
- Side arrows on desktop, arrows below the caption on mobile.
- MUI `Dialog` handles body scroll lock.

### ProgressiveImage (`src/components/ProgressiveImage.component.tsx`)

- Blur-up pattern when a placeholder exists; otherwise a neutral background until the high-res image loads.
- Configurable `aspect-ratio`, `srcset`/`sizes`, `loading="lazy"` (the first feed image can be eager/high-priority), `decoding="async"`.
- All images are `object-fit: cover; object-position: center` per the 2026-11-17 specification.
- Inherits the cursor when not clickable; the `preventCopy` prop adds `draggable={false}`, `user-select: none` and a cancelled context menu ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Used by the covers and the public feed.

## Image optimization

- Files in `public/galleries/` are pre-optimized by the owner: WebP/JPEG, ~1600 px long edge. There is no on-the-fly transform service.
- No responsive `srcset` is generated for repository assets yet; `ProgressiveImage` accepts one but the mapper does not produce variants.
- The static CDN dataset keeps its `carw_*` variants and 600w/1200w `srcset`.
- `ratio` comes from the photo's own aspect ratio when set, otherwise from the gallery layout (`layoutConfig.aspectRatio`), otherwise 3:2. The feed reserves space and avoids layout shift; the gallery ratio still controls the cover ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).

## Related

- [Design System](/concepts/design-system.md)
- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0016](/decisions/0016-gallery-management.md)
