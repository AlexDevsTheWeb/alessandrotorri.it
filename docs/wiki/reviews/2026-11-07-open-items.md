---
type: Review
title: "2026-11-07 — Open items and library review"
description: Register of every open item after the 2026-11-07 loops — what was closed, what moved to a follow-up issue, which libraries are current, and the accepted risks.
tags: [review, open-items, dependencies, backlog, risk]
status: stable
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: issues
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues
    title: GitHub issues (open and closed, 2026-11-07)
  - id: decision-0015
    resource: /decisions/0015-dependency-majors-batch.md
    title: Dependency majors batch
---

# Open items — 2026-11-07

Every item that was open at the start of the day, its disposition, and where it is tracked now.

## Items

| Item | Was | Disposition | Tracked in |
|------|-----|-------------|------------|
| Admin route protection (#3) | open | Done in PR #18; rules written but **not deployed** | Closed #3; owner action in [Firebase Backend](/concepts/firebase-backend.md) |
| gRPC advisory (#5) | open | Cleared by a scoped override (PR #17, [Decision 0013](/decisions/0013-grpc-js-override.md)) | Closed #5 |
| Dependency majors (#6) | open | Vite 8, ESLint 10, uuid 14 adopted (PR #19); two remain | Closed #6; remaining in #20 and #21 |
| TypeScript 7 | blocked | `typescript-eslint` does not support TS 7.0 yet | [#20](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/20) |
| Firebase 13 | deferred | Builds, but needs a live smoke test and the backend decision | [#21](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/21) |
| Deployed Lighthouse (#14) | open | Needs a deploy target; cannot be measured locally | Closed #14; follow-up [#22](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/22) |
| Photo storage and backend choice | open question | Analysis written; owner decision pending | [Photo Storage and Backend Options](/concepts/photo-storage-options.md) |

> [!NOTE] Closing is not finishing
> #6 and #14 are closed because their remaining work now has its own tracked issue, not because it is done. Their follow-ups are #20, #21 and #22.

## Libraries

Checked with `npm outdated` and `npm audit` on 2026-11-07, after the updates in this loop.

| Package | Installed | Latest | Decision |
|---------|-----------|--------|----------|
| `react` / `react-dom` | 19.3.1 | 19.3.1 | Current |
| `react-router-dom` | 7.18.5 | 7.18.5 | Current |
| `@mui/material`, `@mui/icons-material` | 9.5.0 | 9.5.0 | Current ([Decision 0006](/decisions/0006-adopt-mui-9.md)) |
| `@mui/lab` | 9.0.0-beta.10 | 9.0.0-beta.10 | Current; beta — revisit when a stable 9.x ships |
| `zustand` | 5.1.0 | 5.1.0 | Updated this loop (in range) |
| `firebase` | 12.19.0 | 13.2.0 | Deferred to [#21](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/21) |
| `typescript` | 5.9.3 | 7.0.2 | Blocked by typescript-eslint, [#20](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/20) |
| `typescript-eslint` | 8.72.1 | 8.72.1 | Current; the blocker for TS 7 |
| `vite` | 8.3.6 | 8.3.6 | Current ([Decision 0015](/decisions/0015-dependency-majors-batch.md)) |
| `@vitejs/plugin-react` | 6.2.1 | 6.2.1 | Current |
| `eslint`, `@eslint/js`, `eslint-plugin-react-refresh` | 10.14.0 / 10.0.1 / 0.5.7 | same | Current |
| `eslint-plugin-react-hooks` | 7.1.1 | 7.1.1 | Current |
| `globals` | 17.14.0 | 17.14.0 | Current |
| `uuid` | 14.0.3 | 14.0.3 | Current |
| `@types/node` | 22.20.5 | 26.6.6 | Kept on 22: CI and the local runtime are Node 22 |
| `@hello-pangea/dnd` | 18.0.1 | 18.0.1 | Current |
| `react-firebase-hooks` | 5.1.1 | 5.1.1 | Current |

## Accepted risks

- **Dev-only `minimatch` advisories (10 moderate).** Reported by `npm audit`, reached only through the lint toolchain. `npm audit fix` without `--force` does not clear them; `--force` would make a breaking change to the tooling. Not in the production bundle. Re-check when typescript-eslint or ESLint updates land (#20).
- **Production audit is clean** (`npm audit --omit=dev`: 0 vulnerabilities).

## Next actions

1. Owner: create the first `admins/{uid}` document and deploy the rules (see [Firebase Backend](/concepts/firebase-backend.md)).
2. Owner: decide the photo storage and backend direction ([options](/concepts/photo-storage-options.md)).
3. Then: [#21](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/21) (Firebase 13) and [#22](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/22) (deployed Lighthouse) follow the decision.
4. When typescript-eslint supports TS 7: [#20](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/20).
