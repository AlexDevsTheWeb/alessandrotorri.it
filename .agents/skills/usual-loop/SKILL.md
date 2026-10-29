---
name: usual-loop
description: Run the project's standard loop for a new docs/raw source, a feature, or a bug — read, analyze, plan, implement, update the OKF wiki, and open a draft PR. Use when the user says "usual loop", adds a file under docs/raw/, or asks for a feature/bug to be handled end-to-end.
license: MIT
compatibility: opencode, claude-code, pi
metadata:
  project: alessandrotorri.it
  workflow: docs/rules/workflow.md
---

# The usual loop

Apply this end-to-end. Do not skip the wiki step; an implementation without a wiki update is unfinished.

## 0. Orient

Read, in order:

1. `AGENTS.md` (canonical schema)
2. `docs/index.md`
3. `docs/overview.md`
4. `docs/rebuild-plan.md` (status table + resume protocol)
5. `docs/rules/workflow.md` and the rules it links
6. The raw source or the code you will touch

Check `git status`, the current branch, and whether the working tree has uncommitted work that belongs to someone else.

## 1. Read the input

- New source: read the whole file in `docs/raw/`. It is immutable — never edit it.
- Feature/bug: read the issue and reproduce or locate the relevant code.

## 2. Analyze

Produce a short written analysis:

- One-paragraph summary.
- Extracted requirements or acceptance criteria.
- Affected wiki pages and code files.
- Contradictions with existing docs, with evidence and links.
- Open questions; ask only if the answer changes the plan.

## 3. Plan

Write the plan before coding:

- Update `docs/rebuild-plan.md`, or create `docs/decisions/NNNN-slug.md` for a decision.
- State scope, out-of-scope, files, verification, and risks.
- If the scope is large, split it into a foundation PR plus tracked issues.

## 4. Implement

- Create a branch: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, or `chore/<slug>`.
- Keep commits small and conventional.
- Code and its wiki updates go in the same PR.
- Run `npm run lint && npm run build` before every commit.
- Never commit `.env`, `node_modules/`, or `dist/`.

## 5. Update the wiki

- New source → `docs/sources/YYYY-MM-DD-slug.md` (`type: Source Summary`) with `sources[].resource: /raw/<file>`.
- Update every concept the change touches.
- Add `> [!WARNING]` for contradictions and `> [!QUESTION]` for unresolved items.
- New decision → `docs/decisions/NNNN-slug.md` + `docs/decisions/index.md`.
- Update `docs/index.md`, the relevant section `index.md`, and append to `docs/log.md`.
- Keep `status` to `draft | stable | deprecated`; use bundle-relative links.

## 6. Open the draft PR

```bash
git push -u origin HEAD
gh pr create --draft --base development --title "<type>: <summary>" --body-file .github/PULL_REQUEST_TEMPLATE.md
```

Fill the checklist, link issues, and summarize the wiki pages added or updated.

## Done when

- [ ] Analysis and plan exist (in the PR or a decision/plan page).
- [ ] Code implemented, lint green, build green.
- [ ] Source summary and every touched concept updated.
- [ ] `docs/index.md` and `docs/log.md` updated.
- [ ] Decisions recorded.
- [ ] Draft PR open against `development` with issues linked.
