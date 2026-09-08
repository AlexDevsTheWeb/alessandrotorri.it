---
type: Overview
title: Project Overview
description: Tier-1 synthesis hub — what the project is, where it stands, and how the plans relate.
tags: [overview, synthesis, status]
generated: { by: agent:muse-spark, at: 2026-09-08T00:00:00Z }
status: active
sources:
  - id: live-site
    resource: https://alessandrotorri.it/
    title: Live Adobe Portfolio site (read 2026-09-08)
  - id: rebuild-plan
    resource: /rebuild-plan.md
    title: Rebuild Plan
---

# Project Overview

Photography portfolio for Alessandro Torri (landscape / long-exposure). React 19 + Vite + MUI 7 + Zustand + Firebase. Live site today is Adobe Portfolio (`marta/ludwig`); this repo rebuilds it as a modern reinterpretation.

## Where things stand

* Public site (covers grid, collection feed, lightbox): planned in [Rebuild Plan](/rebuild-plan.md), phases 0–5 pending.
* Admin (`/admin` upload, DnD reorder): exists, deferred to Rebuild Plan Phase 6.
* Images: Adobe CDN URLs reused temporarily; Firebase Storage migration comes after the public site is done.

> [!WARNING] Contradiction — which plan is current?
> [Project Roadmap](/concepts/roadmap.md) describes the original "long exposure + placeholder content" plan. For all public-site work, [Rebuild Plan](/rebuild-plan.md) supersedes it. Roadmap stays as history; do not follow both.

> [!QUESTION] Open questions
> * Home `/` = same cover grid as `/gallery`, or redirect? (Rebuild Plan Phase 3 to decide once.)
> * Firestore schema unchanged when CDN phase ends? Assumed yes — revisit in Phase 6.

## Cluster map

* Architecture: [Site Architecture](/concepts/site-architecture.md), [Tech Stack](/concepts/tech-stack.md), [State Management](/concepts/state-management.md)
* Backend: [Firebase Backend](/concepts/firebase-backend.md), [Photo Management](/concepts/photo-management.md)
* Frontend: [Gallery System](/concepts/gallery-system.md), [Design System](/concepts/design-system.md), [Admin Dashboard](/concepts/admin-dashboard.md)
* Rules: [Agent Rules](/rules/agent-rules.md), [Code Style](/rules/code-style.md), [Git Conventions](/rules/git-conventions.md)
