---
type: Decision
title: "0014 — Protect admin routes and gate data with an admins allowlist"
description: Wrap the admin routes in ProtectedRoute, wait for auth to resolve before redirecting, and add Firestore and Storage rules that only allow UIDs listed in an admins collection.
tags: [decision, admin, security, firebase, auth, rules]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: gh-issue-3
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3
    title: "Issue #3 — protect admin routes and finish the administrator section"
  - id: decision-0001
    resource: /decisions/0001-knowledge-base-and-agent-schema.md
    title: Knowledge base and agent schema
---

# Context

The administrator section (`/admin`, `/admin/collection/:name`) was publicly reachable. `ProtectedRoute` existed but was not applied, and the repository had no Firestore or Storage rules. Google sign-in accepts any Google account, so a signed-in check alone is not enough to keep strangers out of the data.

Auth state also resolves asynchronously. A naive redirect on first render would send a refreshed `/admin` to `/login` before Firebase reports the signed-in user.

# Decision

1. **Route guard:** `ProtectedRoute` wraps both admin routes as a layout route. While `isAuthReady` is false it renders `PageLoader`; signed-out users go to `/login` with `replace`.
2. **Auth readiness:** `authStore` gets `isAuthReady`, set to `true` by the first `onAuthStateChanged` callback in `App.tsx`.
3. **Data gate:** `firestore.rules` and `storage.rules` allow writes only when `request.auth.uid` has a document in `admins/{uid}`. The `admins` collection is read-only from clients (each user can read only their own document) and is managed in the Firebase console.
4. **Public reads, narrowly:** `images` documents are readable when `isVisible == true`. Storage objects under `images/` are publicly readable, because the stored download URLs must keep working. Uploads are limited to `image/*` and 50 MB.
5. **Deploy config:** `firebase.json` points the Firebase CLI at the two rules files. Deployment is manual (`firebase deploy --only firestore:rules,storage --project alessandrotorri-it`).

No admin email or UID is stored in the repository. Access is granted by creating an `admins/{uid}` document in the console.

# Verification

- `npm run lint` and `npm run build` pass.
- Browser check on `vite preview` (real Chrome, Playwright): `/admin` and `/admin/collection/01-favorite` redirect to `/login` when signed out; `/gallery` stays public.
- Not verified: rules behavior in the Firebase emulator or on the live project; a signed-in admin flow. Run both before relying on the rules.

# Consequences

- Signed-out visitors cannot see the admin screens.
- A signed-in Google account that is not in `admins` can open the admin screens, but Firestore and Storage deny its reads and writes. The UI shows permission errors rather than data. A client-side admin check is a possible follow-up.
- Uploads and edits require the owner to add their UID to `admins` once, and to deploy the rules.

> [!QUESTION] Admin bootstrap
> Which Firebase Auth UID should be the first `admins/{uid}` document? The owner has to create it in the console; it is not stored in the repository.

# Links

- [Source summary](/sources/2026-11-07-gh-issue-3.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Site Architecture](/concepts/site-architecture.md)
