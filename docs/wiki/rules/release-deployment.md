---
type: Playbook
title: Release and Deployment
description: How v1.0.0 and later releases are verified, previewed and deployed to Firebase Hosting, including the Firestore rules.
tags: [release, deployment, ci, cd, github-actions, firebase-hosting, firestore-rules]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-19T00:00:00Z }
sources:
  - id: decision-0025
    resource: /decisions/0025-release-v1-and-ci-cd.md
    title: Release v1.0.0 and CI/CD strategy
  - id: release-report
    resource: /reviews/2026-11-19-v1.0.0-release.md
    title: v1.0.0 release report
---

# Release and Deployment

## Prerequisites

- Firebase project `alessandrotorri-it` with a Hosting site (the project id is the default site). Override with the repository variable `FIREBASE_PROJECT_ID` if the site differs.
- A service account key with **Firebase Hosting Admin**, **Firebase Rules Admin** and **Service Account User** on the project, stored as the GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT` (the raw JSON).
- `.firebaserc` points `default` at the project; `firebase.json` maps `hosting.public` to `dist` and rewrites unknown paths to `/index.html`.
- Never commit the service account or any Firebase credential. `.env` stays gitignored.

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push to `development`/`main`, every PR | `npm ci`, lint, typecheck, build |
| `preview.yml` | PR to `development`/`main` | verify, build, deploy `preview-<number>` for 7 days; skips the deploy when the secret is missing |
| `deploy.yml` | push to `main`, `v*` tags, manual | verify, deploy `firestore.rules`, then Hosting `live` |

Preview deployments never change production rules. The production workflow deploys the rules **before** hosting, so a rule failure blocks the release.

## Release procedure

1. Merge the release PR into `development` after CI is green.
2. Create `main` the first time, or fast-forward it on later releases:

   ```bash
   git checkout development
   git pull
   git checkout -b main
   git push -u origin main
   ```

3. Tag the release on that commit:

   ```bash
   git tag -a v1.0.0 -m "v1.0.0"
   git push origin v1.0.0
   ```

   The tag push triggers `deploy.yml`.
4. Publish the GitHub Release using [the release report](/reviews/2026-11-19-v1.0.0-release.md) as the body.
5. Verify:
   - the `Deploy` workflow is green;
   - `/`, `/gallery`, `/gallery/<slug>` and the login/admin routes respond on the Hosting URL;
   - an admin write still succeeds (rules deployed);
   - `firebase hosting:channel:list` shows the live channel.

## Rollback

- **Hosting:** `firebase hosting:releases:list --project alessandrotorri-it`, then `firebase hosting:rollback --project alessandrotorri-it`, or re-run `deploy.yml` from a previous tag.
- **Firestore rules:** revert the rules commit, merge it, and let the next release tag deploy it. Rules deployments are versioned rulesets; the previous release stays active until the next deploy.
- **Preview channels:** expire after 7 days; delete early with `firebase hosting:channel:delete preview-<number>`.

## Notes

- `npm run build` runs `tsc -b`; CI also runs `npm run typecheck` so the typecheck contract is explicit.
- The SPA rewrite serves `index.html` for unknown paths. A missing static asset is not a 404 from Hosting; the admin preview fallback handles that case in the browser.
- The deployment secret is the only manual prerequisite. Without it, `deploy.yml` fails with a clear message and `preview.yml` only verifies.
- `main` is the release branch; `development` remains the integration branch. Feature work still targets `development`.

## Related

- [Decision 0025 — Release v1.0.0 and CI/CD strategy](/decisions/0025-release-v1-and-ci-cd.md)
- [Git conventions](/rules/git-conventions.md)
- [The usual loop](/rules/workflow.md)
