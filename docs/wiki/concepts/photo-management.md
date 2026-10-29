---
type: Playbook
title: Photo Management
description: Upload pipeline, collection grouping, metadata schema, and image lifecycle.
tags: [photos, uploads, collections, metadata, firebase-storage]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: image-types
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/src/types/image.types.ts
    title: src/types/image.types.ts
---

# Photo Management

## Image document schema (Firestore `images`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document id — **not stored in the document**; map it explicitly |
| `name` | string | Display name / title |
| `url` | string | Firebase Storage download URL |
| `metadata` | string | EXIF description, location, camera info |
| `collection` | string | Grouping key (e.g. `Scozia`, `Francia`) |
| `isFavorite` | boolean | Mark as favorite |
| `isLatestWork` | boolean | Show in "Latest Work" |
| `isCoverImage` | boolean | Use as collection thumbnail |
| `isVisible` | boolean | Show in the public gallery |
| `order` | number | Sort position within a collection |
| `createdAt` | timestamp | Firestore server timestamp |

The TypeScript mirror is `IImage` in `src/types/image.types.ts`.

## Upload pipeline

1. Admin selects files via `<Input type="file" multiple />`.
2. Client-side preview via `URL.createObjectURL()`.
3. Per-file metadata form: title, metadata, collection, flags.
4. Upload to Firebase Storage at `images/{filename}` via `uploadBytesResumable`.
5. On completion, create a Firestore document with the download URL and metadata.
6. Object URLs are revoked on unmount.

## Collection grouping

- Images are grouped by the `collection` string field.
- Each collection has a cover image (`isCoverImage: true`).
- Collections are discovered by deduplicating `collection` across images.
- There is no separate `collections` collection in Firestore.
- The public rebuild currently uses static CDN data (`src/data/collections.data.ts`) instead of Firestore; the schema stays compatible.

## Reordering

- Drag-and-drop via `@hello-pangea/dnd` in `CollectionDetailPage`.
- Updates `order` on each document in a `writeBatch`.
- Public gallery queries use `orderBy('order')`.
- The local order is memoized from the snapshot; no `setState`-in-effect sync.

## Visibility control

- `isVisible: false` hides an image from the public gallery.
- The admin "delete" action currently sets `isVisible: false` (soft delete).
- Useful for drafts, works-in-progress, or retired shots.

## Known bug fixed 2026-10-29

`react-firebase-hooks` 5.1.1 ignores the legacy `idField` option. Admin actions previously received `image.id === undefined`. `CollectionPage` and `CollectionDetailPage` now use `useCollection` and map `document.id` explicitly. See [the audit](/reviews/2026-10-29-docs-audit.md).

## Related

- [Firebase Backend](/concepts/firebase-backend.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Gallery System](/concepts/gallery-system.md)
