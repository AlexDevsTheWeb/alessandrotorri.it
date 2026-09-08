# Knowledge Bundle Update Log

## 2026-09-08
* **Wiki migration**: `docs/` converted to llm-wiki + OKF v0.2 compliant wiki (English only, per owner decision).
* **Fixed**: `index.md` frontmatter removed (reserved file); `rebuild-plan.md` `okf_version` field removed, `description`/`tags`/`sources` added; all cross-links now absolute bundle-relative (`/concepts/...`, `/rules/...`, `/rebuild-plan.md`, `/overview.md`, `/log.md`); no `../` parent escapes.
* **Added**: `overview.md` (Tier-1 synthesis hub, tree shape: index → overview → cluster hubs); ingest/query/lint operations in `index.md`; contradiction callouts (roadmap superseded) in `overview.md` + `concepts/roadmap.md` (status → `superseded`).
* **Next**: Phase 0 baseline (`npm run lint`, `npm run build`), then Phase 1 `src/data/collections.data.ts`.

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
