---
type: Decision
title: "0017 — Diagnose Firestore permission failures in the client"
description: Structured failure logs, actionable error messages and an admins/{uid} preflight instead of raw Firebase errors, with no relaxation of the security rules.
tags: [decision, firestore, rules, diagnostics, admin, permissions]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-16T00:00:00Z }
sources:
  - id: raw-firestore-check
    resource: ../../raw/2026-11-16-firestore-check.md
    title: Firestore check request (raw, immutable)
  - id: decision-0016
    resource: /decisions/0016-gallery-management.md
    title: Manage galleries in Firestore with static repository images
---

# 0017 — Diagnose Firestore permission failures in the client

## Context

Creating or saving a gallery returned `Missing or insufficient permissions`. The client only surfaced the raw Firebase message, so a missing `admins/{uid}` document and an undeployed ruleset looked identical. An emulator run with the exact application payload showed that the payload satisfies `isValidGallery()` and that the write succeeds once `admins/{uid}` exists ([source summary](/sources/2026-11-16-firestore-check.md)).

## Decision

1. **Every Firestore operation in `galleries.service.ts` logs its failure** through one helper that prints the operation, target path, payload snapshot (server timestamps marked), error code, message and the original error object. Logging happens only on the error path.
2. **Errors are translated for the UI.** `describeGalleryError` maps `permission-denied`, `unavailable` and `failed-precondition` to Italian guidance; unknown errors keep the Firebase message.
3. **The admin page preflights access.** After sign-in it reads `admins/{uid}` (allowed by the rules) and shows a warning naming the UID and the fix when the document is missing, or a deployment warning when the read itself is denied.
4. **The rules stay strict.** `isAdmin()`, `isValidGallery()` and the catch-all are unchanged. A permission denial is a configuration signal, never a reason to relax validation.

## Consequences

Positive:

- The two real causes — missing admin document and undeployed rules — are now distinguishable in one screen, with the exact UID needed for the console.
- Browser-console output carries the exact payload, so future shape mismatches are diagnosable without re-reading the code.
- No security tradeoff and no new dependency.

Negative:

- `console.error` is emitted in production on failures. Accepted: error path only, no user data beyond the gallery being saved.
- One extra document read per admin page load (`admins/{uid}`).
- The preflight adds a fourth state (`adminStatus`) to the store.

## Alternatives rejected

- **Relax the rules or allow any authenticated write.** Rejected: turns a setup mistake into a public write path.
- **Silent retry or generic error toasts.** Rejected: the failure is deterministic; the owner needs the cause.
- **A server-side health check endpoint.** Overkill for a solo portfolio and adds hosting surface.

## Links

- [Firestore permissions playbook](/rules/firestore-permissions.md)
- [Source summary](/sources/2026-11-16-firestore-check.md)
- [Decision 0016](/decisions/0016-gallery-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
