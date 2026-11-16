---
type: Reference
title: Admin Dashboard
description: Gallery CRUD, ordering, image assignment and previews in the protected administrator section.
tags: [admin, dashboard, galleries, firestore, drag-and-drop, images]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-admin-galleries
    resource: ../../raw/2026-11-16-admin-galleries.md
    title: Admin galleries specification (raw, immutable)
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
---

# Admin Dashboard

> [!NOTE] Protected
> Both admin routes sit under `ProtectedRoute` in `src/App.tsx`. Signed-out visitors are redirected to `/login`. Data access is gated by `firestore.rules`, which allows writes only for UIDs in `admins/{uid}` ([decision 0014](/decisions/0014-admin-route-protection.md), [decision 0016](/decisions/0016-gallery-management.md)).

## Routes

- `/admin` — `AdminDashboard`: gallery list, create/edit dialogs, delete confirmation, logout.
- `/admin/gallery/:galleryId` — `AdminGalleryDetailPage`: gallery fields plus image assignment and ordering.

The previous `/admin/collection/:collectionName` route and the Storage upload screens were removed on 2026-11-16.

## Data model

One Firestore document per gallery in `galleries`; images are embedded ([Photo Management](/concepts/photo-management.md), [Decision 0016](/decisions/0016-gallery-management.md)). Image files themselves live in `public/galleries/`, so the admin records paths, not bytes.

## AdminDashboard page

- `useGalleryStore` fetches all galleries once on mount, ordered by `displayOrder`.
- `GalleryList` renders the sortable list: cover thumbnail, name, slug, image count, current order, "Gestisci", edit and delete actions.
- Drag-and-drop calls `reorderGalleries`, which writes `displayOrder = index` for every gallery in one batch. The explicit order field stays editable in the dialog.
- "Nuova galleria" opens a dialog with `GalleryFields`; the slug is derived from the name until the owner edits it, then validated for pattern and uniqueness.
- Delete asks for confirmation and removes the Firestore document only; repository files are untouched.
- Italian copy throughout, a link to the public site, and logout.

## GalleryEditor (detail page)

- Local draft initialised from the loaded gallery, with a baseline snapshot for dirty tracking.
- `GalleryFields`: name, slug (public URL hint), description, cover path with a live 4:3 preview, display order.
- `GalleryImageList`: drag-and-drop rows with a live thumbnail, path/URL, title/caption, alt text and aspect ratio, plus an "Aggiungi immagine" form with its own preview.
- "Salva modifiche" validates and persists the whole document in one write, so partial image edits cannot race. A dirty indicator disables Save when nothing changed.
- The store refetches after every write, so the list order and counts stay truthful.

## Components

| Component | Role |
|-----------|------|
| `GalleryList.component.tsx` | Sortable gallery list with actions |
| `GalleryFields.component.tsx` | Shared gallery form fields and cover preview |
| `GalleryImageList.component.tsx` | Image rows, add form, previews, drag-and-drop |
| `GalleryEditor.component.tsx` | Detail-page draft, validation, save and feedback |

## Store and service

- `src/store/galleryStore.ts` — `galleries`, `status`, `error`, `adminStatus`, `fetchGalleries`, `checkAdminAccess`, `createGallery`, `saveGallery`, `deleteGallery`, `reorderGalleries`.
- `src/services/galleries.service.ts` — the only Firestore gateway for galleries: normalization, slug helper, draft validation, reads and writes, plus the failure diagnostics.
- The admin routes are lazy, so the store and `@hello-pangea/dnd` stay out of the public entry bundle.

## Permissions diagnostics

After sign-in the dashboard reads `admins/{uid}` (allowed by the rules) and shows:

- a yellow **Account non abilitato alla scrittura** banner with the exact UID when the document is missing;
- a red **Permessi non verificabili** banner when even that read is denied, which means the ruleset was never deployed.

Every failed Firestore call logs `[galleries] <operation> failed (<code>)` with the target path and a payload snapshot, and the UI shows an Italian explanation instead of the raw Firebase message. Full decision tree in the [Firestore permissions playbook](/rules/firestore-permissions.md) ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Known issues

- Rules are in the repository but not confirmed deployed; the preflight banner is the check ([Firebase Backend](/concepts/firebase-backend.md), issue #3).
- Drag-and-drop, validation and live previews have only been type-checked and built; no browser or live-project run was possible in this session.
- Adding an image requires committing the file to `public/galleries/` and deploying. This is the intended tradeoff of [Decision 0016](/decisions/0016-gallery-management.md).

## Related

- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Gallery System](/concepts/gallery-system.md)
- [State Management](/concepts/state-management.md)
- [Site Architecture](/concepts/site-architecture.md)
