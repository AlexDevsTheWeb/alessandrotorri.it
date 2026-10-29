---
type: Decision
title: "0007 — Home renders the gallery grid"
description: Serve the 9-cover collection grid directly at / instead of redirecting to /gallery, matching the live site.
tags: [decision, gallery, routing, home, rebuild]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: gh-issue-2
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2
    title: "Issue #2 — complete public site rebuild (phases 3-5)"
    author: human:alessandrotorri
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
---

# Context

The Rebuild Plan left one phase 3 choice open: `/` should either render the same cover grid as `/gallery` or redirect there. The live site uses `/` as the gallery itself, and [decision 0003](/decisions/0003-exact-look-and-feel.md) locks visual parity.

# Decision

`HomePage` renders `CollectionGrid` directly. `/gallery` renders the same component. No redirect, no hero, no duplicate markup.

# Consequences

- `/` and `/gallery` stay visually identical and share one component.
- The browser URL remains `/` on entry, matching the live site.
- Any future home-only content needs a new decision; it must not silently replace the grid.
- The grid is now the single place to change cover layout for both routes.

# Links

- [Source summary](/sources/2026-10-29-gh-issue-2.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Gallery System](/concepts/gallery-system.md)
- [Decision 0003 — Exact look & feel](/decisions/0003-exact-look-and-feel.md)
