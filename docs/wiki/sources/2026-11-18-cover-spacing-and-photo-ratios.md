---
type: Source Summary
title: 2026-11-18 — Cover picker, gallery spacing and photo ratios
description: Owner request to choose the gallery cover from its own photos, add a separate gallery spacing and make the feed honor each photo's aspect ratio.
tags: [source, galleries, cover, spacing, aspect-ratio, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: decision-0022
    resource: /decisions/0022-cover-spacing-and-photo-ratios.md
    title: Pick the cover from the gallery, split photo and gallery spacing, and let photo ratios drive the feed
---

# 2026-11-18 — Cover picker, gallery spacing and photo ratios

## What the owner asked

1. In the gallery, choose the cover photo from the photos the gallery contains.
2. The spacing applied to the gallery's photos is fine, but the gallery itself also needs its own spacing; the two must be independent.
3. The aspect ratio on photos seems not to be respected.

## Evidence and findings

- The cover was stored as `coverImageId` + `coverImageUrl`, but the form showed a disabled URL field and the only picker was the star in `GalleryImageList`; the `/admin` edit dialog had no image list.
- `layoutConfig.padding` (photo spacing) existed; the home/gallery grid gap was fixed (`spacing={{ xs: 1, md: 2 }}`) and there was no per-gallery control.
- [Decision 0021](/decisions/0021-visibility-and-empty-galleries.md) made the gallery ratio override the photo ratio. The test photo is set to 1:1 and the gallery to 16:9; the feed rendered 368×207 (16:9) and ignored the photo metadata. After the precedence flip it renders 368×368.
- The owner had already toggled `isVisible` on the image through the admin, confirming the visibility write path works.

## Requirements extracted

1. Cover options limited to the gallery's assigned photos, with a preview.
2. Two independent spacing controls: inside the gallery (photos) and around the gallery cover in the grid.
3. The feed respects the photo ratio when set; the gallery ratio remains the fallback and the cover contract.
4. No migration for existing galleries.

## Outcome

[Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md) adds the cover select in `GalleryFields`, `layoutConfig.coverSpacing` applied by `CollectionGrid`, and the photo-first ratio precedence in `resolveImageIds`/`galleryToCover`. Verified in headless Chrome: selecting a cover writes the id and URL, selecting a spacing writes `coverSpacing`, and the feed renders the photo's 1:1 ratio. See [Photo Management](/concepts/photo-management.md), [Gallery System](/concepts/gallery-system.md) and [Admin Dashboard](/concepts/admin-dashboard.md).
