---
type: Decision
title: "0016 — Manage galleries in Firestore with static repository images"
description: Replaces the Storage-upload admin with a Firestore galleries collection whose image files live in public/galleries/ and are deployed with the site.
tags: [decision, admin, galleries, firestore, storage, static-assets]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-admin-galleries
    resource: ../../raw/2026-11-16-admin-galleries.md
    title: Admin galleries specification (raw, immutable)
  - id: decision-0014
    resource: /decisions/0014-admin-route-protection.md
    title: Protect admin routes and gate data with an admins allowlist
---

# 0016 — Manage galleries in Firestore with static repository images

> [!NOTE] Partly superseded
> The embedded `images` array described here was replaced on 2026-11-17 by the master `images` catalog and gallery `imageIds` ([Decision 0018](/decisions/0018-image-catalog-and-layout.md)). The static-asset strategy, the removal of Firebase Storage and the public fallback still stand.

## Context

The administrator section was written against a flat Firestore `images` collection plus Firebase Storage uploads. The public site meanwhile reads a static Adobe CDN dataset, so the admin managed data nobody displayed. Storage also brings Blaze billing, an upload pipeline we do not need for ~100 photos, and an egress cost that [Photo Storage and Backend Options](/concepts/photo-storage-options.md) flagged as Firebase's weak point.

The owner's 2026-11-16 specification asks for **complete dynamic gallery management**: gallery CRUD, gallery ordering, image assignment with title/alt, live preview and image reordering, with optimized files stored directly in `public/galleries/` and deployed by the static host.

## Decision

1. **One Firestore collection, `galleries`.** Each document holds the gallery fields and an embedded `images` array:
   `id`, `name`, `slug`, `description`, `displayOrder`, `coverImageUrl`, `images[]`, `createdAt`, `updatedAt`.
   Each image entry holds `id`, `url`, `title`, `alt`, `ratio`, `order`.
2. **Image bytes are repository assets, not Storage objects.** Files live in `public/galleries/` and are referenced as `/galleries/<file>`. Adding an image means committing the file; the admin records its path, caption, alt text and ratio.
3. **`slug` and `ratio` are additions** to the fields named in the source. The slug is the public URL segment; the ratio lets the Masonry feed reserve space before the image loads.
4. **The public site reads `galleries`** and falls back to the static Adobe CDN dataset when Firestore is empty or unavailable. The fallback is intentional: the site must never go blank because of a failed query.
5. **The legacy `images` collection, `ImageUpload`, `CollectionDetailPage`, `CollectionList`, `storage.rules` and the Storage client are removed.** `firestore.rules` gains a `galleries` block (public read, admin write with validation) and the catch-all denies `images`.
6. **`admin_dashboard` UI copy is Italian**, matching the site rule for user-facing text.

## Consequences

Positive:

- No Storage bucket, no upload progress UI, no client-side file handling, no Blaze requirement for images. Delivery is the existing static hosting.
- A gallery and its ordering are one atomic document, so a reorder or image edit is a single write with no cross-document race.
- The public pages and the admin share one model, so the admin is visibly useful after the migration.

Negative:

- Every image addition is a git commit plus a deploy; the owner cannot add a photo from the web UI alone.
- A gallery document is capped at 1 MiB. The rules limit `images` to 500 entries; galleries are far smaller in practice. A future move to an `images` subcollection would need a migration.
- Public readers download the Firestore client lazily to read galleries. The static covers paint first and the service lives in its own chunk, but this is a bundle cost the CDN-only site did not have.
- Deleting a gallery does not delete its files; the owner removes them from the repository.

## Alternatives rejected

- **Keep Storage uploads.** Rejected: the owner explicitly moved to repository assets to remove subscription and egress cost, and the public site would still need a Firestore/SDK path.
- **Subcollection `galleries/{id}/images/{imageId}`.** Cleaner for large galleries and per-image writes, but ordering becomes multi-document and the current galleries are small.
- **Store the whole photo list in a JSON manifest committed to the repo.** Cheapest runtime, but the owner asked for a web admin.

## Relationship to earlier decisions

- [Decision 0014](/decisions/0014-admin-route-protection.md) stays in force for route protection and the `admins/{uid}` allowlist. Its **Storage-rule and `images`-collection parts are superseded** by this decision.
- The static CDN dataset remains as the fallback content path; see [Gallery System](/concepts/gallery-system.md).
- The backend question in [Photo Storage and Backend Options](/concepts/photo-storage-options.md) is partially answered: image bytes no longer need a cloud bucket. Firestore 13 (issue #21) still depends on the remaining Firestore choice.

## Verification

- `npm run lint` and `npm run build` pass.
- Rules are not deployed and the live flows are not exercised in this session; see the PR checklist and issue #3.

## Links

- [Source summary — 2026-11-16 admin galleries](/sources/2026-11-16-admin-galleries.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Photo Management](/concepts/photo-management.md)
