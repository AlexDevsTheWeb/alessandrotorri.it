---
type: Reference
title: Admin Dashboard
description: Gallery CRUD, ordering, the image catalog with GitHub discovery, cover designation and layout controls in the protected administrator section.
tags: [admin, dashboard, galleries, images, catalog, github, firestore, drag-and-drop]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-17T00:00:00Z }
sources:
  - id: raw-admin-galleries-v2
    resource: ../../raw/2026-11-17-admin-galleries-v2.md
    title: Admin galleries v2 — image catalog, GitHub sync and layout system (raw, immutable)
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
  - id: decision-0019
    resource: /decisions/0019-admin-image-preview-fallback.md
    title: Admin previews fall back to the GitHub raw URL
  - id: decision-0020
    resource: /decisions/0020-gallery-detach-and-public-cache.md
    title: Detach images directly and cache public gallery reads
  - id: decision-0021
    resource: /decisions/0021-visibility-and-empty-galleries.md
    title: Hide empty galleries and add visibility flags for galleries and images
  - id: decision-0022
    resource: /decisions/0022-cover-spacing-and-photo-ratios.md
    title: Pick the cover from the gallery, split photo and gallery spacing, and let photo ratios drive the feed
  - id: decision-0024
    resource: /decisions/0024-featured-layout-logotype-admin-cleanup.md
    title: Compact featured layout, serif logotype and one gallery edit path
---

# Admin Dashboard

