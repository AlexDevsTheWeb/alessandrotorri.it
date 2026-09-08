---
type: Architecture
title: Site Architecture
description: Overall project structure, routing, and page layout for the photography portfolio.
tags: [architecture, routing, pages, layout]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Site Architecture

Personal photography portfolio for Alessandro Torri, focused on long exposure photography. Single-page React app with client-side routing.

## Routing

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/` | `HomePage` | Public | Hero + featured work |
| `/gallery` | `GalleryPage` | Public | Browse all collections |
| `/gallery/:collectionName` | `CollectionPage` | Public | Images in a collection |
| `/about` | `AboutPage` | Public | Bio, gear, contact |
| `/login` | `LoginPage` | Public | Admin Google sign-in |
| `/admin` | `AdminDashboard` | Protected | Upload + manage collections |
| `/admin/collection/:name` | `CollectionDetailPage` | Protected | DnD reorder, edit metadata |

## Layout Shell

All public routes render inside `SharedLayout`:
- `Navbar` (fixed, glassmorphism, auto-hide on scroll)
- `<Outlet />` (page content)
- `Footer` (copyright + Instagram)
- `BackToTopButton` (appears after 400px scroll)

See [Design System](/concepts/design-system.md) for visual conventions.

## Directory Structure

```
src/
  components/     # Reusable UI (PhotoGallery, ProgressiveImage, ImageUpload)
  layout/         # Shell components (Navbar, Footer, SharedLayout)
  pages/          # Route-level components
  store/          # Zustand stores (auth, theme)
  style/          # MUI theme definition
  types/          # TypeScript interfaces
```
