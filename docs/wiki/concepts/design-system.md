---
type: Reference
title: Design System
description: MUI theme, typography, color, spacing, and responsive design rules, with the live-site look & feel locked.
tags: [design, theme, mui, typography, colors, responsive]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: decision-0003
    resource: /decisions/0003-exact-look-and-feel.md
    title: Exact look & feel, modern implementation
  - id: decision-0008
    resource: /decisions/0008-visual-refinements.md
    title: Visual refinements after the first rebuild
  - id: raw-layout
    resource: ../../raw/2026-10-29-layout-improvements.md
    title: UI improvements after first rebuild (raw, immutable)
---

# Design System

The live site is the visual reference. The implementation is modern, but the layout, type hierarchy, spacing, and interaction model must match. See [Decision 0003](/decisions/0003-exact-look-and-feel.md), refined by [Decision 0008](/decisions/0008-visual-refinements.md).

## Theme configuration

Defined in `src/style/theme.ts`. Two themes: light and dark. Default is **dark** (`themeStore`).

### Colors

| Token | Light | Dark |
|-------|-------|------|
| Background | `#ffffff` | `#111111` |
| Primary text | `#1a1a1a` | `#ffffff` |
| Paper | `#fafafa` | `#121212` |

The live site is a white editorial theme; dark mode is an addition, not a replacement.

### Typography

| Font | Usage | Weights |
|------|-------|---------|
| DM Sans | Body, buttons, menus, cover titles | 300, 400, 500, 600 |
| Instrument Serif | Headings (h1–h4) | 400, italic |

Loaded via Google Fonts in `index.html`. Replaced Inter + Playfair Display on 2026-10-29 ([decision 0008](/decisions/0008-visual-refinements.md)).

### Shape

- `borderRadius: 0` — sharp, editorial.
- No button ripple.
- Buttons are not automatically uppercase; nav links are explicitly uppercase.
- Focus rings are suppressed on buttons/icon buttons to avoid the persistent border after click.

## Navbar

- Glassmorphism: `backdrop-filter: blur(20px) saturate(180%)`.
- Semi-transparent background (`alpha(bg, 0.7)`).
- Fixed; hides on scroll down and reveals on scroll up.
- Triptych: desktop `Gallerie / {collection}` breadcrumb on the left, `Alessandro Torri` center, Instagram + YouTube + theme toggle right.
- The breadcrumb is hidden on mobile; only the menu button and centered logo remain.
- The collection page does not repeat the breadcrumb in the body ([decision 0010](/decisions/0010-navbar-breadcrumb.md)).
- Uppercase links at `0.75rem / 0.2em`; normal text is `alpha(text.primary, 0.65)`, hover is full `text.primary`.
- Icons follow the same normal/hover color rule, with transparent backgrounds.
- Mobile: the right-side icons are hidden from the header and moved into the drawer; the header keeps only the menu button and the centered logo.
- Drawer: semi-transparent background with blur (`alpha(bg, 0.82)` + `backdrop-filter`), no opaque panel.

## Covers

- 16:9, `overflow: hidden`.
- Collection title is inside the image, centered at the bottom, over a dark gradient for legibility.
- No entrance animation and no hover scale.
- Hover only dims the image slightly (`brightness(0.86)`); no border, no outline.
- Card links have `outline: none`, including focus.

## Collection feed

- Masonry layout: 1 column on mobile, 2 from `sm`, 3 from `md`; `maxWidth="lg"`.
- Each image keeps its intrinsic aspect ratio.
- Caption is hidden by default and revealed on hover or keyboard focus.
- Reveal: a ~50% black gradient fades in and the caption slides up from below to the center.
- Caption is white, centered, with a soft text shadow.
- No permanent caption below the image; the lightbox still shows the caption.
- Equal gutters on every breakpoint; the Masonry root negative margin is neutralized so mobile photos stay centered.

## Lightbox

- Fullscreen `Dialog`, `rgba(0,0,0,0.85)` + `backdrop-filter: blur(15px)`.
- Arrows on the sides (desktop) or below (mobile).
- Esc/arrows keyboard support.
- Caption plus an EXIF placeholder line until real metadata exists.

## Footer

- Single compact row: copyright + social icons, no top border.
- `caption` typography, smaller than before.
- Social icons hidden on mobile and available in the drawer instead.
- No "Back to Top" text in the footer.

## Back to top

- Floating icon only, fixed bottom-right.
- Transparent background in every state; muted color normally, full `text.primary` on hover.
- Accessible `aria-label`, no visible text.

## Responsive breakpoints

Standard MUI: `xs 0`, `sm 600`, `md 900`, `lg 1200`, `xl 1536`.

## Styling approach

- Primary: MUI `sx`.
- One-off custom styles: Emotion `styled()` (e.g. navbar).
- No Tailwind, CSS Modules, or Sass.
- `index.css` is a minimal reset; the Vite boilerplate styles and `App.css` were removed on 2026-10-29 because they caused inconsistent colors, focus outlines, and body layout.

## Related

- [Site Architecture](/concepts/site-architecture.md)
- [Gallery System](/concepts/gallery-system.md)
- [Code Style](/rules/code-style.md)
- [Decision 0008 — Visual refinements](/decisions/0008-visual-refinements.md)
