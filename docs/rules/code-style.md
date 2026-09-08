---
type: Playbook
title: Code Style
description: TypeScript, React, and MUI coding conventions for the project.
tags: [code-style, typescript, react, mui, conventions]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Code Style

## TypeScript

- Strict mode enabled
- No `any` types — use `unknown` or proper interfaces
- Interfaces in `src/types/` directory
- File naming: `.types.ts` (not `.tsx` — no JSX in type files)
- Prefer `interface` over `type` for object shapes

## React

- Functional components only — no class components
- Hooks for state and side effects
- Destructure props in function signature
- No inline styles — use MUI `sx` prop or `styled()` from Emotion

## MUI

- Primary styling: `sx` prop on MUI components
- One-off custom styles: Emotion `styled()` (see `BacktoTopButton.layout.tsx`)
- No Tailwind, no CSS Modules, no Sass
- Use MUI's responsive breakpoints: `theme.breakpoints.up('md')` pattern
- Icons from `@mui/icons-material`

## File Organization

```
src/
  components/     # Reusable UI components
  layout/         # Shell/layout components (*.layout.tsx)
  pages/          # Route-level page components
  store/          # Zustand stores (*Store.ts)
  style/          # Theme configuration
  types/          # TypeScript interfaces (*.types.ts)
```

## Naming Conventions

- Components: `PascalCase` (e.g. `PhotoGallery.component.tsx`)
- Layout components: `*.layout.tsx` suffix
- Stores: `*Store.ts` suffix
- Types: `*.types.ts` suffix
- CSS classes: MUI `sx` prop, no separate class files
