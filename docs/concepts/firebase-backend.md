---
type: Reference
title: Firebase Backend
description: Authentication, Firestore, and Storage configuration for the portfolio.
tags: [firebase, auth, firestore, storage, backend]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Firebase Backend

## Project

- **Project ID**: `alessandrotorri-it`
- **Config**: Loaded from `.env` via `VITE_FIREBASE_*` environment variables
- **Init file**: `src/firebase.ts`

## Authentication

- **Methods**: Email/password + Google sign-in
- **Library**: `firebase` + `react-firebase-hooks`
- **Admin access**: Google sign-in via `LoginPage`
- **State**: Managed in `src/store/authStore.ts` (Zustand)
- **Route protection**: `ProtectedRoute` component wraps `/admin` routes

## Firestore

- **Collection**: `images`
- **Document schema**: See [Photo Management](/concepts/photo-management.md)
- **Queries**: Filter by `collection` name, `isVisible == true`, ordered by `order`

## Storage

- **Path**: `images/{filename}`
- **Upload**: `uploadBytesResumable` with progress tracking
- **Download URLs**: Stored in Firestore documents
