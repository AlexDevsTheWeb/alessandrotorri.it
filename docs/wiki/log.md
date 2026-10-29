# Knowledge Bundle Update Log

## 2026-10-29
* **Ingested**: `docs/raw/2026-10-29-rebuild.md` as [source summary](/sources/2026-10-29-rebuild.md); extracted 10 requirements (wiki, docs audit, blueprint, multi-agent schema, libraries, clone, GitHub tooling).
* **Archived**: root `blueprint.md` moved to `docs/raw/2026-03-03-blueprint.md` and summarized as deprecated history ([decision 0002](/decisions/0002-archive-blueprint.md)).
* **Decision**: [0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md) (OKF v0.2, immutable raw, one `AGENTS.md`); [0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md) (visual parity, modern implementation).
* **Agent schema**: added root `AGENTS.md` (canonical), `CLAUDE.md` + `GEMINI.md` pointers, `.agents/skills/usual-loop/SKILL.md` with a `.claude/skills` symlink; added [The Usual Loop](/rules/workflow.md).
* **Audit**: [Docs and baseline audit](/reviews/2026-10-29-docs-audit.md) — every document classified; fixed stale `/about`, `PLAN.md`, "English site", IDX, and ProtectedRoute claims.
* **Baseline**: `npm run lint` and `npm run build` are green. Fixed `IImage`, unused `styled()` theme params, setState-in-effect, and the unsupported `idField` option (image ids were undefined in admin actions).
* **Tooling**: added GitHub Actions CI, PR/issue templates; opened issues #1 (dependencies), #2 (public rebuild phases 3–5), #3 (protect admin).
* **Restructure**: moved the OKF bundle to `docs/wiki/`, sibling of `docs/raw/`; added [decision 0004](/decisions/0004-wiki-layout.md), fixed the section layout, and extended the loop to GitHub issues.
* **PR**: [#4](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/4) — draft knowledge-foundation MR.
* **Repository hygiene**: removed `.idx/` and the stale Firebase Studio `GEMINI.md`; replaced the Vite boilerplate `README.md`.
* **Next**: issue #1 dependency refresh, then rebuild phase 3 ([issue #2](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2)).

## 2026-09-08
* **Wiki migration**: `docs/` converted to llm-wiki + OKF v0.2 compliant wiki (English only, per owner decision).
* **Fixed**: `index.md` frontmatter removed (reserved file); `rebuild-plan.md` `okf_version` field removed, `description`/`tags`/`sources` added; all cross-links now absolute bundle-relative (`/concepts/...`, `/rules/...`, `/rebuild-plan.md`, `/overview.md`, `/log.md`); no `../` parent escapes.
* **Added**: `overview.md` (Tier-1 synthesis hub, tree shape: index → overview → cluster hubs); ingest/query/lint operations in `index.md`; contradiction callouts (roadmap superseded) in `overview.md` + `concepts/roadmap.md` (status → `superseded`).
* **Phase 0 done**: baseline recorded — lint 3 errors + 1 warning (`ProgressiveImage` unused `theme` x2, `CollectionDetailPage` set-state-in-effect; warning exhaustive-deps in `PhotoGallery`); build fails on `IImage` missing fields (`metadata`, `isFavorite`, `isLatestWork`, `isVisible`, `order`) + Firestore generic mismatches.
* **Phase 1 done**: created `src/data/collections.data.ts` — 9 CDN covers (1280w + 32px placeholders), 24 favorite captions scraped, `PHOTOS` stubbed (cover as src, per-photo URLs TODO). New file lint/tsc clean, no new errors.
* **Phase 2 done**: rewrote `src/layout/Navbar.layout.tsx` (triptych: Gallerie left, Alessandro Torri center, IG + YT + theme toggle right; mobile Drawer; dead `/projects`/`/about` links removed; social URLs exported) and `src/layout/Footer.layout.tsx` (centered ↑ Back to Top + IG/YT + copyright). Lint unchanged (3 errors + 1 warning, all pre-existing); tsc clean on both files.
* **Next**: Phase 3 Gallery grid (`src/pages/GalleryPage.tsx`, `src/pages/HomePage.tsx`, new `src/components/CollectionCover.component.tsx`).

## 2026-09-08
* **Added**: `docs/rebuild-plan.md` — stop/restart plan for modern reinterpretation of live alessandrotorri.it (Adobe Portfolio marta/ludwig). Locked: work in current repo, reuse CDN temporarily, admin deferred to Phase 6.
* **Analyzed**: live site structure (triptych header, 9-cover 16:9 grid, single-col detail feed + captions, lightbox #111@0.9, footer back-to-top) via WebFetch of `/` and `/01-favorite`; mapped gaps in `HomePage.tsx`, `GalleryPage.tsx`, `Navbar.layout.tsx`.
* **Linked**: rebuild plan from `docs/index.md` and `docs/concepts/index.md`. Status: all phases 0-5 pending, Phase 6 deferred.
* **Next**: Phase 0 baseline (`npm run lint`, `npm run build`), then Phase 1 `src/data/collections.data.ts`.

## 2026-08-26
* **Creation**: Initialized OKF v0.2 knowledge bundle for alessandrotorri.it project.
* **Creation**: Added core concepts — site architecture, tech stack, Firebase, photo management, gallery, design system, state management, admin dashboard.
* **Creation**: Added agent rules, code style rules, git conventions.
* **Added**: Project roadmap integrated into wiki as `concepts/roadmap.md` — single source of truth for phases and milestones.
