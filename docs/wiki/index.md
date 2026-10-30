---
okf_version: "0.2"
---

# AlessandroTorri.it — Knowledge Bundle

OKF v0.2 knowledge bundle for the alessandrotorri.it photography portfolio. It captures the rebuild plan, architecture, Firebase/photo workflows, decisions, and the shared rules for AI agents.

> [!TIP] Start here
> New session? Read [AGENTS.md](https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/AGENTS.md), then [Overview](/overview.md), then [Rebuild Plan](/rebuild-plan.md) (status table + phases + resume protocol).

> [!NOTE] Layers
> `docs/raw/` holds immutable sources. `docs/wiki/` (this bundle) holds the generated knowledge. New inputs may be raw files or GitHub issues; both get a page under [Sources](/sources/index.md).

## Start Here

* [Overview](/overview.md) - Tier-1 synthesis: what the project is, where it stands, what contradicts what.
* [Rebuild Plan](/rebuild-plan.md) - Single source of truth for the public-site rebuild; status table, phases, resume protocol.
* [The Usual Loop](/rules/workflow.md) - Read → analyze → plan → implement → update wiki → draft PR.

## Sources

* [Source summaries](/sources/index.md) - One page per ingested raw source or GitHub issue.
* [2026-10-29 — Rebuild charter](/sources/2026-10-29-rebuild.md) - The owner's goals, wiki/agent model, and execution order.
* [2026-10-29 — GitHub issue #1](/sources/2026-10-29-gh-issue-1.md) - Dependency refresh: in-range updates, deferred majors, security note.
* [2026-10-29 — GitHub issue #6](/sources/2026-10-29-gh-issue-6.md) - MUI 9.5 adoption and the v7→v9 migrations.
* [2026-10-29 — GitHub issue #2](/sources/2026-10-29-gh-issue-2.md) - Public rebuild phases 3–4: the 9-cover grid and the collection feed + lightbox.
* [2026-10-29 — Layout improvements](/sources/2026-10-29-layout-improvements.md) - Owner feedback on fonts, hover, cards, footer, mobile header and drawer.
* [2026-03-03 — Blueprint](/sources/2026-03-03-blueprint.md) - Original feature blueprint (deprecated history).

## Decisions

* [Decision index](/decisions/index.md) - All decisions, newest first.
* [0008 — Visual refinements](/decisions/0008-visual-refinements.md) - Fonts, hover, covers, footer, mobile drawer.
* [0007 — Home renders the gallery grid](/decisions/0007-home-gallery-grid.md) - No redirect; `/` and `/gallery` share the grid.
* [0006 — Adopt Material UI 9](/decisions/0006-adopt-mui-9.md) - MUI 9.5 + v9 API migrations.
* [0005 — Dependency refresh policy](/decisions/0005-dependency-refresh-policy.md) - In-range now, majors deferred, no force fixes.
* [0004 — Wiki layout under docs/wiki](/decisions/0004-wiki-layout.md) - Raw and wiki as siblings; fixed section layout.
* [0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md) - OKF v0.2 wiki, immutable raw layer, one `AGENTS.md`.
* [0002 — Archive blueprint.md](/decisions/0002-archive-blueprint.md) - Blueprint moved to `docs/raw/`.
* [0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md) - Visual parity, modern implementation.

## Concepts

* [Site Architecture](/concepts/site-architecture.md) - Routing, pages, layout shell.
* [Tech Stack](/concepts/tech-stack.md) - Frameworks, libraries, toolchain.
* [Firebase Backend](/concepts/firebase-backend.md) - Auth, Firestore, Storage.
* [Photo Management](/concepts/photo-management.md) - Upload pipeline, collections, metadata.
* [Gallery System](/concepts/gallery-system.md) - Public gallery, feed, lightbox, progressive images.
* [Design System](/concepts/design-system.md) - MUI theme, typography, color, responsiveness.
* [State Management](/concepts/state-management.md) - Zustand stores.
* [Admin Dashboard](/concepts/admin-dashboard.md) - Upload, collections, reordering.
* [Project Roadmap](/concepts/roadmap.md) - Original phased plan (deprecated).

## Rules

* [Agent Rules](/rules/agent-rules.md) - How agents work in this repo.
* [The Usual Loop](/rules/workflow.md) - The standard end-to-end procedure.
* [Code Style](/rules/code-style.md) - TypeScript, React, MUI conventions.
* [Git Conventions](/rules/git-conventions.md) - Commits, branches, PRs.

## Reviews

* [Docs and baseline audit — 2026-10-29](/reviews/2026-10-29-docs-audit.md) - Keep/update/archive verdicts and baseline fix.

## Wiki Operations (llm-wiki)

* **Ingest** - New raw file or GitHub issue? Summarize it in `/sources/`, update every concept it touches, flag contradictions with `> [!WARNING]`, append to [Log](/log.md), update this index.
* **Query** - Answer from these pages, not raw code; cite the concept pages used.
* **Lint** - Check orphan pages, broken bundle-relative links, non-OKF `status` values, missing `type` frontmatter, and stale claims. Keep the root clean: only `index.md`, `log.md`, `overview.md`, `rebuild-plan.md`.
