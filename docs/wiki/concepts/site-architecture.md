---
type: Architecture
title: Site Architecture
description: Routing, layout shell, and directory structure for the photography portfolio.
tags: [architecture, routing, pages, layout]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
---

# Site Architecture

Single-page React app with client-side routing. Public pages render inside one shared shell; the administrator area reuses the same shell.

## Routing

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/` | `HomePage` | Public | Entry; becomes the cover grid (same content as `/gallery`) |
| `/gallery` | `GalleryPage` | Public | 9 collection covers |
| `/gallery/:collectionName` | `CollectionPage` | Public | Single-collection feed + lightbox |
| `/login` | `LoginPage` | Public | Google sign-in |
| `/admin` | `AdminDashboard` | **Should be protected** | Upload + manage collections |
| `/admin/collection/:collectionName` | `CollectionDetailPage` | **Should be protected** | DnD reorder + edit metadata |

> [!WARNING] Admin routes are currently reachable without authentication
> `ProtectedRoute` exists but is commented out in `src/App.tsx`. Tracked in issue #3. Do not add new admin routes until this is fixed.

There is **no** `/about`, `/projects`, or `/contact` route. Old links to those pages were removed from the navbar; do not reintroduce them without a decision.

## Layout shell

All routes render inside `SharedLayout`:

- `Navbar` — fixed, glassmorphism, auto-hide on scroll down, triptych: `Gallerie` / `Alessandro Torri` / Instagram + YouTube + theme toggle.
- `<Outlet />` — page content.
- `Footer` — back-to-top, social icons, copyright.
- `BacktoTopButton` — appears after 400px of scroll.

See [Design System](/concepts/design-system.md).

## Directory structure

```text
src/
  components/     # Reusable UI (PhotoGallery, ProgressiveImage, ImageUpload, ...)
  data/           # Static CDN content for the current rebuild phase
  layout/         # Shell components (Navbar, Footer, SharedLayout)
  pages/          # Route-level components
  store/          # Zustand stores (auth, theme)
  style/          # MUI theme definition
  types/          # TypeScript interfaces (*.types.ts)
  firebase.ts     # Firebase init
```

Agent and knowledge files live outside `src/`: `AGENTS.md`, `.agents/skills/`, `docs/wiki/` (bundle), and `docs/raw/` (immutable sources).

## Related

- [Tech Stack](/concepts/tech-stack.md)
- [Gallery System](/concepts/gallery-system.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Rebuild Plan](/rebuild-plan.md)
