---
type: Reference
title: SEO and Metadata
description: Default and per-page metadata, canonical URLs, Open Graph, robots.txt and sitemap.xml for the portfolio.
tags: [seo, metadata, open-graph, sitemap, canonical, routing]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-30T00:00:00Z }
sources:
  - id: decision-0011
    resource: /decisions/0011-seo-and-route-loading.md
    title: SEO, metadata, and route loading without new dependencies
---

# SEO and Metadata

## Defaults

`index.html` contains the Italian title, description, canonical URL and Open Graph/Twitter tags. The default OG image is the FAVORITE cover. This is what non-JavaScript crawlers see.

## Per-page metadata

`src/hooks/usePageMeta.ts` updates:

- `document.title`
- `meta[name="description"]`
- `meta[property="og:title"]`, `og:description`, `og:type`, `og:image`, `og:url`, `og:site_name`
- `meta[name="twitter:card"]`, `twitter:title`, `twitter:description`, `twitter:image`
- `link[rel="canonical"]`

Pages:

| Route | Title |
|-------|-------|
| `/` | `Alessandro Torri — Fotografia di paesaggio` |
| `/gallery` | `Gallerie — Alessandro Torri` |
| `/gallery/:slug` | `{COLLECTION} — Alessandro Torri` |

Collection pages use the collection cover as OG image and a description with the photo count. The hook restores the defaults when the page unmounts.

> [!WARNING] SPA limitation
> Tags set from JavaScript are not guaranteed to be seen by social crawlers that do not execute JS. The static defaults in `index.html` are the reliable fallback. If collection-specific social previews become necessary, add prerendering/SSG.

## Static files

- `public/robots.txt` — allows all crawlers and points to the sitemap.
- `public/sitemap.xml` — `/`, `/gallery` and the 9 collection routes with `lastmod` 2026-10-30.

## Verification

- `/`, `/gallery` and `/gallery/07-francia` show the expected title, description and canonical URL.
- Lighthouse local preview: SEO 100, accessibility 100, best practices 100.
- Deployed performance verification is issue #14.

## Related

- [Decision 0011 — SEO and route loading](/decisions/0011-seo-and-route-loading.md)
- [Site Architecture](/concepts/site-architecture.md)
- [Tech Stack](/concepts/tech-stack.md)
- [Rebuild Plan](/rebuild-plan.md)
