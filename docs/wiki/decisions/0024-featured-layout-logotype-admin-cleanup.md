---
type: Decision
title: "0024 — Compact featured layout, serif logotype and one gallery edit path"
description: Featured galleries become a compact banner when alone and a half-width pair when multiple; the footer drops the social icons; the navbar logotype uses the serif face uppercase; the admin edit dialog and pen action are removed.
tags: [decision, gallery, featured, layout, navbar, footer, admin]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-19T00:00:00Z }
sources:
  - id: ui-admin-cleanup
    resource: /sources/2026-11-19-ui-and-admin-cleanup.md
    title: 2026-11-19 — Featured sizing, logotype and admin cleanup
  - id: decision-0023
    resource: /decisions/0023-featured-gallery-divider.md
    title: Divider between featured and other galleries
---

# 0024 — Compact featured layout, serif logotype and one gallery edit path

## Context

Four requests came in after the divider work:

1. Remove the Instagram and YouTube links from the footer.
2. The featured gallery is too large, both vertically and horizontally; the owner likes a full-width banner for a single featured gallery and a side-by-side pair for two.
3. The "Alessandro Torri" title in the header needs a better font or letter spacing, and must be uppercase.
4. The pen action on `/admin` opens a dialog that does not offer the same controls as `/admin/gallery/:id`; one of the two edit paths should go, preferably the dialog.

Findings:

- Featured covers spanned all 12 columns and used the gallery ratio, rendering 1152×648 at 1440 px.
- The edit dialog only rendered `GalleryFields` (no images, no cover star, no ordering) while the detail page rendered the fields plus the image list and save. The dialog was a strict subset.
- The footer duplicated the navbar social links; the logotype used the button sans style at 0.85 rem with 0.3em tracking.
- The live site currently has one featured gallery (`In Evidenza`) and one empty gallery (`Irlanda`), so the divider and the pair layout are not visible there yet.

## Decision

1. **Featured layout follows the count.**
   - Exactly one featured gallery → full-width banner, no ratio, fixed height `240 / 320 / 420 px` (`xs / sm / md`), the cover fills it with `object-fit: cover` (a panoramic crop instead of a 16:9 block).
   - Two or more featured galleries → half-width cards using each gallery's ratio, so they sit as a pair at the top. A third featured wraps onto the next row.
   - No new data field: the owner chooses one or two featured galleries with the existing switch. `GalleryFields` states the behavior in its helper text.
2. **Footer keeps only the copyright.** The Instagram and YouTube icons stay in the navbar and mobile drawer. The footer becomes a single centered line.
3. **Serif logotype.** `LogoLink` uses `Instrument Serif`, uppercase, 1.1 rem with 0.24em tracking on desktop and 0.9 rem with 0.16em on mobile, at 82% text color.
4. **One edit path.** Remove the pen `IconButton` from `GalleryList` and the edit mode from `AdminDashboard`. The "Nuova galleria" dialog remains for creation and navigates to `/admin/gallery/:id`; from then on, "Gestisci" is the only edit surface, which already includes the fields, the cover select, the image list, ordering and save.

## Consequences

Positive:

- A single featured gallery no longer dominates the page; with two, the section reads as a balanced pair.
- No duplicated edit UI and no risk of the dialog drifting from the detail page.
- The header reads as a logotype rather than a small button; the footer is quieter.

Negative:

- The banner height is fixed by breakpoint, not derived from the image ratio; the crop is more aggressive.
- The featured layout depends on how many galleries are featured. To get a half-width single featured gallery there is no option; use two or none.
- Removing the pen means editing always costs a page navigation, including bulk changes that were previously possible in the dialog.
- The create dialog still exists; it is a creation wizard, not a second editor.

## Alternatives rejected

- **Keep the featured cover at 16:9 full width.** Rejected: 648 px tall at 1440 px, the reported problem.
- **A per-gallery featured size field.** Rejected for now: the owner expressed the choice as "one or two featured", not per-gallery sizing.
- **A site-wide featured-layout setting.** Rejected: it would need a new settings document and rules for one toggle.
- **Keep both edit paths.** Rejected: the dialog was a subset and the owner prefers a single place to manage a gallery.

## Links

- [Source summary](/sources/2026-11-19-ui-and-admin-cleanup.md)
- [Gallery System](/concepts/gallery-system.md)
- [Design System](/concepts/design-system.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Decision 0023](/decisions/0023-featured-gallery-divider.md)
