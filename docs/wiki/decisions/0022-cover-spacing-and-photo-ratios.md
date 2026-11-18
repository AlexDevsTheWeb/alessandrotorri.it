---
type: Decision
title: "0022 — Pick the cover from the gallery, split photo and gallery spacing, and let photo ratios drive the feed"
description: The gallery cover is chosen from the gallery's own images, cover spacing is separate from photo spacing, and an explicit photo aspect ratio now wins in the feed.
tags: [decision, galleries, cover, spacing, aspect-ratio, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: cover-spacing-ratio-report
    resource: /sources/2026-11-18-cover-spacing-and-photo-ratios.md
    title: 2026-11-18 — Cover picker, gallery spacing and photo ratios
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
  - id: decision-0021
    resource: /decisions/0021-visibility-and-empty-galleries.md
    title: Hide empty galleries and add visibility flags for galleries and images
---

# 0022 — Pick the cover from the gallery, split photo and gallery spacing, and let photo ratios drive the feed

## Context

Three requests after the visibility work:

1. The gallery cover should be chosen from the photos the gallery contains.
2. The spacing that is applied to a gallery's photos is fine, but the gallery itself also needs a spacing setting; the two must be independent.
3. The aspect ratio set on a photo is not respected.

Findings:

- The cover was stored per gallery, but the editor only exposed a disabled URL field plus a star icon in the image list. The `/admin` edit dialog had no image list at all.
- `layoutConfig.padding` controlled the Masonry gap between the gallery's photos. There was no control for the space around the gallery cover in the shared home/gallery grid.
- [Decision 0021](/decisions/0021-visibility-and-empty-galleries.md) made the gallery ratio win over the photo ratio. The owner set the test photo to 1:1 and the feed kept rendering the gallery's 16:9: the photo ratio was ignored. Verified live: the feed rendered 368×207 and changed to 368×368 after the precedence flip.

## Decision

1. **Cover from the gallery's own images.** `GalleryFields` gets a "Immagine di copertina" select built from `imageIds` joined with the catalog, plus "Nessuna (prima foto)". Selecting one writes both `coverImageId` and `coverImageUrl`. The star in `GalleryImageList` remains a shortcut. The preview uses the selected cover and its ratio. A stored cover that no longer belongs to the gallery is flagged and must be replaced.
2. **Two spacing controls.** `layoutConfig.padding` stays the photo spacing ("Spaziatura foto", inside the gallery). New `layoutConfig.coverSpacing` ("Spaziatura galleria", `none | small | medium | large`, default `none`) adds padding around the gallery cover in `CollectionGrid`: 0, 8, 16 or 24 px. Existing documents normalize to `none`; the rules accept the field as optional.
3. **Photo ratio wins in the feed.** `imageRatio` returns the photo's ratio when it is not `auto`; otherwise the gallery ratio; otherwise 3:2. The gallery ratio still sets the cover and acts as the default for photos left on `Naturale`. `Naturale` covers use the resolved cover image's ratio.

## Consequences

Positive:

- A cover can only be one of the gallery's photos, chosen from a list; no free-text URL and no hidden requirement to find the star.
- Photo spacing and gallery spacing are independent and both editable per gallery.
- The feed respects each photo's ratio, matching the metadata the owner sets on the catalog card.

Negative:

- Setting a photo ratio now changes the feed even when the gallery has a different ratio. Existing catalogs where every photo carries an explicit ratio will look different after this change.
- To make a photo follow the gallery ratio, the photo must be set back to `Naturale`.
- `coverSpacing` is a new field; the admin writes it, but existing documents stay valid without it.

## Alternatives rejected

- **Keep the star as the only cover control.** Rejected: it requires knowing the gallery editor, and the dashboard dialog had no way to choose a cover.
- **A single spacing value for photos and covers.** Rejected: the owner explicitly wants both.
- **A global gallery-grid gap.** Rejected: spacing is per gallery, like the photo spacing.
- **Keep the gallery ratio authoritative for the feed.** Rejected: the owner set a 1:1 photo and expected the feed to honor it.

## Links

- [Source summary](/sources/2026-11-18-cover-spacing-and-photo-ratios.md)
- [Photo Management](/concepts/photo-management.md)
- [Gallery System](/concepts/gallery-system.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)
