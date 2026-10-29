---
type: Playbook
title: The Usual Loop
description: The standard read → analyze → plan → implement → update-wiki → draft-PR loop used for every raw source, GitHub issue, feature, and bug.
tags: [workflow, loop, process, agents, wiki]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# The Usual Loop

This is the operating procedure for changes in this repository. `AGENTS.md` is the canonical schema; this page is the detailed playbook. The loadable agent skill lives at `.agents/skills/usual-loop/SKILL.md`.

## When to use it

- A new file appears under `docs/raw/` (the owner drops any document that may be useful).
- The owner points at a GitHub issue or issue URL.
- A new feature is requested or a bug is reported.
- A dependency or tooling change is proposed.

## 0. Orient

Read `AGENTS.md`, [the bundle index](/index.md), [the overview](/overview.md), [the Rebuild Plan](/rebuild-plan.md), and the [rules](/rules/index.md). Check `git status` and the branch. Treat uncommitted work as someone else's until proven otherwise.

## 1. Read

- **Raw file:** read it end-to-end. Raw sources are immutable: never edit `docs/raw/`.
- **GitHub issue:** fetch the issue and its comments with `gh issue view <number> --comments` (or read the URL the owner provides). Treat the issue as a source; do not edit it unless asked.
- Reproduce the bug or inspect the current implementation when the input is a bug.

## 2. Analyze

Write down, before coding:

- one-paragraph summary;
- requirements and acceptance criteria;
- affected wiki pages and code files;
- contradictions, with links and a `> [!WARNING]` callout;
- open questions. Ask only when the answer changes the plan.

## 3. Plan

Update [the Rebuild Plan](/rebuild-plan.md) or create a [decision record](/decisions/index.md). State scope, out-of-scope, files, verification, and risks. Split large work into a foundation PR plus tracked GitHub issues.

## 4. Implement

- Branch from `development`: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`.
- One logical change per commit, Conventional Commits.
- No comments, no new dependencies, MUI `sx` only, TypeScript strict.
- `npm run lint && npm run build` before every commit.
- Never commit `.env`, `node_modules/`, or `dist/`.

## 5. Update the wiki

- New raw source → a [source summary](/sources/index.md) named `YYYY-MM-DD-slug.md` with `sources[].resource: ../../raw/<file>`.
- New GitHub issue → a [source summary](/sources/index.md) named `YYYY-MM-DD-gh-issue-<n>.md` with `sources[].resource: https://github.com/.../issues/<n>`.
- Update every concept the change touches.
- Update the section `index.md` and the root [bundle index](/index.md); append to [the log](/log.md).
- Record decisions in `/decisions/` and link them from the index.
- Keep frontmatter valid (OKF v0.2) and links bundle-relative, except the documented `../../raw/` references.

## 6. Open the draft PR

Push the branch and open a **draft** PR against `development` with `.github/PULL_REQUEST_TEMPLATE.md`. Link the issue. The PR is the review surface for both code and wiki changes.

## Wiki organization (keep it this way)

```text
docs/
  raw/                     # immutable sources + index.md
  wiki/                    # OKF bundle root
    index.md               # every page discoverable from here or a section index
    log.md                 # append-only history
    overview.md            # one tier-1 synthesis at the root
    rebuild-plan.md        # one active plan at the root
    concepts/              # architecture, systems, references
    rules/                 # agent schema, workflow, code/git conventions
    decisions/             # NNNN-slug.md + index.md
    sources/               # one summary per raw file or issue + index.md
    reviews/               # audits and health checks + index.md
```

- No loose pages at `docs/wiki/` root: only the four root files above.
- Match the section to the page type. Reuse and update an existing page before creating a near-duplicate.
- When a page goes stale, set `status: deprecated` and link the replacement; do not delete history silently.

## Definition of done

- [ ] Analysis and plan are written.
- [ ] Implementation is complete; lint and build are green.
- [ ] Source summary (raw file or issue) and touched concepts are updated.
- [ ] `docs/wiki/index.md`, the section index, and `docs/wiki/log.md` are updated.
- [ ] Decisions are recorded.
- [ ] Draft PR is open and the issue is linked.

## Related

- [Agent Rules](/rules/agent-rules.md)
- [Git Conventions](/rules/git-conventions.md)
- [Code Style](/rules/code-style.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
- [Decision 0004 — Wiki layout under docs/wiki](/decisions/0004-wiki-layout.md)
