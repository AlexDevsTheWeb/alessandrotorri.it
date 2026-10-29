# AGENTS.md — Operating Schema

Canonical instructions for every AI agent working on this repository: Claude Code, OpenCode, Pi, Codex, Gemini, Cursor, or anything else. `CLAUDE.md` and `GEMINI.md` point here. If a tool-specific file conflicts with this one, **this file wins**.

## 1. What this repo is

Photography portfolio for Alessandro Torri (landscape / long-exposure), rebuilt from the live Adobe Portfolio site at <https://www.alessandrotorri.it>. React 19 + Vite + TypeScript + MUI 7 + Zustand + Firebase. The public site is being rebuilt first; the existing `/admin` section is preserved and finished afterwards.

## 2. Read order (every session)

1. This file.
2. [`docs/index.md`](docs/index.md) — bundle catalog.
3. [`docs/overview.md`](docs/overview.md) — current state and contradictions.
4. [`docs/rebuild-plan.md`](docs/rebuild-plan.md) — phases, status table, resume protocol.
5. [`docs/rules/workflow.md`](docs/rules/workflow.md) and the rest of [`docs/rules/`](docs/rules/index.md).
6. The source or code files you are about to change.

Do not start coding before this. If the wiki and the code disagree, the code is evidence and the wiki must be corrected in the same change.

## 3. Three layers

| Layer | Path | Ownership |
|-------|------|-----------|
| Raw sources | `docs/raw/` | Human-curated, **immutable**. Read it; never rewrite it. |
| Wiki | `docs/` except `docs/raw/` | Agent-owned. Summaries, concepts, decisions, rules, reviews. |
| Schema | `AGENTS.md` + `docs/rules/` | Co-evolves with the project. Update it when a convention changes. |

## 4. The usual loop

Use this for every new source in `docs/raw/`, every feature, and every bug. The same procedure lives in [`docs/rules/workflow.md`](docs/rules/workflow.md) and in the [`.agents/skills/usual-loop`](.agents/skills/usual-loop/SKILL.md) skill.

1. **Read** — the raw source (or issue), then the read order above.
2. **Analyze** — summarize it, extract requirements, list affected docs/code, and flag contradictions with evidence.
3. **Plan** — write the plan (update `docs/rebuild-plan.md` or create a decision record). State scope, files, acceptance criteria, and what is explicitly out of scope.
4. **Implement** — branch, small conventional commits, code + docs together, `npm run lint && npm run build`.
5. **Update the wiki** — add a source summary, update every concept touched, update `docs/index.md`, append to `docs/log.md`, record decisions.
6. **Draft PR** — push and open a draft PR with the checklist; link issues.

Definition of done: lint green, build green, wiki consistent, log updated, PR open as draft, no secrets or generated artifacts staged.

## 5. Non-negotiables

- **No comments** in new code unless explicitly requested.
- **No new dependencies** without approval. Check `package.json` first.
- **MUI only** — `sx` prop or Emotion `styled()`. No Tailwind, CSS Modules, or Sass.
- **TypeScript strict** — no `any`, no incomplete interfaces. Prefer `interface`.
- **Zustand** for app state. No Redux, no new Context stores.
- **File naming** — `*.layout.tsx`, `*.component.tsx`, `*.types.ts`, `*Store.ts`.
- **Language** — UI copy is Italian (Gallerie, collection titles, captions). Code identifiers, comments-free code, and documentation are English.
- **No secrets** — never commit `.env`, keys, tokens, or downloaded credentials. `.env` stays gitignored.
- **No generated artifacts** — never commit `node_modules/` or `dist/`.
- **Raw is read-only** — never edit or delete anything under `docs/raw/`.
- **One logical change per commit** — Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`).

## 6. Wiki contract (llm-wiki + OKF v0.2)

The wiki follows the [llm-wiki three-layer pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) and is an [OKF v0.2](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md) bundle.

- Every non-reserved `*.md` file in the **wiki layer** starts with YAML frontmatter containing a non-empty `type`.
- `docs/raw/` is the llm-wiki source layer: immutable evidence, intentionally outside the OKF concept layer. OKF structural checks apply to `docs/` excluding `docs/raw/`.
- `index.md` and `log.md` are reserved: no frontmatter, except `okf_version: "0.2"` on the bundle-root `index.md`.
- Links between concepts are **bundle-relative** (`/concepts/tech-stack.md`), never `../` escapes.
- Lifecycle `status` is one of `draft`, `stable`, `deprecated`.
- Page types in use: `Overview`, `Plan`, `Architecture`, `Reference`, `Playbook`, `Roadmap`, `Source Summary`, `Decision`, `Review`.
- Every new page must be linked from at least one other page and listed in the relevant `index.md`.
- New source → `docs/sources/YYYY-MM-DD-slug.md` plus updates to every concept it touches.
- New decision → `docs/decisions/NNNN-slug.md` plus an entry in `docs/decisions/index.md`.
- Contradictions get a `> [!WARNING]` callout naming the conflicting pages; unresolved items get `> [!QUESTION]`.
- Append to `docs/log.md` (newest first, ISO dates) after every loop.

## 7. Branch, commit, PR

- Branches: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`. Default branch is `development`.
- Commits: Conventional Commits, imperative, no scope unless useful.
- Before committing: `npm run lint` and `npm run build` must pass.
- PRs: open as **draft** until verification is complete, target `development`, fill `.github/PULL_REQUEST_TEMPLATE.md`, link issues, and include the wiki/log updates.
- Use the GitHub CLI (`gh`) for issues, PRs, and Actions.

## 8. Verification

```bash
npm run lint
npm run build
# manual: npm run dev → /, /gallery, /gallery/<slug>, /admin on desktop + 390px
```

Baseline is green as of 2026-10-29. If it is red, fix or document it before starting new work.

## 9. Current state and next

- Public rebuild: phases 0–2 done, phase 3 next. See [`docs/rebuild-plan.md`](docs/rebuild-plan.md).
- Knowledge foundation: done 2026-10-29 (wiki compliance, docs audit, agent schema, skills, green baseline).
- Next: dependency refresh (issue #1), public site phases 3–5 (issue #2), admin protection (issue #3).
- Admin is currently reachable without auth; do not "improve" it until issue #3, but never expose new admin routes.
