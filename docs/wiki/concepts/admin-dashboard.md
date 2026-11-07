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

> [!NOTE] Protected
> Both admin routes sit under `ProtectedRoute` in `src/App.tsx`. Signed-out visitors are redirected to `/login`. Data access is gated by `firestore.rules` and `storage.rules`, which allow writes only for UIDs in `admins/{uid}` ([decision 0014](/decisions/0014-admin-route-protection.md), issue #3).

## Routes

- `/admin` — `AdminDashboard`: upload form + collection list + logout.
- `/admin/collection/:collectionName` — `CollectionDetailPage`: manage images in a collection.

## AdminDashboard page

- Lists collections deduplicated from the Firestore `images` collection.
- Upload form via `ImageUpload`.
- Logout action.
- Reached only through `ProtectedRoute` (signed-in users).

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

- A signed-in account that is not in `admins/{uid}` can open the screens, but Firestore and Storage deny its reads and writes. A client-side admin check is a follow-up.
- Rules are in the repo but not deployed or emulator-tested yet (see [Firebase Backend](/concepts/firebase-backend.md)).
- The admin still writes to Firestore while the public site reads static CDN data; both are intentional during the rebuild.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Site Architecture](/concepts/site-architecture.md)
