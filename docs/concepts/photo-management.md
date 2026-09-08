---
type: Playbook
title: Photo Management
description: Upload pipeline, collection grouping, metadata schema, and image lifecycle.
tags: [photos, uploads, collections, metadata, firebase-storage]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Photo Management

## Image Document Schema (Firestore `images` collection)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Auto-generated Firestore doc ID |
| `name` | string | Display name / title |
| `url` | string | Firebase Storage download URL |
| `metadata` | string | EXIF description, location, camera info |
| `collection` | string | Grouping key (e.g. "Seascapes", "Star Trails") |
| `isFavorite` | boolean | Mark as favorite |
| `isLatestWork` | boolean | Show in "Latest Work" section |
| `isCoverImage` | boolean | Use as collection thumbnail |
| `isVisible` | boolean | Show in public gallery |
| `order` | number | Sort position within collection |
| `createdAt` | timestamp | Firestore server timestamp |

## Upload Pipeline

1. Admin selects files via `<Input type="file" multiple />`
2. Client-side preview via `URL.createObjectURL()`
3. Per-file metadata form: title, collection name, flags
4. Upload to Firebase Storage at `images/{filename}` via `uploadBytesResumable`
5. On completion: create Firestore document with download URL + metadata
6. Object URLs cleaned up on component unmount

## Collection Grouping

- Images grouped by `collection` string field
- Each collection has a cover image (`isCoverImage: true`)
- Collections are discovered by deduplicating the `collection` field across all images
- No separate `collections` collection in Firestore — derived from image data

## Reordering

- Drag-and-drop via `@hello-pangea/dnd` in `CollectionDetailPage`
- Updates `order` field on each image document
- Public gallery queries with `.orderBy('order')`

## Visibility Control

- `isVisible: false` hides image from public gallery
- Admin can toggle visibility per-image
- Useful for drafts, works-in-progress, or retired shots
