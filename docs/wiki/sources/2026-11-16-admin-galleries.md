---
type: Source Summary
title: "2026-11-16 — Admin gallery management specification"
description: Owner specification for PR #23 review and a dynamic gallery admin backed by Firestore metadata and static repository images.
tags: [source, admin, galleries, firestore, pr-23, storage]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-admin-galleries
    resource: ../../raw/2026-11-16-admin-galleries.md
    title: Task specification for OpenCode — PR #23 review and dynamic gallery management (raw, immutable)
    author: human:alessandrotorri
---

# Summary

The owner asks for two things: assess PR #23 before starting new work, and replace the admin's Storage-upload model with **dynamic gallery management**. Image files move into `public/galleries/` (WebP/JPEG, ~1600 px long edge) and are deployed with the site; Firestore keeps the gallery metadata. The admin must support gallery CRUD, gallery ordering, image assignment with title/alt text, live previews and image ordering, with MUI components matching the dark photography aesthetic.

# PR #23 assessment

| Item | Finding |
|------|---------|
| PR | [#23](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23) — `docs: open items review, library updates and backend options` |
| State | Open, draft, mergeable (`CLEAN`), CI `verify` passed |
| Base | `development`. The source says "against `main`", but no `main` branch exists; `development` is the integration branch |
| Contents | `zustand` 5.0.16 → 5.1.0, `@types/node` 24 → 22, the 2026-11-07 open-items review, the photo-storage options concept, issue #14 source summary, wiki index/log/plan updates |
| Pending infra/admin fixes | None |
| Recommendation | Merge #23 into `development` first, then rebase the gallery branch. This PR's branch is stacked on #23 to avoid wiki conflicts until then |

# Requirements → implementation

| Requirement | Implementation |
|-------------|----------------|
| Analyze PR #23 | Recorded above and in [Decision 0016](/decisions/0016-gallery-management.md) context |
| Images in `public/galleries/` | Directory added; admin stores `/galleries/<file>` paths; no Storage client remains |
| Gallery CRUD | `AdminDashboard` create/edit/delete dialogs; `/admin/gallery/:galleryId` editor |
| Gallery ordering | Drag-and-drop list plus an explicit `displayOrder` field, persisted in one batch |
| Image assignment | URL/title/alt/ratio rows with live thumbnail previews |
| Image ordering | Drag-and-drop inside the gallery draft, persisted with the gallery document |
| TypeScript definitions | `Gallery`, `GalleryImage`, `GalleryOrder`, `GalleryDraft`, `GalleryImageDraft` in `src/types/gallery.types.ts` |
| Firestore schema | `galleries` collection with embedded `images` (see the decision) |
| Zustand store | `useGalleryStore` in `src/store/galleryStore.ts` |
| MUI v7+ components | MUI 9 components with `sx`; Italian admin copy; dark-theme friendly |
| Rules | `galleries` public read, admin-only validated writes; legacy `images` rules removed |
| Public wiring | `/`, `/gallery` and `/gallery/:slug` read Firestore and fall back to the static CDN dataset |
| Checks | `npm run lint`, `npm run build`, plus manual admin checks pending a live project |

# Deviations from the raw source

- **No `main` branch.** The comparison target is `development` (the repository default), not `main`.
- **Slug and ratio fields added** to the schema: the public route needs a stable segment, and the feed needs the aspect ratio.
- **The spec is silent on the public site.** The admin would manage data nobody renders, so the public read path was added with a static fallback (confirmed with the owner before implementation).
- **The legacy `images` model is replaced, not kept**, also confirmed with the owner.
- **No binary upload in the browser.** Repository files plus git/deploy are the upload path, exactly as the spec's storage section describes.
- **`IMPLEMENTATION_PLAN.md` lives at the repository root** as the spec requires, and is summarized here plus [Decision 0016](/decisions/0016-gallery-management.md).

# Verification

- `npm run lint` — clean.
- `npm run build` — succeeds; the Firestore gallery service is emitted as its own lazy chunk.
- Not verified: live Firestore reads/writes, rules deployment, drag-and-drop in a browser. These need `.env` credentials and a deployed ruleset (issue #3).

# Links

- [Raw source](../../raw/2026-11-16-admin-galleries.md)
- [Decision 0016 — Manage galleries in Firestore with static repository images](/decisions/0016-gallery-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Gallery System](/concepts/gallery-system.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Photo Management](/concepts/photo-management.md)
- [PR #23](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23)
- [Issue #3 — admin protection and rules](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3)
