---
type: Overview
title: Project Overview
description: Tier-1 synthesis hub — what the project is, where it stands, and how the plans relate.
tags: [overview, synthesis, status]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: live-site
    resource: https://alessandrotorri.it/
    title: Live Adobe Portfolio site
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
  - id: raw-rebuild
    resource: ../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Project Overview

Photography portfolio for Alessandro Torri (landscape / long-exposure). React 19 + Vite 8 + MUI 9 + Zustand + Firebase. The live site today is Adobe Portfolio (`marta/ludwig`); this repo rebuilds it with the **exact look & feel**, implemented on the modern stack, plus a protected administrator section.

## Where things stand

* **v1.0.0 — release prepared 2026-11-19, deploy repaired 2026-11-21.** Version `1.0.0`; CI runs lint, typecheck and build; `preview.yml` deploys PR preview channels and `deploy.yml` deploys Firestore rules + Firebase Hosting on `main` / `v*` tags. `main` and the `v1.0.0` tag exist, but every `Deploy` run failed at the rules step with a `403` from `firestore.googleapis.com` because the workflow used a service account without permission on the project; the hosting step never ran, so the site answers "Site not found". The workflows now accept either secret name, validate the credential and stay three files ([Decision 0026](/decisions/0026-firebase-credentials-and-workflow-consolidation.md), [playbook](/rules/release-deployment.md)). A successful deploy is still pending.
* **Knowledge foundation — done 2026-10-29.** `docs/wiki/` is an OKF v0.2 bundle; `docs/raw/` is immutable; `AGENTS.md` is the canonical schema for every agent; the usual loop is documented and loadable as a skill.
* **Baseline — green.** `npm run lint`, `npm run typecheck` and `npm run build` pass. CI runs all three on push/PR.
* **Public rebuild — phases 0–5 done.** Data layer, shell, cover grid, Masonry feed + lightbox, layout refinements, SEO/metadata, lazy routes and code splitting are in place. The administrator section manages galleries and the image catalog ([Decision 0016](/decisions/0016-gallery-management.md), [Decision 0018](/decisions/0018-image-catalog-and-layout.md)); remaining work is content seeding, the first production deploy and the deployed Lighthouse check. See [Rebuild Plan](/rebuild-plan.md), [Decision 0008](/decisions/0008-visual-refinements.md) and [Decision 0011](/decisions/0011-seo-and-route-loading.md).
* **Gallery refinements — 2026-11-07.** Covers are 4:3 with titles revealed on hover, the grid is tighter, images have pointer cursors, the EXIF label is gone and the single gallery is protected from right-click copying ([Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
* **Libraries — in-range refresh done, MUI 9 adopted 2026-10-29.** `npm update` applied all compatible updates and the lockfile is authoritative. Material UI is now 9.5.0 ([Decision 0006](/decisions/0006-adopt-mui-9.md)); Vite 8, ESLint 10, uuid 14 and globals 17 are adopted ([Decision 0015](/decisions/0015-dependency-majors-batch.md)); TypeScript 7 is blocked by typescript-eslint and Firebase 13 is deferred, both in issue #6. The Firebase grpc advisory is in issue #5.
* **Admin — galleries done (2026-11-16).** The Storage-upload screens were replaced by a gallery admin: Firestore `galleries` with embedded images, full CRUD, drag-and-drop ordering, image previews and per-image alt/title/ratio. Image files are static assets in `public/galleries/`; `storage.rules` is gone. The public site reads Firestore and falls back to the static CDN dataset ([Decision 0016](/decisions/0016-gallery-management.md)). A permission failure found in the first live attempt is now self-diagnosing: structured console logs, actionable messages and an `admins/{uid}` preflight banner ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)). Admin writes succeed live; `deploy.yml` deploys the repository rules on release tags.
* **Image catalog + layout — 2026-11-17.** Image metadata moved from embedded gallery arrays into a master `images` collection; galleries reference it through ordered `imageIds` and mirror membership in `galleryIds`. `/admin/images` discovers the files committed to `public/galleries/` through the GitHub contents API, filters unindexed/incomplete/unassigned photos, edits metadata inline and assigns galleries. Galleries gained a cover (`coverImageId` + denormalized URL), a featured flag and `layoutConfig` (aspect ratio, padding); the homepage pins featured galleries full-width and every image is `object-fit: cover; object-position: center` ([Decision 0018](/decisions/0018-image-catalog-and-layout.md)). The fixed 4:3 cover from [0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md) is superseded for Firestore galleries.
* **Admin previews — 2026-11-18.** A photo uploaded to `public/galleries/` on GitHub was discovered by `/admin/images` but had no thumbnail: previews used the checkout path while discovery read `development`. Admin previews now fall back to the GitHub raw URL ([Decision 0019](/decisions/0019-admin-image-preview-fallback.md)); public rendering still uses only deployed assets.
* **Gallery removal and public reads — 2026-11-18.** Assigned gallery chips on `/admin/images` can be removed with an atomic detach that promotes the cover ([Decision 0020](/decisions/0020-gallery-detach-and-public-cache.md)). Public pages cache the last Firestore join and show a loader on a cold load, so the static CDN placeholders no longer flash before the real galleries; admin writes invalidate that cache.
* **Visibility and ratio polish — 2026-11-18.** Galleries and catalog images have `isVisible` (default true, no migration). Hidden photos disappear from every gallery; hidden galleries and galleries with no visible photos disappear from `/` and `/gallery`, and direct links show "not found". The lightbox caption is 0.875 rem ([Decision 0021](/decisions/0021-visibility-and-empty-galleries.md)).
* **Cover, spacing and photo ratios — 2026-11-18.** The gallery cover is chosen from the gallery's own photos; `coverSpacing` adds space around the cover in the grid independently of the photo spacing; an explicit photo ratio now wins in the feed, with the gallery ratio as the fallback for `Naturale` photos and the cover ([Decision 0022](/decisions/0022-cover-spacing-and-photo-ratios.md)).
* **Featured divider — 2026-11-18.** Featured galleries are separated from the remaining galleries by a centered, solid `LUOGHI` divider in the shared grid ([Decision 0023](/decisions/0023-featured-gallery-divider.md)).
* **Featured sizing and admin cleanup — 2026-11-19.** One featured gallery is a full-width banner capped at 420 px; two or more are a half-width pair. The footer keeps only the copyright, the logotype uses Instrument Serif uppercase with wider tracking, and the admin has one edit path: the detail page (the pen dialog is gone) ([Decision 0024](/decisions/0024-featured-layout-logotype-admin-cleanup.md)).
* **Images — repository assets, not Firebase Storage.** `/galleries/<file>` paths are deployed with the site; the Adobe CDN dataset is kept only as a failure/empty fallback. Firestore is authoritative whenever it returns galleries.

