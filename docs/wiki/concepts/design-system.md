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

- The static fallback uses 4:3; Firestore galleries use `layoutConfig.aspectRatio` (default `3/2`, owner-selectable `16:9`, `3:2`, `4:3`, `1:1`).
- `overflow: hidden`, `object-fit: cover`, `object-position: center`.
- Collection title is centered in the image and hidden until hover or keyboard focus; it fades in over a 0.6–0.85 black gradient ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- No entrance animation and no hover scale.
- Hover only dims the image slightly (`brightness(0.86)`); no border, no outline.
- Card links have `outline: none`, including focus, and a pointer cursor.

> [!WARNING] Cover ratio superseded
> [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md) fixed covers at 4:3. The 2026-11-17 specification makes the ratio per gallery with a `3/2` default ([Decision 0018](/decisions/0018-image-catalog-and-layout.md)). The static CDN fallback still renders 4:3; the hover title, pointer and copy-guard rules stand.

## Collection feed

- Masonry layout: 1 column on mobile, 2 from `sm`, 3 from `md`; `maxWidth="lg"`.
- Images use their own `aspectRatio` when set, otherwise the gallery's `layoutConfig.aspectRatio` (default `3/2`); `auto` falls back to 3:2 ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- Feed spacing comes from `layoutConfig.padding`: `none` 0, `small` 8 px, `medium` 16 px, `large` 24 px.
- The gallery cover grid adds a per-gallery `coverSpacing` (0/8/16/24 px) inside the card cell, independent of the feed spacing ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- The featured block and the remaining galleries are separated by a centered `LUOGHI` divider: full-width, 1 px solid lines on both sides, uppercase `0.7rem` label with `0.35em` letter spacing in `text.secondary`, vertical margins 2/3 ([Decision 0023](/decisions/0023-featured-gallery-divider.md)).
- Every image is `object-fit: cover; object-position: center` ([Decision 0018](/decisions/0018-image-catalog-and-layout.md)).
- Caption is hidden by default and revealed on hover or keyboard focus.
- Reveal: a ~50% black gradient fades in and the caption slides up from below to the center.
- Caption is white, centered, with a soft text shadow.
- No permanent caption below the image; the lightbox still shows the caption.
- Equal gutters on every breakpoint; the Masonry root negative margin is neutralized so mobile photos stay centered.

## Lightbox

- Fullscreen `Dialog`, `rgba(0,0,0,0.85)` + `backdrop-filter: blur(15px)`.
- Arrows on the sides (desktop) or below (mobile).
- Esc/arrows keyboard support.
- Caption only; the EXIF placeholder was removed ([decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
- Caption typography is `body2` (0.875 rem) at 75% white since 2026-11-18, much smaller than the old `h6` ([Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)).
- Feed and lightbox photos are not draggable and their context menu is cancelled.

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
