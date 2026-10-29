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
---

# Design System

The live site is the visual reference. The implementation is modern, but the layout, type hierarchy, spacing, and interaction model must match. See [Decision 0003](/decisions/0003-exact-look-and-feel.md).

## Theme configuration

Defined in `src/style/theme.ts`. Two themes: light and dark. Default is **dark** (`themeStore`).

### Colors

| Token | Light | Dark |
|-------|-------|------|
| Background | `#ffffff` | `#0a0a0a` |
| Primary text | `#1a1a1a` | `#ffffff` |
| Paper | `#fafafa` | `#121212` |

The live site is a white editorial theme; dark mode is an addition, not a replacement.

### Typography

| Font | Usage | Weights |
|------|-------|---------|
| Inter | Body, buttons, menus | 300, 400, 500 |
| Playfair Display | Headings (h1–h4) | 700, 700 italic |

Loaded via Google Fonts in `index.html`.

### Shape

- `borderRadius: 0` — sharp, editorial.
- No button ripple.
- Buttons are not automatically uppercase; nav links are explicitly uppercase.

## Navbar

- Glassmorphism: `backdrop-filter: blur(20px) saturate(180%)`.
- Semi-transparent background (`alpha(bg, 0.7)`).
- Fixed; hides on scroll down and reveals on scroll up.
- Triptych: `Gallerie` left, `Alessandro Torri` center, Instagram + YouTube + theme toggle right.
- Uppercase links at `0.75rem / 0.2em`, opacity hover, no ripple.

## Covers

- 16:9, `overflow: hidden`.
- Hover: `scale(1.05–1.08)` and `brightness(0.65)`.
- Title centered below or overlaying with a bottom gradient.

## Collection feed

- `maxWidth` ~900px, centered single column.
- Spacing 4–6 between images.
- Caption `body2`, secondary color, centered.

## Lightbox

- Fullscreen `Dialog`, `rgba(0,0,0,0.85)` + `backdrop-filter: blur(15px)`.
- Arrows on the sides (desktop) or below (mobile).
- Esc/arrows keyboard support.
- Caption plus an EXIF placeholder line until real metadata exists.

## Footer

- Transparent, top divider.
- `© {year} Alessandro Torri` centered.
- Instagram + YouTube icons.
- Centered back-to-top control.

## Responsive breakpoints

Standard MUI: `xs 0`, `sm 600`, `md 900`, `lg 1200`, `xl 1536`.

## Styling approach

- Primary: MUI `sx`.
- One-off custom styles: Emotion `styled()` (e.g. navbar, back-to-top).
- No Tailwind, CSS Modules, or Sass.

## Related

- [Site Architecture](/concepts/site-architecture.md)
- [Gallery System](/concepts/gallery-system.md)
- [Code Style](/rules/code-style.md)
