---
okf_version: "0.2"
---

# AlessandroTorri.it — Knowledge Bundle

OKF v0.2 knowledge bundle for the alessandrotorri.it photography portfolio. It captures the rebuild plan, architecture, Firebase/photo workflows, decisions, and the shared rules for AI agents.

> [!TIP] Start here
> New session? Read [AGENTS.md](https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/AGENTS.md), then [Overview](/overview.md), then [Rebuild Plan](/rebuild-plan.md) (status table + phases + resume protocol).

> [!NOTE] Layers
> `docs/raw/` holds immutable sources. `docs/wiki/` (this bundle) holds the generated knowledge. New inputs may be raw files or GitHub issues; both get a page under [Sources](/sources/index.md).

## Start Here

* [Overview](/overview.md) - Tier-1 synthesis: what the project is, where it stands, what contradicts what.
* [Rebuild Plan](/rebuild-plan.md) - Single source of truth for the public-site rebuild; status table, phases, resume protocol.
* [The Usual Loop](/rules/workflow.md) - Read → analyze → plan → implement → update wiki → draft PR.

## Sources

* [Source summaries](/sources/index.md) - One page per ingested raw source or GitHub issue.
* [2026-11-19 — UI and admin cleanup](/sources/2026-11-19-ui-and-admin-cleanup.md) - Featured banner/pair sizing, footer socials removed, serif logotype, single gallery edit path.
* [2026-11-18 — Featured gallery divider](/sources/2026-11-18-featured-divider.md) - Featured galleries separated from the rest of the grid by a solid, centered `LUOGHI` divider.
* [2026-11-18 — Cover, spacing and photo ratios](/sources/2026-11-18-cover-spacing-and-photo-ratios.md) - Cover chosen from the gallery's photos, a separate gallery spacing, and photo ratios respected in the feed.
* [2026-11-18 — Visibility and ratio polish](/sources/2026-11-18-visibility-and-polish.md) - Empty galleries hidden, visible/not-visible flags for galleries and photos, ratio precedence clarified, smaller lightbox caption.
* [2026-11-18 — Gallery removal and home flash](/sources/2026-11-18-gallery-removal-and-home-flash.md) - Assigned photos could not be removed from the image card; the home grid flashed the static placeholders before Firestore on every visit.
* [2026-11-18 — Missing image preview](/sources/2026-11-18-image-preview.md) - A photo uploaded on GitHub is listed by discovery but previews from the local path; fixed with a GitHub raw fallback.
* [2026-11-17 — Image catalog, GitHub discovery and layout](/sources/2026-11-17-admin-galleries-v2.md) - Master `images` catalog, repository discovery, `/admin/images` filters, cover designation, featured galleries and layout config.
* [2026-11-16 — Firestore permission check](/sources/2026-11-16-firestore-check.md) - "Missing or insufficient permissions" on gallery writes: payload/rules verified, cause is the admins/{uid} gate or undeployed rules; diagnostics added.
* [2026-11-16 — Admin gallery management](/sources/2026-11-16-admin-galleries.md) - PR #23 review, Firestore galleries, static repository images, admin CRUD/ordering, public read with fallback.
* [2026-10-29 — Rebuild charter](/sources/2026-10-29-rebuild.md) - The owner's goals, wiki/agent model, and execution order.
* [2026-11-07 — Gallery layout improvements](/sources/2026-11-07-ui-improvement.md) - Owner feedback on gallery cursors, hover-only cover titles, 4:3 covers, grid spacing, EXIF label and copy protection.
* [2026-11-07 — GitHub issue #6](/sources/2026-11-07-gh-issue-6.md) - Majors batch: Vite 8, ESLint 10, uuid 14, globals 17; TypeScript 7 blocked; Firebase 13 deferred.
* [2026-11-07 — GitHub issue #5](/sources/2026-11-07-gh-issue-5.md) - Firestore grpc-js advisory cleared by a scoped override.
* [2026-11-07 — GitHub issue #3](/sources/2026-11-07-gh-issue-3.md) - Admin route protection and admin-only Firestore/Storage rules.
* [2026-10-29 — GitHub issue #1](/sources/2026-10-29-gh-issue-1.md) - Dependency refresh: in-range updates, deferred majors, security note.
* [2026-10-29 — GitHub issue #6](/sources/2026-10-29-gh-issue-6.md) - MUI 9.5 adoption and the v7→v9 migrations.
* [2026-10-29 — GitHub issue #2](/sources/2026-10-29-gh-issue-2.md) - Public rebuild phases 3–5: grid, feed + lightbox, SEO/performance polish.
* [2026-10-29 — Layout improvements](/sources/2026-10-29-layout-improvements.md) - Owner feedback on fonts, hover, cards, footer, mobile header and drawer.
* [2026-03-03 — Blueprint](/sources/2026-03-03-blueprint.md) - Original feature blueprint (deprecated history).

## Decisions

* [Decision index](/decisions/index.md) - All decisions, newest first.
* [0024 — Compact featured layout, serif logotype and one gallery edit path](/decisions/0024-featured-layout-logotype-admin-cleanup.md) - Single featured banner vs pair, footer socials removed, serif uppercase logotype, edit dialog removed.
* [0023 — Divider between featured and other galleries](/decisions/0023-featured-gallery-divider.md) - Solid centered `LUOGHI` divider in the shared grid when both groups exist.
* [0022 — Cover picker, gallery spacing and photo ratios](/decisions/0022-cover-spacing-and-photo-ratios.md) - Cover chosen from the gallery's photos, separate cover spacing, photo ratio wins in the feed.
* [0021 — Hide empty galleries and add visibility flags](/decisions/0021-visibility-and-empty-galleries.md) - `isVisible` on galleries and images, empty/hidden galleries filtered from the public site, explicit ratio precedence, smaller lightbox caption.
* [0020 — Detach images directly and cache public gallery reads](/decisions/0020-gallery-detach-and-public-cache.md) - Removable gallery chips with atomic detach and cover promotion; cached public reads with a loader instead of a placeholder flash.
* [0019 — Admin previews fall back to the GitHub raw URL](/decisions/0019-admin-image-preview-fallback.md) - Repository previews retry via raw.githubusercontent.com when the file is not in the checkout; public rendering unchanged.
* [0018 — Master image catalog, GitHub discovery and per-gallery layout controls](/decisions/0018-image-catalog-and-layout.md) - `images` catalog, gallery `imageIds`, GitHub discovery, covers, featured galleries, layout config.
* [0017 — Diagnose Firestore permission failures in the client](/decisions/0017-firestore-permission-diagnostics.md) - Structured failure logs, actionable errors and an admins/{uid} preflight; rules stay strict.
* [0016 — Manage galleries in Firestore with static repository images](/decisions/0016-gallery-management.md) - Storage uploads replaced; galleries collection, embedded images, public read with fallback.
* [0015 — Adopt Vite 8, ESLint 10, uuid 14 and globals 17; defer TypeScript 7 and Firebase 13](/decisions/0015-dependency-majors-batch.md) - Majors evaluated one at a time; TypeScript 7 blocked by typescript-eslint.
* [0013 — Override @grpc/grpc-js to a patched 1.14 release](/decisions/0013-grpc-js-override.md) - Scoped override clears the Firestore advisory; browser bundle unaffected.
* [0014 — Protect admin routes and gate data with an admins allowlist](/decisions/0014-admin-route-protection.md) - ProtectedRoute, isAuthReady, and rules with admins/{uid}.
* [0012 — Gallery hover titles and copy guard](/decisions/0012-gallery-hover-titles-and-copy-guard.md) - Hover-only cover titles, 4:3 covers, pointer cursors, copy guard, EXIF label removed.
* [0011 — SEO and route loading](/decisions/0011-seo-and-route-loading.md) - Metadata hook, static sitemap, lazy routes, chunks.
* [0010 — Breadcrumb in the navbar](/decisions/0010-navbar-breadcrumb.md) - Desktop navbar breadcrumb; hidden on mobile.
* [0009 — Masonry feed with hover captions](/decisions/0009-masonry-feed-hover-captions.md) - Masonry layout; captions reveal over a black gradient.
* [0008 — Visual refinements](/decisions/0008-visual-refinements.md) - Fonts, hover, covers, footer, mobile drawer.
* [0007 — Home renders the gallery grid](/decisions/0007-home-gallery-grid.md) - No redirect; `/` and `/gallery` share the grid.
* [0006 — Adopt Material UI 9](/decisions/0006-adopt-mui-9.md) - MUI 9.5 + v9 API migrations.
* [0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md) - In-range now, majors deferred, no force fixes.
* [0004 — Wiki layout under docs/wiki](/decisions/0004-wiki-layout.md) - Raw and wiki as siblings; fixed section layout.
* [0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md) - OKF v0.2 wiki, immutable raw layer, one `AGENTS.md`.
* [0002 — Archive blueprint.md](/decisions/0002-archive-blueprint.md) - Blueprint moved to `docs/raw/`.
* [0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md) - Visual parity, modern implementation.

## Concepts

* [Site Architecture](/concepts/site-architecture.md) - Routing, pages, layout shell.
* [Tech Stack](/concepts/tech-stack.md) - Frameworks, libraries, toolchain.
* [Firebase Backend](/concepts/firebase-backend.md) - Auth, Firestore galleries, rules (no Storage).
* [Photo Management](/concepts/photo-management.md) - Master image catalog, gallery membership, ordering, GitHub discovery.
* [Photo Storage and Backend Options](/concepts/photo-storage-options.md) - Is Firebase the right fit, cost comparison, and alternatives (draft; image storage resolved).
* [Gallery System](/concepts/gallery-system.md) - Public gallery, feed, lightbox, featured covers, layout config, progressive images.
* [Design System](/concepts/design-system.md) - MUI theme, typography, color, responsiveness.
* [SEO and Metadata](/concepts/seo-metadata.md) - Titles, canonical, Open Graph, robots and sitemap.
* [State Management](/concepts/state-management.md) - Zustand stores.
* [Admin Dashboard](/concepts/admin-dashboard.md) - Gallery CRUD, image catalog, GitHub discovery, covers, featured and layout controls.
* [Project Roadmap](/concepts/roadmap.md) - Original phased plan (deprecated).

## Rules

* [Agent Rules](/rules/agent-rules.md) - How agents work in this repo.
* [The Usual Loop](/rules/workflow.md) - The standard end-to-end procedure.
* [Firestore Permissions](/rules/firestore-permissions.md) - Diagnose "Missing or insufficient permissions" on gallery writes.
* [Code Style](/rules/code-style.md) - TypeScript, React, MUI conventions.
* [Git Conventions](/rules/git-conventions.md) - Commits, branches, PRs.

## Reviews

* [Image catalog and layout implementation report — 2026-11-17](/reviews/2026-11-17-image-catalog-implementation.md) - Delivered scope, verification evidence, deviations, risks and follow-ups.
* [Admin galleries implementation report — 2026-11-16](/reviews/2026-11-16-admin-galleries-implementation.md) - Delivered scope, verification evidence, deviations, risks and follow-ups.
* [Open items and library review — 2026-11-07](/reviews/2026-11-07-open-items.md) - Disposition of every open item, library status, accepted risks.
* [Docs and baseline audit — 2026-10-29](/reviews/2026-10-29-docs-audit.md) - Keep/update/archive verdicts and baseline fix.

## Wiki Operations (llm-wiki)

* **Ingest** - New raw file or GitHub issue? Summarize it in `/sources/`, update every concept it touches, flag contradictions with `> [!WARNING]`, append to [Log](/log.md), update this index.
* **Query** - Answer from these pages, not raw code; cite the concept pages used.
* **Lint** - Check orphan pages, broken bundle-relative links, non-OKF `status` values, missing `type` frontmatter, and stale claims. Keep the root clean: only `index.md`, `log.md`, `overview.md`, `rebuild-plan.md`.
