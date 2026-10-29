---
type: Reference
title: Tech Stack
description: Frameworks, libraries, versions, and toolchain used in the project.
tags: [tech-stack, react, mui, firebase, vite, toolchain]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: package-json
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/package.json
    title: package.json
  - id: gh-issue-1
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/1
    title: "Issue #1 — refresh dependencies after knowledge foundation"
---

# Tech Stack

## Core

| Layer | Technology | Installed (2026-10-29) |
|-------|------------|------------------------|
| Runtime | Node.js | 22.23.3 |
| Package manager | npm | 10.9.9 |
| Framework | React | 19.3.1 |
| Language | TypeScript | 5.9.3 |
| Bundler | Vite | 7.3.7 |
| UI library | MUI (Material-UI) | 7.3.11 |
| State | Zustand | 5.0.16 |
| Routing | React Router DOM | 7.18.5 |

Last in-range refresh: 2026-10-29 ([issue #1](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/1)). Majors are deferred to [issue #6](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6); see [Decision 0005](/decisions/0005-dependency-refresh-policy.md).

## Firebase

| Service | Package | Purpose |
|---------|---------|---------|
| Auth | `firebase` 12.19.0 | Google sign-in for the administrator |
| Firestore | `firebase` | Image metadata and collections |
| Storage | `firebase` | Image file hosting |

> [!WARNING] Transitive advisory
> `firebase@12.19.0 -> @firebase/firestore@4.17.2` still pins `@grpc/grpc-js@1.9.16`, which has 4 high-severity advisories. `npm audit fix --force` would downgrade Firebase to 9.14.0, so it was not applied. Tracked in [issue #5](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/5).

Config is read from `VITE_FIREBASE_*` environment variables in `.env` (gitignored). See [Firebase Backend](/concepts/firebase-backend.md).

## Supporting libraries

| Library | Purpose |
|---------|---------|
| `@mui/lab` 7.0.1-beta.25 | Masonry layout (admin/demo gallery) |
| `@mui/icons-material` 7.3.11 | Icon set |
| `@emotion/react` + `@emotion/styled` | CSS-in-JS (MUI dependency) |
| `framer-motion` 12.43.0 | Page transitions and stagger animations |
| `@hello-pangea/dnd` 18.0.1 | Drag-and-drop reordering in admin |
| `react-firebase-hooks` 5.1.1 | Firestore query hooks |
| `uuid` 13.0.2 | Unique upload ids |

## Dev tooling

- ESLint 9 flat config + typescript-eslint; `npm run lint`.
- `tsc -b && vite build`; `npm run build`.
- GitHub Actions CI runs lint and build on push/PR (`.github/workflows/ci.yml`).
- GitHub CLI for issues, PRs, and Actions.

Firebase Studio / IDX was removed on 2026-10-29 (`.idx/` and the old `GEMINI.md` deleted). Do not document or reintroduce it.

## Dependency policy

- `package-lock.json` is the source of truth.
- No new dependencies without approval.
- In-range updates are applied in a dedicated loop; majors need a decision record and an individual branch.
- `npm outdated` is the starting point, not an instruction to upgrade everything.
- Never use `npm audit fix --force` when it downgrades a core package; document the advisory and track it instead.
- Current budget note: the production bundle is ~1.35 MB (418.89 kB gzip); phase 5 code splitting is expected to reduce it.

## Related

- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
- [Decision 0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md)
- [Source summary — issue #1](/sources/2026-10-29-gh-issue-1.md)
- [Code Style](/rules/code-style.md)
- [Site Architecture](/concepts/site-architecture.md)
