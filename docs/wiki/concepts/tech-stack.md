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
---

# Tech Stack

## Core

| Layer | Technology | Installed (2026-10-29) |
|-------|------------|------------------------|
| Runtime | Node.js | 22.23.3 |
| Package manager | npm | 10.9.9 |
| Framework | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Bundler | Vite | 7.3.1 |
| UI library | MUI (Material-UI) | 7.3.9 |
| State | Zustand | 5.0.10 |
| Routing | React Router DOM | 7.13.0 |

## Firebase

| Service | Package | Purpose |
|---------|---------|---------|
| Auth | `firebase` 12.8.0 | Google sign-in for the administrator |
| Firestore | `firebase` | Image metadata and collections |
| Storage | `firebase` | Image file hosting |

Config is read from `VITE_FIREBASE_*` environment variables in `.env` (gitignored). See [Firebase Backend](/concepts/firebase-backend.md).

## Supporting libraries

| Library | Purpose |
|---------|---------|
| `@mui/lab` | Masonry layout (admin/demo gallery) |
| `@mui/icons-material` | Icon set |
| `@emotion/react` + `@emotion/styled` | CSS-in-JS (MUI dependency) |
| `framer-motion` 12.29.2 | Page transitions and stagger animations |
| `@hello-pangea/dnd` 18.0.1 | Drag-and-drop reordering in admin |
| `react-firebase-hooks` 5.1.1 | Firestore query hooks |
| `uuid` 13.0.0 | Unique upload ids |

## Dev tooling

- ESLint 9 flat config + typescript-eslint; `npm run lint`.
- `tsc -b && vite build`; `npm run build`.
- GitHub Actions CI runs lint and build on push/PR (`.github/workflows/ci.yml`).
- GitHub CLI for issues, PRs, and Actions.

Firebase Studio / IDX was removed on 2026-10-29 (`.idx/` and the old `GEMINI.md` deleted). Do not document or reintroduce it.

## Dependency policy

- `package-lock.json` is the source of truth.
- No new dependencies without approval.
- In-range updates are handled in issue #1; major jumps need a decision record.
- `npm outdated` is the starting point, not an instruction to upgrade everything.

## Related

- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
- [Code Style](/rules/code-style.md)
- [Site Architecture](/concepts/site-architecture.md)
