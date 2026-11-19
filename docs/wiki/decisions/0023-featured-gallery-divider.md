---
type: Decision
title: "0023 — Divider between featured and other galleries"
description: The shared gallery grid separates featured galleries from the rest with a solid, centered divider labelled LUOGHI.
tags: [decision, galleries, featured, layout, visual, divider]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: featured-divider-report
    resource: /sources/2026-11-18-featured-divider.md
    title: 2026-11-18 — Divider between featured and other galleries
  - id: decision-0007
    resource: /decisions/0007-home-gallery-grid.md
    title: Home renders the gallery grid
---

# 0023 — Divider between featured and other galleries

## Context

Featured galleries are pinned full-width at the top of the shared grid, but there was no visual boundary between them and the remaining two-column galleries. The owner asked for a separation with a solid line and a centered label, written as `--------- LUOGHI ---------` (the dashes being a solid continuous line).

## Decision

1. `CollectionGrid` splits the incoming collections into featured and non-featured, renders the featured covers first, then a full-width divider, then the rest.
2. The divider is an MUI `Divider` with `textAlign="center"` and the label **LUOGHI**, styled as 1 px solid lines on both sides, uppercase `0.7rem` text, `0.35em` letter spacing, `text.secondary` color, with vertical margins (`2` on mobile, `3` from `md`).
3. The divider renders only when both groups are non-empty; a site with only featured or only regular galleries shows no extra line.
4. It lives in the shared grid, so `/` and `/gallery` stay identical ([Decision 0007](/decisions/0007-home-gallery-grid.md)). The static fallback dataset has no featured flags, so it renders as a single group.

## Consequences

Positive:

- The featured block reads as a distinct section without a new page or layout.
- No data-model change: the split uses the existing `isFeatured` and `featuredOrder`.
- The label and styling are one component, easy to adjust.

Negative:

- "LUOGHI" is hardcoded Italian copy; changing it is a code edit, not an admin field.
- The divider adds a row with margins, slightly increasing the vertical rhythm on the home page.
- Because the grid is shared, `/gallery` gets the same divider. Intentional for parity.

## Alternatives rejected

- **Dashed lines.** Rejected: the owner explicitly wants a solid continuous line.
- **A separate home-only section.** Rejected: it would break the `/` = `/gallery` parity of decision 0007.
- **A configurable label per gallery or per site.** Rejected for now: one fixed section label is enough and avoids another admin control.

## Links

- [Source summary](/sources/2026-11-18-featured-divider.md)
- [Gallery System](/concepts/gallery-system.md)
- [Design System](/concepts/design-system.md)
- [Decision 0007](/decisions/0007-home-gallery-grid.md)
