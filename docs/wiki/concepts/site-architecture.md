---
type: Architecture
title: Site Architecture
description: Routing, layout shell, and directory structure for the photography portfolio.
tags: [architecture, routing, pages, layout, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
---

# Site Architecture

Single-page React app with client-side routing. Public pages render inside one shared shell; the administrator area reuses the same shell.

## Routing

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/` | `HomePage` | Public | Entry; renders the same cover grid as `/gallery` (decision 0007) |
| `/gallery` | `GalleryPage` | Public | Gallery covers (Firestore, static fallback) |
| `/gallery/:collectionName` | `CollectionPage` | Public | Single-gallery feed + lightbox (Firestore, static fallback) |
| `/login` | `LoginPage` | Public | Google sign-in |
| `/admin` | `AdminDashboard` | Protected | Gallery list, create/edit/delete, ordering |
| `/admin/images` | `AdminImagesPage` | Protected | Image catalog, GitHub discovery, metadata, assignment |
| `/admin/gallery/:galleryId` | `AdminGalleryDetailPage` | Protected | Gallery fields, featured/layout, image assignment and ordering |

> [!NOTE] Admin protection
> `/admin`, `/admin/images` and `/admin/gallery/:id` sit under `ProtectedRoute` in `src/App.tsx` ([decision 0014](/decisions/0014-admin-route-protection.md)). New admin routes must be added inside the same layout route.

There is **no** `/about`, `/projects`, or `/contact` route. Old links to those pages were removed from the navbar; do not reintroduce them without a decision.

## Layout shell

All routes render inside `SharedLayout`:

- `Navbar` — fixed, glassmorphism, auto-hide on scroll down. Desktop: `Gallerie / {collection}` breadcrumb / `Alessandro Torri` / Instagram + YouTube + theme toggle. Mobile: menu + centered logo; socials and theme toggle live in the blurred drawer; no breadcrumb.
- `<Outlet />` — page content, wrapped in `ErrorBoundary` + `Suspense` with a `PageLoader` fallback.
- `Footer` — compact single row with copyright and social icons; icons hidden on mobile, no top border.
- `BacktoTopButton` — floating transparent icon after 400px of scroll, with no visible text.

Public pages except `HomePage` are lazy-loaded. `HomePage`, `GalleryPage`, `CollectionPage`, `LoginPage`, `AdminDashboard`, `AdminImagesPage` and `AdminGalleryDetailPage` are route chunks; see [Decision 0011](/decisions/0011-seo-and-route-loading.md).

See [Design System](/concepts/design-system.md).

## Directory structure

```text
src/
  components/     # Reusable UI (PhotoLightbox, gallery admin forms, ErrorBoundary, ...)
  data/           # Static fallback content and Firestore-to-public mappers
  hooks/          # usePageMeta, usePublicGalleries
  layout/         # Shell components (Navbar, Footer, SharedLayout)
  pages/          # Route-level components (mostly lazy-loaded)
  services/       # Firestore gateways (galleries, images) and GitHub discovery
  store/          # Zustand stores (auth, theme, galleries, images)
  style/          # MUI theme definition
  types/          # TypeScript interfaces (*.types.ts)
  firebase.ts     # Firebase app + auth
  firebaseData.ts # Firestore handle
public/
  galleries/      # Static image assets referenced by Firestore galleries
```

Agent and knowledge files live outside `src/`: `AGENTS.md`, `.agents/skills/`, `docs/wiki/` (bundle), and `docs/raw/` (immutable sources).

## Related

- [Tech Stack](/concepts/tech-stack.md)
- [Gallery System](/concepts/gallery-system.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Rebuild Plan](/rebuild-plan.md)
