---
type: Review
title: "2026-11-16 — Admin galleries implementation report"
description: What was delivered for the dynamic gallery management change — data model, admin screens, public read, rules, removals, verification evidence and remaining work.
tags: [review, implementation, admin, galleries, firestore, verification]
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

# Admin galleries — implementation report (2026-11-16)

Source: `docs/raw/2026-11-16-admin-galleries.md`. Branch `feat/admin-galleries`, draft PR [#24](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/24), stacked on PR [#23](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23).

## 1. PR #23 assessment

- State: open draft, `MERGEABLE` / `CLEAN`, CI `verify` passed, 3 commits.
- Base: `development`. The source asked for a comparison against `main`; this repository has no `main`.
- Content: `zustand` 5.0.16 → 5.1.0, `@types/node` 24 → 22, the 2026-11-07 open-items review, the photo-storage options concept, the issue #14 source summary, and wiki index/log/plan updates.
- No pending infrastructure or admin fixes. Recommendation: merge #23 into `development` first and rebase this branch afterwards.
- Consequence: PR #24 currently lists #23's three commits because it is stacked on that branch.

## 2. Delivered

### Data model

- New `galleries` collection, one document per gallery: `name`, `slug`, `description`, `displayOrder`, `coverImageUrl`, embedded `images[]`, `createdAt`, `updatedAt`.
- Each image entry: `id`, `url`, `title`, `alt`, `ratio`, `order`.
- `slug` and `ratio` are additions to the source's field list (public route segment and CLS-safe aspect ratio).
- Types: `Gallery`, `GalleryImage`, `GalleryOrder`, `GalleryDraft`, `GalleryImageDraft`, `GalleryStatus` in `src/types/gallery.types.ts`.

### Admin

- `/admin`: gallery list with cover thumbnail, slug, image count and order; create/edit dialogs; delete confirmation; logout; Italian copy.
- Gallery ordering: drag and drop (batch write of `displayOrder = index`) plus an explicit numeric field for precise placement.
- `/admin/gallery/:galleryId`: `GalleryEditor` with a local draft, dirty tracking, validation (name, slug pattern, slug uniqueness, non-empty image URLs) and one atomic save.
- Image assignment: rows with a live thumbnail, path/URL, title/caption, alt text and ratio; drag-and-drop reordering; add form with its own preview.
- Cover and image previews resolve from `/galleries/<file>` or any full URL; missing files degrade to the theme placeholder.

### State and service

- `useGalleryStore`: `galleries`, `status`, `error`, `fetchGalleries`, `createGallery`, `saveGallery`, `deleteGallery`, `reorderGalleries`. Reorder is optimistic with rollback on failure.
- `src/services/galleries.service.ts`: the only Firestore gateway. Owns normalization, `slugify`, draft validation, reads and writes.

### Public read

- `usePublicGalleries` dynamically imports the service after mount, so Firestore stays off the critical path.
- `/` and `/gallery`: static covers paint immediately; when Firestore returns at least one gallery it replaces the list.
- `/gallery/:slug`: Firestore gallery by slug when available, static dataset otherwise; Firestore is authoritative when it has data, so deleted galleries are not resurrected.
- Unknown slug with no Firestore data waits for the query (`PageLoader`) instead of flashing "not found".
- `alt` now comes from the image entry, falling back to the caption.

### Rules and configuration

- `galleries`: public read; create/update require `isAdmin()` and a shape check (string fields, slug pattern, numeric order, list ≤ 500 images, timestamp `updatedAt`); delete requires `isAdmin()`.
- Legacy `images` rules removed; the catch-all denies the collection.
- `admins/{uid}` unchanged: readable by that user, never writable from clients.

### Removed

- `src/components/ImageUpload.tsx`, `src/components/CollectionList.tsx`, `src/pages/CollectionDetailPage.tsx`, `src/types/image.types.ts`.
- `storage.rules`, the Storage entry in `firebase.json`, and the `storage` export in `src/firebaseData.ts`.
- The unused `react-firebase-hooks` dependency (no imports remain).

### Documentation

- `IMPLEMENTATION_PLAN.md` at the repository root, as the source asks.
- Source summary, decision 0016, and updates to admin-dashboard, photo-management, firebase-backend, gallery-system, state-management, site-architecture, tech-stack, photo-storage-options, agent-rules, overview, rebuild-plan, AGENTS.md, README, all section indexes and the log.

## 3. Verification performed

| Check | Result |
|-------|--------|
| `npm run lint` | clean |
| `npm run build` | green |
| Public grid | headless Chrome on `npm run preview`: `/gallery` renders the 9 fallback covers |
| Public feed | `/gallery/01-favorite` renders the 24-photo fallback feed with captions and `srcset` |
| Bundle split | `galleries.service` emitted separately at 2.41 kB (1.11 kB gzip); Firestore stays in `firebase-data` |

## 4. Not verified

- Live Firestore reads/writes: no deployed rules or owner session in this loop.
- Rules deployment and emulator tests.
- Browser drag-and-drop and form flows inside `/admin`.
- Signed-in `/admin` rendering: headless Chrome never resolved Firebase auth, so the route stayed on `PageLoader`.

## 5. Deviations from the source

1. **`main` does not exist**; the integration branch and PR base is `development`.
2. **Public wiring was added.** The source only specified the admin; without it the admin would manage data nothing renders. Confirmed with the owner before implementation.
3. **The legacy model was replaced, not kept.** Confirmed with the owner.
4. **`slug` and `ratio` added** to the schema; `IMPLEMENTATION_PLAN.md` records why.
5. **`IMPLEMENTATION_PLAN.md` lives at the repository root** while implementation knowledge also lands in the wiki, per the owner's choice.

## 6. Risks accepted

- Public visitors download the Firestore chunk (~113 kB gzip) after first paint to read galleries; the static fallback preserves content and LCP.
- A gallery document is capped at 1 MiB; the rules cap images at 500 entries. A future subcollection migration would be a schema change.
- Adding an image requires a git commit and deploy; there is no browser upload by design.
- Deleting a gallery leaves its files in `public/galleries/`.

## 7. Follow-ups

1. Merge PR #23, then rebase PR #24.
2. Deploy `firestore.rules` and create `admins/{uid}` (issue #3).
3. Seed galleries and files, then retire the Adobe CDN fallback.
4. Re-run Lighthouse after deploy (issue #22) to confirm the Firestore chunk does not regress performance.
5. Firebase 13 remains gated on the metadata-store decision (issue #21).

## Links

- [Source summary](/sources/2026-11-16-admin-galleries.md)
- [Decision 0016](/decisions/0016-gallery-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Gallery System](/concepts/gallery-system.md)
- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Rebuild Plan](/rebuild-plan.md)
- [PR #24](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/24)
