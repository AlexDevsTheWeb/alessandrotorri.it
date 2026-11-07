---
type: Decision
title: "0012 — Gallery covers reveal titles on hover, 4:3 covers, and a photo copy guard"
description: Owner feedback on the gallery pages — hover-only centered cover titles over a stronger gradient, 4:3 covers, tighter grid spacing, pointer cursors on images, no EXIF placeholder in the lightbox, and a native copy guard instead of a new dependency.
tags: [decision, gallery, hover, cursor, copy-protection, layout]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: raw-ui-improvement
    resource: ../../raw/2026-11-07-ui-improvement.md
    title: Layout improvements (raw, immutable)
    author: human:alessandrotorri
  - id: decision-0008
    resource: /decisions/0008-visual-refinements.md
    title: Visual refinements
  - id: decision-0003
    resource: /decisions/0003-exact-look-and-feel.md
    title: Exact look & feel, modern implementation
---

# Context

The owner reviewed the gallery pages after phase 5 and flagged four groups of issues:

- On `/gallery`, the cursor was the default arrow over the covers; only the title area showed a pointer. The card was a link, but its image wrapper forced `cursor: default`.
- On `/gallery`, cover titles were always visible at the bottom of the image. The owner wants them hidden until hover, centered both ways, with a stronger background gradient. The covers were also 16:9 and the gaps between them were too large.
- On `/gallery/:slug`, the photo buttons used `zoom-in` but the image inside forced `cursor: default`, so no pointer appeared over the photos.
- In the lightbox, the "Dati EXIF non disponibili" label appeared under every photo. The owner wants photos protected from copying with a right click.

# Decision

1. **Cover titles:** hidden by default. On hover or keyboard focus, the title fades in at the vertical and horizontal center, rising 14px into place, over a 0.6–0.85 black gradient that fades in with it. Hover still dims the image with `brightness(0.86)`. This supersedes the bottom-positioned, always-visible title from [Decision 0008](/decisions/0008-visual-refinements.md), point 3.
2. **Cover ratio:** covers are `4/3` (was `16/9`), which matches the owner's "at least 4:3" request.
3. **Grid spacing:** `CollectionGrid` gap reduced from `{ xs: 4, md: 6 }` to `{ xs: 1, md: 2 }` (8px / 16px).
4. **Cursor:** cover cards and feed photo buttons use `cursor: pointer`. `ProgressiveImage` inherits the cursor when it is not clickable instead of forcing `default`.
5. **Copy guard (native, no new dependency):** feed photos and the lightbox image use `draggable={false}`, `user-select: none`, and a `contextmenu` handler that cancels the context menu. It is opt-in through `ProgressiveImage`'s `preventCopy` prop and applied to the single-gallery feed and the lightbox only.
6. **Lightbox:** the "Dati EXIF non disponibili" line is removed. The caption stays.

# Consequences

- The galleries feel calmer and the photos are the focus. Titles are discoverable on hover and on keyboard focus, but a touch user only sees them after a tap, because there is no hover on touch screens.
- Covers are 4:3 and cropped with `object-fit: cover`, so 16:9 source images lose some width.
- The copy guard is a deterrent only. The photos are public Adobe CDN URLs, so anyone can still open the image URL or save from the network. The owner asked for "a library"; none was added because [AGENTS.md](/rules/agent-rules.md) requires approval for new dependencies. If the owner wants a library, that needs a separate approval.
- The EXIF placeholder is gone until real metadata exists in phase 6; [Photo Management](/concepts/photo-management.md) still describes the metadata field.

> [!WARNING] Contradiction — live-site parity vs owner feedback
> [Decision 0003](/decisions/0003-exact-look-and-feel.md) and the [Rebuild Plan](/rebuild-plan.md) describe centered uppercase cover titles that are always visible on the live site. This decision deliberately hides them until hover, at the owner's request. The owner's feedback wins for this point; the live site is no longer the exact reference for cover titles.

> [!QUESTION] Protection library
> Should the owner approve a dedicated right-click/copy library? If yes, add it through a separate dependency decision and replace the native handler in `ProgressiveImage` and `PhotoLightbox`.

# Links

- [Source summary](/sources/2026-11-07-ui-improvement.md)
- [Decision 0008 — Visual refinements](/decisions/0008-visual-refinements.md)
- [Decision 0009 — Masonry feed with hover captions](/decisions/0009-masonry-feed-hover-captions.md)
- [Decision 0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md)
- [Gallery System](/concepts/gallery-system.md)
- [Design System](/concepts/design-system.md)
