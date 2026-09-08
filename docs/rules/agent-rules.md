---
type: Playbook
title: Agent Rules
description: Guidelines for AI agents working on the alessandrotorri.it codebase.
tags: [agents, rules, guidelines, ai-assistant]
generated: { by: human:alessandro, at: 2026-08-26T22:00:00Z }
status: stable
---

# Agent Rules

## Before Starting Work

1. Read this knowledge bundle (`docs/`) to understand the project
2. Check `PLAN.md` for the current phase and what's in progress
3. Run `npm run lint` and `npm run build` to establish baseline
4. Read the file you're about to edit — understand its context before changing it

## Code Rules

- **No comments** unless explicitly asked
- **No new dependencies** without approval — check `package.json` first
- **MUI only** — do not introduce Tailwind, CSS Modules, or other CSS systems
- **TypeScript strict** — no `any` types, complete all interfaces
- **Firebase patterns** — use existing `firebase.ts` init, follow Firestore document schema in [Photo Management](/concepts/photo-management.md)
- **Zustand for state** — no Redux, no Context API for new stores
- **Existing file naming** — follow `.layout.tsx`, `.component.tsx`, `.types.tsx` conventions already in the codebase

## Before Committing

1. Run `npm run lint` — fix all errors
2. Run `npm run build` — must succeed
3. Run `npm run typecheck` if available — no type errors
4. Verify no `console.log` statements left in code
5. Verify no secrets or API keys in code (check `.env` is in `.gitignore`)

## Git Conventions

- See [Git Conventions](/rules/git-conventions.md) for commit message format
- One logical change per commit
- Never commit `node_modules/` or build artifacts

## Architecture Constraints

- All public pages render inside `SharedLayout` (Navbar + Footer)
- Admin routes must be wrapped in `ProtectedRoute` (currently commented out — fix this)
- Images upload to Firebase Storage at `images/{filename}`
- Image metadata lives in Firestore `images` collection
- Collections are derived from the `collection` field — no separate collection entity
- See [Site Architecture](/concepts/site-architecture.md) for routing details

## Photography Domain

- Main subject: **long exposure photography**
- Content should reflect this: seascapes, city lights, star trails, waterfalls
- Placeholder content should use long exposure photography from Unsplash/Pexels
- The site is in English; Italian text in code is legacy — replace with English
