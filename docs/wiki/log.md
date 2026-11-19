# Knowledge Bundle Update Log

## 2026-11-19
* **Release v1.0.0 prepared**: `package.json`/lockfile at `1.0.0`; new `typecheck` script; `ci.yml` runs lint + typecheck + build; `preview.yml` deploys PR preview channels; `deploy.yml` deploys `firestore.rules` then Firebase Hosting `live` on `main`/`v*`; `firebase.json` gained Hosting (`dist`, SPA rewrite) and `.firebaserc` pins `alessandrotorri-it`.
* **Spec deviations**: the requested `docs/raw/2026-11-18-release-v1.0.md` was not written (raw is immutable); the release summary lives in [reviews](/reviews/2026-11-19-v1.0.0-release.md). Issues #1/#2/#3/#14 were already closed and were not re-closed. The overview says "release prepared, first deploy pending" rather than "Stable Production" because no deploy has run. `main`, the `v1.0.0` tag and the first deploy are post-merge steps.
* **Decision**: [0025 — Release v1.0.0 and CI/CD strategy](/decisions/0025-release-v1-and-ci-cd.md).
* **Wiki**: added the [source summary](/sources/2026-11-19-v1.0.md), decision 0025, the [release and deployment playbook](/rules/release-deployment.md) and the [v1.0.0 release report](/reviews/2026-11-19-v1.0.0-release.md); updated [Rebuild Plan](/rebuild-plan.md) (Phase 6 done, Phase 8 added), [Overview](/overview.md), AGENTS, README and the indexes.
* **Verify**: `npm run lint`, `npm run typecheck` and `npm run build` pass; the three workflow files parse as YAML. The Firebase deploy steps were not executed (no service account here) and the Hosting site existence was not verified.
* **Next**: merge the release PR, add `FIREBASE_SERVICE_ACCOUNT`, create `main`, tag `v1.0.0`, run the first deploy and the deployed Lighthouse check (#22).
* **Featured sizing**: with one featured gallery the cover is a full-width banner capped at 240/320/420 px (xs/sm/md) with a panoramic crop; with two or more, featured galleries render half-width as a pair using the gallery ratio. `GalleryFields` explains the behavior. No new field: the count decides.
* **Header and footer**: the footer keeps only the copyright; Instagram and YouTube remain in the navbar/drawer. The logotype is Instrument Serif, uppercase, 1.1 rem/0.24em (0.9/0.16 on mobile).
* **Admin**: removed the pen edit dialog and the `onEdit` path from `GalleryList`/`AdminDashboard`. `Nuova galleria` remains as a creation dialog and navigates to the detail page, now the only edit surface (fields, cover, images, ordering).
* **Decision**: [0024 — Compact featured layout, serif logotype and one gallery edit path](/decisions/0024-featured-layout-logotype-admin-cleanup.md).
* **Wiki**: added the [source summary](/sources/2026-11-19-ui-and-admin-cleanup.md) and decision 0024; updated [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Headless Chrome: the footer has no social links, the logotype computes to Instrument Serif with 4.224 px tracking and uppercase, the live single featured banner is 1136×404, and a mock with two featured galleries renders 568×320 each beside 568×379 regular covers.
* **Next**: add a second featured (or unfeature the current one) to exercise the pair layout; the release workflow now deploys the rules on tags.

## 2026-11-18
* **Featured divider**: the shared grid now renders featured galleries first, then a full-width centered `Divider` labelled **LUOGHI** (1 px solid lines, uppercase 0.7 rem, 0.35em tracking), then the remaining galleries. The divider appears only when both groups exist. Applies to `/` and `/gallery` for parity.
* **Decision**: [0023 — Divider between featured and other galleries](/decisions/0023-featured-gallery-divider.md).
* **Wiki**: added the [source summary](/sources/2026-11-18-featured-divider.md) and decision 0023; updated [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Headless Chrome on a mock grid confirmed featured → divider → rest, `solid 1px` lines and the `coverSpacing` inset. The live site currently has no non-featured gallery, so the divider is not visible there yet.
* **Cover picker**: the gallery cover is now a select built from the gallery's own `imageIds` (plus "Nessuna (prima foto)") in `GalleryFields`; it writes `coverImageId` and `coverImageUrl` together, keeps the star shortcut, flags a stale cover and previews the selected image. The `/admin` dialog loads the catalog so it can offer the select.
* **Spacing**: added `layoutConfig.coverSpacing` ("Spaziatura galleria", 0/8/16/24 px, default none) applied around the cover in `CollectionGrid`. `layoutConfig.padding` remains "Spaziatura foto" inside the gallery; the two controls are independent.
* **Photo ratios**: an explicit photo `aspectRatio` now wins in the feed; the gallery ratio is the fallback for `Naturale` photos and sets the cover. Verified live: the 1:1 test photo rendered 368×368 in a 16:9 gallery.
* **Decision**: [0022 — Cover picker, gallery spacing and photo ratios](/decisions/0022-cover-spacing-and-photo-ratios.md), which supersedes the ratio precedence of [0021](/decisions/0021-visibility-and-empty-galleries.md).
* **Wiki**: added the [source summary](/sources/2026-11-18-cover-spacing-and-photo-ratios.md) and decision 0022; updated [Photo Management](/concepts/photo-management.md), [Gallery System](/concepts/gallery-system.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Design System](/concepts/design-system.md), [Firebase Backend](/concepts/firebase-backend.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Headless Chrome confirmed the cover select writes the id and URL, the spacing select writes `coverSpacing`, and the feed follows the photo ratio. The live cover-spacing render was not exercised (existing galleries default to none).
* **Next**: choose a cover and a gallery spacing from the admin, then deploy the rules (issue #3).
* **Empty galleries and visibility**: a gallery now needs at least one visible photo to appear publicly; galleries and catalog images gained `isVisible` (missing = visible, rules tolerant, no migration). `publicGalleries.service.ts` filters hidden galleries, hidden images and empty galleries, and exposes `hasRemoteGalleries` so hidden content is never replaced by the static CDN dataset. Admin: "Visibile nel sito" switches in `GalleryFields` and `ImageCatalogCard`, "Nascosta" chips in the lists.
* **Aspect ratio (first pass)**: the gallery ratio already worked (measured 16:9 and 3:2 live); the gap was feedback. `Naturale` covers use the image ratio and the catalog preview follows the selected ratio. This pass made the gallery ratio win; superseded later the same day by decision 0022.
* **Lightbox caption**: switched from `h6` (20 px) to `body2` (14 px) at 75% white.
* **Decision**: [0021 — Hide empty galleries and add visibility flags](/decisions/0021-visibility-and-empty-galleries.md).
* **Wiki**: added the [source summary](/sources/2026-11-18-visibility-and-polish.md) and decision 0021; updated [Photo Management](/concepts/photo-management.md), [Gallery System](/concepts/gallery-system.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Design System](/concepts/design-system.md), [Firebase Backend](/concepts/firebase-backend.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Live data confirmed the empty-gallery filter: `Irlanda` now has `imageIds: []` and no longer appears on `/`. Headless Chrome confirmed the 16:9/3:2 covers and the 14 px lightbox caption. Hidden visibility was not exercised live (no admin session).
* **Next**: toggle a hidden gallery/image from the admin to confirm the rules accept the field, then deploy the rules (issue #3).
* **Gallery removal**: reported inability to remove an assigned photo. Firestore was consistent and the editor's draft/save removal worked; the gap was `/admin/images`, where gallery chips were inert. Added `detachImageFromGallery` (transaction removes `imageIds` and `galleryIds`, promotes or clears the cover), `unassignFromGallery` in the image store, removable chips on the catalog card and an assignment select that only lists galleries the image is not in.
* **Home flash**: `/` rendered the static CDN covers, then the Firestore galleries, and repeated the flash on every navigation. `src/services/publicGalleries.service.ts` now caches the last join and deduplicates loads; `usePublicGalleries` paints the cache and refetches in the background; `/`, `/gallery` and `/gallery/:slug` render `PageLoader` until the first read. Admin writes invalidate the cache.
* **Decision**: [0020 — Detach images directly and cache public gallery reads](/decisions/0020-gallery-detach-and-public-cache.md).
* **Wiki**: added the [source summary](/sources/2026-11-18-gallery-removal-and-home-flash.md) and decision 0020; updated [Photo Management](/concepts/photo-management.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Gallery System](/concepts/gallery-system.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Headless Chrome confirmed the chip delete triggers the unassign callback and that back navigation paints the Firestore galleries with no static flash. The live detach write was not exercised (no admin session); it is covered by the deployed rules like the other admin writes.
* **Next**: remove the test photo from one or both galleries from `/admin/images`, then continue seeding the catalog; deploy the rules (issue #3).
* **Image preview bug**: the owner uploaded `public/galleries/Screenshot 2026-11-17 alle 16.30.20.png` on `development`; `/admin/images` discovered it through the GitHub API but the thumbnail was blank. Preview used `/galleries/<file>` from the checkout, which did not contain the file, and the SPA fallback answered `200 text/html`. Root cause: discovery and preview read from different sources.
* **Fix**: `RepositoryImage` renders the served path and retries once through the GitHub raw URL; `CatalogEntry.remoteUrl` carries `download_url` and `repositoryImageFallback(path)` derives it for catalog-only entries. Applied to `ImageCatalogCard`, `GalleryImageList`, `GalleryList` and the `GalleryFields` cover preview. Public rendering is unchanged.
* **Decision**: [0019 — Admin previews fall back to the GitHub raw URL](/decisions/0019-admin-image-preview-fallback.md).
* **Wiki**: added the [source summary](/sources/2026-11-18-image-preview.md) and decision 0019; updated [Photo Management](/concepts/photo-management.md), [Admin Dashboard](/concepts/admin-dashboard.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) and the indexes.
* **Verify**: `npm run lint` and `npm run build` pass; the raw GitHub URL returns `200 image/png` for the uploaded file. `development` was merged into `feat/image-catalog-and-layout` so the checkout matches the discovery branch. Browser verification of the fallback was not possible here (no headless browser).
* **Next**: index and assign the uploaded photo; deploy the rules and smoke-test the admin (issue #3).

## 2026-11-17
* **Image catalog**: image metadata moved out of the embedded `galleries.images` arrays into a Firestore `images` catalog (`filename`, `path`, `title`, `description`, `alt`, `aspectRatio`, `galleryIds`). Galleries now hold an ordered `imageIds` array; `galleryIds` and `imageIds` are written together in one batch. Image document ids derive from the sanitized filename, so re-indexing is idempotent.
* **Admin**: new `/admin/images` page with the five filters (tutte, nuove/non indicizzate, senza titolo, senza descrizione, non assegnate), inline metadata edits, gallery assignment, "+ Nuova galleria" and bulk indexing. The gallery editor now assigns catalog images, reorders them, stars the cover, toggles featured and sets `layoutConfig`. `AdminNav` links the sections.
* **Discovery**: `src/services/githubImages.service.ts` lists `public/galleries/` through the GitHub contents API (`VITE_GITHUB_REPO`, `VITE_GITHUB_BRANCH`, unauthenticated). A rate limit shows a retry warning without breaking the catalog.
* **Public**: featured galleries render full-width at the top of the shared grid; covers use the gallery ratio; the feed crops by `layoutConfig.aspectRatio` and spaces by `layoutConfig.padding`; `ProgressiveImage` enforces `object-fit: cover; object-position: center`.
* **Rules**: `images` public read with validated admin writes (`isValidImage`); `isValidGallery` extended with `isFeatured`, `featuredOrder`, `coverImageId`, `imageIds` and the `layoutConfig` enums.
* **Decision**: [0018 — Master image catalog, GitHub discovery and per-gallery layout controls](/decisions/0018-image-catalog-and-layout.md), which supersedes the embedded-image parts of [0016](/decisions/0016-gallery-management.md) and the fixed 4:3 cover of [0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md).
* **Wiki**: added the [source summary](/sources/2026-11-17-admin-galleries-v2.md) and [decision 0018](/decisions/0018-image-catalog-and-layout.md); rewrote [Photo Management](/concepts/photo-management.md), [Admin Dashboard](/concepts/admin-dashboard.md) and [Firebase Backend](/concepts/firebase-backend.md); updated [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [State Management](/concepts/state-management.md), [Site Architecture](/concepts/site-architecture.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md) (phase 7), AGENTS.md, README, `.env.example` and the indexes.
* **Report**: [Image catalog and layout implementation report](/reviews/2026-11-17-image-catalog-implementation.md) records the delivered scope, verification evidence (including a headless render of the public pages), deviations, accepted risks and follow-ups.
* **Verify**: `npm run lint` and `npm run build` pass; the admin pages are separate lazy chunks and no chunk exceeds 500 kB. Not exercised: live Firestore reads/writes, rules deployment, the GitHub request against committed files, browser drag-and-drop and the featured grid (no credentials, no committed images).
* **Next**: replay the new rules in the emulator and deploy them (issue #3); commit photos to `public/galleries/`, index and assign them; smoke-test the catalog flows.

## 2026-11-16
* **Incident**: gallery create/save returned `Missing or insufficient permissions`. Inspected the write path and replayed the exact payload against `firestore.rules` in the Firestore emulator: without `admins/{uid}` the write is denied; with it, create, update and ordered read succeed. The payload satisfies `isValidGallery()`, including `updatedAt is timestamp` with `serverTimestamp()`.
* **Diagnosis**: the rules and payload match. The gates are the missing `admins/{uid}` document and/or an undeployed ruleset; the UI previously showed only the raw Firebase message, so the two were indistinguishable.
* **Fix**: `galleries.service.ts` logs every failure with operation, path, payload snapshot, code and message and exports `describeGalleryError` for Italian, actionable UI text; the store gained `adminStatus` and `checkAdminAccess`; `/admin` preflights `admins/{uid}` and shows the UID with the console steps. Rules unchanged.
* **Decision**: [0017 — Diagnose Firestore permission failures in the client](/decisions/0017-firestore-permission-diagnostics.md). No rule was relaxed.
* **Wiki**: added the [Firestore check source summary](/sources/2026-11-16-firestore-check.md) and the [Firestore permissions playbook](/rules/firestore-permissions.md); updated [Admin Dashboard](/concepts/admin-dashboard.md), [Firebase Backend](/concepts/firebase-backend.md), the [implementation report](/reviews/2026-11-16-admin-galleries-implementation.md), Overview, Rebuild Plan, AGENTS, indexes and this log.
* **Verify**: `npm run lint` and `npm run build` pass. Emulator evidence recorded; the live project was not touched (no credentials, no deploy).
* **Next**: deploy `firestore.rules`, create `admins/{uid}`, then smoke-test the admin (issue #3).

## 2026-11-16
* **PR #23 review**: draft, mergeable, CI green, based on `development` (no `main` branch exists). It carries only the 2026-11-07 docs slice plus `zustand` 5.1.0 and `@types/node` 22, so it should merge first; this branch is stacked on it until then.
* **Admin galleries**: replaced the Storage-upload admin with Firestore `galleries` (embedded `images`) and a full gallery CRUD: create/edit/delete dialogs, drag-and-drop gallery ordering plus an explicit `displayOrder`, image rows with live previews, title/alt/ratio and drag-and-drop ordering, validated save in one write. New `useGalleryStore`, `galleries.service.ts`, `/admin/gallery/:galleryId`.
* **Images**: static repository assets in `public/galleries/`; `storage.rules`, the Storage client and `firebase.json` storage config removed. `react-firebase-hooks` dropped (unused after the rewrite).
* **Public read**: `/`, `/gallery` and `/gallery/:slug` read Firestore lazily and fall back to the captured CDN dataset, so first paint never waits on Firestore and the site cannot go blank.
* **Rules**: `galleries` public read, admin-only validated writes; the legacy `images` block removed and denied by the catch-all. Not deployed or emulator-tested.
* **Decision**: [0016 — Manage galleries in Firestore with static repository images](/decisions/0016-gallery-management.md); supersedes the Storage/`images` parts of [0014](/decisions/0014-admin-route-protection.md).
* **Wiki**: added [source summary](/sources/2026-11-16-admin-galleries.md), the decision, and `IMPLEMENTATION_PLAN.md` at the repository root as the raw source requires; updated [Admin Dashboard](/concepts/admin-dashboard.md), [Photo Management](/concepts/photo-management.md), [Firebase Backend](/concepts/firebase-backend.md), [Gallery System](/concepts/gallery-system.md), [State Management](/concepts/state-management.md), [Site Architecture](/concepts/site-architecture.md), [Tech Stack](/concepts/tech-stack.md), [Photo Storage Options](/concepts/photo-storage-options.md), [Agent Rules](/rules/agent-rules.md), AGENTS.md, README, Overview, Rebuild Plan and indexes.
* **Report**: [Admin galleries implementation report](/reviews/2026-11-16-admin-galleries-implementation.md) records the delivered scope, verification evidence, deviations, accepted risks and follow-ups.
* **Verify**: `npm run lint` and `npm run build` pass; the gallery service is emitted as its own lazy chunk. Live Firestore, rules deployment and browser drag-and-drop are not exercised (no credentials in this session).
* **Next**: merge #23, deploy `firestore.rules`, seed galleries and retire the CDN fallback (issue #3).

## 2026-11-07
* **Open items closed**: closed #6 and #14 with follow-ups — [#20](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/20) TypeScript 7 (blocked upstream), [#21](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/21) Firebase 13 (after the backend decision), [#22](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/22) deployed Lighthouse (needs a deploy target). Register in [open items review](/reviews/2026-11-07-open-items.md).
* **Libraries**: `zustand` 5.0.16 → 5.1.0 (in range); `@types/node` 24 → 22 to match CI and the local runtime. Production audit clean; 10 moderate dev-only `minimatch` advisories accepted (fix requires a breaking `--force`).
* **Backend analysis**: [Photo Storage and Backend Options](/concepts/photo-storage-options.md) (draft) — Firebase fits auth and metadata; image egress and delivery are its weak points; Cloudflare R2 for bytes is the recommended option to discuss.
* **Wiki**: added [open items review](/reviews/2026-11-07-open-items.md), [photo storage options](/concepts/photo-storage-options.md), [source summary for issue #14](/sources/2026-11-07-gh-issue-14.md); updated Rebuild Plan, Overview, Firebase Backend, Tech Stack and indexes.
* **Verify**: `npm run lint` and `npm run build` pass after the updates.
* **Next**: owner decisions on backend and deployment; then #21, #22.

## 2026-11-07
* **Issue #6 / majors batch**: adopted Vite 8 + `@vitejs/plugin-react` 6, ESLint 10 + `@eslint/js` 10 + `eslint-plugin-react-refresh` 0.5, `uuid` 14 and `globals` 17; lint and build green with no config changes. TypeScript 7 builds but `typescript-eslint` does not support it, so `npm run lint` fails; kept 5.9.3. Firebase 13 builds but needs a live smoke test and still resolves the vulnerable gRPC; deferred. `framer-motion` is no longer a dependency.
* **Decision**: [0015 — Adopt Vite 8, ESLint 10, uuid 14 and globals 17; defer TypeScript 7 and Firebase 13](/decisions/0015-dependency-majors-batch.md).
* **Wiki**: added [source summary for issue #6 (2026-11-07)](/sources/2026-11-07-gh-issue-6.md); updated [Tech Stack](/concepts/tech-stack.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md), AGENTS.md, and indexes.
* **Verify**: `npm run lint` and `npm run build` pass; `npm ci` from the lockfile passes; browser check on the Vite 8 build: `/gallery` renders.
* **Next**: TypeScript 7 once typescript-eslint supports it; Firebase 13 after a live smoke test (issue #6 stays open).
* **Issue #5 / grpc advisory**: added a scoped `overrides` entry `@grpc/grpc-js: ^1.14.7`. `npm audit --omit=dev` is clean (was 4 high). Firebase stays at 12.19.0; Firebase 13 still resolves a vulnerable grpc, so it was not the fix. The `firebase-data` chunk is byte-identical, so the browser bundle is unchanged.
* **Decision**: [0013 — Override @grpc/grpc-js to a patched 1.14 release](/decisions/0013-grpc-js-override.md).
* **Wiki**: added [source summary for issue #5](/sources/2026-11-07-gh-issue-5.md); updated [Tech Stack](/concepts/tech-stack.md), [Firebase Backend](/concepts/firebase-backend.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md), and indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Live Firestore not exercised (no project credentials in this session).
* **Next**: admin route protection (issue #3); majors (issue #6).
* **Issue #3 / admin protection**: wrapped `/admin` and `/admin/collection/:name` in `ProtectedRoute`; added `isAuthReady` so a refreshed `/admin` waits for auth instead of redirecting; added `firestore.rules`, `storage.rules` and `firebase.json` so writes need an `admins/{uid}` document. Browser check: signed-out `/admin` and `/admin/collection/…` redirect to `/login`; `/gallery` stays public.
* **Decision**: [0014 — Protect admin routes and gate data with an admins allowlist](/decisions/0014-admin-route-protection.md).
* **Wiki**: added [source summary for issue #3](/sources/2026-11-07-gh-issue-3.md); updated [Admin Dashboard](/concepts/admin-dashboard.md), [Firebase Backend](/concepts/firebase-backend.md), [Site Architecture](/concepts/site-architecture.md), [Agent Rules](/rules/agent-rules.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md), AGENTS.md, and indexes.
* **Not done**: rules are not yet deployed or emulator-tested; the first `admins/{uid}` document is created by the owner in the console.
* **Gallery layout refinements**: applied the owner feedback from `docs/raw/2026-11-07-ui-improvement.md` — cover titles centered and shown only on hover/focus over a stronger gradient, 4:3 covers, tighter grid gap (8px / 16px), pointer cursors on covers and photos (fixed the `cursor: default` that `ProgressiveImage` forced), "Dati EXIF non disponibili" removed from the lightbox, and a native right-click/drag guard on single-gallery photos.
* **Decision**: [0012 — Gallery hover titles and copy guard](/decisions/0012-gallery-hover-titles-and-copy-guard.md); supersedes the always-visible cover title in [0008](/decisions/0008-visual-refinements.md) and records the deviation from live-site parity in [0003](/decisions/0003-exact-look-and-feel.md).
* **Dependency**: no copy-protection library added. The owner asked for "a library", but AGENTS.md requires approval for new dependencies; the guard is native and deterrent-only. Question recorded in decision 0012.
* **Wiki**: added [source summary](/sources/2026-11-07-ui-improvement.md) and [decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md); updated [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Rebuild Plan](/rebuild-plan.md) (status `L2`), [Overview](/overview.md), and the bundle, decision and source indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Manual browser check of hover, cursor and mobile layout is still pending.
* **Next**: owner review of the gallery changes; administrator section (issue #3).

## 2026-10-30
* **Issue #2 / phase 5**: fixed `index.html` defaults, added `usePageMeta` per-route title/description/canonical/OG/Twitter, `robots.txt` and `sitemap.xml`, lazy routes + `Suspense`/`ErrorBoundary`, manual chunks, and a CDN preconnect.
* **Performance**: split MUI/React/Firebase chunks, made `firebase.ts` auth-only and `firebaseData.ts` lazy, removed the dead `PhotoGallery` demo and unused `framer-motion`, and added 600w/1200w `srcset` plus eager/high-priority first images. No chunk exceeds 500 kB.
* **Verification**: lint/build green; meta/canonical checked on `/`, `/gallery`, `/gallery/07-francia`; Masonry 1/2/3 columns and symmetric gutters at 390/768/1280; lightbox keyboard + scroll lock verified. Lighthouse local preview: a11y/BP/SEO 100, performance 74 (6.7s local TTFB); deployed verification is issue #14.
* **Decision**: [0011 — SEO, metadata, and route loading](/decisions/0011-seo-and-route-loading.md).
* **Wiki**: added [SEO and Metadata](/concepts/seo-metadata.md); updated source summary, rebuild plan, site architecture, tech stack, Firebase backend, admin/overview pages, indexes and README.
* **PR**: [#15](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/15) — draft phase 5 polish.
* **Next**: administrator section (issue #3); deployed Lighthouse check (issue #14).

## 2026-10-30
* **Issue #2 / phase 4**: rewrote `CollectionPage` to use the static dataset, with breadcrumb, centered uppercase H1, single-column feed, captions, and a new `PhotoLightbox` (dark Dialog, blurred backdrop, prev/next, Esc/arrows, mobile arrows).
* **Data**: captured all 9 collection photo lists from the live site — **89 photos** (24 favorite) with real CDN URLs, Italian captions and aspect ratios in `src/data/collections.photos.ts`. `ProgressiveImage` now accepts an optional placeholder.
* **Refinement**: replaced the single-column feed with a responsive Masonry grid (1/2/3 columns) and hid the caption until hover/focus, when it slides to the center over a ~50% black gradient ([decision 0009](/decisions/0009-masonry-feed-hover-captions.md)).
* **Fix**: MUI Masonry's negative root margin shifted the mobile feed left. Neutralized it with `margin: 0 !important`; at 390px the gutters are now 24px on both sides.
* **Breadcrumb**: removed the in-page breadcrumb and moved `Gallerie / {title}` into the desktop navbar; hidden on mobile, H1 remains ([decision 0010](/decisions/0010-navbar-breadcrumb.md)).
* **Theme**: dark background changed from `#0a0a0a` to `#111111`; dark paper stays `#121212`.
* **Wiki**: updated [source summary for issue #2](/sources/2026-10-29-gh-issue-2.md), [Gallery System](/concepts/gallery-system.md), [Photo Management](/concepts/photo-management.md), [Design System](/concepts/design-system.md), [Rebuild Plan](/rebuild-plan.md), [Overview](/overview.md), [Tech Stack](/concepts/tech-stack.md), AGENTS, README and raw index.
* **Verify**: `npm run lint` and `npm run build` pass. Bundle ~1.272 MB / 393.52 kB gzip (demo gallery tree-shaken).
* **PR**: [#11](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/11) — draft phase 4 feed + lightbox.
* **Next**: phase 5 — titles/OG, robots/sitemap, responsive audit, lazy routes, error boundary, bundle splitting.

## 2026-10-29
* **Layout refinements**: applied the owner feedback from `docs/raw/2026-10-29-layout-improvements.md` — DM Sans + Instrument Serif, muted-to-full hover colors, visible light-theme icons, no focus borders, no card entrance/scale animation, cover titles inside a bottom gradient, compact borderless footer, transparent back-to-top icon, mobile icons moved into a blurred drawer.
* **CSS cleanup**: replaced the Vite `index.css` boilerplate with a minimal reset and deleted the unused `App.css`.
* **Decision**: [0008 — Visual refinements](/decisions/0008-visual-refinements.md), refining the visual specifics of decision 0003.
* **Wiki**: added [source summary](/sources/2026-10-29-layout-improvements.md); updated [Design System](/concepts/design-system.md), [Gallery System](/concepts/gallery-system.md), [Site Architecture](/concepts/site-architecture.md), [Rebuild Plan](/rebuild-plan.md), indexes and AGENTS.
* **Verify**: `npm run lint` and `npm run build` pass. Bundle ~1.357 MB / 420.96 kB gzip.
* **PR**: [#10](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/10) — draft layout/visual refinements.
* **Next**: phase 4 — collection feed, captions, and lightbox (`/gallery/:slug`).

## 2026-10-29
* **Issue #2 / phase 3**: shipped the 9-cover gallery grid on `/` and `/gallery`. New `CollectionGrid` + `CollectionCover` components, static `COLLECTIONS` data, 16:9 `ProgressiveImage`, centered uppercase titles, hover scale/brightness, framer-motion stagger.
* **Home decision**: `/` renders the grid directly, no redirect ([decision 0007](/decisions/0007-home-gallery-grid.md)). Removed the Unsplash hero, commented Firestore blocks, and `height: 3000px` hack.
* **Cleanup**: deleted the dead `src/components/Navbar.tsx`; `GalleryPage` no longer renders the demo `PhotoGallery`.
* **Wiki**: added [source summary for issue #2](/sources/2026-10-29-gh-issue-2.md); updated [Gallery System](/concepts/gallery-system.md), [Rebuild Plan](/rebuild-plan.md), [Overview](/overview.md), and indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Bundle ~1.352 MB / 419.88 kB gzip.
* **PR**: [#9](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/9) — draft phase 3 gallery grid.
* **Next**: phase 4 — collection feed, captions, and lightbox (`/gallery/:slug`).

## 2026-10-29
* **Issue #6 / MUI 9**: upgraded `@mui/material` and `@mui/icons-material` to 9.5.0 and `@mui/lab` to 9.0.0-beta.10; `@mui/system`, `@mui/utils`, and `@mui/styled-engine` resolve to 9.5.0. React 19.3.1 and Emotion 11.14 already satisfy the v9 peers.
* **Migration**: `Dialog` `PaperProps` → `slotProps.paper`; system props moved to `sx` on `Box`/`Stack`/`Grid`; `nativeButton={false}` on buttons rendered as Router links.
* **Decision**: [0006 — Adopt Material UI 9](/decisions/0006-adopt-mui-9.md); remaining majors stay in issue #6.
* **Wiki**: added [source summary for issue #6](/sources/2026-10-29-gh-issue-6.md); updated [Tech Stack](/concepts/tech-stack.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md), and indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Bundle is ~1.37 MB (423.65 kB gzip); phase 5 code splitting remains the main remedy.
* **PR**: [#8](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/8) — draft MUI 9 upgrade, stacked on #7.
* **Next**: public rebuild phase 3 (issue #2); remaining majors in issue #6.

## 2026-10-29
* **Issue #1 / dependencies**: applied all in-range updates with `npm update` (19 packages, including React 19.3.1, MUI 7.3.11, Vite 7.3.7, Firebase 12.19.0, Router 7.18.5, Zustand 5.0.16). `package-lock.json` only; `package.json` ranges unchanged.
* **Security**: `npm audit` still reports 4 high advisories in `@grpc/grpc-js@1.9.16` (Firebase transitive). `npm audit fix --force` would downgrade Firebase to 9.14.0, so it was not applied; tracked in issue #5.
* **Decision**: [0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md); majors deferred to issue #6.
* **Wiki**: added [source summary for issue #1](/sources/2026-10-29-gh-issue-1.md); updated [Tech Stack](/concepts/tech-stack.md), [Overview](/overview.md), [Rebuild Plan](/rebuild-plan.md), and indexes.
* **Verify**: `npm run lint` and `npm run build` pass. Bundle is 1.35 MB (418.89 kB gzip); phase 5 code splitting is now a priority.
* **PR**: [#7](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/7) — draft in-range dependency refresh.
* **Next**: public rebuild phase 3 (issue #2).

## 2026-10-29
* **Ingested**: `docs/raw/2026-10-29-rebuild.md` as [source summary](/sources/2026-10-29-rebuild.md); extracted 10 requirements (wiki, docs audit, blueprint, multi-agent schema, libraries, clone, GitHub tooling).
* **Archived**: root `blueprint.md` moved to `docs/raw/2026-03-03-blueprint.md` and summarized as deprecated history ([decision 0002](/decisions/0002-archive-blueprint.md)).
* **Decision**: [0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md) (OKF v0.2, immutable raw, one `AGENTS.md`); [0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md) (visual parity, modern implementation).
* **Agent schema**: added root `AGENTS.md` (canonical), `CLAUDE.md` + `GEMINI.md` pointers, `.agents/skills/usual-loop/SKILL.md` with a `.claude/skills` symlink; added [The Usual Loop](/rules/workflow.md).
* **Audit**: [Docs and baseline audit](/reviews/2026-10-29-docs-audit.md) — every document classified; fixed stale `/about`, `PLAN.md`, "English site", IDX, and ProtectedRoute claims.
* **Baseline**: `npm run lint` and `npm run build` are green. Fixed `IImage`, unused `styled()` theme params, setState-in-effect, and the unsupported `idField` option (image ids were undefined in admin actions).
* **Tooling**: added GitHub Actions CI, PR/issue templates; opened issues #1 (dependencies), #2 (public rebuild phases 3–5), #3 (protect admin).
* **Restructure**: moved the OKF bundle to `docs/wiki/`, sibling of `docs/raw/`; added [decision 0004](/decisions/0004-wiki-layout.md), fixed the section layout, and extended the loop to GitHub issues.
* **PR**: [#4](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/4) — draft knowledge-foundation MR.
* **Repository hygiene**: removed `.idx/` and the stale Firebase Studio `GEMINI.md`; replaced the Vite boilerplate `README.md`.
* **Next**: issue #1 dependency refresh, then rebuild phase 3 ([issue #2](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2)).

## 2026-09-08
* **Wiki migration**: `docs/` converted to llm-wiki + OKF v0.2 compliant wiki (English only, per owner decision).
* **Fixed**: `index.md` frontmatter removed (reserved file); `rebuild-plan.md` `okf_version` field removed, `description`/`tags`/`sources` added; all cross-links now absolute bundle-relative (`/concepts/...`, `/rules/...`, `/rebuild-plan.md`, `/overview.md`, `/log.md`); no `../` parent escapes.
* **Added**: `overview.md` (Tier-1 synthesis hub, tree shape: index → overview → cluster hubs); ingest/query/lint operations in `index.md`; contradiction callouts (roadmap superseded) in `overview.md` + `concepts/roadmap.md` (status → `superseded`).
* **Phase 0 done**: baseline recorded — lint 3 errors + 1 warning (`ProgressiveImage` unused `theme` x2, `CollectionDetailPage` set-state-in-effect; warning exhaustive-deps in `PhotoGallery`); build fails on `IImage` missing fields (`metadata`, `isFavorite`, `isLatestWork`, `isVisible`, `order`) + Firestore generic mismatches.
* **Phase 1 done**: created `src/data/collections.data.ts` — 9 CDN covers (1280w + 32px placeholders), 24 favorite captions scraped, `PHOTOS` stubbed (cover as src, per-photo URLs TODO). New file lint/tsc clean, no new errors.
* **Phase 2 done**: rewrote `src/layout/Navbar.layout.tsx` (triptych: Gallerie left, Alessandro Torri center, IG + YT + theme toggle right; mobile Drawer; dead `/projects`/`/about` links removed; social URLs exported) and `src/layout/Footer.layout.tsx` (centered ↑ Back to Top + IG/YT + copyright). Lint unchanged (3 errors + 1 warning, all pre-existing); tsc clean on both files.
* **Next**: Phase 3 Gallery grid (`src/pages/GalleryPage.tsx`, `src/pages/HomePage.tsx`, new `src/components/CollectionCover.component.tsx`).

## 2026-09-08
* **Added**: `docs/rebuild-plan.md` — stop/restart plan for modern reinterpretation of live alessandrotorri.it (Adobe Portfolio marta/ludwig). Locked: work in current repo, reuse CDN temporarily, admin deferred to Phase 6.
* **Analyzed**: live site structure (triptych header, 9-cover 16:9 grid, single-col detail feed + captions, lightbox #111@0.9, footer back-to-top) via WebFetch of `/` and `/01-favorite`; mapped gaps in `HomePage.tsx`, `GalleryPage.tsx`, `Navbar.layout.tsx`.
* **Linked**: rebuild plan from `docs/index.md` and `docs/concepts/index.md`. Status: all phases 0-5 pending, Phase 6 deferred.
* **Next**: Phase 0 baseline (`npm run lint`, `npm run build`), then Phase 1 `src/data/collections.data.ts`.

## 2026-08-26
* **Creation**: Initialized OKF v0.2 knowledge bundle for alessandrotorri.it project.
* **Creation**: Added core concepts — site architecture, tech stack, Firebase, photo management, gallery, design system, state management, admin dashboard.
* **Creation**: Added agent rules, code style rules, git conventions.
* **Added**: Project roadmap integrated into wiki as `concepts/roadmap.md` — single source of truth for phases and milestones.
