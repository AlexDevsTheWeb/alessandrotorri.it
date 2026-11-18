---
type: Decision
title: "0021 — Hide empty galleries and add visibility flags for galleries and images"
description: Galleries and catalog images can be marked invisible, public pages hide hidden or photo-less galleries, and the aspect-ratio precedence is made explicit.
tags: [decision, galleries, images, visibility, aspect-ratio, public, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: visibility-report
    resource: /sources/2026-11-18-visibility-and-polish.md
    title: 2026-11-18 — Empty galleries, visibility and ratio polish
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
  - id: decision-0020
    resource: /decisions/0020-gallery-detach-and-public-cache.md
    title: Detach images directly and cache public gallery reads
---

# 0021 — Hide empty galleries and add visibility flags for galleries and images

> [!NOTE] Ratio precedence superseded
> Point 4 below made the gallery ratio win in the feed. [Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md) reverses that: an explicit photo ratio wins, the gallery ratio is the fallback for `Naturale` photos and sets the cover.

## Context

Four requests came in after the detach/caching fixes:

1. a gallery with no photos must not appear on the home page;
2. galleries **and** photos need a visible/not-visible control;
3. the aspect-ratio setting "seems not to be working";
4. the caption in the full-size lightbox is too large.

Findings:

- The gallery ratio itself worked: the live covers rendered 16:9 and 3:2 exactly as stored in `layoutConfig`. What was unclear was precedence — the layout ratio overrides the per-image ratio unless the layout is `Naturale` — and the catalog card preview was hardcoded to 4:3, so changing the image ratio changed nothing on screen. With `Naturale`, the cover still forced 3:2 instead of using the cover image.
- The lightbox caption used `variant="h6"` (20 px).
- `galleries` and `images` had no visibility field; empty galleries rendered a blank cover.

## Decision

1. **`isVisible` on both models.** `galleries.isVisible` and `images.isVisible` default to `true`; a missing field normalizes to visible. Rules use `request.resource.data.get('isVisible', true) is bool` so existing documents without the field keep passing validation — no migration is required. Writes from the admin always include the field.
2. **Public visibility filter.** `src/services/publicGalleries.service.ts` drops hidden galleries, drops hidden catalog images, and then drops galleries left with no visible images. The filter runs on the joined result, so an image hidden in the catalog disappears from every gallery.
3. **Firestore stays authoritative.** The hook exposes `hasRemoteGalleries` (true when the read returns any gallery, before filtering). When it is true, `/` and `/gallery` render the filtered Firestore set even if it is empty (with "Nessuna galleria pubblicata"), and `/gallery/:slug` shows "Collezione non trovata" instead of resurrecting a static collection. The static dataset is only the fallback when the read fails or returns nothing.
4. **Ratio precedence is explicit.** `layoutConfig.aspectRatio` wins; `Naturale` uses the catalog image's own ratio (falling back to 3:2). The cover uses the ratio of the resolved cover image, not a fixed 3:2, and the catalog card preview follows the selected ratio. Helper text states the precedence.
5. **Smaller lightbox caption.** `body2` (0.875 rem), 75% white, instead of `h6`.
6. **Admin controls.** A "Visibile nel sito" switch in `GalleryFields` and in `ImageCatalogCard`; hidden galleries and images show a "Nascosta" chip in the admin lists. Toggles persist with the existing save actions.

## Consequences

Positive:

- Empty and hidden galleries no longer appear on `/` or `/gallery`; direct links to them show "not found".
- Hiding a photo removes it from the feeds, the gallery count and, if it was the last one, hides the gallery.
- The ratio controls now visibly do what they say, with the precedence documented.
- No Firestore migration and no rule relaxation.

Negative:

- Visibility is applied only on save, like the other metadata.
- Hiding the cover image promotes the next visible image on the grid without changing the stored `coverImageId`.
- `hasRemoteGalleries` means an owner who hides every gallery sees an empty site, not the CDN fallback. Intentional: the fallback is for failures, not for hidden content.

## Alternatives rejected

- **Filter empty galleries only in the grid component.** Rejected: the detail page and the photo feed need the same joined view.
- **Required `isVisible` in the rules.** Rejected: it would deny writes on the existing documents until a manual migration.
- **Make the image ratio always override the gallery.** Rejected: the gallery layout is the presentation contract; per-image ratios are for `Naturale`.
- **Detect the intrinsic ratio from the file.** Rejected for now: needs image load measurement and a client cache; the catalog already carries a manual ratio.

## Links

- [Source summary](/sources/2026-11-18-visibility-and-polish.md)
- [Photo Management](/concepts/photo-management.md)
- [Gallery System](/concepts/gallery-system.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Design System](/concepts/design-system.md)
- [Decision 0018](/decisions/0018-image-catalog-and-layout.md)
- [Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md)
