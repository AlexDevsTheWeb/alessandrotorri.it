---
type: Playbook
title: Agent Rules
description: How AI agents should work in the alessandrotorri.it repository.
tags: [agents, rules, guidelines, ai-assistant]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Agent Rules

The canonical schema is the repository-root `AGENTS.md`. This page is the wiki copy of the coding and collaboration rules; if they disagree, `AGENTS.md` wins and this page must be fixed.

## Before starting work

1. Read `AGENTS.md`, [the bundle index](/index.md), [the overview](/overview.md), and [the Rebuild Plan](/rebuild-plan.md).
2. Read [The Usual Loop](/rules/workflow.md).
3. Run `npm run lint` and `npm run build` to confirm the baseline.
4. Read the files you are about to edit. If the wiki and the code disagree, fix the wiki in the same change.

## Code rules

- **No comments** in new code unless explicitly requested.
- **No new dependencies** without approval — check `package.json` first.
- **MUI only** — `sx` prop or Emotion `styled()`. No Tailwind, CSS Modules, or Sass.
- **TypeScript strict** — no `any`, complete all interfaces.
- **Firebase patterns** — use the existing `src/firebase.ts` init; follow the schema in [Photo Management](/concepts/photo-management.md).
- **Zustand for state** — no Redux, no new Context stores.
- **File naming** — `*.layout.tsx`, `*.component.tsx`, `*.types.ts`, `*Store.ts`.

## Before committing

1. `npm run lint` — clean.
2. `npm run build` — succeeds.
3. No `console.log` left in code.
4. No secrets or API keys staged; `.env` stays ignored.
5. Wiki pages and `docs/wiki/log.md` updated in the same PR.

## Architecture constraints

- All public pages render inside `SharedLayout` (Navbar + Footer + BackToTop).
- Admin routes must be wrapped in `ProtectedRoute`. This is **not yet enabled** in `src/App.tsx`; tracked in issue #3.
- Images upload to Firebase Storage at `images/{filename}`.
- Image metadata lives in the Firestore `images` collection.
- Collections are derived from the `collection` field — there is no separate collection entity.
- The Firestore document id is not a stored field; map `document.id` explicitly when using `useCollection`.
- See [Site Architecture](/concepts/site-architecture.md) for routes.

## Content and language

- Main subject: **long-exposure landscape photography**.
- The live site and UI copy are **Italian** (Gallerie, FAVORITE/ULTIMI LAVORI, captions like "Eilean Donan Castle - Scozia"). Preserve them.
- Documentation and code identifiers are **English**.
- Use the Adobe CDN images already captured in `src/data/collections.data.ts`; do not introduce Unsplash/Pexels placeholders.

## Related

- [The Usual Loop](/rules/workflow.md)
- [Code Style](/rules/code-style.md)
- [Git Conventions](/rules/git-conventions.md)
- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
