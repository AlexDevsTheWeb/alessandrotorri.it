---
type: Source Summary
title: 2026-11-19 — Featured sizing, logotype and admin cleanup
description: Owner request to shrink the featured gallery, remove footer social links, restyle the header title, and keep only one gallery editing surface.
tags: [source, gallery, featured, layout, navbar, footer, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-19T00:00:00Z }
sources:
  - id: decision-0024
    resource: /decisions/0024-featured-layout-logotype-admin-cleanup.md
    title: Compact featured layout, serif logotype and one gallery edit path
---

# 2026-11-19 — Featured sizing, logotype and admin cleanup

## What the owner asked

1. Remove Instagram and YouTube from the footer.
2. The featured gallery is too big vertically and horizontally; the owner suggested a full-width banner for one featured gallery or a side-by-side pair for two.
3. The "Alessandro Torri" header title needs a better font or letter spacing and must be uppercase.
4. Check whether the pen dialog on `/admin` matches `/admin/gallery/:id`; remove one of the two edit paths, preferring the dialog.

## Evidence and findings

- The featured cover rendered 1152×648 at 1440 px (full width, gallery ratio 16:9).
- The edit dialog rendered only `GalleryFields`; it lacked the image list, cover selection and ordering that the detail page provides.
- The footer repeated the navbar social links; the logotype was a sans 0.85 rem/0.3em button.
- Live data: one featured gallery (`In Evidenza`) with one photo, one empty gallery (`Irlanda`). The pair layout and divider are not visible on the live site yet.

## Outcome

[Decision 0024](/decisions/0024-featured-layout-logotype-admin-cleanup.md):

- one featured gallery → full-width banner capped at 240/320/420 px (xs/sm/md), `object-fit: cover`;
- two or more featured galleries → half-width pair using the gallery ratio;
- footer keeps only the copyright;
- logotype uses Instrument Serif uppercase with 0.24em tracking (0.16em on mobile);
- the edit dialog and pen are removed; "Nuova galleria" stays as a creation wizard and navigates to the detail page, which is the only editor.

Verified with headless Chrome: footer has no social links, the logotype computes to Instrument Serif/4.224 px tracking/uppercase, the live featured banner is 1136×404 (ratio 2.81), and a mock with two featured galleries renders 568×320 each with the rest at 568×379.
