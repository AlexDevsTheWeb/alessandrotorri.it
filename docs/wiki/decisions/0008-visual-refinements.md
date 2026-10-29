---
type: Decision
title: "0008 — Visual refinements after the first rebuild"
description: Refine the visual system after owner feedback — fonts, muted hover states, cover titles, no card animation, compact footer, transparent back-to-top, mobile drawer.
tags: [decision, design, typography, navbar, footer, cards, mobile]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-layout
    resource: ../../raw/2026-10-29-layout-improvements.md
    title: UI improvements after first rebuild (raw, immutable)
    author: human:alessandrotorri
  - id: decision-0003
    resource: /decisions/0003-exact-look-and-feel.md
    title: Exact look & feel, modern implementation
---

# Context

The first public build matched the live site's structure but the owner flagged concrete visual problems: font choice, low-contrast icons in light mode, persistent focus borders, hover colors, card entrance animation, cover titles below the image, footer and back-to-top treatment, and mobile header/drawer behavior.

# Decision

Apply the owner's refinements:

1. **Typography:** DM Sans for body/UI and cover titles; Instrument Serif for h1–h4. Replaces Inter + Playfair Display.
2. **Hover language:** normal text/icons use `alpha(text.primary, 0.6–0.72)`; hover uses full `text.primary`. No opacity fade.
3. **Covers:** title inside the image over a bottom gradient; no entrance animation, no hover scale, no border/outline; hover only dims the image slightly.
4. **Focus rings:** suppress the Vite/global focus border on buttons, icon buttons and cover links. Keep the admin form fields usable.
5. **Footer:** single compact row with copyright and social icons; no top border; no “Back to Top” text.
6. **Back to top:** floating transparent icon, no background in any state.
7. **Mobile:** hide social/theme icons from the header, keep the title on one line, and move the icons into the drawer.
8. **Drawer:** semi-transparent blurred paper instead of an opaque panel.
9. **CSS hygiene:** replace the Vite `index.css` boilerplate and delete the unused `App.css`.

This refines [Decision 0003](/decisions/0003-exact-look-and-feel.md) for the specific visual points above; the overall goal remains a faithful, modern implementation of the live site.

# Consequences

- The visual language is calmer and more modern; the site no longer depends on the Vite starter CSS.
- Focus outlines are intentionally suppressed on interactive chrome, per owner request. Form fields keep their focus treatment.
- Social links are desktop-only in the footer and mobile-only in the drawer; both are always reachable.
- Future typography/cover/footer changes should update this decision or supersede it.

# Links

- [Source summary](/sources/2026-10-29-layout-improvements.md)
- [Design System](/concepts/design-system.md)
- [Gallery System](/concepts/gallery-system.md)
- [Site Architecture](/concepts/site-architecture.md)
- [Decision 0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md)
