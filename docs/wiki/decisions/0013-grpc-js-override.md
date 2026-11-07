---
type: Decision
title: "0013 — Override @grpc/grpc-js to a patched 1.14 release"
description: Resolve the high-severity @grpc/grpc-js advisory with a scoped npm override instead of the breaking Firebase downgrade, and record why the browser bundle is unaffected.
tags: [decision, security, dependencies, firebase, grpc]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: gh-issue-5
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/5
    title: "Issue #5 — resolve @grpc/grpc-js advisory"
  - id: decision-0005
    resource: /decisions/0005-dependency-refresh-policy.md
    title: Dependency refresh policy
---

# Context

After the in-range refresh ([decision 0005](/decisions/0005-dependency-refresh-policy.md)), `npm audit` reports 4 high-severity advisories in `@grpc/grpc-js@1.9.16`. Firebase 12.19.0 pins it through `@firebase/firestore@4.17.2` (`~1.9.0`). Patched versions start at 1.13.6.

Two options were rejected or checked:

- `npm audit fix --force` downgrades Firebase to 9.14.0. Breaking; not acceptable.
- Firebase 13.2.0 still resolves a vulnerable `@grpc/grpc-js`, so it does not fix the advisory on its own.

The advisory's package is Node-only. The production build of the public and admin site (`dist/assets/firebase-data-*.js`) has no `@grpc/grpc-js` code: the browser Firestore transport does not use it.

# Decision

Add a scoped `overrides` entry in `package.json`:

```json
"overrides": { "@grpc/grpc-js": "^1.14.7" }
```

`npm ls @grpc/grpc-js` resolves `1.14.7 overridden` under `firebase -> @firebase/firestore`. Firebase itself stays at 12.19.0.

# Verification

- `npm audit --omit=dev` — 0 vulnerabilities.
- `npm run lint` and `npm run build` — green.
- The `firebase-data` chunk hash is unchanged (`firebase-data-CnnWAqZ3.js`), so the client bundle is byte-identical and browser behavior does not change.
- Not verified: Firestore against a live project. Node-side Firestore is not exercised by the site; admin reads and writes run in the browser. The admin smoke test in [issue #3](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/3) covers it.

# Consequences

- `npm audit` is clean for production dependencies.
- The override must be removed when Firebase ships a `@firebase/firestore` that accepts `@grpc/grpc-js` 1.14 directly. Revisit with issue #6 (Firebase 13).
- Any new Node-side use of Firestore (SSR, scripts) must re-check the override.

# Links

- [Source summary](/sources/2026-11-07-gh-issue-5.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Tech Stack](/concepts/tech-stack.md)
- [Decision 0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md)
