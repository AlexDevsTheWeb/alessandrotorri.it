---
type: Decision
title: "0002 — Archive blueprint.md as a raw source"
description: Move the stale root blueprint into docs/raw and keep the Rebuild Plan as the only active build plan.
tags: [decision, documentation, blueprint, history]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: /raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
  - id: raw-blueprint
    resource: /raw/2026-03-03-blueprint.md
    title: Photography Portfolio Project Blueprint (raw, immutable)
---

# Context

`blueprint.md` at the repository root described the original feature plan. It duplicated the [Project Roadmap](/concepts/roadmap.md) and was already behind the [Rebuild Plan](/rebuild-plan.md): it listed GalleryPage/CollectionPage as "next" without the live-site analysis, phases, or acceptance criteria. A root-level planning file also competes with the wiki as the place agents look first.

# Decision

Move it to `docs/raw/2026-03-03-blueprint.md`, treat it as immutable historical evidence, and remove it from the repository root. The [Rebuild Plan](/rebuild-plan.md) remains the only active build plan. The blueprint is summarized in [its source page](/sources/2026-03-03-blueprint.md) and marked deprecated.

# Consequences

- No ambiguous root-level plan.
- History is preserved and diffable.
- Agents read the Rebuild Plan, not a stale feature list.
- Future planning changes go to the Rebuild Plan or a decision record.

# Links

- [Raw blueprint](/raw/2026-03-03-blueprint.md)
- [Source summary](/sources/2026-03-03-blueprint.md)
- [Rebuild Plan](/rebuild-plan.md)