> [!NOTE] Protected
> Every admin route sits under `ProtectedRoute` in `src/App.tsx`. Signed-out visitors are redirected to `/login`. Data access is gated by `firestore.rules`, which allows writes only for UIDs in `admins/{uid}` ([decision 0014](/decisions/0014-admin-route-protection.md), [decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Routes

- `/admin` — `AdminDashboard`: gallery list, create dialog, delete confirmation. Editing an existing gallery happens only on its detail page; the old pen dialog was removed ([Decision 0024](/decisions/0024-featured-layout-logotype-admin-cleanup.md)).
- `/admin/images` — `AdminImagesPage`: the image catalog, GitHub discovery, filters, inline edits, gallery assignment and the quick gallery modal.
- `/admin/gallery/:galleryId` — `AdminGalleryDetailPage`: the single edit surface — gallery fields, cover select, featured/visibility, layout, photo and gallery spacing, catalog image assignment and ordering.

`AdminNav` gives the two sections plus "Vedi sito" and "Esci" on every admin page.

## Data model

Two public-read collections: `images` (the master catalog) and `galleries` (ordered `imageIds`, cover and layout). Image bytes live in `public/galleries/`; the admin records paths, not bytes ([Photo Management](/concepts/photo-management.md), [Decision 0018](/decisions/0018-image-catalog-and-layout.md)).

## AdminDashboard page

- `useGalleryStore` fetches all galleries once on mount, ordered by `displayOrder`.
- `GalleryList` renders the sortable list: cover thumbnail, name, a "In evidenza" chip, a "Nascosta" chip for hidden galleries, slug, image count, order, "Gestisci" and delete. There is no edit dialog.
- Drag-and-drop calls `reorderGalleries`, which writes `displayOrder = index` for every gallery in one batch; the numeric field stays editable in the dialog.
- "Nuova galleria" opens a dialog with `GalleryFields` to create the document and then navigates to the detail page, which is the only editor ([Decision 0024](/decisions/0024-featured-layout-logotype-admin-cleanup.md)).
- Delete asks for confirmation, deletes the document and detaches it from the catalog images.

## AdminImagesPage

- `useImageStore` reads the catalog; the page scans `public/galleries/` through the GitHub contents API on mount (`VITE_GITHUB_REPO`, `VITE_GITHUB_BRANCH`, default `development`) and merges repository files with catalog documents by filename.
- Filters: **Tutte**, **Nuove / non indicizzate**, **Senza titolo**, **Senza descrizione**, **Non assegnate**, each with a live count, plus a text search.
- Unindexed repository files show a preview and an "Indicizza" action; "Indicizza tutte" creates the missing documents in one pass.
- Previews try the served `/galleries/<file>` first and fall back to the GitHub raw URL, so a file that is on GitHub but not in the checkout still shows ([Decision 0019](/decisions/0019-admin-image-preview-fallback.md)).
- Indexed cards edit `title`, `description`, `alt`, `aspectRatio` and `isVisible` inline and save per card; hidden photos show a "Nascosta" chip.
- The card preview follows the selected image ratio (3:2 for `Naturale`). The photo ratio wins in the feed; the gallery ratio is the fallback, and helper text states it ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
- The assignment select adds the image to an existing gallery in one batch (both indexes); it only lists galleries the image is not already in. Assigned gallery chips have a delete action that detaches the image immediately and promotes the cover if needed ([Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md)).
- "+ Nuova galleria" opens a modal that creates the gallery and assigns the photo immediately.
- A GitHub rate limit (60 requests/hour unauthenticated) shows a warning with retry; the catalog stays usable.

## GalleryEditor (detail page)

- Local draft initialised from the loaded gallery, with a baseline snapshot for dirty tracking.
- `GalleryFields`: name, slug, description, display order, a "Visibile nel sito" switch, featured switch and `featuredOrder`, the cover select (only the gallery's own photos, plus "Nessuna (prima foto)"), layout ratio, "Spaziatura foto" and "Spaziatura galleria" selects, and a live cover preview.
- The cover select writes `coverImageId` and `coverImageUrl` together; the star in the image list is a shortcut. A stored cover that is no longer in the gallery is flagged in red and must be replaced.
- `GalleryImageList`: assigned images resolved from the catalog, drag-and-drop order, cover star, remove (applied on "Salva modifiche"), and an autocomplete to add unassigned catalog images.
- Selecting the cover writes `coverImageId` and `coverImageUrl`; removing the cover image promotes the next image.
- "Salva modifiche" validates and persists the gallery plus the membership diff in one batch. A dirty indicator disables Save when nothing changed.
- A gallery that still has the legacy embedded `images` array and no `imageIds` shows a migration warning.

## Components

| Component | Role |
|-----------|------|
| `AdminNav` | Section tabs and session actions |
| `GalleryList` | Sortable gallery list with featured/hidden badges, "Gestisci" and delete |
| `GalleryFields` | Gallery form, featured and layout controls, cover preview |
| `GalleryImageList` | Catalog assignment, cover star, ordering |
| `GalleryEditor` | Detail-page draft, validation, save and feedback |
| `ImageCatalogCard` | One catalog or repository entry: preview, metadata, assignment |
| `RepositoryImage` | Admin image preview with a one-shot GitHub raw fallback |

## Store and services

- `src/store/galleryStore.ts` — `galleries`, `status`, `error`, `adminStatus`, `fetchGalleries`, `checkAdminAccess`, `createGallery`, `saveGallery`, `deleteGallery`, `reorderGalleries`.
- `src/store/imageStore.ts` — `images`, `status`, `error`, `fetchImages`, `indexImage`, `indexImages`, `saveImage`, `assignToGallery`.
- `src/services/galleries.service.ts` — gallery documents, membership diffs, deletion cleanup and assignment.
- `src/services/images.service.ts` — catalog reads, indexing and metadata writes.
- `src/services/githubImages.service.ts` — repository discovery only; no write path.
- Admin routes are lazy, so the stores, `@hello-pangea/dnd` and the catalog UI stay out of the public entry bundle.

## Permissions diagnostics

After sign-in the admin reads `admins/{uid}` (allowed by the rules) and shows:

- a yellow **Account non abilitato alla scrittura** banner with the exact UID when the document is missing;
- a red **Permessi non verificabili** banner when even that read is denied, which means the ruleset was never deployed.

Every failed Firestore call logs `[galleries]` or `[images]` with operation, path, payload snapshot, code and message; the UI shows an Italian explanation. Full decision tree in the [Firestore permissions playbook](/rules/firestore-permissions.md) ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Known issues

- Rules are in the repository but not confirmed deployed; the preflight banner is the check ([Firebase Backend](/concepts/firebase-backend.md), issue #3).
- Drag-and-drop, the GitHub call, inline editing and bulk indexing have only been type-checked and built; no browser or live-project run was possible in this session.
- `public/galleries/` holds only the owner's first upload; the catalog stays effectively empty until the photos are committed and indexed.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Gallery System](/concepts/gallery-system.md)
- [State Management](/concepts/state-management.md)
- [Site Architecture](/concepts/site-architecture.md)
