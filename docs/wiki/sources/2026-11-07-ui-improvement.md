---
type: Source Summary
title: "2026-11-07 — Layout improvements for the gallery pages"
description: Owner feedback on /gallery and /gallery/:slug — cursor, hover-only centered cover titles, tighter 4:3 covers, EXIF label removal, and right-click copy protection.
tags: [source, ui, gallery, cursor, hover, copy-protection]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: raw-ui-improvement
    resource: ../../raw/2026-11-07-ui-improvement.md
    title: Layout improvements (raw, immutable)
    author: human:alessandrotorri
---

# Summary

The owner reviewed the gallery pages after phase 5 and listed four groups of issues. The raw file is the source; the mapping below is the implementation contract. The implementation is recorded in [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md).

# Request → implementation

| Request | Implementation |
|---------|----------------|
| Galleries: cursor is not a pointer over images | `ProgressiveImage` inherits the cursor when it is not clickable (it used to force `default`); the cover card sets `cursor: pointer`. |
| Galleries: text visible only on hover, centered, stronger gradient | Cover title is centered and `opacity: 0`; it fades in on hover or focus over a 0.6–0.85 black gradient. |
| Galleries: too much space between images | `CollectionGrid` spacing reduced from `{ xs: 4, md: 6 }` to `{ xs: 1, md: 2 }`. |
| Galleries: more square covers, at least 4:3 | Cover ratio changed from `16/9` to `4/3`. |
| Single gallery: no cursor pointer on images | Photo button cursor changed from `zoom-in` to `pointer`; the image inherits it. |
| Single gallery: remove "Dati EXIF non disponibili" | Removed from `PhotoLightbox`; the caption stays. |
| Single gallery: prevent copying images with right click | `ProgressiveImage` `preventCopy` prop on the feed plus a native guard in the lightbox (`draggable={false}`, `user-select: none`, `contextmenu` cancelled). No library added. |

# Analysis notes

- The cursor bug has one root cause: `ProgressiveImage` set `cursor: default` on its wrapper, which hid the pointer from the link and button around it.
- The owner asked for "a library" for copy protection. [AGENTS.md](/rules/agent-rules.md) forbids new dependencies without approval, so the change is native. The guard is deterrent-only because the photos are public CDN URLs. See the question in Decision 0012.
- The always-visible cover title conflicts with the live-site parity in [Decision 0003](/decisions/0003-exact-look-and-feel.md); Decision 0012 records the owner's change as the new rule.

# Verification

- `npm run lint` — clean.
- `npm run build` — succeeds.

# Links

- [Raw source](../../raw/2026-11-07-ui-improvement.md)
- [Decision 0012 — Gallery hover titles and copy guard](/decisions/0012-gallery-hover-titles-and-copy-guard.md)
- [Decision 0008 — Visual refinements](/decisions/0008-visual-refinements.md)
- [Gallery System](/concepts/gallery-system.md)
- [Design System](/concepts/design-system.md)
