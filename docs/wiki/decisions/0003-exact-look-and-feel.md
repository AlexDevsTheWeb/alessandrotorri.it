---
type: Decision
title: "0003 — Exact look & feel, modern implementation"
description: Resolve the rebuild ambiguity: match the live site's visual and interaction design, implement it with the modern stack, and keep the administrator section.
tags: [decision, design, rebuild, look-and-feel, scope]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
  - id: live-site
    resource: https://www.alessandrotorri.it/
    title: Live Adobe Portfolio site
---

# Context

The Rebuild Plan originally locked "modern reinterpretation (not pixel-clone)". The newer charter says the main goal is to "re-create the exact look & feel". These are not identical instructions, and agents must not guess.

# Decision

"Exact look & feel" wins: the public site must reproduce the live site's visual identity and interaction model — triptych header, 16:9 cover grid, uppercased centered titles, single-column collection feed with captions, dark lightbox, back-to-top footer, Italian copy, and typography hierarchy.

"Modern implementation" describes the code, not the design: React 19, MUI 7, `sx`, Zustand, static CDN data in the current phase, and accessible/responsive behavior. It does not license redesigning the layout.

Pixel-perfect asset cloning is not required where assets or fonts are unavailable; parity of layout, spacing, type scale, color, and interaction is. The administrator section is in scope, protected, and finished after the public site.

# Consequences

- Rebuild Plan phases 3–5 are judged against visual parity, not novelty.
- New visual ideas go to a decision record first; they do not sneak into the clone.
- The theme keeps the live site's white/black editorial feel plus the existing dark mode.
- The live site remains the reference for content and captions.

# Links

- [Rebuild Plan](/rebuild-plan.md)
- [Design System](/concepts/design-system.md)
- [Gallery System](/concepts/gallery-system.md)
- [Source summary](/sources/2026-10-29-rebuild.md)
