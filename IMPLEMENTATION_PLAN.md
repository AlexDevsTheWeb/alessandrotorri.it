# Implementation Plan — PR #23 review and dynamic gallery management

Source: [`docs/raw/2026-11-16-admin-galleries.md`](docs/raw/2026-11-16-admin-galleries.md)
Branch: `feat/admin-galleries` (stacked on `docs/open-items-review`, PR #23)
Date: 2026-11-16

## 1. Preliminary task — PR #23 assessment

| Item | Finding |
|------|---------|
| PR | [#23](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23) — `docs: open items review, library updates and backend options` |
| State | Open, **draft**, `mergeStateStatus: CLEAN`, CI `verify` **passed** |
| Base | `development` — the repository has **no `main` branch**; `development` is the default and the target of every previous PR |
| Head | `docs/open-items-review`, 3 commits |
| Diff | `zustand` 5.0.16 → 5.1.0 and `@types/node` 24 → 22 (package.json + lockfile), the 2026-11-07 open-items review, the photo-storage options concept, source summary for issue #14, and wiki index/log/plan updates |
| Pending infra | None. It carries no Firestore rules, hosting or admin changes |
| Recommendation | **Merge #23 into `development` first**, then rebase this branch onto `development`. It is a small docs + dependency slice, already green. Until it merges, this branch is stacked on it to avoid conflicts in the wiki files that both branches touch |

Contradiction with the raw source: it asks to compare PR #23 against `main`. No `main` exists; `development` is the integration branch ([Git Conventions](/docs/wiki/rules/git-conventions.md), [Decision 0004](/docs/wiki/decisions/0004-wiki-layout.md)).

## 2. Scope

In scope:

1. Replace the Firebase Storage upload admin with gallery management backed by Firestore (`galleries` collection) and static repository assets under `public/galleries/`.
2. Gallery CRUD: create, edit, delete, reorder (drag and drop plus explicit `displayOrder`).
3. Image assignment inside a gallery: static path, title/caption, alt text, aspect ratio, live thumbnail, drag-and-drop ordering.
4. Zustand store (`useGalleryStore`) for admin state and writes.
5. Public read path: `/` and `/gallery` render Firestore galleries, falling back to the existing static CDN dataset when Firestore is empty or unreachable; `/gallery/:slug` renders the gallery images with the same fallback.
6. Firestore security rules: public read of `galleries`, admin-only writes via the existing `admins/{uid}` allowlist.
7. Removal of the legacy `images`/Storage admin code and rules.
8. Wiki update, decision record and draft PR.

Out of scope:

- Uploading binaries from the browser. Images are committed to `public/galleries/` and deployed by the static host; the admin references their web paths.
- Migrating the existing 89 CDN photos into `public/galleries/`.
- `@hello-pangea/dnd` alternatives, new dependencies, Tailwind/CSS modules.
- Deploying the rules (owner action, tracked in issue #3).

## 3. Architecture

### 3.1 Storage strategy

Images live in `public/galleries/`, are served from the site origin (`/galleries/<file>.webp`) and deployed with the existing hosting pipeline. Firestore stores only metadata and the web path. This removes Firebase Storage from the runtime path and its egress/space limits, which is the cost goal of the raw source.

### 3.2 Firestore schema

Collection `galleries`, one document per gallery:

```ts
interface Gallery {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  coverImageUrl: string;
  images: GalleryImage[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  alt: string;
  ratio: string;
  order: number;
}
```

Design notes:

- `slug` is added to the raw source's field list because the public route is `/gallery/:slug`; it is the stable URL segment and must be unique.
- `images` is an embedded array so a gallery and its ordering are one atomic document. Firestore caps a document at 1 MiB; the rules cap the array at 500 entries, which is far above the real gallery size.
- `ratio` is added so the public Masonry feed can reserve space before the image loads (avoids CLS). Default `3/2`.
- `order` mirrors the array index and is normalized on every save; the array order is authoritative.

### 3.3 Security rules

```
match /galleries/{galleryId} {
  allow read: if true;
  allow write: if isAdmin() && isValidGallery();
}
```

`isValidGallery()` checks field types, slug shape and the image-list cap. The legacy `images` match block is removed, so the catch-all denies it. `storage.rules` and the Storage client are removed because nothing uploads to the bucket anymore.

### 3.4 State management

- `src/store/galleryStore.ts` — Zustand store: `galleries`, `isLoading`, `error`, `fetchGalleries`, `createGallery`, `saveGallery`, `deleteGallery`, `reorderGalleries`.
- `src/services/galleries.service.ts` — the only module that touches Firestore for galleries; pure `normalizeGallery` / draft helpers live next to it.
- `src/hooks/usePublicGalleries.ts` — public read hook. It **dynamically imports** the service after mount, so Firestore stays out of the public critical-path bundle and the current `firebase-data` split is preserved. It never blocks first paint: the static dataset renders immediately and Firestore overrides it once loaded when it has galleries.

## 4. Component hierarchy and file plan

### New files

| File | Role |
|------|------|
| `src/types/gallery.types.ts` | `Gallery`, `GalleryImage`, `GalleryOrder`, `GalleryDraft`, `GalleryImageDraft` |
| `src/services/galleries.service.ts` | Firestore reads/writes, normalization, slug helpers |
| `src/store/galleryStore.ts` | Zustand gallery store |
| `src/hooks/usePublicGalleries.ts` | Public read hook with static fallback semantics |
| `src/data/galleries.mapper.ts` | `Gallery` → `CollectionCover` and → `CollectionPhoto` mapping for the public pages |
| `src/components/GalleryFields.component.tsx` | Shared form fields (name, slug, description, cover path + preview, display order) |
| `src/components/GalleryList.component.tsx` | Sortable gallery list with edit/delete/open actions |
| `src/components/GalleryImageList.component.tsx` | Sortable image rows with live preview, URL/title/alt/ratio inputs, add row |
| `src/components/GalleryEditor.component.tsx` | Detail-page editor: fields + images + dirty tracking + save |
| `src/pages/AdminGalleryDetailPage.tsx` | `/admin/gallery/:galleryId` page shell |
| `docs/wiki/sources/2026-11-16-admin-galleries.md` | Source summary |
| `docs/wiki/decisions/0016-gallery-management.md` | Decision record |
| `IMPLEMENTATION_PLAN.md` | This document |

### Modified files

| File | Change |
|------|--------|
| `src/pages/AdminDashboard.tsx` | Gallery list, create dialog, delete confirmation, logout; Italian copy |
| `src/App.tsx` | `/admin/gallery/:galleryId` under `ProtectedRoute`; drop the collection route |
| `docs/wiki/concepts/admin-dashboard.md` | Rewritten for the gallery model (the existing page was updated instead of adding a near-duplicate) |
| `src/components/CollectionGrid.component.tsx` | Accepts a `collections` prop, defaults to the static dataset |
| `src/pages/GalleryPage.tsx`, `src/pages/HomePage.tsx` | Merge Firestore covers over the static covers |
| `src/pages/CollectionPage.tsx` | Firestore gallery by slug, static fallback, alt text from the image entry |
| `src/components/PhotoLightbox.component.tsx` | `alt` falls back to the caption |
| `src/data/collections.data.ts` | `placeholder` optional, `alt` optional on `CollectionPhoto` |
| `firestore.rules` | `galleries` block, validation, legacy `images` block removed |
| `firebase.json` | Storage rules entry removed |
| `src/firebaseData.ts` | `storage` export removed |
| `docs/wiki/*`, `AGENTS.md` | Status, concepts, decision, source, log, indexes |

### Deleted files

`src/components/ImageUpload.tsx`, `src/components/CollectionList.tsx`, `src/pages/CollectionDetailPage.tsx`, `src/types/image.types.ts`, `storage.rules`.

## 5. Flows

### Create a gallery

Dashboard → "Nuova galleria" opens a dialog with `GalleryFields`. The slug is derived from the name until the owner edits it. Validation: name, slug (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) and uniqueness against the loaded galleries. Save writes the document with `createdAt`/`updatedAt` server timestamps and `displayOrder` (default: list length), then refetches.

### Reorder galleries

Dashboard drag-and-drop reorders the local list, then writes `displayOrder = index` for every gallery in a single batch. The explicit `displayOrder` field stays editable in the dialog.

### Edit images

Detail page → `GalleryEditor` holds a local draft. Each image row shows a thumbnail that updates as the URL changes. Drag-and-drop reorders the array and renumbers `order`. Add/remove mutate the draft. "Salva" persists the whole document in one write, so partial image edits never race. A dirty indicator disables Save when nothing changed.

### Public rendering

- Grid: static covers paint immediately; when Firestore returns at least one gallery it replaces the list (sorted by `displayOrder`).
- Collection: gallery found by slug; unknown slug with Firestore data present → "Collezione non trovata" (Firestore is authoritative). If Firestore is empty or fails → the static dataset is used.
- Feed: `GalleryImage` → `CollectionPhoto` (`src = url`, `caption = title || alt`, `alt = alt || title`, `ratio`).

## 6. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Firestore document size (1 MiB) | 500-image rule cap; galleries are small; documented |
| Public bundle growth from Firestore | Public hook dynamically imports the service; admin code stays in lazy admin chunks |
| Empty images in `public/galleries/` | Public feed renders the theme placeholder box; no broken layout |
| Duplicate slugs | Create/edit validation against the loaded list plus the documented convention |
| Legacy `images` docs | No longer read or written; the catch-all denies access. Data deletion is the owner's call, documented in the decision |
| Rules not deployed | Owner deploy step in the PR checklist (issue #3) |
| Static CDN fallback hides a Firestore outage | Intentional: the public site must never go blank; the admin still writes to Firestore when authenticated |

## 7. Verification

```bash
npm run lint
npm run build
# manual: npm run dev → / , /gallery , /gallery/<slug> , /admin , /admin/gallery/<id>
```

Checks: static pages still render with no Firestore data; signed-out `/admin` redirects; gallery CRUD, reorder, image preview and save work against a live project; 390 px layout for the admin rows.

## 8. Execution outcome

Delivered on `feat/admin-galleries`:

- **PR #23** was reviewed only. It remains a draft against `development`; this branch is stacked on it.
- **Admin**: gallery CRUD, ordering (drag and drop plus a numeric field), image rows with live previews and per-image title/alt/ratio, drag-and-drop image ordering, single-write save with dirty tracking, validation for name/slug/uniqueness/empty URLs, Italian copy.
- **Model**: Firestore `galleries` with embedded `images`; `Gallery`, `GalleryImage`, `GalleryOrder`, `GalleryDraft` types; `galleries.service.ts` gateway; `useGalleryStore`.
- **Public**: `usePublicGalleries` loads the service lazily after mount; `/` and `/gallery` render static covers first and swap to Firestore galleries when present; `/gallery/:slug` prefers the Firestore gallery and falls back to the static dataset; alt text comes from the image entry.
- **Removed**: `ImageUpload`, `CollectionList`, `CollectionDetailPage`, `IImage`, `storage.rules`, the Storage client export, the storage block in `firebase.json`, and the unused `react-firebase-hooks` dependency.
- **Rules**: `galleries` public read, validated admin writes, admins allowlist unchanged; legacy `images` denied.
- **Wiki**: source summary, decision 0016, rewritten admin/photo/Firebase/gallery/state/architecture pages, tech stack, agent rules, overview, rebuild plan, AGENTS, README, indexes and log.

Verification: `npm run lint` clean; `npm run build` green. The gallery service is emitted as a separate 2.41 kB chunk. Not verified in this session: live Firestore reads/writes, rules deployment, and browser drag-and-drop; they need `.env` credentials and a deployed ruleset (PR checklist, issue #3).

Risk accepted: public visitors download the Firestore chunk (about 113 kB gzip) after first paint to read galleries. The static fallback keeps LCP and content intact; if deployed Lighthouse regresses, the follow-up is a REST read or prerendered gallery data.

See the PR and [the wiki source summary](/docs/wiki/sources/2026-11-16-admin-galleries.md).
