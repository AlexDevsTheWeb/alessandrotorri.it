---
type: Decision
title: "0005 — Dependency refresh policy: in-range now, majors deferred"
description: Apply only updates that satisfy current package.json ranges, defer majors to individual evaluations, and never use force fixes that downgrade Firebase.
tags: [decision, dependencies, npm, security, maintenance]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: gh-issue-1
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/1
    title: "Issue #1 — refresh dependencies after knowledge foundation"
    author: human:alessandrotorri
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Context

Issue #1 is the dependency gate before the public site rebuild. `npm outdated` listed 22 packages. `npm update` resolved every in-range update, but several majors remain, and `npm audit` still reports 4 high advisories in `@grpc/grpc-js@1.9.16` pulled in by Firebase Firestore.

# Decision

1. Apply only updates that satisfy the existing `package.json` ranges; keep `package-lock.json` authoritative.
2. Do not take major jumps in the same loop. Evaluate them one at a time in issue #6: MUI 9, Vite 8, ESLint 10, TypeScript 7, Firebase 13, framer-motion 14, uuid 14, `@vitejs/plugin-react` 6, `globals` 17, `eslint-plugin-react-refresh` 0.5.
3. Do not run `npm audit fix --force` when it downgrades Firebase (`firebase@9.14.0`). Track the grpc advisory in issue #5 and evaluate a scoped `overrides` entry or Firebase 13.
4. Re-check `npm outdated` and `npm audit` in every dependency loop and record accepted risk in the wiki.

# Consequences

- The refresh is low-risk and keeps `lint`/`build` green.
- Majors stay visible instead of being smuggled into a routine update.
- The remaining high-severity advisory is documented and owned, not silently ignored.
- The bundle grew to 1.35 MB (418.89 kB gzip); phase 5 code splitting is now a higher priority.
- Dependency changes require a wiki source summary, a decision when majors are adopted, and a log entry.

# Links

- [Source summary](/sources/2026-10-29-gh-issue-1.md)
- [Tech Stack](/concepts/tech-stack.md)
- [Issue #5 — grpc advisory](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/5)
- [Issue #6 — dependency majors](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/6)
