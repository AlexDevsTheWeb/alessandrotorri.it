---
type: Decision
title: "0010 — Breadcrumb lives in the navbar on desktop"
description: Move the collection breadcrumb from the page body into the desktop navbar; hide it on mobile and keep the H1 as the page title.
tags: [decision, navigation, breadcrumb, navbar, mobile]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-30T00:00:00Z }
sources:
  - id: gh-issue-2
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2
    title: "Issue #2 — complete public site rebuild (phases 3-5)"
    author: human:alessandrotorri
---

# Context

The collection page carried a `Gallerie / {title}` breadcrumb in the body, under the fixed navbar. The owner found it redundant and did not like it on mobile, where space is limited.

# Decision

1. On desktop (`sm` and up), the navbar's left area shows `Gallerie / {title}` when the route is `/gallery/:slug`.
2. The `Gallerie` part links to `/gallery`; the current title is plain text.
3. The collection page no longer renders a breadcrumb; the H1 remains as the page title.
4. On mobile, the breadcrumb is hidden entirely. The menu, centered logo and H1 are enough.
5. Long titles are truncated with an ellipsis in the navbar rather than wrapping.

# Consequences

- Navigation context is available without duplicating it in the body.
- Mobile gets more vertical room and less visual noise.
- The navbar needs `useLocation` and the `COLLECTIONS` lookup for the current slug.
- The H1 is the only on-page title on mobile, so it must stay accurate.

# Links

- [Source summary](/sources/2026-10-29-gh-issue-2.md)
- [Gallery System](/concepts/gallery-system.md)
- [Site Architecture](/concepts/site-architecture.md)
- [Design System](/concepts/design-system.md)
- [Rebuild Plan](/rebuild-plan.md)
