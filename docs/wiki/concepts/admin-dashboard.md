---
type: Reference
title: Admin Dashboard
description: Image upload, collection management, and drag-and-drop reordering interface.
tags: [admin, dashboard, upload, collections, drag-and-drop]
status: draft
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: admin-issue
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3
    title: "Issue #3 — protect admin routes and finish the administrator section"
---

# Admin Dashboard

> [!WARNING] Not protected
> `ProtectedRoute` is not applied in `src/App.tsx`. Anyone can reach `/admin` and `/admin/collection/:name`. Tracked in issue #3; do not expose new admin routes until it is fixed.

## Routes

- `/admin` — `AdminDashboard`: upload form + collection list + logout.
- `/admin/collection/:collectionName` — `CollectionDetailPage`: manage images in a collection.

## AdminDashboard page

- Lists collections deduplicated from the Firestore `images` collection.
- Upload form via `ImageUpload`.
- Logout action.
- Route protection is still disabled (issue #3).

## ImageUpload component

- Multi-file `<Input type="file" multiple />`.
- Per-file metadata form: title, metadata, collection, and the `isFavorite`, `isLatestWork`, `isCoverImage`, `isVisible` flags.
- Upload progress via `LinearProgress`.
- Uploads to Firebase Storage and creates a Firestore document on completion.

## CollectionDetailPage

- Drag-and-drop reordering via `@hello-pangea/dnd`; writes `order` in a batch.
- Inline editing of name and metadata.
- Toggles for favorite, latest work, cover image, and visibility.
- Soft delete (`isVisible: false`); can also delete a whole collection.
- Queries by `collection`, ordered by `order`.
- The local list is memoized from the snapshot (no `setState` in an effect).

## CollectionList component

- Queries all images from Firestore.
- Deduplicates collection names.
- Renders as an MUI `List` with links to the admin collection pages.

## Known issues

- Route protection disabled (issue #3).
- Firestore/Storage security rules are not in the repo yet.
- The admin still writes to Firestore while the public site reads static CDN data; both are intentional during the rebuild.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Site Architecture](/concepts/site-architecture.md)
