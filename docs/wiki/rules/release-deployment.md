---
type: Playbook
title: Release and Deployment
description: How v1.0.0 and later releases are verified, previewed and deployed to Firebase Hosting, including the Firestore rules, credentials and troubleshooting.
tags: [release, deployment, ci, cd, github-actions, firebase-hosting, firestore-rules, secrets, troubleshooting]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-21T00:00:00Z }
sources:
  - id: decision-0025
    resource: /decisions/0025-release-v1-and-ci-cd.md
    title: Release v1.0.0 and CI/CD strategy
  - id: decision-0026
    resource: /decisions/0026-firebase-credentials-and-workflow-consolidation.md
    title: Accept either Firebase secret and keep three workflows
  - id: release-report
    resource: /reviews/2026-11-19-v1.0.0-release.md
    title: v1.0.0 release report
---

# Release and Deployment

## Prerequisites

- Firebase project `alessandrotorri-it` with an existing Hosting site (the project id is the default site). Override with the repository variable `FIREBASE_PROJECT_ID` if the site differs.
- A service account key with **Firebase Hosting Admin**, **Firebase Rules Admin** and **Service Account User** on the project, stored as a GitHub Actions secret. Either name works:
  - `FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT` — preferred, the key `firebase init` generates for this project;
  - `FIREBASE_SERVICE_ACCOUNT` — fallback, kept for compatibility.
- `.firebaserc` points `default` at the project; `firebase.json` maps `hosting.public` to `dist`, rewrites unknown paths to `/index.html` and points `firestore.rules` at the repository rules file.
- Never commit the service account or any Firebase credential. `.env` stays gitignored. `public/index.html` must never be committed either: Vite owns `index.html` at the repository root and copies `public/` into `dist/`.

## Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push to `development`/`main`; PRs targeting `development`/`main` | `npm ci`, lint, typecheck, build |
| `preview.yml` | PRs targeting `development`/`main` | verify, build, deploy `preview-<number>` for 7 days; skips the deploy when no credential is set |
| `deploy.yml` | push to `main`, `v*` tags, manual | verify, validate the credential, deploy `firestore.rules`, then Hosting `live` |

Credential resolution in both deploy workflows:

```text
secrets.FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT || secrets.FIREBASE_SERVICE_ACCOUNT
```

`deploy.yml` fails before touching Firebase when neither secret exists, when the value is not valid JSON, or when `client_email`/`private_key` is missing. It warns, without failing, when the key's `project_id` differs from `FIREBASE_PROJECT_ID`. Preview deployments never change production rules. The production workflow deploys the rules **before** hosting, so a rule failure blocks the release.

No other workflow files are allowed. A generated `firebase-hosting-merge.yml` or `firebase-hosting-pull-request.yml` must be deleted, never adapted.

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

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `403 Permission denied to get service [firestore.googleapis.com]` | The service account JSON is not from this project or lacks roles on it | Use a key from project `alessandrotorri-it` with Hosting/Rules Admin, or grant the roles to that account |
| `Site not found` on `<project>.web.app` | Hosting never received a release (the rules step failed first) or the site does not exist | Fix the deploy run; create the default site with `firebase hosting:sites:create alessandrotorri-it` if it is missing |
| `No Firebase credentials found` | Neither secret is set | Add `FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT` |
| Deploy is green but the site is stale | A tag or `main` push was reused without a new build | Re-run `deploy.yml` from the Actions tab (`workflow_dispatch`) |

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
- [Decision 0026 — Accept either Firebase secret and keep three workflows](/decisions/0026-firebase-credentials-and-workflow-consolidation.md)
- [Source summary — 2026-11-21 Firebase Hosting and CI/CD fix](/sources/2026-11-21-firebase-ci-cd.md)
- [Git conventions](/rules/git-conventions.md)
- [The usual loop](/rules/workflow.md)
