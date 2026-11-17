---
type: Source Summary
title: 2026-11-17 — Image catalog, GitHub discovery and dynamic layout
description: Owner specification for a master Firestore image catalog, GitHub file discovery, gallery assignment, featured galleries and layout controls.
tags: [source, admin, images, github, catalog, featured, layout]
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

# 2026-11-17 — Image catalog, GitHub discovery and dynamic layout

## What the source asks

The 2026-11-16 gallery admin is extended into a photo-first workflow:

1. a master `images` catalog in Firestore, one document per file, with `filename`, `path`, `title`, `description`, `alt`, `aspectRatio` and `galleryIds`;
2. GitHub REST discovery of `public/galleries/`, cross-referenced with the catalog so unindexed files are visible;
3. a dedicated `/admin/images` screen with filters (all, new/unindexed, missing title, missing description, unassigned), inline metadata editing, gallery assignment and a quick "create gallery" modal;
4. cover designation from the gallery's own images (`coverImageId`, `coverImageUrl`);
5. featured galleries (`isFeatured`, `featuredOrder`) pinned full-width at the top of the homepage;
6. per-gallery `layoutConfig` (`aspectRatio`, `padding`) and strict `object-fit: cover; object-position: center` rendering;
7. Firestore rules for `images` plus the new gallery fields.

## Decisions made while ingesting

- **Catalog over embedded images.** [Decision 0016](/decisions/0016-gallery-management.md) had chosen embedded `images` to keep a gallery and its ordering atomic. The catalog is required for reuse, the unassigned filter and cover designation; [Decision 0018](/decisions/0018-image-catalog-and-layout.md) supersedes the embedded-image parts of 0016. Galleries keep an ordered `imageIds` array.
- **Two indexes, one batch.** `galleries.imageIds` and `images.galleryIds` are written together in one Firestore batch on every membership change.
- **No token.** The GitHub call is unauthenticated; `VITE_GITHUB_REPO` and `VITE_GITHUB_BRANCH` override the defaults. A token in a Vite env would ship in the public bundle.
- **Aspect ratio supersedes 0012.** Firestore covers use `layoutConfig.aspectRatio` (default `3/2` per the source); the static fallback keeps 4:3. See the warning in [Design System](/concepts/design-system.md).
- **Repository stack.** The source names Vite 7 and MUI 7; the repository runs Vite 8 and MUI 9 ([Tech Stack](/concepts/tech-stack.md)).

## Delivered

- `images` collection, `src/services/images.service.ts`, `src/store/imageStore.ts`.
- `src/services/githubImages.service.ts` and the `/admin/images` page with the five filters, inline edits, assignment, quick gallery creation and bulk indexing.
- Gallery editor: catalog assignment, reorder, cover star, featured switch and layout selects; the legacy embedded-image shape gets a migration warning.
- Public: featured covers full-width at the top, per-gallery cover ratio, feed ratio/spacing from `layoutConfig`, `object-position: center`.
- Rules: public read and validated admin writes for `images`; `isValidGallery()` accepts the new fields.
- Docs: [Decision 0018](/decisions/0018-image-catalog-and-layout.md), this summary, and updates to the admin, photo, backend, gallery, state, architecture, design, overview and plan pages.

## Verification

`npm run lint` and `npm run build` pass. Not exercised in this session: live Firestore reads/writes, rules deployment, the GitHub call with real files and browser checks; they need the owner's credentials, deployed rules and committed images (issue #3).

## Open items

- Deploy `firestore.rules` and create `admins/{uid}` (issue #3).
- Commit the photos to `public/galleries/`, index them and assign galleries.
- Delete any leftover documents from the retired 2026-03 `images` collection; the new reads ignore them.
