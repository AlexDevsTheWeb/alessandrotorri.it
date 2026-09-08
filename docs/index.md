# AlessandroTorri.it — Knowledge Bundle

OKF v0.2 knowledge bundle for the alessandrotorri.it photography portfolio project. This bundle captures architecture decisions, tech stack conventions, photo management workflows, and agent rules for AI assistants working on the codebase.

> [!TIP] Start here
> New session? Read [Rebuild Plan](/rebuild-plan.md) first (status table + phases + resume protocol), then [Overview](/overview.md) for the big picture.

## Active Plan

* [Rebuild Plan](/rebuild-plan.md) — **START HERE to resume work.** Modern reinterpretation of alessandrotorri.it, status table + phases + resume protocol.

## Overview

* [Overview](/overview.md) — Tier-1 synthesis hub: what the project is, where it stands, what contradicts what.

## Roadmap

* [Project Roadmap](/concepts/roadmap.md) — Original phased development plan (superseded for public-site work by the Rebuild Plan).

## Concepts

* [Site Architecture](/concepts/site-architecture.md) — Overall structure, routing, and page layout
* [Tech Stack](/concepts/tech-stack.md) — Frameworks, libraries, and toolchain
* [Firebase Backend](/concepts/firebase-backend.md) — Auth, Firestore, Storage configuration
* [Photo Management](/concepts/photo-management.md) — Upload pipeline, collections, metadata
* [Gallery System](/concepts/gallery-system.md) — Public-facing gallery, masonry layout, lightbox
* [Design System](/concepts/design-system.md) — MUI theme, typography, colors, responsive rules
* [State Management](/concepts/state-management.md) — Zustand stores, auth and theme state
* [Admin Dashboard](/concepts/admin-dashboard.md) — Upload, collection management, DnD reordering

## Rules

* [Agent Rules](/rules/agent-rules.md) — Guidelines for AI agents working on this repo
* [Code Style](/rules/code-style.md) — TypeScript, React, and MUI conventions
* [Git Conventions](/rules/git-conventions.md) — Commit messages, branching, PR format

## Wiki Operations (llm-wiki)

* **Ingest** — new source? Summarize it, update every concept it touches, flag contradictions with a `> [!WARNING]` callout, append to [Log](/log.md), update this index.
* **Query** — answer from these pages (not raw code); cite the concept pages used.
* **Lint** — check for orphan pages, broken bundle-relative links, superseded claims, missing `type` frontmatter on non-index concepts.
