---
type: Decision
title: "0018 — Master image catalog, GitHub discovery and per-gallery layout controls"
description: Moves image metadata from embedded gallery arrays into an images catalog, discovers repository files through the GitHub API, and adds cover, featured and layout configuration.
tags: [decision, images, catalog, github, galleries, featured, layout, firestore]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-17T00:00:00Z }
sources:
  - id: raw-admin-galleries-v2
    resource: ../../raw/2026-11-17-admin-galleries-v2.md
    title: Admin galleries v2 — image catalog, GitHub sync and layout system (raw, immutable)
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
---

# 0018 — Master image catalog, GitHub discovery and per-gallery layout controls

## Context

[Decision 0016](/decisions/0016-gallery-management.md) embedded image entries in each gallery document. That kept a gallery and its ordering atomic, but it makes three things the owner now asks for impossible or expensive:

- **Reuse and completeness:** an image that belongs to two galleries exists twice, and "which photos have no gallery?" cannot be answered without scanning every document.
- **Discovery:** files committed to `public/galleries/` are invisible to the admin until someone types their path.
- **Cover and layout:** a cover is a number in an array, and there is no per-gallery presentation contract.

The 2026-11-17 source asks for a master `images` catalog, GitHub discovery, a dedicated image screen, cover designation, featured galleries and layout controls.

## Decision

1. **`images` is the master catalog.** One document per file with `filename`, `path`, `title`, `description`, `alt`, `aspectRatio`, `galleryIds`, `createdAt`, `updatedAt`. The document id is derived from the sanitized filename, which makes GitHub indexing idempotent. The id is not stored in the document, following the 0016 convention.
2. **Galleries reference images by id.** `imageIds` is the authoritative, ordered membership; `images` is no longer written. `galleryIds` mirrors the membership for filtering. Both indexes change in one `writeBatch`, so they cannot drift within a successful write.
3. **The cover is explicit.** `coverImageId` is authoritative and `coverImageUrl` is denormalized so the public grid paints without resolving the catalog. An empty cover falls back to the first resolved image.
4. **GitHub is read-only discovery.** `src/services/githubImages.service.ts` reads the contents endpoint for `public/galleries/` on `VITE_GITHUB_REPO` / `VITE_GITHUB_BRANCH` (defaults: the project repository and `development`). Unauthenticated, no token in the bundle. Rate limits are surfaced with a retry action; the catalog keeps working.
5. **Legacy embedded images stay readable.** A gallery document with an `images` array and no `imageIds` still renders publicly, and the editor shows a migration warning. No production galleries are seeded, so this is a safety net, not a migration path.
6. **`layoutConfig` owns presentation.** `aspectRatio` crops covers and feed images; `padding` sets the feed spacing. `object-fit: cover; object-position: center` is enforced in `ProgressiveImage` for covers and feed items.
7. **Featured galleries** (`isFeatured`, `featuredOrder`) render full-width at the top of the shared `/` and `/gallery` grid. The sort is featured-first, then `featuredOrder`; non-featured keep their existing order.
8. **Rules.** `images`: public read, admin-only validated writes. `galleries`: `isValidGallery()` accepts and type-checks the new fields and the `layoutConfig` enums.

## Consequences

Positive:

- One metadata record per photo; editing a caption fixes every gallery that uses it.
- `/admin/images` answers the operational questions directly: what is not indexed, not described, not assigned.
- Cover, featured and layout are explicit data, not implicit conventions.
- A gallery document no longer risks the 1 MiB document limit from its image list, only from `imageIds` (500-entry rule cap).

Negative:

- The public read now joins two collections. It is a second `getDocs` (~100 documents) after mount, inside the existing lazy chunk.
- Two membership indexes must be written together; every mutation goes through the service to enforce that.
- Indexing is manual (or "indica tutte"); the GitHub call is not a background sync.
- `coverImageUrl` can drift from the catalog if the path changes; the admin re-designates the cover.
- Legacy embedded images are read-only and will not appear in the catalog until re-indexed.

## Alternatives rejected

- **Keep embedded images and add a derived catalog.** Duplicate metadata in two places with no owner; every edit needs a reconciliation job.
- **Subcollection `galleries/{id}/images/{imageId}`.** Per-gallery ownership again; cannot answer "unassigned" cheaply.
- **Authenticated GitHub calls.** A token in `VITE_*` ships to every browser; a server proxy is out of scope for a static site.
- **Global layout settings instead of per-gallery.** The source explicitly puts `layoutConfig` on the gallery.

## Relationship to earlier decisions

- Supersedes the **embedded-image** parts of [Decision 0016](/decisions/0016-gallery-management.md); the static-asset and no-Storage decisions stand.
- Supersedes the **fixed 4:3 cover** for Firestore galleries in [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md). Hover titles, pointer cursors and the copy guard stand; the static fallback still uses 4:3.
- Keeps [Decision 0014](/decisions/0014-admin-route-protection.md) and [0017](/decisions/0017-firestore-permission-diagnostics.md): admin routes stay protected and the `admins/{uid}` preflight remains.
- The backend question in [Photo Storage and Backend Options](/concepts/photo-storage-options.md) is unchanged: image bytes stay repository assets.

## Verification

- `npm run lint` and `npm run build` pass.
- Not verified: live Firestore writes, rules deployment, the GitHub request against committed files, browser drag-and-drop and the featured grid. They need credentials, deployed rules and real files (issue #3).

## Links

- [Source summary — 2026-11-17](/sources/2026-11-17-admin-galleries-v2.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Gallery System](/concepts/gallery-system.md)
