---
type: Decision
title: "0009 — Masonry collection feed with hover captions"
description: Replace the single-column collection feed with a responsive Masonry grid and reveal each photo caption on hover/focus over a ~50% black gradient.
tags: [decision, gallery, masonry, captions, hover, phase-4]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-30T00:00:00Z }
sources:
  - id: gh-issue-2
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2
    title: "Issue #2 — complete public site rebuild (phases 3-5)"
    author: human:alessandrotorri
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Context

Phase 4 originally specified a single-column collection feed with a caption below each image. After reviewing the first implementation the owner asked for a more pleasant Masonry layout and for the photo caption to appear over the image on hover, sliding up to the center over a black gradient.

# Decision

1. The collection feed uses MUI `Masonry` with 1 column on mobile, 2 from `sm`, and 3 from `md`, inside `maxWidth="lg"`.
2. Each photo keeps its intrinsic aspect ratio from the dataset.
3. The caption is hidden by default. On hover or keyboard focus:
   - a `linear-gradient` overlay at roughly 50% black fades in;
   - the caption fades in and slides from below to the center;
   - the image itself does not scale or bounce.
4. MUI Masonry's negative root margin is neutralized so the grid has equal left/right gutters on every breakpoint, including the mobile single column.
5. The caption remains available in the lightbox for touch users and as the accessible button label.
6. The lightbox behavior from phase 4 is unchanged.

This supersedes the single-column/caption-below part of the phase 4 plan and refines the visual behavior in [Decision 0008](/decisions/0008-visual-refinements.md).

# Consequences

- Dense collections read as a gallery wall instead of a long scroll.
- Captions are not permanently visible; the hover/focus reveal and the lightbox are the two ways to read them.
- Keyboard users get the same reveal via `:focus-visible`.
- Masonry order is column-first; do not assume a strict left-to-right reading order when adding new photos.
- Future layout changes should update the Rebuild Plan and this decision.

# Links

- [Source summary](/sources/2026-10-29-gh-issue-2.md)
- [Gallery System](/concepts/gallery-system.md)
- [Design System](/concepts/design-system.md)
- [Rebuild Plan](/rebuild-plan.md)
- [Decision 0008 — Visual refinements](/decisions/0008-visual-refinements.md)
