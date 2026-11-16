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

- **Collection:** `galleries`, one document per gallery with embedded images ([Photo Management](/concepts/photo-management.md)).
- **Queries:** `orderBy('displayOrder')` for the grid; the feed reads the document array.
- **Access:** public read; writes require a document `admins/{uid}`.
- **Document id:** the Firestore key, mapped explicitly by `normalizeGallery`; it is not stored in the document.

## Storage

Removed on 2026-11-16. Image files live in `public/galleries/` and are deployed with the static host ([Decision 0016](/decisions/0016-gallery-management.md)). `storage.rules` and the `storage` section of `firebase.json` were deleted; `src/firebaseData.ts` no longer exports a Storage handle. `storageBucket` stays in the Firebase config because the console initialises the app with it.

## Backend choice

Firebase still owns auth and metadata; it no longer owns the photo bytes. Whether Firestore itself stays long-term is open — see [Photo Storage and Backend Options](/concepts/photo-storage-options.md). Firebase 13 (issue #21) depends on that decision.

## Owner actions before the admin works

1. In the Firebase console, create `admins/{uid}` with the Auth UID of the owner account.
2. Deploy the rules: `firebase deploy --only firestore:rules --project alessandrotorri-it`.
3. Seed at least one gallery (or accept the static fallback on the public site).
4. Smoke-test as the owner (create, reorder, save) and as a second Google account (expect denial).

If a write still returns `Missing or insufficient permissions`, follow the [Firestore permissions playbook](/rules/firestore-permissions.md). The admin page now preflights `admins/{uid}` and names the missing step ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Dependency note

- `@grpc/grpc-js` is overridden to `^1.14.7` in `package.json` to clear the Firestore advisory ([decision 0013](/decisions/0013-grpc-js-override.md)). The browser bundle does not include it.

## Security rules

- `firestore.rules` is referenced by `firebase.json` and is the only ruleset left.
- `galleries`: public read; create/update require `isAdmin()` **and** a valid shape (string fields, slug pattern, numeric order, list of at most 500 images, timestamp `updatedAt`); delete requires `isAdmin()`.
- `admins/{uid}` is readable only by that user and never writable from clients.
- The catch-all denies everything else, including the retired `images` collection.
- The gallery payload and these checks were validated in the Firestore emulator on 2026-11-16 (deny without `admins/{uid}`, allow with it). Deployment to the live project is still pending.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Site Architecture](/concepts/site-architecture.md)
