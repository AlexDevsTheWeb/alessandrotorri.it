---
type: Decision
title: "0015 — Adopt Vite 8, ESLint 10, uuid 14 and globals 17; defer TypeScript 7 and Firebase 13"
description: Evaluate the deferred majors from issue #6 one at a time. Adopt the four that build and lint cleanly, and record why TypeScript 7 and Firebase 13 wait.
tags: [decision, dependencies, vite, eslint, typescript, firebase]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: gh-issue-6
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6
    title: "Issue #6 — evaluate dependency majors deferred from issue #1"
  - id: decision-0005
    resource: /decisions/0005-dependency-refresh-policy.md
    title: Dependency refresh policy
  - id: decision-0006
    resource: /decisions/0006-adopt-mui-9.md
    title: Adopt Material UI 9
---

# Context

Issue #6 lists the majors deferred from the in-range refresh ([decision 0005](/decisions/0005-dependency-refresh-policy.md)). Each major is evaluated on its own: install, `npm run lint`, `npm run build`, and a browser check. MUI 9 was adopted earlier ([decision 0006](/decisions/0006-adopt-mui-9.md)).

# Results

| Package | Target | Result | Decision |
|---------|--------|--------|----------|
| `vite` + `@vitejs/plugin-react` | 8.3.6 + 6.2.1 | Lint and build green. Chunk names kept; all chunks under 500 kB. Build is faster (rolldown). | Adopt |
| `eslint` + `@eslint/js` + `eslint-plugin-react-refresh` | 10.14.0 + 10.0.1 + 0.5.7 | Lint green with the existing flat config. | Adopt |
| `uuid` | 14.0.3 | Build and lint green; `v4` import unchanged. | Adopt |
| `globals` | 17.14.0 | Lint green. | Adopt |
| `typescript` | 7.0.2 | `tsc -b` passes, but `typescript-eslint` rejects TypeScript 7.0 (`does not support TS 7.0`, tracked upstream). `npm run lint` fails. | Defer; stay on 5.9.3 |
| `firebase` | 13.2.0 | Lint and build green, but it still resolves the vulnerable `@grpc/grpc-js`, and Auth/Firestore/Storage behavior needs a live smoke test. | Defer; see [decision 0013](/decisions/0013-grpc-js-override.md) |
| `framer-motion` | 14 | Not a dependency; removed in phase 5. | Not applicable |

# Decision

Adopt Vite 8, `@vitejs/plugin-react` 6, ESLint 10, `@eslint/js` 10, `eslint-plugin-react-refresh` 0.5, `uuid` 14 and `globals` 17. Keep TypeScript 5.9.3 and Firebase 12.19.0 until their blockers clear.

# Consequences

- The build is faster on Vite 8 and uses rolldown; the manual chunk names still work.
- `npm run lint` runs on ESLint 10 with the existing flat config; no config changes were needed.
- TypeScript 7 is blocked by `typescript-eslint` until it supports TypeScript 7.1+ (upstream issue #10940). Re-evaluate then.
- Firebase 13 stays open in [issue #6](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6). Adopt it only after a live smoke test of Auth, Firestore and Storage, and with the grpc override kept or re-verified.

# Links

- [Source summary](/sources/2026-11-07-gh-issue-6.md)
- [Tech Stack](/concepts/tech-stack.md)
- [Decision 0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md)
- [Decision 0006 — Adopt Material UI 9](/decisions/0006-adopt-mui-9.md)
- [Decision 0013 — gRPC override](/decisions/0013-grpc-js-override.md)
