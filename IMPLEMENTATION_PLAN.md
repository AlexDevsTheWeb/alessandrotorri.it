# Implementation Plan — Release v1.0.0 and CI/CD automation

Source: [`docs/raw/2026-11-19-v1.0.md`](docs/raw/2026-11-19-v1.0.md)
Branch: `chore/release-v1.0.0`
Date: 2026-11-19
Status: implemented; first deploy pending the post-merge checklist.

## 1. Analysis

PR #26 (image catalog, GitHub discovery, layout, visibility, covers and spacing) is merged into `development` (`2a8a19e`). The source asks for the v1.0.0 release, GitHub Actions CI/CD, wiki status updates and issue closure.

Verified facts:

- `main` does not exist; `development` is the only integration branch.
- Only `.github/workflows/ci.yml` exists (Node 22, `npm ci`, lint, build).
- `package.json` was `0.0.0`; `firebase.json` had no Hosting block and there was no `.firebaserc`.
- Issues #1/#2/#3/#14 are already closed; #22 remains open.
- The admin has been exercised live, so the deployed Firestore rules accept the current writes.
- The public rebuild has not been deployed; the live domain still serves Adobe Portfolio.

### Contradictions and resolutions

| Contradiction | Resolution |
|---------------|------------|
| The source asks for `docs/raw/2026-11-18-release-v1.0.md`. | `docs/raw/` is immutable (AGENTS §3/§5). The release summary is [`docs/wiki/reviews/2026-11-19-v1.0.0-release.md`](docs/wiki/reviews/2026-11-19-v1.0.0-release.md). |
| The source asks to mark "Phase 7 (Release v1.0)" complete. | Phase 7 is the image catalog. A new Phase 8 covers the release in the [Rebuild Plan](docs/wiki/rebuild-plan.md). |
| The source asks for "v1.0.0 Stable Production". | No deploy has run. The wiki says "release prepared, first deploy pending" until `deploy.yml` succeeds. |
| The source asks to close #1/#2/#3/#14. | They are already closed; no false re-closure. #22 stays open until a deployed Lighthouse run. |
| `main` and the `v1.0.0` tag should be created. | They must follow the release PR merge; creating them now would tag an incomplete release. The exact commands are in the release report. |

### Requirements and acceptance criteria

- `package.json` and the lockfile at `1.0.0`; `npm run typecheck` available.
- `ci.yml`: lint, typecheck and build on `development`/`main` pushes and PRs.
- `preview.yml`: PR preview channels, skipped when the Firebase secret is absent.
- `deploy.yml`: Firestore rules then Hosting `live` on `main`/`v*` tags.
- `firebase.json` Hosting (`dist`, SPA rewrite) and `.firebaserc` (`alessandrotorri-it`).
- Wiki: source summary, decision 0025, release report and deployment playbook; rebuild plan and overview updated; indexes and log refreshed.
- `npm run lint`, `npm run typecheck` and `npm run build` green; workflow YAML valid.
- Draft PR against `development`.

Out of scope: running the Firebase deploy, creating `main`/the tag, closing already-closed issues, seeding photos, Lighthouse.

## 2. Release flow

```text
feature PR → development → release PR (this branch) → merge
                                                     ↓
                                       create main from development
                                                     ↓
                                          tag v1.0.0 → deploy.yml
                                                     ↓
                                   firestore.rules → Firebase Hosting live
```

`preview.yml` deploys `preview-<PR number>` for pull requests. Preview never deploys rules.

## 3. File changes

| File | Change |
|------|--------|
| `package.json`, `package-lock.json` | Version `1.0.0`; `typecheck` script |
| `.github/workflows/ci.yml` | Typecheck step; `main` push trigger |
| `.github/workflows/preview.yml` | PR verification + preview channel |
| `.github/workflows/deploy.yml` | Rules + Hosting live on `main`/tags |
| `firebase.json` | Hosting block, SPA rewrite |
| `.firebaserc` | Default project `alessandrotorri-it` |
| `README.md`, `AGENTS.md` | Release status, scripts and next steps |
| `docs/wiki/sources/2026-11-19-v1.0.md` | Source summary |
| `docs/wiki/decisions/0025-release-v1-and-ci-cd.md` | Release/CI decision |
| `docs/wiki/rules/release-deployment.md` | Secrets, release, rollback playbook |
| `docs/wiki/reviews/2026-11-19-v1.0.0-release.md` | Release report + checklist |
| `docs/wiki/rebuild-plan.md`, `overview.md`, indexes, `log.md` | Status and links |

## 4. Verification

```bash
npm run lint
npm run typecheck
npm run build
```

- Workflow YAML parsed with Ruby `YAML.load_file`.
- Not executed: Firebase deploy steps, Hosting site existence, service-account roles, post-deploy admin smoke test.

## 5. Post-merge checklist

1. Merge the release PR into `development`.
2. Add `FIREBASE_SERVICE_ACCOUNT` (Hosting Admin + Rules Admin + Service Account User); optionally set `FIREBASE_PROJECT_ID`.
3. Create `main` from `development` and push it.
4. Tag `v1.0.0` and push the tag; confirm `Deploy` is green.
5. Smoke-test the Hosting URL: `/`, `/gallery`, `/gallery/<slug>`, `/login`, `/admin`, `/admin/images`.
6. Confirm an admin write still succeeds after the rules deploy.
7. Create the GitHub Release with the release report as the body.
8. Continue seeding photos; run the deployed Lighthouse check (#22).

## 6. Risks

- The Hosting site may not exist for `alessandrotorri-it`; the deploy fails until it does or `FIREBASE_PROJECT_ID` points at the real site.
- The service account roles are documented, not verified from this environment.
- `main` and the tag are manual; automation cannot create the release boundary by itself.
- The SPA rewrite serves `index.html` for unknown paths; missing static assets are not a Hosting 404.
