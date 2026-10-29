---
type: Review
title: "2026-10-29 — Docs and baseline audit"
description: Inventory of the existing documentation, keep/update/archive verdicts, stale claims found, and the state of the lint/build baseline.
tags: [review, audit, documentation, baseline, build]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: /raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Scope

The charter asks to inspect the documents already in `docs/` and decide whether they are usable, need updating, or should be trashed. This review covers every file present before the 2026-10-29 loop, plus root-level files that acted as documentation.

OKF structural conformance applies to the wiki layer (`docs/` excluding `docs/raw/`). `docs/raw/` is the immutable llm-wiki source layer and intentionally has no frontmatter.

# Verdicts

| Document | Verdict | Reason / action |
|----------|---------|-----------------|
| `docs/index.md` | Keep + update | Valid catalog, but missing sources/decisions/reviews/workflow; stale status. Rewritten. |
| `docs/overview.md` | Update | Said phases 0–5 pending; did not mention the charter. Refreshed status and added the look & feel contradiction. |
| `docs/rebuild-plan.md` | Update | "Not pixel-clone" conflicted with the charter; baseline said build fails. Decision wording, status, and verification updated. |
| `docs/log.md` | Keep + append | Correct format; appended the 2026-10-29 loop. |
| `docs/concepts/index.md` | Keep + update | Add missing pages (decisions, sources, workflow). |
| `docs/concepts/roadmap.md` | Keep (deprecated) | Historical plan; status changed to `deprecated` and linked to the Rebuild Plan. |
| `docs/concepts/site-architecture.md` | Update | Listed `/about`, which does not exist; omitted the rebuild routes. Corrected. |
| `docs/concepts/tech-stack.md` | Update | Claimed Firebase Studio/IDX, removed from the repo. Refreshed versions and tooling. |
| `docs/concepts/firebase-backend.md` | Update | Route protection claim was false; added the id mapping note. |
| `docs/concepts/photo-management.md` | Update | Schema was right; added the document-id rule and the `idField` bug. |
| `docs/concepts/gallery-system.md` | Update | Described Firestore-only behavior; current public work is static CDN data. Marked the dual state. |
| `docs/concepts/design-system.md` | Keep | Accurate; linked to decision 0003. |
| `docs/concepts/state-management.md` | Keep | Accurate. |
| `docs/concepts/admin-dashboard.md` | Update | Route protection is still commented out; recorded as issue #3. |
| `docs/rules/agent-rules.md` | Update | Referenced a non-existent `PLAN.md`; claimed the site is English and told agents to add Unsplash placeholders. Corrected. |
| `docs/rules/code-style.md` | Update | Type files are now `.ts`, not `.tsx`; clarified legacy naming. |
| `docs/rules/git-conventions.md` | Update | Default branch is `development`; documented draft PRs and wiki-in-PR. |
| `docs/rules/index.md` | Update | Added the workflow page. |
| `docs/raw/2026-10-29-rebuild.md` | Keep (immutable) | New source; never edited. |
| `blueprint.md` (root) | Archive | Moved to `docs/raw/2026-03-03-blueprint.md`; see decision 0002. |
| `GEMINI.md` (root) | Trash + replace | Old Firebase Studio guidance contradicted the project. Replaced with a pointer to `AGENTS.md`. |
| `.idx/` | Trash | Firebase Studio workspace files, unused and deleted. |
| `README.md` (root) | Replace | Vite template boilerplate; replaced with project docs and quick start. |

# Stale or false claims found

1. **`/about` route** documented in architecture and roadmap but absent from `src/App.tsx`; no About page exists.
2. **`PLAN.md`** referenced in agent rules but never existed; the active plan is `docs/rebuild-plan.md`.
3. **"Site is in English"** in agent rules; the live site and UI copy are Italian.
4. **Firebase Studio/IDX** listed as tooling after `.idx/` and `GEMINI.md` were removed.
5. **ProtectedRoute** documented as active; it is commented out in `src/App.tsx`.
6. **`idField: 'id'`** passed to `react-firebase-hooks` 5.1.1, which does not support it; every `image.id` was `undefined` in admin actions.
7. **Build status** documented as failing; it is now green after the baseline fix.

# Baseline

Before the loop: `npm run lint` → 3 errors + 1 warning; `npm run build` → TypeScript errors in `IImage`, `CollectionPage`, and `CollectionDetailPage`.

After the loop:

```text
npm run lint   # clean
npm run build  # succeeds (single 1.1 MB chunk warning, deferred to phase 5)
```

The baseline fix is commit `31d6854` and is covered by CI (`.github/workflows/ci.yml`).

# Carried forward

- Issue #1 — dependency refresh after the foundation.
- Issue #2 — public site rebuild phases 3–5.
- Issue #3 — protect admin routes and finish the administrator section.
- Phase 5 debt: page titles/meta, `robots.txt`, `sitemap.xml`, route-level code splitting, bundle-size warning.

# Links

- [Source summary](/sources/2026-10-29-rebuild.md)
- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
- [Decision 0002 — Archive blueprint.md](/decisions/0002-archive-blueprint.md)
- [Rebuild Plan](/rebuild-plan.md)
