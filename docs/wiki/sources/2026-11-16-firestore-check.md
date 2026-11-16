---
type: Source Summary
title: "2026-11-16 — Firestore permission check for gallery writes"
description: Owner report of "Missing or insufficient permissions" when creating or saving a gallery, with the requested payload/rules inspection and the resolution.
tags: [source, firestore, rules, permissions, admin, debugging]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-firestore-check
    resource: ../../raw/2026-11-16-firestore-check.md
    title: Firestore check request (raw, immutable)
    author: human:alessandrotorri
---

# Summary

The owner reports `Missing or insufficient permissions` when creating or saving a gallery in `/admin`, and asks for four things: inspect how the writes are built, add detailed `console.error` logging on failures, verify that `firestore.rules` matches the written payload, and explain/fix the failure.

# Finding

The payload and the rules **already match**. The denial is authorization, not schema:

| Scenario (Firestore emulator, exact app payload) | Result |
|--------------------------------------------------|--------|
| Signed in, **no** `admins/{uid}` document | `permission-denied` (`isAdmin()` false) |
| Signed in, `admins/{uid}` present | create **OK**, update **OK**, ordered read **OK** |
| `getDoc('admins/{uid}')` with no document | resolves with `exists=false` (no exception) |

The payload sent by `createGallery` (`name`, `slug`, `description`, `displayOrder`, `coverImageUrl`, `images[]`, `createdAt`/`updatedAt` server timestamps) passes `isValidGallery()` unchanged, including `updatedAt is timestamp` with `FieldValue.serverTimestamp()`. So the two causes left are environmental:

1. `admins/{uid}` does not exist for the signed-in account — the rules' `isAdmin()` gate.
2. `firestore.rules` was never deployed (the deployed ruleset is still the `images`-era one, or the default deny).

Before this change the UI surfaced only the raw Firebase message, so both cases looked identical. The fix is diagnostic: structured logs, actionable messages, and a preflight read of `admins/{uid}` that names the problem and shows the UID.

# Request → implementation

| Request | Implementation |
|---------|----------------|
| Inspect how writes are formatted | `createGallery`/`saveGallery`/`reorderGalleries` build one payload via `buildGalleryPayload`; inspected against the rules and exercised in the emulator |
| Add detailed `console.error` on failure | `logFirestoreFailure` in `galleries.service.ts` logs operation, target path, payload snapshot, error code, message and the original error |
| Check the rules against the payload | Verified in the emulator (table above); no rule change was necessary |
| Explain and fix the failure | Preflight `checkAdminAccess` + dashboard banner with the UID and both remediation steps; `describeGalleryError` maps `permission-denied`/`unavailable`/`failed-precondition` to Italian guidance |

# Deviations and notes

- The source refers to `src/stores/useGalleryStore.ts`; the repository has `src/store/galleryStore.ts` (singular, no `use` prefix in the filename).
- No Firestore rule was weakened. Relaxing `isAdmin()` or the shape check would turn a deployment mistake into an open write path.
- The `console.error` calls are intentional and error-path only; they are the documented exception to the "no console noise" convention ([Decision 0017](/decisions/0017-firestore-permission-diagnostics.md)).
- The emulator run used `firebase-tools@13.35.1` because the machine has Java 19 and newer tools require Java 21.

# Verification

- Emulator: deny without `admins/{uid}`, allow with it, update and ordered read succeed.
- `npm run lint` clean; `npm run build` green.
- Not verified: the deployed project (no credentials in this session). The owner must deploy the rules and create the admin document.

# Links

- [Raw source](../../raw/2026-11-16-firestore-check.md)
- [Firestore permissions playbook](/rules/firestore-permissions.md)
- [Decision 0017 — Firestore permission diagnostics](/decisions/0017-firestore-permission-diagnostics.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Issue #3 — admin protection and rules](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3)
