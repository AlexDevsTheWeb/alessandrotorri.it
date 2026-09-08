---
type: Reference
title: Admin Dashboard
description: Image upload, collection management, and drag-and-drop reordering interface.
tags: [admin, dashboard, upload, collections, drag-and-drop]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Admin Dashboard

## Routes

- `/admin` — `AdminDashboard`: upload form + collection list + logout
- `/admin/collection/:collectionName` — `CollectionDetailPage`: manage images in a collection

## AdminDashboard Page

- Lists all collections (deduplicated from Firestore `images` collection)
- Upload form via `ImageUpload` component
- Logout button
- **Note**: Route protection via `ProtectedRoute` is currently commented out

## ImageUpload Component

- Multi-file `<Input type="file" multiple />`
- Per-file metadata form:
  - Title (text)
  - Metadata/description (text)
  - Collection name (text)
  - Checkboxes: `isFavorite`, `isLatestWork`, `isCoverImage`, `isVisible`
- Upload progress via `LinearProgress`
- Uploads to Firebase Storage, creates Firestore doc on completion

## CollectionDetailPage

- Drag-and-drop reordering via `@hello-pangea/dnd`
- Inline editing of image name and metadata
- Toggle checkboxes: favorite, latestWork, coverImage, visible
- Delete individual images or entire collection
- Queries by `collection` name, ordered by `order`

## CollectionList Component

- Queries all images from Firestore
- Deduplicates collection names
- Renders as MUI `List` with links to admin collection detail pages
