# alessandrotorri.it

Photography portfolio for Alessandro Torri — long-exposure landscape work. The live site is currently Adobe Portfolio (<https://www.alessandrotorri.it>); this repository rebuilds it with the exact look & feel on a modern stack, plus a protected administrator section.

## Stack

React 19 · Vite 7 · TypeScript · MUI 7 · Zustand · Firebase (Auth, Firestore, Storage) · framer-motion

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
```

`.env` is gitignored. Never commit credentials.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

CI runs lint and build on every push and pull request.

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

- Knowledge foundation: done 2026-10-29 (OKF wiki, agent schema, skills, green baseline).
- Public rebuild: phases 0–3 done, layout refinements done, phase 4 next. See the [Rebuild Plan](docs/wiki/rebuild-plan.md).
- Open work: dependency refresh (#1), public site phases 3–5 (#2), admin protection (#3).

## License

Private project. All photographs and text are © Alessandro Torri.
