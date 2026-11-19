---
type: Reference
title: Photo Management
description: Master image catalog, gallery membership, ordering, repository assets, and GitHub discovery.
tags: [photos, galleries, catalog, metadata, static-assets, firestore, github]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-17T00:00:00Z }
sources:
  - id: image-types
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/src/types/image.types.ts
    title: src/types/image.types.ts
  - id: gallery-types
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/src/types/gallery.types.ts
    title: src/types/gallery.types.ts
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
  - id: decision-0019
    resource: /decisions/0019-admin-image-preview-fallback.md
    title: Admin previews fall back to the GitHub raw URL
  - id: decision-0020
    resource: /decisions/0020-gallery-detach-and-public-cache.md
    title: Detach images directly and cache public gallery reads
  - id: decision-0021
    resource: /decisions/0021-visibility-and-empty-galleries.md
    title: Hide empty galleries and add visibility flags for galleries and images
---

# Photo Management

## Model (since 2026-11-17)

Image metadata lives once in the Firestore `images` catalog. Galleries reference catalog documents through an ordered `imageIds` array. This replaced the embedded `images` arrays of 2026-11-16 ([Decision 0018](/decisions/0018-image-catalog-and-layout.md), superseding the embedded parts of [Decision 0016](/decisions/0016-gallery-management.md)).

## `images` document

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Document id, derived from the sanitized filename; not stored in the document |
| `filename` | string | e.g. `italia-dolomiti-01.webp` |
| `path` | string | Public path, e.g. `/galleries/italia-dolomiti-01.webp` |
| `title` | string | Caption on hover and in the lightbox |
| `description` | string | Longer text, admin-only for now |
| `alt` | string | Accessible description; falls back to the title |
| `aspectRatio` | `16:9 \| 3:2 \| 4:3 \| 1:1 \| auto` | Intrinsic ratio; used when the gallery layout is `auto` |
| `isVisible` | boolean | Public visibility; missing or `true` means visible |
| `galleryIds` | string[] | Galleries containing the image, mirrored from `imageIds` |
| `createdAt`, `updatedAt` | timestamp | Server timestamps; the rules require `updatedAt` |

The id is `slugify(filename without extension)`. Re-indexing the same file is therefore idempotent.

## `galleries` document

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document id; mapped explicitly, not stored |
| `name` | string | Gallery title, shown uppercase in the public grid |
| `slug` | string | Public URL segment; `^[a-z0-9]+(-[a-z0-9]+)*$`, unique |
| `description` | string | Intro text, admin-only for now |
| `displayOrder` | number | Position in the public grid |
| `isVisible` | boolean | Public visibility; missing or `true` means visible |
| `isFeatured` | boolean | Pins the gallery full-width at the top of the grid |
| `featuredOrder` | number | Order among featured galleries |
| `coverImageId` | string | Catalog id of the selected cover, chosen from the gallery's own `imageIds` |
| `coverImageUrl` | string | Denormalized cover path, written with `coverImageId`; falls back to the first visible image |
| `imageIds` | string[] | Ordered membership, authoritative |
| `layoutConfig` | object | `{ aspectRatio, padding }`, see below |
| `createdAt`, `updatedAt` | timestamp | Server timestamps |

`layoutConfig`:

| Field | Values | Default | Effect |
|-------|--------|---------|--------|
| `aspectRatio` | `16:9`, `3:2`, `4:3`, `1:1`, `auto` | `3:2` | Cover ratio and fallback for photos set to `Naturale`; an explicit photo ratio wins in the feed |
| `padding` | `none`, `small`, `medium`, `large` | `medium` | Photo spacing inside the gallery: 0, 8, 16, 24 px |
| `coverSpacing` | `none`, `small`, `medium`, `large` | `none` | Space around the gallery cover in the shared home/gallery grid: 0, 8, 16, 24 px |

The TypeScript mirrors are `CatalogImage`/`CatalogImageDraft` in `src/types/image.types.ts` and `Gallery`/`GalleryDraft`/`LayoutConfig` in `src/types/gallery.types.ts`.

## Membership writes

