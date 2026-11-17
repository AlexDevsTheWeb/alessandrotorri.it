---
type: Review
title: "2026-11-17 — Image catalog and layout implementation report"
description: What was delivered for the image catalog, GitHub discovery, featured galleries and layout change — data model, admin screens, public rendering, rules, verification evidence, deviations, risks and follow-ups.
tags: [review, implementation, images, catalog, github, admin, galleries, verification]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-17T00:00:00Z }
sources:
  - id: raw-admin-galleries-v2
    resource: ../../raw/2026-11-17-admin-galleries-v2.md
    title: Admin galleries v2 — image catalog, GitHub sync and layout system (raw, immutable)
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
---

# Image catalog and layout — implementation report (2026-11-17)

Source: `docs/raw/2026-11-17-admin-galleries-v2.md`. Branch `feat/image-catalog-and-layout`, draft PR [#26](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/26), base `development`. Two commits: the feature and the wiki slice.

## 1. Delivered

### Data model

- New `images` collection: `filename`, `path`, `title`, `description`, `alt`, `aspectRatio`, `galleryIds`, `createdAt`, `updatedAt`. The document id is `slugify(filename without extension)`, so re-indexing the same file is idempotent.
- `galleries` now holds `imageIds` (ordered, authoritative), `coverImageId`, `coverImageUrl`, `isFeatured`, `featuredOrder` and `layoutConfig { aspectRatio, padding }`.
- `imageIds` and `galleryIds` are written together in one `writeBatch` on create, save, assign and delete. Deleting a gallery detaches it from every image.
- The id is not stored in the document, following the 0016 convention; this is a documented deviation from the source's field list.

### Admin

- `/admin/images` (`AdminImagesPage`): GitHub scan on mount, the five filters with counts (tutte, nuove/non indicizzate, senza titolo, senza descrizione, non assegnate), text search, inline title/description/alt/ratio editing, gallery assignment, "+ Nuova galleria" (creates and assigns), "Indicizza" and "Indicizza tutte".
- Gallery editor: `GalleryFields` adds the featured switch, `featuredOrder`, ratio and padding selects; `GalleryImageList` resolves assigned images from the catalog, supports drag-and-drop ordering, the cover star, removal with automatic cover promotion, and an autocomplete to add unassigned catalog images.
- `AdminNav` links Gallerie, Immagini, Vedi sito and Esci on every admin page.
- Legacy galleries with an embedded `images` array and no `imageIds` show a migration warning and keep rendering publicly.

### Discovery

- `src/services/githubImages.service.ts` calls `GET /repos/{repo}/contents/public/galleries?ref={branch}` unauthenticated, filters the supported extensions, and maps filenames to ids and `/galleries/...` paths.
- Defaults: `AlexDevsTheWeb/alessandrotorri.it` and `development`, overridable with `VITE_GITHUB_REPO` / `VITE_GITHUB_BRANCH`. No token is bundled.
- 404 means an empty or missing directory and renders as an empty list; 403/429 shows a retry warning without breaking the catalog.

### Public

- Homepage and `/gallery`: featured galleries render full-width (`sm: 12`) first, ordered by `featuredOrder`; the rest keep the two-column grid.
- Covers use `layoutConfig.aspectRatio` (static fallback keeps 4:3).
- `/gallery/:slug`: the feed crops by `layoutConfig.aspectRatio` and spaces by `layoutConfig.padding` (0/8/16/24 px); `auto` uses each image's own ratio.
- `ProgressiveImage` enforces `object-fit: cover; object-position: center`.
- `usePublicGalleries` joins `galleries.imageIds` with the catalog; a failed catalog read still renders galleries, and a failed gallery read falls back to the static dataset.

### Rules

- `images`: public read; create/update require `isAdmin()` and `isValidImage()` (strings, allowed `aspectRatio`, `galleryIds` list ≤ 100, timestamp `updatedAt`); delete requires `isAdmin()`.
- `galleries`: `isValidGallery()` extended with `isFeatured` (bool), `featuredOrder` (number), `coverImageId`/`coverImageUrl` (strings), `imageIds` list ≤ 500, and the `layoutConfig` enums.

### Documentation

- `IMPLEMENTATION_PLAN.md` rewritten for this source.
- Source summary, [decision 0018](/decisions/0018-image-catalog-and-layout.md), and updates to [Photo Management](/concepts/photo-management.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Firebase Backend](/concepts/firebase-backend.md), [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [State Management](/concepts/state-management.md), [Site Architecture](/concepts/site-architecture.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) (phase 7), AGENTS.md, README, `.env.example`, the indexes and the log.

## 2. Verification performed

| Check | Result |
|-------|--------|
| `npm run lint` | clean |
| `npm run build` | green |
| Public covers | headless Chrome on `npm run preview`: `/` and `/gallery` render 9 covers with all 9 titles |
| Public feed | `/gallery/01-favorite` renders the 24 fallback photos with captions (e.g. `Eilean Donan Castle - Scozia`, `Dolomiti di Brenta`, `Lago di Braies`, `Vernazza`) |
| Bundle split | admin stays lazy: `AdminImagesPage` 11.41 kB (4.14 gzip), `AdminDashboard` 6.59 kB, `AdminGalleryDetailPage` 7.18 kB; `images.service` 2.09 kB; no chunk over 500 kB |
| Types | `tsc -b` passes with the new `Gallery`, `PublicGallery`, `CatalogImage` and filter types |

There is no automated test suite in the repository; the checks above are the lint/build and a headless render of the public pages.

## 3. Not verified

- Live Firestore reads/writes for `images` and `galleries`: no deployed rules or owner session in this loop.
- The new `images` rules and the extended gallery validation in the emulator; 2026-11-16 validated the previous gallery payload only.
- The GitHub request against real files: `public/galleries/` is currently empty, so the scan returns 404 by design.
- Browser flows inside `/admin` (indexing, inline edits, assignment, drag-and-drop, cover, featured, layout); headless Chrome cannot resolve Firebase auth.
- Featured full-width rendering and the layout config with real Firestore data, because no galleries are seeded.

## 4. Deviations from the source

1. **`main` / Vite 7 / MUI 7** in the source; the repository uses `development`, Vite 8 and MUI 9 ([decisions 0015 and 0006](/decisions/index.md)).
2. **The catalog replaces, not duplicates, the embedded images** of decision 0016; [decision 0018](/decisions/0018-image-catalog-and-layout.md) records the supersession.
3. **`id` is not stored** in `images` or `galleries`; the Firestore document id is mapped explicitly, as in 0016.
4. **`layoutConfig` applies to the cover and the gallery feed**, not to the shared grid gap; a per-item gap is not possible in one grid. The feed gap follows the source's 0/8/16/24 px options.
5. **The cover ratio default is `3/2`** as the source says, superseding the fixed 4:3 of decision 0012 for Firestore galleries.
6. **Bulk metadata editing** is per-card quick edit plus bulk indexing; the source's "batch & quick edit" is satisfied for indexing and inline edits, not for multi-select metadata edits.
7. **No delete for catalog images** in the UI; the owner can remove a document in the console. The source did not ask for it.

## 5. Risks accepted

- The public read is now two queries (galleries + catalog) after mount, inside the lazy chunk. The static fallback preserves first paint and content.
- Two membership indexes (`imageIds`, `galleryIds`) are denormalized; every mutation must go through `galleries.service.ts`. A manual console edit can drift them.
- `coverImageUrl` is denormalized from the catalog path; renaming a file requires re-designating the cover.
- GitHub discovery is unauthenticated (60 requests/hour per IP) and manual; there is no scheduled sync.
- Legacy documents in the retired `images` collection are publicly readable (the 0016 catch-all no longer covers the collection) but ignored by the client because they lack `filename`/`path`.
- The rules cap `imageIds` at 500 and `galleryIds` at 100; galleries are far smaller in practice.

## 6. Follow-ups

1. **Deploy `firestore.rules` and create `admins/{uid}` (issue #3).** Without both, every admin write is denied: the rule set must exist in the project, and the signed-in UID must have a document in `admins`. The admin preflight banner and the structured logs name the missing step; the [playbook](/rules/firestore-permissions.md) has the decision tree.
2. Replay `isValidImage()` and the extended `isValidGallery()` in the Firestore emulator, then smoke-test as the owner and as a second account (expect denial).
3. Commit photos to `public/galleries/`, index them from `/admin/images`, assign galleries and choose covers.
4. Retire the Adobe CDN fallback once the Firestore galleries cover the nine collections.
5. Browser check of featured full-width covers and each layout ratio/padding combination.
6. Optional: catalog delete action, responsive variants for repository images, and a scheduled discovery job if manual indexing becomes tedious.

## Links

- [Source summary](/sources/2026-11-17-admin-galleries-v2.md)
- [Decision 0018](/decisions/0018-image-catalog-and-layout.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Photo Management](/concepts/photo-management.md)
- [Gallery System](/concepts/gallery-system.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Firestore permissions playbook](/rules/firestore-permissions.md)
- [Rebuild Plan](/rebuild-plan.md)
- [PR #26](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/26)
