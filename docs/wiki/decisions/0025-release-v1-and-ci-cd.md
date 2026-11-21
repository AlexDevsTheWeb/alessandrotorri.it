---
type: Decision
title: "0025 — Release v1.0.0 and CI/CD strategy"
description: Ship v1.0.0 from development, move main to the release commit, deploy Firebase Hosting and Firestore rules from GitHub Actions, and keep the raw layer immutable.
tags: [decision, release, ci, cd, github-actions, hosting, rules, tag]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-19T00:00:00Z }
sources:
  - id: raw-v1
    resource: ../../raw/2026-11-19-v1.0.md
    title: Release v1.0.0 & CI/CD automation (raw, immutable)
  - id: release-report
    resource: /reviews/2026-11-19-v1.0.0-release.md
    title: v1.0.0 release report
---

# 0025 — Release v1.0.0 and CI/CD strategy

## Context

PR #26 (image catalog, discovery, layout, visibility, cover/spacing) merged into `development` on 2026-11-19. The owner asked for the official v1.0.0 release, CI/CD automation, wiki status updates and issue closure.

The repository had one workflow (`ci.yml`), version `0.0.0`, no `main` branch, no Firebase Hosting configuration and no deployment secret. Issues #1/#2/#3/#14 were already closed. The source also asked for a release summary inside `docs/raw/`, which is the immutable layer.

## Decision

1. **Version and release branch.** `package.json` and the lockfile move to `1.0.0`. The release work goes through a `chore/release-v1.0.0` PR into `development`. After it merges, `main` is created from `development`, then `v1.0.0` is tagged on that commit. `development` remains the integration branch.
2. **CI.** `ci.yml` runs, on push to `development`/`main` and on pull requests: `npm ci`, `npm run lint`, `npm run typecheck` (`tsc -b`) and `npm run build`. The build script keeps running `tsc -b` too; the explicit step makes the typecheck contract visible.
3. **Preview deployments.** `preview.yml` runs on pull requests to `development`/`main`, verifies, uploads `dist` and deploys a Firebase Hosting preview channel `preview-<number>` for 7 days. If `FIREBASE_SERVICE_ACCOUNT` is absent, verification still runs and the deploy step is skipped.
4. **Production deployment.** `deploy.yml` runs on push to `main`, on `v*` tags and by manual dispatch. It verifies, deploys `firestore.rules` first and then Firebase Hosting to the `live` channel. Both steps require the `FIREBASE_SERVICE_ACCOUNT` secret; the workflow fails with a clear message when it is missing.
5. **Hosting config.** `firebase.json` gains `hosting` (`public: dist`, SPA rewrite to `/index.html`); `.firebaserc` pins the default project `alessandrotorri-it`. The optional repository variable `FIREBASE_PROJECT_ID` overrides it.
6. **Rules from the release workflow only.** Preview deployments never touch production rules. The release workflow deploys the rules before hosting, so a rules failure stops the release.
7. **Raw layer untouched.** The requested `docs/raw/2026-11-18-release-v1.0.md` was not created. The release summary lives in [reviews/2026-11-19-v1.0.0-release.md](/reviews/2026-11-19-v1.0.0-release.md), and the process is in the [release and deployment playbook](/rules/release-deployment.md).
8. **Issues and status.** #1/#2/#3/#14 are already closed; they are not re-closed. #22 stays open until a deployed Lighthouse run exists. The wiki marks v1.0.0 as "release prepared, first deploy pending", not "Stable Production", until `deploy.yml` succeeds.

## Consequences

Positive:

- One reproducible path from `development` to production, with preview URLs for review.
- Rules and hosting ship together on a tag, so the client and the rules cannot drift silently.
- A missing secret fails the production workflow loudly but does not block normal PR verification.
- The immutable raw layer stays intact; the release history is in the agent-owned wiki.

Negative:

- Two workflows require the Firebase service account secret before previews or deploys produce URLs.
- `npm run typecheck` and `npm run build` run `tsc -b` twice in CI.
- `main` and the tag are manual steps after the release PR; they are not automated by merging.
- The first deployment needs a Firebase Hosting site (default `alessandrotorri-it`) and a service account with Hosting and Rules permissions.

## Alternatives rejected

- **Deploy from `development` on every push.** Rejected: production would follow feature merges without a release boundary.
- **Deploy rules from the preview workflow.** Rejected: previews must not mutate production.
- **Create `main` and the tag from this branch.** Rejected: the tag would miss the release PR commit; both must follow the merge.
- **Write the release summary into `docs/raw/` as requested.** Rejected: the raw layer is immutable and human-curated.
- **Set the overview to "Stable Production" now.** Rejected: no deploy has run; the claim would be false.

## Links

- [Source summary](/sources/2026-11-19-v1.0.md)
- [Release report](/reviews/2026-11-19-v1.0.0-release.md)
- [Release and deployment playbook](/rules/release-deployment.md)
- [Git conventions](/rules/git-conventions.md)
