---
type: Reference
title: Firebase Backend
description: Authentication and Firestore for the portfolio; image bytes are static repository assets.
tags: [firebase, auth, firestore, rules, backend]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: firebase-init
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/src/firebase.ts
    title: src/firebase.ts
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
---

# Firebase Backend

## Project

- **Project ID:** `alessandrotorri-it` (from the existing environment wiring).
- **Config:** loaded from `.env` via `VITE_FIREBASE_*` variables; `.env` is gitignored.
- **Init:** `src/firebase.ts` exports the app and `auth`. `src/firebaseData.ts` exports `db` only.

## Authentication

- **Methods:** Google sign-in (the store also has an email/password action).
- **Library:** `firebase/auth` + a Zustand `authStore`.
- **State sync:** `onAuthStateChanged` in `src/App.tsx`.
- **Route protection:** `ProtectedRoute` wraps the admin routes. `authStore.isAuthReady` prevents a refreshed `/admin` from redirecting before auth resolves ([decision 0014](/decisions/0014-admin-route-protection.md)).

## Firestore

- **Collections:** `images` (master catalog: one document per file) and `galleries` (metadata, ordered `imageIds`, cover and layout) — see [Photo Management](/concepts/photo-management.md).
- **Queries:** `orderBy('displayOrder')` for galleries, `orderBy('filename')` for the catalog; the public hook joins them after mount.
- **Access:** public read on both; writes require a document `admins/{uid}`.
- **Document ids:** mapped explicitly by `normalizeGallery` / `normalizeCatalogImage`; they are not stored in the documents. Image ids are derived from the sanitized filename so GitHub indexing is idempotent.

## Storage

Removed on 2026-11-16. Image files live in `public/galleries/` and are deployed with the static host ([Decision 0016](/decisions/0016-gallery-management.md)). `storage.rules` and the `storage` section of `firebase.json` were deleted; `src/firebaseData.ts` no longer exports a Storage handle. `storageBucket` stays in the Firebase config because the console initialises the app with it.

## Backend choice

Firebase still owns auth and metadata; it no longer owns the photo bytes. Whether Firestore itself stays long-term is open — see [Photo Storage and Backend Options](/concepts/photo-storage-options.md). Firebase 13 (issue #21) depends on that decision.

## Owner actions before the admin works

1. In the Firebase console, create `admins/{uid}` with the Auth UID of the owner account.
2. Deploy the rules: `firebase deploy --only firestore:rules --project alessandrotorri-it`.
3. Commit the photos to `public/galleries/`; then index them from `/admin/images` (the GitHub scan lists the committed files).
4. Create or seed at least one gallery and assign catalog images (or accept the static fallback on the public site).
5. Smoke-test as the owner (create, index, assign, set cover, reorder, save) and as a second Google account (expect denial).

If a write still returns `Missing or insufficient permissions`, follow the [Firestore permissions playbook](/rules/firestore-permissions.md). The admin pages preflight `admins/{uid}` and name the missing step ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Dependency note

- `@grpc/grpc-js` is overridden to `^1.14.7` in `package.json` to clear the Firestore advisory ([decision 0013](/decisions/0013-grpc-js-override.md)). The browser bundle does not include it.

## Security rules

- `firestore.rules` is referenced by `firebase.json` and is the only ruleset left.
- `images`: public read; create/update require `isAdmin()` and a valid shape (`filename`, `path`, title/description/alt strings, a valid `aspectRatio`, an optional boolean `isVisible`, a `galleryIds` list of at most 100, timestamp `updatedAt`); delete requires `isAdmin()`.
- `galleries`: public read; create/update require `isAdmin()` **and** a valid shape (string fields, slug pattern, numeric orders, booleans including an optional `isVisible`, `imageIds` list of at most 500, `layoutConfig` with the allowed `aspectRatio`, `padding` and optional `coverSpacing` values, timestamp `updatedAt`); delete requires `isAdmin()`.
- `isVisible` is optional in the rules (`get('isVisible', true) is bool`) so documents created before [Decision 0021](/decisions/0021-visibility-and-empty-galleries.md) stay writable; the client treats a missing field as visible.
- `admins/{uid}` is readable only by that user and never writable from clients.
- The catch-all denies everything else. Leftover documents from the retired 2026-03 `images` model are technically readable but ignored by the client because they lack `filename`/`path`.
- The gallery payload was validated in the Firestore emulator on 2026-11-16; the new `images` rules and the extended gallery validation have not been replayed there yet. Deployment to the live project is still pending.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Site Architecture](/concepts/site-architecture.md)
