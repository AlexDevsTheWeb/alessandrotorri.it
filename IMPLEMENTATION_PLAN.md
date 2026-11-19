# Implementation Plan — Image catalog, GitHub discovery, featured galleries and layout controls

Source: [`docs/raw/2026-11-17-admin-galleries-v2.md`](docs/raw/2026-11-17-admin-galleries-v2.md)
Branch: `feat/image-catalog-and-layout`
Date: 2026-11-17

## 1. Analysis

The source expands the gallery admin delivered on 2026-11-16 into a photo-first workflow:

1. a master `images` catalog in Firestore, indexed by filename;
2. GitHub REST discovery of the files already committed to `public/galleries/`, so unindexed photos are visible in the admin;
3. a dedicated `/admin/images` screen with completeness filters, inline edits and gallery assignment;
4. cover designation from the gallery's own images;
5. featured galleries pinned full-width at the top of the homepage;
6. per-gallery layout config (aspect ratio, grid padding) and strict `object-fit: cover` rendering;
7. Firestore rules for `images` and the new gallery fields.

### Contradictions and resolutions

| Contradiction | Resolution |
|---------------|------------|
| [Decision 0016](/docs/wiki/decisions/0016-gallery-management.md) rejected a separate `images` collection and chose embedded images. | The new source asks for a reusable catalog with `galleryIds`. [Decision 0018](/docs/wiki/decisions/0018-image-catalog-and-layout.md) adopts the catalog and supersedes the embedded-image parts of 0016. Galleries keep an ordered `imageIds` array; image metadata lives once in `images`. |
| [Decision 0012](/docs/wiki/decisions/0012-gallery-hover-titles-and-copy-guard.md) locked 4:3 covers. | Covers now use the gallery's `layoutConfig.aspectRatio` (default `3/2`, as the source specifies). The static fallback dataset keeps 4:3. |
| The source repeats "React 19, Vite 7, MUI v7"; the repository runs Vite 8, MUI 9. | Follow the repository ([Tech Stack](/docs/wiki/concepts/tech-stack.md), decisions 0006 and 0015). |
| The source says gallery documents carry `id`. | The codebase maps the Firestore document id explicitly and never stores it (decision 0016, [Photo Management](/docs/wiki/concepts/photo-management.md)). Kept as-is. Same for `images`. |

### Requirements and acceptance criteria

- `images/{imageId}` documents: `filename`, `path`, `title`, `description`, `alt`, `aspectRatio`, `galleryIds`, timestamps. Document id derived from the sanitized filename so GitHub sync is idempotent.
- `galleries` documents: the previous fields plus `isFeatured`, `featuredOrder`, `coverImageId`, `imageIds`, `layoutConfig { aspectRatio, padding }`.
- `/admin/images` (protected): filters *Tutte*, *Nuove / non indicizzate*, *Senza titolo*, *Senza descrizione*, *Non assegnate*; inline title/description/alt editing; gallery assignment; "+ Nuova galleria" quick modal.
- GitHub discovery of `GET /repos/AlexDevsTheWeb/alessandrotorri.it/contents/public/galleries`, cross-referenced with the catalog.
- Gallery editor: assign catalog images, reorder, remove, set the cover, toggle featured, set the layout config.
- Homepage: featured galleries first, full width; the rest in the standard two-column grid.
- `/gallery/:slug`: the layout config drives the feed ratio and spacing; every image uses `object-fit: cover; object-position: center`.
- `firestore.rules`: public read and admin-only validated writes for `images`; the new gallery fields validated.
- Lint and build green; wiki, decision and log updated; draft PR against `development`.

Out of scope: browser uploads (files stay in `public/galleries/`), migrating the CDN photos, authenticated GitHub calls, new dependencies.

## 2. Data model

```ts
// images/{imageId}
interface CatalogImage {
  id: string;                 // sanitized filename, not stored in the document
  filename: string;           // italia-dolomiti-01.webp
  path: string;               // /galleries/italia-dolomiti-01.webp
  title: string;
  description: string;
  alt: string;
  aspectRatio: ImageAspectRatio; // 16:9 | 3:2 | 4:3 | 1:1 | auto
  galleryIds: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// galleries/{galleryId}
interface Gallery {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isFeatured: boolean;
  featuredOrder: number;
  coverImageId: string;
  coverImageUrl: string;
  imageIds: string[];
  layoutConfig: { aspectRatio: ImageAspectRatio; padding: 'none' | 'small' | 'medium' | 'large' };
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
```

