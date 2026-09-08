---
type: Reference
title: Design System
description: MUI theme, typography, colors, spacing, and responsive design rules.
tags: [design, theme, mui, typography, colors, responsive]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Design System

## Theme Configuration

Defined in `src/style/theme.ts`. Two themes: light and dark (default: dark).

### Colors

| Token | Light | Dark |
|-------|-------|------|
| Background | `#ffffff` | `#0a0a0a` |
| Primary text | `#1a1a1a` | `#ffffff` |
| Paper | `#fafafa` | `#121212` |

### Typography

| Font | Usage | Weights |
|------|-------|---------|
| Inter | Body, buttons, menus | 300, 400, 500 |
| Playfair Display | Headings (h1-h4) | 700, 700 italic |

Loaded via Google Fonts in `index.html`.

### Shape

- `borderRadius: 0` — sharp, modern aesthetic
- No button ripple effect
- Uppercase disabled on buttons

### Navbar

- Glassmorphism: `backdrop-filter: blur(20px) saturate(180%)`
- Semi-transparent background
- Fixed position, auto-hide on scroll down, show on scroll up
- Thin divider border at bottom

## Responsive Breakpoints

Standard MUI breakpoints:
- `xs`: 0px+
- `sm`: 600px+
- `md`: 900px+
- `lg`: 1200px+
- `xl`: 1536px+

## Styling Approach

- Primary: MUI `sx` prop
- One styled component via Emotion `styled()` (BackToTopButton)
- No Tailwind, no CSS Modules, no Sass
