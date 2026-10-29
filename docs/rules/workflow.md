---
type: Playbook
title: The Usual Loop
description: The standard read → analyze → plan → implement → update-wiki → draft-PR loop used for every source, feature, and bug.
tags: [workflow, loop, process, agents, wiki]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: /raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# The Usual Loop

This is the operating procedure for changes in this repository. `AGENTS.md` is the canonical schema; this page is the detailed playbook. The loadable agent skill lives at `.agents/skills/usual-loop/SKILL.md`.

## When to use it

- A new file appears under `docs/raw/`.
- A new feature is requested.
- A bug is reported.
- A dependency or tooling change is proposed.

## 0. Orient

Read `AGENTS.md`, [the bundle index](/index.md), [the overview](/overview.md), [the Rebuild Plan](/rebuild-plan.md), and the [rules](/rules/index.md). Check `git status` and the branch. Treat uncommitted work as someone else's until proven otherwise.

## 1. Read

Read the raw source end-to-end or reproduce the bug. Raw sources are immutable: never edit `docs/raw/`.

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

- New source → a [source summary](/sources/index.md) page named `YYYY-MM-DD-slug.md`.
- Update every concept the change touches.
- Update the relevant `index.md` and append to [the log](/log.md).
- Record decisions in `/decisions/`.
- Keep frontmatter and bundle-relative links valid (OKF v0.2).

## 6. Open the draft PR

Push the branch and open a **draft** PR against `development` with `.github/PULL_REQUEST_TEMPLATE.md`. Link issues. The PR is the review surface for both code and wiki changes.

## Definition of done

- [ ] Analysis and plan are written.
- [ ] Implementation is complete; lint and build are green.
- [ ] Source summary and touched concepts are updated.
- [ ] `docs/index.md` and `docs/log.md` are updated.
- [ ] Decisions are recorded.
- [ ] Draft PR is open and issues are linked.

## Related

- [Agent Rules](/rules/agent-rules.md)
- [Git Conventions](/rules/git-conventions.md)
- [Code Style](/rules/code-style.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
