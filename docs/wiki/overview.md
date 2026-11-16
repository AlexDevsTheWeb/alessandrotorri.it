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

Photography portfolio for Alessandro Torri (landscape / long-exposure). React 19 + Vite + MUI 7 + Zustand + Firebase. The live site today is Adobe Portfolio (`marta/ludwig`); this repo rebuilds it with the **exact look & feel**, implemented on the modern stack, plus a protected administrator section.

## Where things stand

* **Knowledge foundation — done 2026-10-29.** `docs/wiki/` is an OKF v0.2 bundle; `docs/raw/` is immutable; `AGENTS.md` is the canonical schema for every agent; the usual loop is documented and loadable as a skill.
* **Baseline — green.** `npm run lint` and `npm run build` pass. CI runs both on push/PR.
* **Public rebuild — phases 0–5 done.** Data layer, shell, cover grid, Masonry feed + lightbox, layout refinements, SEO/metadata, lazy routes and code splitting are in place. The administrator section now manages galleries ([Decision 0016](/decisions/0016-gallery-management.md)); what remains is deploying the rules, seeding galleries and retiring the CDN fallback. See [Rebuild Plan](/rebuild-plan.md), [Decision 0008](/decisions/0008-visual-refinements.md) and [Decision 0011](/decisions/0011-seo-and-route-loading.md).
* **Gallery refinements — 2026-11-07.** Covers are 4:3 with titles revealed on hover, the grid is tighter, images have pointer cursors, the EXIF label is gone and the single gallery is protected from right-click copying ([Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md)).
* **Libraries — in-range refresh done, MUI 9 adopted 2026-10-29.** `npm update` applied all compatible updates and the lockfile is authoritative. Material UI is now 9.5.0 ([Decision 0006](/decisions/0006-adopt-mui-9.md)); Vite 8, ESLint 10, uuid 14 and globals 17 are adopted ([Decision 0015](/decisions/0015-dependency-majors-batch.md)); TypeScript 7 is blocked by typescript-eslint and Firebase 13 is deferred, both in issue #6. The Firebase grpc advisory is in issue #5.
* **Admin — galleries done (2026-11-16).** The Storage-upload screens were replaced by a gallery admin: Firestore `galleries` with embedded images, full CRUD, drag-and-drop ordering, image previews and per-image alt/title/ratio. Image files are static assets in `public/galleries/`; `storage.rules` is gone. The public site reads Firestore and falls back to the static CDN dataset ([Decision 0016](/decisions/0016-gallery-management.md)). A permission failure found in the first live attempt is now self-diagnosing: structured console logs, actionable messages and an `admins/{uid}` preflight banner ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)). Rules are validated in the emulator but not confirmed deployed.
* **Images — repository assets, not Firebase Storage.** `/galleries/<file>` paths are deployed with the site; the old Adobe CDN dataset remains the public fallback until the owner seeds galleries.

> [!WARNING] Contradiction — exact clone vs modern reinterpretation
> The Rebuild Plan originally said "modern reinterpretation (not pixel-clone)". The 2026-10-29 charter says "re-create the exact look & feel". [Decision 0003](/decisions/0003-exact-look-and-feel.md) resolves it: **visual parity, modern implementation**. Do not redesign the layout while calling it a rebuild.

> [!WARNING] Contradiction — live-site cover titles vs owner feedback
> [Decision 0003](/decisions/0003-exact-look-and-feel.md) keeps cover titles visible as on the live site. [Decision 0012](/decisions/0012-gallery-hover-titles-and-copy-guard.md) hides them until hover at the owner's request. The owner's feedback wins; treat the live site as reference for layout, not for hover details.

> [!WARNING] Contradiction — which plan is current?
> [Project Roadmap](/concepts/roadmap.md) describes the original long-exposure plan and is now `deprecated`. For all current work, [Rebuild Plan](/rebuild-plan.md) is authoritative. The [blueprint](/sources/2026-03-03-blueprint.md) is archived history only.

> [!QUESTION] Open questions
> * Is the ruleset deployed in the Firebase project and is `admins/{uid}` populated for the owner? The admin preflight answers this at a glance; see the [Firestore permissions playbook](/rules/firestore-permissions.md).
> * Should Firestore stay as the metadata store now that images are static repository assets? See [Photo Storage and Backend Options](/concepts/photo-storage-options.md).
> * When does the owner seed `galleries` and retire the Adobe CDN fallback?
> * Home `/` = same cover grid as `/gallery`, or redirect? (Rebuild Plan phase 3 decided: same grid.)
> * Which dependency majors are worth adopting? (Issue #1; requires a decision record per major.)

## Cluster map

* Foundation: [Decision 0001](/decisions/0001-knowledge-base-and-agent-schema.md), [The Usual Loop](/rules/workflow.md), [Docs audit](/reviews/2026-10-29-docs-audit.md)
* Architecture: [Site Architecture](/concepts/site-architecture.md), [Tech Stack](/concepts/tech-stack.md), [State Management](/concepts/state-management.md)
* Backend: [Firebase Backend](/concepts/firebase-backend.md), [Photo Management](/concepts/photo-management.md)
* Frontend: [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Admin Dashboard](/concepts/admin-dashboard.md)
* Process: [Source summaries](/sources/index.md), [Decisions](/decisions/index.md), [Rules](/rules/index.md)
