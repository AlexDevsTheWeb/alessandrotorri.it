---
name: usual-loop
description: Run the project's standard loop for a docs/raw source, a GitHub issue, a feature, or a bug — read, analyze, plan, implement, update the OKF wiki under docs/wiki, and open a draft PR. Use when the user says "usual loop", adds a file under docs/raw/, links an issue, or asks for end-to-end handling.
license: MIT
compatibility: opencode, claude-code, pi
metadata:
  project: alessandrotorri.it
  workflow: docs/wiki/rules/workflow.md
---

# The usual loop

Apply this end-to-end. Do not skip the wiki step; an implementation without a wiki update is unfinished.

## 0. Orient

Read, in order:

1. `AGENTS.md` (canonical schema)
2. `docs/wiki/index.md`
3. `docs/wiki/overview.md`
4. `docs/wiki/rebuild-plan.md` (status table + resume protocol)
5. `docs/wiki/rules/workflow.md` and the rules it links
6. The raw source, issue, or code you will touch

Check `git status`, the current branch, and whether the working tree has uncommitted work that belongs to someone else.

## 1. Read the input

- Raw source: read the whole file in `docs/raw/`. It is immutable — never edit it.
- GitHub issue: fetch it with `gh issue view <n> --comments` (or the URL the user provides). Treat it as a source; do not edit it unless asked.
- Feature/bug: reproduce the bug or locate the relevant code.

## 2. Analyze

Produce a short written analysis:

- One-paragraph summary.
- Extracted requirements or acceptance criteria.
- Affected wiki pages and code files.
- Contradictions with existing docs, with evidence and links.
- Open questions; ask only if the answer changes the plan.

## 3. Plan

Write the plan before coding:

- Update `docs/wiki/rebuild-plan.md`, or create `docs/wiki/decisions/NNNN-slug.md` for a decision.
- State scope, out-of-scope, files, verification, and risks.
- If the scope is large, split it into a foundation PR plus tracked issues.

## 4. Implement

- Create a branch: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, or `chore/<slug>`.
- Keep commits small and conventional.
- Code and its wiki updates go in the same PR.
- Run `npm run lint && npm run build` before every commit.
- Never commit `.env`, `node_modules/`, or `dist/`.

## 5. Update the wiki

The wiki is `docs/wiki/`; `docs/raw/` is the immutable source layer.

- New raw source → `docs/wiki/sources/YYYY-MM-DD-slug.md` (`type: Source Summary`) with `sources[].resource: ../../raw/<file>`.
- New GitHub issue → `docs/wiki/sources/YYYY-MM-DD-gh-issue-<n>.md` with `sources[].resource: https://github.com/.../issues/<n>`.
- Update every concept the change touches.
- Add `> [!WARNING]` for contradictions and `> [!QUESTION]` for unresolved items.
- New decision → `docs/wiki/decisions/NNNN-slug.md` + `docs/wiki/decisions/index.md`.
- Update `docs/wiki/index.md`, the relevant section `index.md`, and append to `docs/wiki/log.md`.
- Keep `status` to `draft | stable | deprecated`; use bundle-relative links, except the documented `../../raw/` references.

### Keep the wiki organized

```text
docs/wiki/
  index.md  log.md  overview.md  rebuild-plan.md
  concepts/  rules/  decisions/  sources/  reviews/
```

Do not create loose pages at the wiki root. Put behaviour in `rules/`, implementation knowledge in `concepts/`, choices in `decisions/`, inputs in `sources/`, and audits in `reviews/`. Every section has an `index.md`; update it and the root index. Reuse pages before creating near-duplicates; deprecate, don't silently delete.

## 6. Open the draft PR

```bash
git push -u origin HEAD
gh pr create --draft --base development --title "<type>: <summary>" --body-file .github/PULL_REQUEST_TEMPLATE.md
```

Fill the checklist, link the issue, and summarize the wiki pages added or updated.

## Done when

- [ ] Analysis and plan exist (in the PR or a decision/plan page).
- [ ] Code implemented, lint green, build green.
- [ ] Source summary (raw file or issue) and every touched concept updated.
- [ ] `docs/wiki/index.md`, section index, and `docs/wiki/log.md` updated.
- [ ] Decisions recorded.
- [ ] Draft PR open against `development` with the issue linked.
