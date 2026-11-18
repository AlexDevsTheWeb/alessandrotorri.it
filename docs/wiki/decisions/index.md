# Decisions

Architecture and process decisions for this project, newest first. Each decision records context, the choice, and consequences. Decisions are immutable records; supersede rather than rewrite.

* [0020 — Detach images directly and cache public gallery reads](/decisions/0020-gallery-detach-and-public-cache.md) - Removable gallery chips with atomic detach and cover promotion; cached public reads with a loader.
* [0019 — Admin previews fall back to the GitHub raw URL](/decisions/0019-admin-image-preview-fallback.md) - Repository previews retry through raw.githubusercontent.com when the file is not in the checkout; public rendering unchanged.
* [0018 — Master image catalog, GitHub discovery and per-gallery layout controls](/decisions/0018-image-catalog-and-layout.md) - Images catalog with `galleryIds`, galleries reference `imageIds`; GitHub discovery, covers, featured galleries, layout config.
* [0017 — Diagnose Firestore permission failures in the client](/decisions/0017-firestore-permission-diagnostics.md) - Structured logs, actionable errors, admins/{uid} preflight; no rule relaxation.
* [0016 — Manage galleries in Firestore with static repository images](/decisions/0016-gallery-management.md) - Replaces Storage uploads; galleries collection, embedded images, public read with static fallback.
* [0015 — Adopt Vite 8, ESLint 10, uuid 14 and globals 17; defer TypeScript 7 and Firebase 13](/decisions/0015-dependency-majors-batch.md) - Majors evaluated one at a time; TypeScript 7 blocked by typescript-eslint.
* [0014 — Protect admin routes and gate data with an admins allowlist](/decisions/0014-admin-route-protection.md) - ProtectedRoute, isAuthReady, and rules with admins/{uid}.
* [0013 — Override @grpc/grpc-js to a patched 1.14 release](/decisions/0013-grpc-js-override.md) - Scoped override clears the Firestore advisory; browser bundle unaffected.
* [0012 — Gallery covers reveal titles on hover, 4:3 covers, and a copy guard](/decisions/0012-gallery-hover-titles-and-copy-guard.md) - Hover-only centered cover titles, 4:3 covers, pointer cursors, EXIF label removed, native copy guard.
* [0011 — SEO, metadata, and route loading](/decisions/0011-seo-and-route-loading.md) - Metadata hook, static sitemap, lazy routes, chunks.
* [0010 — Breadcrumb lives in the navbar on desktop](/decisions/0010-navbar-breadcrumb.md) - Navbar breadcrumb, hidden on mobile; no in-page breadcrumb.
* [0009 — Masonry collection feed with hover captions](/decisions/0009-masonry-feed-hover-captions.md) - Masonry layout and hover/focus caption reveal.
* [0008 — Visual refinements](/decisions/0008-visual-refinements.md) - Fonts, hover states, covers, footer, back-to-top and mobile drawer.
* [0007 — Home renders the gallery grid](/decisions/0007-home-gallery-grid.md) - `/` and `/gallery` share the 9-cover grid; no redirect.
* [0006 — Adopt Material UI 9](/decisions/0006-adopt-mui-9.md) - MUI 9.5 family and the v9 API migrations.
* [0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md) - In-range now, majors deferred, no force fixes.
* [0004 — Wiki layout under docs/wiki](/decisions/0004-wiki-layout.md) - Splits raw and wiki into siblings and fixes the section layout.
* [0003 — Exact look & feel, modern implementation](/decisions/0003-exact-look-and-feel.md) - Resolves the "pixel clone vs reinterpretation" ambiguity in favor of visual parity.
* [0002 — Archive blueprint.md as a raw source](/decisions/0002-archive-blueprint.md) - Removes the stale root blueprint from the working set.
* [0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md) - Adopts an OKF v0.2 wiki, immutable raw layer, and one shared agent schema.