- `imageIds` and `galleryIds` change in one `writeBatch`; `saveGallery` diffs against the previous ids, `assignImageToGallery` adds to both, and deleting a gallery detaches it from every image.
- `detachImageFromGallery` removes an image from one gallery in a single transaction: it drops the id from `imageIds`, the gallery id from `galleryIds`, and promotes the next image when the removed one was the cover (or clears the cover fields when the gallery becomes empty). It powers the removable chips on `/admin/images` ([Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md)).
- The gallery editor removes images through the draft and persists on save; the catalog card detaches immediately. Both keep the two indexes in sync.
- Every image write carries `updatedAt: serverTimestamp()` because the rules validate it.
- The cover is selected from the gallery's own images in `GalleryFields` (or with the star in the image list); both `coverImageId` and `coverImageUrl` are written together. A photo that is not in the gallery cannot be used as its cover ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- The two indexes are the only denormalization; there is no other duplicated metadata.

## Image files and discovery

- Location: `public/galleries/`, served as `/galleries/<file>`.
- Format: WebP/JPEG/PNG/AVIF, pre-optimized by the owner.
- `src/services/githubImages.service.ts` lists the folder through the GitHub contents API (`VITE_GITHUB_REPO`, `VITE_GITHUB_BRANCH`) so the admin can index files that were committed but never described.
- Adding a photo = commit the file, then index it from `/admin/images` and assign it to a gallery.

## Admin previews

Discovery reads GitHub, but previews render the served path. The two can disagree while the file is only on another branch or not yet pulled, so admin previews are:

- **local first** — `/galleries/<file>` from the running checkout or deployment;
- **remote fallback** — on error, retried once through `raw.githubusercontent.com/<repo>/<branch>/public/galleries/<file>` by the shared `RepositoryImage` component;
- **admin-only** — `ImageCatalogCard`, `GalleryImageList`, `GalleryList` and the `GalleryFields` cover preview use it. The public pages keep rendering the deployed path so a missing deployment stays visible.

`CatalogEntry.remoteUrl` carries the repository `download_url`; catalog-only entries derive it with `repositoryImageFallback(path)`. Filenames are URL-encoded for the raw URL, while stored `path` values stay raw ([Decision 0019](/decisions/0019-admin-image-preview-fallback.md)).

## Ordering

- Gallery order: `displayOrder`, edited directly or by drag-and-drop on `/admin`.
- Image order: the `imageIds` array, reordered in the gallery editor and persisted with the gallery.
- Featured order: `featuredOrder`, then `displayOrder` for the remainder.

## Visibility and deletion

- A gallery is public when `isVisible` is not `false` **and** it resolves at least one visible image. Hidden galleries and galleries left with no visible photos disappear from `/`, `/gallery` and direct links ([Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)).
- An image with `isVisible: false` is removed from every feed and gallery; if it was the last image, the gallery is hidden too. The cover falls back to the first visible image without rewriting `coverImageId`.
- Both flags default to visible when the field is missing, so the existing documents need no migration; the admin writes the field on the next save.
- There is no soft-delete flag: a gallery is published or deleted.
- Deleting a gallery removes the document and detaches it from every image; files stay in the repository.
- Deleting a catalog image is not exposed in the UI; remove the entry in the console if needed.

## Legacy model

- The embedded `images` array is no longer written. A document that still has one and no `imageIds` is rendered through a read-only fallback and flagged in the editor.
- The retired 2026-03 `images` documents (`name`, `url`, `metadata`, …) have no `filename`/`path`, so `fetchImages` ignores them. The owner can delete leftovers.

## Static fallback content

Until the owner seeds galleries, the public site keeps rendering the captured CDN dataset:

- `src/data/collections.data.ts` — 9 covers and optional placeholders.
- `src/data/collections.photos.ts` — 89 photos (24 for `01-favorite`) with Adobe CDN URLs, Italian captions and aspect ratios, captured 2026-10-30.

## Related

- [Firebase Backend](/concepts/firebase-backend.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Gallery System](/concepts/gallery-system.md)
- [Decision 0018](/decisions/0018-image-catalog-and-layout.md)
