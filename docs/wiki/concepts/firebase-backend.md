---
type: Reference
title: Firebase Backend
description: Authentication, Firestore, and Storage configuration for the portfolio.
tags: [firebase, auth, firestore, storage, backend]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: firebase-init
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/src/firebase.ts
    title: src/firebase.ts
---

# Firebase Backend

## Project

- **Project ID:** `alessandrotorri-it` (from the existing environment wiring).
- **Config:** loaded from `.env` via `VITE_FIREBASE_*` variables; `.env` is gitignored.
- **Init:** `src/firebase.ts` exports the app and `auth`. `src/firebaseData.ts` exports `db` and `storage` so Firestore/Storage load only with the admin routes.

## Authentication

- **Methods:** Google sign-in (the UI also has an email/password action in the store).
- **Library:** `firebase/auth` + a Zustand `authStore`.
- **State sync:** `onAuthStateChanged` in `src/App.tsx`.
- **Route protection:** `ProtectedRoute` wraps the admin routes. `authStore.isAuthReady` prevents a refreshed `/admin` from redirecting before auth resolves ([decision 0014](/decisions/0014-admin-route-protection.md)).

## Firestore

- **Collection:** `images`.
- **Schema:** see [Photo Management](/concepts/photo-management.md).
- **Queries:** filter by `collection`, `isVisible == true`, and order by `order`.
- **Document id:** the id is the Firestore document key, not a stored field. `react-firebase-hooks` 5.1.1 does not inject it, so map `document.id` explicitly when using `useCollection`.

## Storage

- **Path:** `images/{filename}`.
- **Upload:** `uploadBytesResumable` with progress tracking.
- **Download URLs:** stored in the Firestore document `url` field.

## Security rules

- `firestore.rules` and `storage.rules` are in the repository, referenced by `firebase.json`.
- Writes to `images` and Storage uploads require a document `admins/{uid}`; `admins` is read-only from clients and managed in the console.
- `images` documents are readable when `isVisible == true`; Storage `images/` is public-read, with uploads limited to `image/*` and 50 MB.
- Deploy manually once the admin UID is in `admins`: `firebase deploy --only firestore:rules,storage --project alessandrotorri-it`. Not yet deployed or emulator-tested.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Site Architecture](/concepts/site-architecture.md)
