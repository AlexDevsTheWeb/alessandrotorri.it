---
type: Reference
title: State Management
description: Zustand stores for authentication, theme, gallery administration and the image catalog.
tags: [state, zustand, auth, theme, galleries, images]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
---

# State Management

## Auth store (`src/store/authStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `isAuthReady` | `boolean` | Auth resolution finished (route guard) |
| `isLoading` | `boolean` | Auth loading flag |
| `error` | `string \| null` | Auth error message |

| Action | Description |
|--------|-------------|
| `login(email, password)` | Email/password sign-in |
| `loginWithGoogle()` | Google OAuth sign-in |
| `logout()` | Sign out and clear state |

`onAuthStateChanged` in `src/App.tsx` keeps the store in sync with Firebase.

## Theme store (`src/store/themeStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `themeMode` | `'light' \| 'dark'` | Current theme (default: `dark`) |

| Action | Description |
|--------|-------------|
| `toggleTheme()` | Switch between light and dark |

## Gallery store (`src/store/galleryStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `galleries` | `Gallery[]` | Galleries sorted by `displayOrder` |
| `status` | `'idle' \| 'loading' \| 'ready' \| 'error'` | Fetch lifecycle |
| `error` | `string \| null` | Last write/read error, shown as an alert |

| Action | Description |
|--------|-------------|
| `fetchGalleries()` | Read all galleries, sorted |
| `checkAdminAccess(uid)` | Preflight `admins/{uid}` and expose `adminStatus` |
| `createGallery(draft?)` | Create a document, refetch, return the id |
| `saveGallery(id, draft)` | Persist the gallery plus the membership diff in one batch, refetch |
| `deleteGallery(id)` | Delete the document, detach it from catalog images, drop it locally |
| `reorderGalleries(ids)` | Optimistic order update, then batch `displayOrder = index` |

## Image store (`src/store/imageStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `images` | `CatalogImage[]` | Catalog sorted by filename |
| `status` | `'idle' \| 'loading' \| 'ready' \| 'error'` | Fetch lifecycle |
| `error` | `string \| null` | Last read/write error, shown as an alert |

| Action | Description |
|--------|-------------|
| `fetchImages()` | Read the catalog |
| `indexImage(file)` | Create the catalog document for a repository file, refetch |
| `indexImages(files)` | Index a batch, one refetch at the end |
| `saveImage(id, patch)` | Persist metadata, refetch |
| `assignToGallery(imageId, galleryId)` | Add to both indexes in one batch, refetch |

All Firestore access goes through `src/services/` (`galleries.service.ts`, `images.service.ts`, `githubImages.service.ts`); the stores never handle raw documents. The gallery and image services are also what the public hook loads lazily, which keeps Firestore out of the public entry bundle.

## Pattern

- Zustand over Redux for minimal boilerplate.
- No middleware and no persistence — the theme resets on reload.
- Theme is consumed through MUI `ThemeProvider` in `src/App.tsx`.
- Public pages do not use the gallery store: `usePublicGalleries` keeps local state and dynamically imports the gallery and image services, so the public read path never blocks first paint ([Gallery System](/concepts/gallery-system.md)).

## Related

- [Tech Stack](/concepts/tech-stack.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
