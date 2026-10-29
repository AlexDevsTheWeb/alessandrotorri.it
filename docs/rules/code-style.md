---
type: Playbook
title: Code Style
description: TypeScript, React, and MUI coding conventions for the project.
tags: [code-style, typescript, react, mui, conventions]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
---

# Code Style

## TypeScript

- Strict mode enabled (`tsconfig.app.json`).
- No `any` — use `unknown` or a proper interface.
- Interfaces live in `src/types/` as `*.types.ts` (no JSX in type files).
- Prefer `interface` over `type` for object shapes.
- Type-only imports use `import type` (the project enables `verbatimModuleSyntax`).

## React

- Functional components only — no class components.
- Hooks for state and side effects.
- Destructure props in the function signature.
- No inline styles — use MUI `sx` or Emotion `styled()`.

## MUI

- Primary styling: `sx` prop on MUI components.
- One-off custom styles: Emotion `styled()` (see `BacktoTopButton.layout.tsx`).
- No Tailwind, no CSS Modules, no Sass.
- Responsive breakpoints: `theme.breakpoints.up('md')` or the `sx` object syntax.
- Icons from `@mui/icons-material`.

## File organization

```text
src/
  components/     # Reusable UI components (*.component.tsx or PascalCase legacy)
  layout/         # Shell/layout components (*.layout.tsx)
  pages/          # Route-level page components
  store/          # Zustand stores (*Store.ts)
  style/          # Theme configuration
  types/          # TypeScript interfaces (*.types.ts)
  data/           # Static content for the CDN phase
```

## Naming conventions

- Components: `PascalCase` (e.g. `PhotoGallery.component.tsx`).
- Layout components: `*.layout.tsx`.
- Stores: `*Store.ts`.
- Types: `*.types.ts`.
- CSS: MUI `sx`; no separate class files.

## Comments

- No comments in new code unless explicitly requested. Prefer clear names and small functions.
- Existing Italian comments are legacy; remove them when touching the surrounding code.
