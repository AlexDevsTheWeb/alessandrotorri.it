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
- **Init:** `src/firebase.ts` exports `auth`, `db`, and `storage`.

## Authentication

- **Methods:** Google sign-in (the UI also has an email/password action in the store).
- **Library:** `firebase/auth` + a Zustand `authStore`.
- **State sync:** `onAuthStateChanged` in `src/App.tsx`.
- **Route protection:** `ProtectedRoute` exists but is **commented out** in `src/App.tsx`; admin routes are currently public. Tracked in issue #3.

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

`firestore.rules` and `storage.rules` are not in the repository yet. Add them with the admin-hardening work (issue #3) before deploying.

## Related

- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Site Architecture](/concepts/site-architecture.md)
