---
type: Source Summary
title: 2026-11-18 — Gallery removal and home placeholder flash
description: Owner report that an assigned photo cannot be removed from a gallery from the image page, and that the home grid shows the static placeholders before the Firestore galleries on every visit.
tags: [source, bug, admin, images, galleries, cache, public]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: decision-0020
    resource: /decisions/0020-gallery-detach-and-public-cache.md
    title: Detach images directly and cache public gallery reads
---

# 2026-11-18 — Gallery removal and home placeholder flash

## What the owner reported

1. A photo already assigned to a gallery cannot be removed from it.
2. `/` shows the old Adobe CDN placeholders, then the Firestore galleries. The same flash happens when navigating from a gallery back to the home page.

## Reproduction and evidence

- Live Firestore data was consistent: both galleries (`In Evidenza`, `Irlanda`) listed the uploaded image in `imageIds`, and the image listed both galleries in `galleryIds`. No write had been lost.
- The gallery editor's trash icon updates the draft and the save path removes both sides correctly, verified in a headless browser harness with mocked data.
- The gap was `/admin/images`: the card could assign but the assigned-gallery chips had no action, and the assignment select only ever added.
- A headless run of `/` recorded the sequence: on `back` the DOM showed `FAVORITE ULTIMI LAVORI FRANCIA IRLANDA ITALIA PORTOGALLO REGNO UNITO SCOZIA SPAGNA`, then `IN EVIDENZA IRLANDA` after the Firestore query. `usePublicGalleries` re-ran on every mount and always started from `COLLECTIONS`.

## Requirements extracted

1. Remove an image from a gallery from the catalog card, without hunting for another screen.
2. Keep `imageIds` and `galleryIds` in sync and promote the cover when needed.
3. Never paint the static fallback before a successful Firestore read; show a loader on a cold load.
4. Do not re-run the two queries from scratch on every navigation; keep the last result.
5. Keep the static dataset as the fallback when Firestore is unavailable or empty.

## Outcome

[Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md) adds the transactional detach, removable gallery chips and the assignment filter, and introduces `publicGalleries.service.ts` plus cache invalidation on admin writes. Pages render `PageLoader` until `isReady`. Verified with headless Chrome: chip delete fires the unassign callback, and back navigation paints the Firestore galleries with no static flash. See [Photo Management](/concepts/photo-management.md), [Admin Dashboard](/concepts/admin-dashboard.md) and [Gallery System](/concepts/gallery-system.md).
