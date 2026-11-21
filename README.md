# alessandrotorri.it

Photography portfolio for Alessandro Torri — long-exposure landscape work. The live site is currently Adobe Portfolio (<https://www.alessandrotorri.it>); this repository rebuilds it with the exact look & feel on a modern stack, plus a protected administrator section.

## Stack

React 19 · Vite 8 · TypeScript · MUI 9 · Zustand · Firebase (Auth, Firestore)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variables (Firebase web config) are listed in `.env.example`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional: repository discovery for /admin/images (defaults shown)
# VITE_GITHUB_REPO=AlexDevsTheWeb/alessandrotorri.it
# VITE_GITHUB_BRANCH=development
```

`.env` is gitignored. Never commit credentials.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run typecheck` | Type-check (`tsc -b`) |
| `npm run build` | Type-check and production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

CI runs lint, typecheck and build on every push and pull request. `deploy.yml` publishes to Firebase Hosting and deploys the Firestore rules on `main` / `v*` tags; `preview.yml` publishes a temporary preview channel for pull requests. Both read `FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT` first and fall back to `FIREBASE_SERVICE_ACCOUNT`. See [Release and deployment](docs/wiki/rules/release-deployment.md).

## Documentation

The knowledge base lives in [`docs/wiki/`](docs/wiki/index.md) and follows Karpathy's llm-wiki pattern with OKF v0.2.

- [`AGENTS.md`](AGENTS.md) — canonical rules for every AI agent (Claude Code, OpenCode, Pi, Gemini, Codex, …).
- [`docs/wiki/overview.md`](docs/wiki/overview.md) — current state and contradictions.
- [`docs/wiki/rebuild-plan.md`](docs/wiki/rebuild-plan.md) — phases, status, resume protocol.
- [`docs/wiki/rules/workflow.md`](docs/wiki/rules/workflow.md) — the usual loop.
- [`docs/wiki/sources/`](docs/wiki/sources/index.md) — one summary per raw source or GitHub issue.
- [`docs/wiki/decisions/`](docs/wiki/decisions/index.md) — architecture and process decisions.
- [`docs/raw/`](docs/raw/index.md) — immutable source material (sibling of `docs/wiki/`).

Every new raw source, GitHub issue, feature, or bug goes through the usual loop: **read → analyze → plan → implement → update the wiki → draft PR**.

## Status

- **v1.0.0 — release prepared 2026-11-19.** Version bumped to `1.0.0`; CI runs lint, typecheck and build; `deploy.yml` handles Firebase Hosting + Firestore rules on `main` and tags; `preview.yml` deploys PR preview channels. First production deployment, `main` branch and the `v1.0.0` tag are pending the release checklist.
- Public rebuild: phases 0–5 done; gallery admin done 2026-11-16; image catalog, GitHub discovery, layout controls, visibility and cover/spacing settings done 2026-11-17/18. See the [Rebuild Plan](docs/wiki/rebuild-plan.md).
- Open work: configure the deployment secret and run the first deploy; seed the remaining gallery photos; deployed Lighthouse (#22); remaining majors (#20 / #21).

## License

Private project. All photographs and text are © Alessandro Torri.
