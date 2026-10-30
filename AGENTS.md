# AGENTS.md — Operating Schema

Canonical instructions for every AI agent working on this repository: Claude Code, OpenCode, Pi, Codex, Gemini, Cursor, or anything else. `CLAUDE.md` and `GEMINI.md` point here. If a tool-specific file conflicts with this one, **this file wins**.

## 1. What this repo is

Photography portfolio for Alessandro Torri (landscape / long-exposure), rebuilt from the live Adobe Portfolio site at <https://www.alessandrotorri.it>. React 19 + Vite + TypeScript + MUI 7 + Zustand + Firebase. The public site is being rebuilt first; the existing `/admin` section is preserved and finished afterwards.

## 2. Read order (every session)

1. This file.
2. [`docs/wiki/index.md`](docs/wiki/index.md) — bundle catalog.
3. [`docs/wiki/overview.md`](docs/wiki/overview.md) — current state and contradictions.
4. [`docs/wiki/rebuild-plan.md`](docs/wiki/rebuild-plan.md) — phases, status table, resume protocol.
5. [`docs/wiki/rules/workflow.md`](docs/wiki/rules/workflow.md) and the rest of [`docs/wiki/rules/`](docs/wiki/rules/index.md).
6. The source or code files you are about to change.

Do not start coding before this. If the wiki and the code disagree, the code is evidence and the wiki must be corrected in the same change.

## 3. Three layers

| Layer | Path | Ownership |
|-------|------|-----------|
| Raw sources | `docs/raw/` | Human-curated, **immutable**. Read it; never rewrite it. |
| Wiki | `docs/wiki/` | Agent-owned. Summaries, concepts, decisions, rules, reviews. |
| Schema | `AGENTS.md` + `docs/wiki/rules/` | Co-evolves with the project. Update it when a convention changes. |

## 4. The usual loop

Use this for every new source in `docs/raw/`, every GitHub issue, every feature, and every bug. The same procedure lives in [`docs/wiki/rules/workflow.md`](docs/wiki/rules/workflow.md) and in the [`.agents/skills/usual-loop`](.agents/skills/usual-loop/SKILL.md) skill.

1. **Read** — the raw source, or the GitHub issue fetched with `gh issue view <n> --comments`, then the read order above. The user may drop any useful document in `docs/raw/` or point you at an issue URL; both are valid inputs.
2. **Analyze** — summarize it, extract requirements, list affected docs/code, and flag contradictions with evidence.
3. **Plan** — write the plan (update `docs/wiki/rebuild-plan.md` or create a decision record). State scope, files, acceptance criteria, and what is explicitly out of scope.
4. **Implement** — branch, small conventional commits, code + docs together, `npm run lint && npm run build`.
5. **Update the wiki** — add a source summary (raw file or issue), update every concept touched, update `docs/wiki/index.md`, append to `docs/wiki/log.md`, record decisions.
6. **Draft PR** — push and open a draft PR with the checklist; link the issue.

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

- Every non-reserved `*.md` file in `docs/wiki/` starts with YAML frontmatter containing a non-empty `type`.
- `docs/raw/` sits outside the bundle: it is the immutable llm-wiki source layer and never has frontmatter. Do not "fix" it.
- `index.md` and `log.md` are reserved: no frontmatter, except `okf_version: "0.2"` on the bundle-root `index.md`.
- Links between wiki concepts are **bundle-relative** (`/concepts/tech-stack.md`). References to the sibling raw layer use a relative path such as `../../raw/2026-10-29-rebuild.md`; that is the only allowed parent escape.
- Lifecycle `status` is one of `draft`, `stable`, `deprecated`.
- Page types in use: `Overview`, `Plan`, `Architecture`, `Reference`, `Playbook`, `Roadmap`, `Source Summary`, `Decision`, `Review`.
- Every new page must be linked from at least one other page and listed in the relevant `index.md`.
- New source → `docs/wiki/sources/YYYY-MM-DD-slug.md` plus updates to every concept it touches. For a GitHub issue, use the ingest date and link the issue URL in `sources[].resource`.
- New decision → `docs/wiki/decisions/NNNN-slug.md` plus an entry in `docs/wiki/decisions/index.md`.
- Contradictions get a `> [!WARNING]` callout naming the conflicting pages; unresolved items get `> [!QUESTION]`.
- Append to `docs/wiki/log.md` (newest first, ISO dates) after every loop.

### Wiki organization (keep it this way)

```text
docs/
  raw/                     # immutable sources (files + index.md)
  wiki/                    # OKF bundle root
    index.md               # catalog: every page linked here or in a section index
    log.md                 # append-only history
    overview.md            # tier-1 synthesis (root-level, one only)
    rebuild-plan.md        # active plan (root-level, one only)
    concepts/              # architecture, systems, references
    rules/                 # agent schema, workflow, code/git conventions
    decisions/             # NNNN-slug.md + index.md
    sources/               # one summary per raw file or GitHub issue + index.md
    reviews/               # audits and health checks + index.md
```

- Do not create loose pages in `docs/wiki/`; only the four root files above live there. Everything else goes in a section.
- Put a page in the section that matches its type: behaviour → `rules/`, implementation knowledge → `concepts/`, a choice → `decisions/`, an input → `sources/`, an audit → `reviews/`.
- Every section has an `index.md`; update it and the root `index.md` when adding a page.
- Reuse and update existing pages before creating near-duplicates.
- If a page stops being current, set `status: deprecated` and link its replacement; do not silently delete history.

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

- Public rebuild: phases 0–5 done. Next: administrator section (issue #3). See [`docs/wiki/rebuild-plan.md`](docs/wiki/rebuild-plan.md).
- Knowledge foundation: done 2026-10-29 (wiki compliance, docs audit, agent schema, skills, green baseline).
- Wiki layout: `docs/wiki/` is the OKF bundle, sibling of `docs/raw/`; sections are fixed by decision 0004.
- Dependencies: in-range refresh done; MUI 9.5 adopted 2026-10-29; remaining majors in issue #6, grpc advisory in issue #5.
- Next: public site phases 3–5 (issue #2); admin protection (issue #3).
- Admin is currently reachable without auth; do not "improve" it until issue #3, but never expose new admin routes.
