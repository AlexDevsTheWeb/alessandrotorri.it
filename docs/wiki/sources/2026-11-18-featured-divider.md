---
type: Source Summary
title: 2026-11-18 — Divider between featured and other galleries
description: Owner request to separate featured galleries from the rest of the home grid with a solid line and a centered section label.
tags: [source, galleries, featured, layout, divider]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: decision-0023
    resource: /decisions/0023-featured-gallery-divider.md
    title: Divider between featured and other galleries
---

# 2026-11-18 — Divider between featured and other galleries

## What the owner asked

Separate the "in evidenza" galleries from the others on the home page with a divider like `--------- LUOGHI ---------`, where the dashes are a solid continuous line.

## Findings

- The shared grid already sorts featured galleries first (`sortFeaturedFirst`) and renders them full-width, but without any visual boundary before the two-column remainder.
- `/` and `/gallery` use the same `CollectionGrid` by design ([Decision 0007](/decisions/0007-home-gallery-grid.md)).

## Outcome

[Decision 0023](/decisions/0023-featured-gallery-divider.md) adds a centered `Divider` labelled **LUOGHI** between the featured covers and the rest, rendered only when both groups exist. Solid 1 px lines on both sides, uppercase caption-size label. Verified with headless Chrome on a mock grid: order is featured → divider → rest, the line computes to `solid 1px`, and a gallery with `coverSpacing: large` renders 48 px narrower inside its cell. See [Gallery System](/concepts/gallery-system.md) and [Design System](/concepts/design-system.md).
