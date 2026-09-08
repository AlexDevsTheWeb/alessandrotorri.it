---
type: Playbook
title: Git Conventions
description: Commit message format, branching strategy, and PR guidelines.
tags: [git, commits, branching, pr]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Git Conventions

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>

[optional body]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature (new page, new component, new functionality) |
| `fix` | Bug fix (broken route, type error, UI glitch) |
| `refactor` | Code restructuring without behavior change |
| `chore` | Tooling, config, dependency updates |
| `docs` | Documentation changes only |
| `style` | Formatting, no logic change |
| `test` | Adding or updating tests |

### Examples

```
feat: add About page with bio and gear section
fix: enable ProtectedRoute for admin pages
refactor: extract ImageCard from CollectionPage
chore: update MUI to 7.3.8
```

## Branching

- `main` — production-ready code
- Feature branches: `feat/<description>`, `fix/<description>`
- One logical change per branch

## Pull Requests

- Clear title describing the change
- Reference any related issues
- Ensure `npm run lint` and `npm run build` pass
- Review all changed files before requesting merge
