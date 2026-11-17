---
type: Playbook
title: Firestore permissions troubleshooting
description: Diagnose "Missing or insufficient permissions" on gallery writes — missing admins/{uid}, undeployed rules, or a payload that fails the shape check.
tags: [playbook, firestore, rules, permissions, admin, debugging]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-firestore-check
    resource: ../../raw/2026-11-16-firestore-check.md
    title: Firestore check request (raw, immutable)
  - id: decision-0017
    resource: /decisions/0017-firestore-permission-diagnostics.md
    title: Diagnose Firestore permission failures in the client
---

# Firestore permissions troubleshooting

## Symptom

`Missing or insufficient permissions` (client code `permission-denied`) when creating, saving, reordering or deleting a gallery in `/admin`.

## What the app now tells you

| Banner / message | Meaning | Fix |
|------------------|---------|-----|
| **Account non abilitato alla scrittura** (yellow) + UID | `admins/{uid}` is missing for the signed-in account | Create the document in the Firebase console: Firestore → `admins` → document ID = the UID shown, any fields |
| **Permessi non verificabili** (red) | Even the self-read of `admins/{uid}` was denied: the ruleset is not the one in this repository | Deploy `firestore.rules` (below) |
| **Permesso negato da Firestore** in the dialog/editor | A write was denied; console has the exact payload | Check both rows above, then compare the payload with `isValidGallery()` |
| No banner, write still denied | Rules deployed and admin document present, but the payload failed the shape check | See [payload checks](#payload-checks) |

The browser console prints one structured line per failure:

```
[galleries] create failed (permission-denied) { path, payload, code, message, error }
```

The payload snapshot replaces server timestamps with `<serverTimestamp>` so it can be compared with the rules field by field.

## Deploy the rules

```bash
# from the repository root; firebase-tools must be available (npx firebase-tools@13 works)
firebase deploy --only firestore:rules --project alessandrotorri-it
```

Notes:

- `storage.rules` no longer exists ([Decision 0016](/decisions/0016-gallery-management.md)); do not pass `storage` to `--only`.
- The repository has no `.firebaserc`, so `--project alessandrotorri-it` is required.
- firebase-tools 14+ requires Java 21. If the machine has an older JDK, use `firebase-tools@13`.

## Create the admin document

1. Sign in to `/admin` and read the UID from the yellow banner (or Firebase Authentication → Users).
2. Firebase console → Firestore Database → collection `admins` → document ID = that UID.
3. Reload `/admin`: the banner disappears and writes are allowed.

`admins/{uid}` is never writable from clients (`allow write: if false`); it is console-managed on purpose.

## Payload checks

`isValidGallery()` requires:

| Field | Rule |
|-------|------|
| `name` | string |
| `slug` | string, `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `description` | string (may be empty) |
| `displayOrder` | number |
| `coverImageUrl` | string (may be empty) |
| `images` | list, at most 500 entries |
| `updatedAt` | timestamp (the client sends `serverTimestamp()`) |

`buildGalleryPayload` in `src/services/galleries.service.ts` produces exactly these fields, and image entries add `id`, `url`, `title`, `alt`, `ratio`, `order`. A mismatch here would surface as a denial even with a valid admin document; the console payload shows which field broke.

## Verified behaviour

The rules were exercised with the Firestore emulator and the exact application payload:

- signed in, no `admins/{uid}` → `permission-denied`;
- signed in, `admins/{uid}` present → create, update and ordered read succeed;
- `getDoc('admins/{uid}')` on a missing document → `exists=false`, no exception (this is what the preflight relies on).

Reproduce locally (requires Java and network for the emulator jar):

```bash
npx firebase-tools@13 emulators:start --only firestore,auth --project demo-check
# point a temporary SDK script at 127.0.0.1:8085 / 127.0.0.1:9099,
# seed admins/{uid} with the admin bypass, and replay the payload
```

## Do not relax the rules

A denial is a signal that the environment is wrong, not that validation is too strict. Weakening `isAdmin()` would let any authenticated Google account write galleries; weakening `isValidGallery()` would let malformed documents break the public feed. Fix the environment instead ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).

## Related

- [Firebase Backend](/concepts/firebase-backend.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Source summary — Firestore check](/sources/2026-11-16-firestore-check.md)
- [Decision 0016 — Gallery management](/decisions/0016-gallery-management.md)
- [Issue #3 — admin protection and rules](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3)
