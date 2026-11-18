---
type: Source Summary
title: 2026-11-18 — Empty galleries, visibility and ratio polish
description: Owner request to hide photo-less galleries, add visible/not-visible flags to galleries and photos, fix the aspect-ratio controls and shrink the lightbox caption.
tags: [source, galleries, images, visibility, aspect-ratio, lightbox]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: decision-0021
    resource: /decisions/0021-visibility-and-empty-galleries.md
    title: Hide empty galleries and add visibility flags for galleries and images
---

# 2026-11-18 — Empty galleries, visibility and ratio polish

## What the owner asked

1. A gallery with no photos must not be visible on the home page.
2. Both galleries and photos need a "visible / not visible" setting.
3. Check the aspect ratio: it seems not to be working.
4. The photo title shown when a photo is opened full-size is too big; make it much smaller.

## Evidence and findings

- **Empty gallery:** after the owner detached the test photo from `Irlanda`, the gallery kept `imageIds: []` but still rendered a blank cover on `/`. The grid mapped every Firestore gallery without checking resolved images.
- **Aspect ratio:** measured the live grid — `In Evidenza` (`16:9`) rendered 1152×648 (1.778) and `Irlanda` (`3:2`) rendered 568×379 (1.5), and the `In Evidenza` feed rendered 368×207 (1.778). The gallery ratio works. The confusion is precedence: the gallery ratio overrides the per-image ratio unless the gallery is `Naturale`; the catalog card preview was fixed at 4:3, and covers in `Naturale` still forced 3:2.
- **Lightbox caption:** `Typography variant="h6"`, computed at 20 px.
- **Visibility:** no field existed on `galleries` or `images`; all documents are public-read.

## Requirements extracted

1. Hide galleries with no visible photos on `/`, `/gallery` and direct links.
2. `isVisible` on galleries and images; hidden photos disappear from feeds and galleries.
3. Keep existing documents valid without a migration.
4. Make the ratio controls respond and document the precedence.
5. Shrink the lightbox caption substantially.

## Outcome

[Decision 0021](/decisions/0021-visibility-and-empty-galleries.md) adds `isVisible` (default true, missing accepted by the rules), filters the joined public data, exposes `hasRemoteGalleries` so hidden content is not replaced by the CDN fallback, applies the cover image ratio in `Naturale`, makes the catalog preview follow the ratio, and sets the lightbox caption to `body2` at 0.875 rem. See [Photo Management](/concepts/photo-management.md), [Gallery System](/concepts/gallery-system.md), [Admin Dashboard](/concepts/admin-dashboard.md) and [Design System](/concepts/design-system.md).