> [!WARNING] Release status — raw spec vs reality
> The 2026-11-19 source asks the overview to say `v1.0.0 Stable Production` and to write a release summary into `docs/raw/`. Neither is accurate: every Firebase Hosting deploy has failed so far (a credential 403 on the rules step) and the live domain still serves the Adobe Portfolio site; `docs/raw/` is immutable. The wiki says "release prepared, deploy repaired, first successful deploy pending" until `deploy.yml` succeeds, and the summary lives in [the release report](/reviews/2026-11-19-v1.0.0-release.md) ([Decision 0025](/decisions/0025-release-v1-and-ci-cd.md), [Decision 0026](/decisions/0026-firebase-credentials-and-workflow-consolidation.md)).

> [!WARNING] Contradiction — exact clone vs modern reinterpretation
> The Rebuild Plan originally said "modern reinterpretation (not pixel-clone)". The 2026-10-29 charter says "re-create the exact look & feel". [Decision 0003](/decisions/0003-exact-look-and-feel.md) resolves it: **visual parity, modern implementation**. Do not redesign the layout while calling it a rebuild.

> [!WARNING] Contradiction — cover ratio
> [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md) fixed covers at 4:3. [Decision 0018](/decisions/0018-image-catalog-and-layout.md) makes the ratio per gallery (`layoutConfig.aspectRatio`, default `3/2`) as the owner requested on 2026-11-17. The static CDN fallback still renders 4:3; the hover-title, cursor and copy-guard rules stand.

> [!WARNING] Contradiction — live-site cover titles vs owner feedback
> [Decision 0003](/decisions/0003-exact-look-and-feel.md) keeps cover titles visible as on the live site. [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md) hides them until hover at the owner's request. The owner's feedback wins; treat the live site as reference for layout, not for hover details.

> [!WARNING] Contradiction — which plan is current?
> [Project Roadmap](/concepts/roadmap.md) describes the original long-exposure plan and is now `deprecated`. For all current work, [Rebuild Plan](/rebuild-plan.md) is authoritative. The [blueprint](/sources/2026-03-03-blueprint.md) is archived history only.

> [!QUESTION] Open questions
> * Which service account will be the long-term deployment identity? `FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT` works where `FIREBASE_SERVICE_ACCOUNT` returns 403; the generic alias should be fixed or deleted.
> * Is the deployed Firestore ruleset the repository revision? The admin writes succeed and `deploy.yml` deploys the rules on `v*` tags; the first successful automated run will confirm it.
> * Does the Firebase project still need a Hosting site created (`firebase hosting:sites:create alessandrotorri-it`), or did `firebase init` provision it? "Site not found" is unresolved until a deploy reaches the hosting step.
> * Should Firestore stay as the metadata store now that images are static repository assets? See [Photo Storage and Backend Options](/concepts/photo-storage-options.md).
> * When does the owner seed the remaining galleries and run the first production deploy?
> * Home `/` = same cover grid as `/gallery`, or redirect? (Rebuild Plan phase 3 decided: same grid.)
> * Which dependency majors are worth adopting? (Issues #20 and #21; requires a decision record per major.)

## Cluster map

* Foundation: [Decision 0001](/decisions/0001-knowledge-base-and-agent-schema.md), [The Usual Loop](/rules/workflow.md), [Docs audit](/reviews/2026-10-29-docs-audit.md)
* Architecture: [Site Architecture](/concepts/site-architecture.md), [Tech Stack](/concepts/tech-stack.md), [State Management](/concepts/state-management.md)
* Backend: [Firebase Backend](/concepts/firebase-backend.md), [Photo Management](/concepts/photo-management.md)
* Frontend: [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Admin Dashboard](/concepts/admin-dashboard.md), [State Management](/concepts/state-management.md)
* Process: [Source summaries](/sources/index.md), [Decisions](/decisions/index.md), [Rules](/rules/index.md)
