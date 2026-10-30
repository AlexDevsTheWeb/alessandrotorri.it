---
type: Decision
title: "0011 — SEO, metadata, and route loading without new dependencies"
description: Use static defaults plus a client-side metadata hook, lazy routes, manual chunks, and an error boundary for phase 5 polish.
tags: [decision, seo, metadata, performance, routing, phase-5]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-30T00:00:00Z }
sources:
  - id: gh-issue-2
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/2
    title: "Issue #2 — complete public site rebuild (phases 3-5)"
    author: human:alessandrotorri
---

# Context

Phase 5 needed titles, descriptions, canonical/OG/Twitter metadata, robots/sitemap, lazy route loading, an error boundary, and bundle splitting. The project rule is no new dependencies without approval, so an SEO library or prerender setup was not an option in this loop.

# Decision

1. `index.html` carries correct default Italian metadata and the first cover as the OG image.
2. `usePageMeta` updates `document.title`, description, canonical, OG and Twitter tags per route. It restores defaults on unmount.
3. `public/robots.txt` and `public/sitemap.xml` list the home, gallery and all 9 collection routes.
4. Public and admin routes are loaded with `React.lazy`; `SharedLayout` wraps the outlet in `Suspense` and an `ErrorBoundary`.
5. `vite.config.ts` splits React, MUI/Emotion and Firebase chunks. `src/firebase.ts` now exposes auth only; `src/firebaseData.ts` exposes Firestore/Storage so the data chunk loads with admin.
6. The dead `PhotoGallery` demo and the unused `framer-motion` dependency were removed.
7. The first feed image is eager/high-priority and uses the CDN 600w/1200w `srcset`; other images stay lazy.
8. Deployed Lighthouse verification is tracked separately in issue #14 because local preview TTFB is not representative.

# Consequences

- Shared links have reliable default OG tags from `index.html`; per-page OG tags are a best-effort enhancement for clients that execute JavaScript.
- Social crawlers that do not execute JS will see the default title/image, not the collection-specific one. Prerendering or SSG is the future fix if needed.
- Firestore/Storage are no longer downloaded on the public site; the admin routes load them on demand.
- The production bundle no longer has a chunk over 500 kB.
- Local Lighthouse showed accessibility/best-practices/SEO at 100 and performance at 74 due to a 6.7s local TTFB; production verification is issue #14.

# Links

- [SEO and Metadata](/concepts/seo-metadata.md)
- [Source summary](/sources/2026-10-29-gh-issue-2.md)
- [Pull request #15](https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/15)
- [Rebuild Plan](/rebuild-plan.md)
- [Issue #14](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/14)
