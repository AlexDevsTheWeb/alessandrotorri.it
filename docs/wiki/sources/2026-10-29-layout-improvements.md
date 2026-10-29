---
type: Source Summary
title: "2026-10-29 — Layout improvements after the first rebuild"
description: Owner feedback on the first public build: fonts, icon visibility, hover states, card treatment, footer, back-to-top, mobile header and drawer.
tags: [source, ui, layout, feedback, design]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-layout
    resource: ../../raw/2026-10-29-layout-improvements.md
    title: UI improvements after first rebuild (raw, immutable)
    author: human:alessandrotorri
---

# Summary

After the first public rebuild the owner listed layout and visual issues. This loop treats the raw file as the source, applies the changes, and records the visual decisions. The full list is in the raw file; the mapping below is the implementation contract.

# Request → implementation

| Request | Implementation |
|---------|----------------|
| Top-right icons invisible in light theme | AppBar now inherits `text.primary`; icons use `alpha(text.primary, 0.65)` normal and full color on hover. |
| Icons keep a selected border | Removed the Vite `button:focus` rule; `MuiButton`/`MuiIconButton` focus-visible rings disabled; nav links and cover cards have no outline. |
| Fonts feel dated | Replaced Inter + Playfair Display with **DM Sans** (body/UI) + **Instrument Serif** (headings), loaded from Google Fonts. |
| Text normal state too white, hover should be white | Nav/logo/footer icons use muted `text.primary` normally and full `text.primary` on hover. |
| Same for icon hover | Same muted → full-color rule on all social/theme/menu icons. |
| Remove card animation | Removed the framer-motion entrance/stagger and the hover scale. |
| Card border on hover | Removed the focus outline from the cover link; no border is rendered. |
| Collection name inside the photo with gradient | Title is now absolutely positioned inside the cover, over a bottom dark gradient. |
| Remove footer “Back to Top” text | Removed the footer button; only the floating icon remains. |
| Back-to-top icon has weird background | Floating control is now a transparent `IconButton`, muted icon normally and full color on hover. |
| Footer on one line, smaller, try no border | Footer is a single compact row with `caption` type and no top border. |
| Mobile icons squeeze the title onto two lines | Right-side header icons are hidden on mobile; the title keeps one line. |
| Sidebar background is bad | Drawer paper is semi-transparent (`alpha(bg, 0.82)`) with `blur(20px) saturate(180%)`. |
| Move mobile icons inside the sidebar | Instagram, YouTube and theme toggle are in the drawer. |

# Additional cleanup

- Replaced the Vite boilerplate `src/index.css` with a minimal reset.
- Deleted the unused `src/App.css`.
- Updated `index.html` to load DM Sans + Instrument Serif.

# Verification

- `npm run lint` — clean.
- `npm run build` — succeeds.
- Bundle: 1.357 MB / 420.96 kB gzip.

# Links

- [Raw source](../../raw/2026-10-29-layout-improvements.md)
- [Decision 0008 — Visual refinements](/decisions/0008-visual-refinements.md)
- [Design System](/concepts/design-system.md)
- [Gallery System](/concepts/gallery-system.md)
- [Site Architecture](/concepts/site-architecture.md)
