---
type: Playbook
title: Git Conventions
description: Commit message format, branching strategy, PR rules, and CI expectations.
tags: [git, commits, branching, pr, ci]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
---

# Git Conventions

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <description>

[optional body]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature (page, component, functionality) |
| `fix` | Bug fix (broken route, type error, UI glitch) |
| `refactor` | Restructuring without behavior change |
| `chore` | Tooling, config, dependency updates |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `test` | Tests |

### Examples

```text
feat: add collection cover grid
fix: enable ProtectedRoute for admin pages
docs: ingest rebuild charter and audit the wiki
chore: remove Firebase Studio workspace files
```

## Branching

- `development` — default and integration branch.
- Feature branches: `feat/<description>`, `fix/<description>`, `docs/<description>`, `chore/<description>`.
- One logical change per branch.

## Pull requests

- Open as **draft** while work is in progress; mark ready only after verification.
- Target `development`.
- Fill `.github/PULL_REQUEST_TEMPLATE.md`; link issues.
- Include code **and** the wiki/log updates in the same PR (see [The Usual Loop](/rules/workflow.md)).
- `npm run lint` and `npm run build` must pass; CI runs both.
- Review the full diff before requesting merge.