Notes:

- `galleryIds` and `imageIds` are maintained together in one Firestore batch on every membership change, so the two indexes agree.
- `coverImageUrl` is denormalized from the catalog so the public grid can paint without resolving the catalog; `coverImageId` stays authoritative in the admin.
- Legacy gallery documents with an embedded `images` array are still read (public mapper falls back) but the admin saves only the new shape. Galleries are not seeded yet, so no production data migrates.
- Read stats: one `getDocs` per collection; the catalog is ~100 documents.

## 3. GitHub discovery

- `src/services/githubImages.service.ts` calls the contents endpoint with `VITE_GITHUB_REPO` (default `AlexDevsTheWeb/alessandrotorri.it`) and `VITE_GITHUB_BRANCH` (default `development`).
- Unauthenticated request, public repository. No token in the bundle.
- Supported extensions: `.webp`, `.jpg`, `.jpeg`, `.png`, `.avif`.
- A 403/429 is surfaced as a rate-limit message with a retry action; the rest of the admin keeps working.
- Unindexed files are rendered as stubs with an "Indicizza" action that creates the catalog document.

## 4. Routes and components

| Route | Component | Change |
|-------|-----------|--------|
| `/admin` | `AdminDashboard` | shared admin nav, featured badge in the list |
| `/admin/gallery/:galleryId` | `AdminGalleryDetailPage` | loads the catalog for assignment |
| `/admin/images` | `AdminImagesPage` (new) | catalog, GitHub sync, filters, assignment |

New components: `AdminNav`, `ImageCatalogCard` (the filter toolbar is inline in `AdminImagesPage`). Rewritten: `GalleryImageList` (catalog assignment, cover picker), `GalleryFields` (featured + layout). Updated: `CollectionGrid` (featured, per-cover ratio), `CollectionCover` (ratio), `CollectionPage` (ratio + spacing), `ProgressiveImage` (object-position).

State: `useImageStore` (catalog CRUD, indexing, assignment) next to `useGalleryStore`; `usePublicGalleries` joins galleries and catalog for the public pages.

## 5. Rules

```
match /images/{imageId} {
  allow read: if true;
  allow create, update: if isAdmin() && isValidImage();
  allow delete: if isAdmin();
}

match /galleries/{galleryId} {
  allow read: if true;
  allow create, update: if isAdmin() && isValidGallery();
  allow delete: if isAdmin();
}
```

`isValidImage()` and `isValidGallery()` validate types, the required timestamp and the allowed enum values for `aspectRatio` and `padding`.

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Two indexes (`galleryIds`, `imageIds`) drift | membership changes always run in one `writeBatch` |
| GitHub rate limit (60 req/h unauthenticated) | single request per admin visit, explicit error and retry, no polling |
| Legacy `images` documents from the retired collection | reads ignore documents without `filename`/`path`; the owner can delete leftovers |
| Legacy embedded gallery images | read-only fallback in the public mapper; no seeded galleries exist |
| Rules not deployed | the existing `admins/{uid}` preflight stays; deployment remains issue #3 |
| Public bundle growth | the catalog read runs after mount through the existing lazy service chunk |

## 7. Verification

```bash
npm run lint
npm run build
# manual: npm run dev → /, /gallery, /gallery/<slug>, /admin, /admin/images, /admin/gallery/<id>
```

Live Firestore writes, rules deployment and the GitHub call need credentials/network and are listed for the owner.

## 8. Execution outcome

Delivered on `feat/image-catalog-and-layout`, draft PR [#26](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/26): the `images` catalog and membership batching, `/admin/images` with GitHub discovery and filters, cover/featured/layout controls in the gallery editor, featured full-width covers, per-gallery feed ratio and spacing, `object-fit: cover` rendering, the rules update and the full wiki slice.

`npm run lint` and `npm run build` pass. Headless Chrome on `npm run preview` renders the 9 fallback covers on `/` and `/gallery` and the 24-photo feed on `/gallery/01-favorite`. Live Firestore, rules deployment, the GitHub call against committed files and the admin browser flows are not verified; see the [implementation report](docs/wiki/reviews/2026-11-17-image-catalog-implementation.md).
