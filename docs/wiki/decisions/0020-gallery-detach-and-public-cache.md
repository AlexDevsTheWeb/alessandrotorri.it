---
type: Decision
title: "0020 — Detach images directly and cache public gallery reads"
description: Assignments can be removed from the image card with an atomic detach, and public pages paint cached Firestore galleries instead of flashing the static placeholders before the query resolves.
tags: [decision, admin, images, galleries, cache, public, firestore]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: removal-flash-report
    resource: /sources/2026-11-18-gallery-removal-and-home-flash.md
    title: 2026-11-18 — Gallery removal and home placeholder flash
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
---

# 0020 — Detach images directly and cache public gallery reads

## Context

Two issues were reported after the image catalog landed:

1. **Removal was one-way from `/admin/images`.** The catalog card could assign an image to a gallery but the gallery chips were inert; the only way out was `/admin/gallery/:id`, then the trash icon, then "Salva modifiche". The owner reported being unable to remove a photo once assigned.
2. **The public grid flashed the static placeholders.** `usePublicGalleries` started from the captured Adobe CDN dataset and replaced it when Firestore answered, and every navigation remounted the hook from scratch. `/gallery` → back to `/` showed FAVORITE…SPAGNA for a moment, then the Firestore galleries.

The Firestore data was consistent: each gallery's `imageIds` and each image's `galleryIds` matched. The editor trash worked in isolation, so the removal gap was the missing counterpart to the card's assignment select.

## Decision

1. **Direct detach from the catalog card.** Assigned gallery chips get a delete affordance that calls `unassignFromGallery`. It is a deliberate, immediate write, unlike the editor's draft/save flow.
2. **Atomic detach.** `detachImageFromGallery` runs in one transaction: it removes the id from `galleries.imageIds` and the gallery id from `images.galleryIds`, and promotes the next image when the removed one was the cover (or clears the cover fields when none remain).
3. **The assignment select hides already-assigned galleries.** It only offers galleries the image is not in, so "assign" cannot silently no-op.
4. **Public reads are cached, not flashed.** `src/services/publicGalleries.service.ts` keeps the last successful join and deduplicates concurrent loads. `usePublicGalleries` starts from the cache when present and refetches in the background; pages render `PageLoader` only while `isReady` is false on a cold load.
5. **Admin writes invalidate the cache.** The gallery and image stores clear it after create/save/delete/reorder/assign/unassign/save-image, so a public visit after an edit refetches instead of painting stale data.

## Consequences

Positive:

- Removing a photo from a gallery is available where it was added, with no hidden save step.
- Cover promotion stays consistent with the editor.
- No static-to-Firestore flash on navigation; revisits paint instantly and refresh silently.
- Cold loads show a loader instead of the wrong galleries.

Negative:

- The detach is immediate and has no confirmation; a misclick removes the assignment. The image stays in the catalog and can be reassigned.
- A cold public load now waits for Firestore before the first cover instead of painting the CDN fallback. The fallback still renders when the read fails or returns no galleries.
- The cache is module-level memory, not persisted: a hard reload always refetches.

## Alternatives rejected

- **Only keep the editor trash.** Rejected: it does not answer the reported flow, which starts on `/admin/images`.
- **Remove on draft without saving in the editor.** Rejected: breaks the editor's single-batch save semantics.
- **Keep the static-first paint and accept the flash.** Rejected: the owner sees wrong galleries for every navigation.
- **Persist the public cache in localStorage.** Rejected: would survive admin edits and stale-detail changes; not worth it for two queries.

## Links

- [Source summary](/sources/2026-11-18-gallery-removal-and-home-flash.md)
- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Gallery System](/concepts/gallery-system.md)
- [Decision 0018](/decisions/0018-image-catalog-and-layout.md)
