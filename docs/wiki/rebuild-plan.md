---
type: Plan
title: Rebuild Plan — Modern Reinterpretation of alessandrotorri.it
description: Stop/restart plan for rebuilding the live Adobe Portfolio site as a modern reinterpretation in this repo.
tags: [plan, rebuild, gallery, phases, resume]
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
status: stable
sources:
  - id: live-site
    resource: https://alessandrotorri.it/
    title: Live Adobe Portfolio site
  - id: raw-rebuild
    resource: ../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
  - id: roadmap
    resource: /concepts/roadmap.md
    title: Original project roadmap (deprecated)
  - id: decision-0003
    resource: /decisions/0003-exact-look-and-feel.md
    title: Exact look & feel, modern implementation
---

# Rebuild Plan — Modern Reinterpretation of alessandrotorri.it

> **Single source of truth to stop / restart work at any point.**
> Update `## Status` after every work session. See `## Resume Protocol` at the bottom.
> "Exact look & feel" is locked by [Decision 0003](/decisions/0003-exact-look-and-feel.md); "modern" refers to the implementation, not a redesign.

## 0. Goal & Locked Decisions

Recreate https://alessandrotorri.it/ (owner's live Adobe Portfolio site) with the **exact look & feel** inside **this repo** (`/Users/abstract/CODE/personal/alessandrotorri.it`, React 19 + Vite + MUI 7 + Zustand + Firebase), plus a protected administrator section.

Decisions locked 2026-09-08, amended 2026-10-29:

1. **Scope:** current repository, visual parity with the live site, modern implementation. Not a fresh repo; not a redesign. See [Decision 0003](/decisions/0003-exact-look-and-feel.md).
2. **Images:** reuse Adobe CDN URLs temporarily (`cdn.myportfolio.com/...`). No Firebase Storage migration yet.
3. **Admin:** preserve the existing `/admin` section; protect and finish it after the public site (issue #3).
4. **Stack:** no new deps without approval. MUI only, `sx` prop, Zustand, React Router, framer-motion. See [Tech Stack](/concepts/tech-stack.md) and [Agent Rules](/rules/agent-rules.md).
5. **Process:** every change runs [The Usual Loop](/rules/workflow.md) and updates this wiki in the same PR.

Original reference (read 2026-09-08 via WebFetch):

- Header fixed: left `GALLERIE`, center `ALESSANDRO TORRI`, right Instagram + YouTube.
- Home = `/gallery`: 2-col grid, 16:9 covers, centered uppercase titles: FAVORITE, ULTIMI LAVORI, FRANCIA, IRLANDA, ITALIA, PORTOGALLO, REGNO UNITO, SCOZIA, SPAGNA.
- Detail e.g. `/01-favorite`: centered H1 + single-column feed, full-width image + small caption (`Eilean Donan Castle - Scozia`, etc.). Lightbox dark `#111 @0.9`, download disabled, lazy + `srcset 640w-5120w`.
- Footer: `↑ Back to Top` + `Copyright © Alessandro Torri 2026`.
- Theme `marta/ludwig`, white bg, black text, Adobe Fonts sans, page/link transitions.

## 1. Target Information Architecture

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` (rewritten as cover grid) | Entry — same content as `/gallery`, like original where `/` → gallery |
| `/gallery` | `GalleryPage` | 9 collection covers, 2-col responsive |
| `/gallery/:collectionName` | `CollectionPage` | Single-column feed + captions + lightbox |
| `/login`, `/admin`, `/admin/collection/:name` | existing | **Out of scope until Phase 6** — do not break, do not improve |
| `/projects`, `/about` | — | **Do not create yet.** Remove links from Navbar (currently dead links in `src/layout/Navbar.layout.tsx:84-89`) |

Layout shell (`src/layout/Shared.layout.tsx`): `Navbar` + `<Outlet/>` + `Footer` + `BacktoTopButton`. Keep.

## 2. Temporary Content Model (CDN phase)

New file `src/data/collections.data.ts`:

```ts
export interface CollectionCover { slug: string; title: string; cover: string; coverSrcSet?: string }
export interface CollectionPhoto { src: string; caption: string }
```

- 9 covers from live site (16:9 `carw_16x9x1280.jpg` variants for grid, `32px` blur placeholder where available).
- Per-collection photo lists: start with `favorite` (24 captions scraped 2026-09-08), others progressively scraped from `/02-ultimi-lavori`, `/07-francia`, etc.
- Later (Phase 6): replace with Firestore `images` where `isVisible==true`, grouped by `collection`, cover = `isCoverImage`. No schema change needed.

Caption seed (favorite, already captured): Eilean Donan Castle - Scozia, Badlands - South Dakota, Falaise d'Étretat - Normandia (x2), Dolomiti di Brenta, Lago di Braies, Tellaro, Grandes Jorasses, Riomaggiore, Bedruthan steps / Holywell Bay / Land's End - Cornovaglia, Vernazza, Pointe du Raz / Pointe du Van / Kermorvan - Bretagna, Arnìa - Cantabria, Virxe da Barca - Galizia, Cabo de São Vicente / Cabo da Roca - Portogallo, Dunquin pier / The three sisters - Irlanda, Faro di Goury / Le Mont Saint-Michel - Francia.

## 3. Design Tokens (modern reinterpretation)

Keep `src/style/theme.ts` (Inter + Playfair Display, `borderRadius: 0`). Changes:

- Light: bg `#ffffff`, paper `#fafafa`, text `#1a1a1a`. Dark: bg `#0a0a0a`, paper `#121212`.
- Navbar: glass `blur(20px) saturate(180%)`, `alpha(bg,0.7)`, uppercase `0.75rem / 0.2em` links, opacity-hover (no ripple). Center logo `ALESSANDRO TORRI`.
- Covers: 16:9, `overflow:hidden`, hover `scale(1.05-1.08)` + `brightness(0.65)`, title uppercase centered, gradient reveal from bottom.
- Detail feed: max-width `~900px` centered single column, `spacing 4-6`, caption `body2 secondary centered`.
- Lightbox: fullscreen `Dialog`, `rgba(0,0,0,0.85)` + `backdrop blur(15px)`, arrows sides (desktop) / bottom (mobile), Esc/arrows keyboard, caption + fake EXIF line (replace later).
- Footer: transparent, top divider, `© {year} Alessandro Torri` + Instagram + YouTube icons, centered Back-to-Top.

## 4. Phases, Tasks & Acceptance

### Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| F | Knowledge foundation | done | OKF v0.2 wiki, docs audit, `AGENTS.md`, usual-loop skill, green baseline (2026-10-29) |
| D | Dependency refresh | done (in-range + MUI 9) | 19 packages updated; MUI 9.5 adopted (decision 0006); remaining majors issue #6; grpc advisory issue #5 |
| L | Layout refinements | done | owner feedback 2026-10-29; fonts, hover, covers, footer, mobile drawer (decision 0008) |
| 0 | Baseline & cleanup prep | done | originally lint 3 errors + 1 warning and red build; fixed 2026-10-29 (commit `31d6854`) |
| 1 | Data layer (CDN) | done | `src/data/collections.data.ts`: 9 CDN covers + 24 favorite captions; per-photo URLs still TODO |
| 2 | Navbar + Footer + Shell | done | triptych nav (Gallerie/logo/IG+YT+theme), mobile drawer, centered footer; zero lint issues |
| 3 | Gallery grid (`/` + `/gallery`) | done | 9 covers, 2-col `sm+`, `CollectionCover` + `CollectionGrid`, Home renders the grid (decision 0007) |
| 4 | Collection feed + lightbox | done | static 89-photo dataset, single-column feed, captions, `PhotoLightbox`, keyboard nav |
| 5 | Polish (SEO, responsive, perf) | pending | **next** — titles, OG, lazy, sitemap |
| 6 | Admin reconnect (DEFERRED) | deferred | protect `/admin`, finish upload/manage; issue #3 |

Update this table on every stop. Statuses: `pending | in-progress | done | deferred`.

### Phase 0 — Baseline (30 min) — done

- [x] `npm run lint`, `npm run build` — originally red; fixed 2026-10-29.
- [x] Read `src/App.tsx`, `src/layout/*`, `src/pages/HomePage.tsx`, `src/pages/GalleryPage.tsx`, `src/pages/CollectionPage.tsx`, `src/components/PhotoGallery.component.tsx`, `src/components/ProgressiveImage.component.tsx`.
- [x] Baseline recorded in the [audit](/reviews/2026-10-29-docs-audit.md).

### Phase 1 — Data layer — done

Files: `src/data/collections.data.ts` (+ `src/data/collections.photos.ts` if large).

- [x] Export `COLLECTIONS: CollectionCover[]` (9 entries, slug = `01-favorite`, `02-ultimi-lavori`, `07-francia`, `09-irlanda`, `03-italia`, `05-portogallo`, `08-uk`, `06-scozia`, `04-spagna`; title uppercase IT).
- [x] Export `PHOTOS: Record<string, CollectionPhoto[]>` — favorite fully filled (24 rows, CDN URLs + captions above); others stub with cover repeated + `TODO scrape`.
- [x] `npm run lint && npm run build` passes.
- Acceptance: `import { COLLECTIONS }` works from a test page; no Unsplash URLs remain in data.

### Phase 2 — Navbar + Footer + Shell — done

Files: `src/layout/Navbar.layout.tsx`, `src/layout/Footer.layout.tsx`, `src/layout/NavbarWrapper.layout.tsx`, `src/App.tsx` (routes only if needed).

- [x] Navbar: left single link `GALLERIE → /gallery`; center `ALESSANDRO TORRI → /`; right Instagram (`http://instagram.com/alessandrotorriph`) + YouTube (`https://www.youtube.com/c/AlessandroTorri`) + theme toggle. Remove `/projects`, `/about`. Mobile: hamburger → same 3 items.
- [x] Footer: `↑ Back to Top` anchor + `Copyright © Alessandro Torri {year}` centered + both socials.
- [x] Keep `SharedLayout` outlet order. Keep dark/light toggle via `themeStore`.
- Acceptance: desktop + 390px mobile header matches original triptych; no dead routes in nav.

### Phase 3 — Gallery grid — done

Files: `src/pages/GalleryPage.tsx`, `src/pages/HomePage.tsx`, `src/components/CollectionCover.component.tsx` (new), `src/components/CollectionGrid.component.tsx` (new).

- [x] `GalleryPage`: `Container maxWidth lg`, no `H2 Explore the Collections`; grid `xs:1 sm:2` (`Masonry` NOT needed here — plain `Grid`), `16:9` covers from `COLLECTIONS`, title inside the cover over a bottom gradient, `Link → /gallery/:slug`, no entrance animation (refined by decision 0008).
- [x] `HomePage`: renders the same `<CollectionGrid />` (decision 0007). Removed the Unsplash hero, commented Firestore blocks, and the `height:3000px` hack.
- [x] Deleted dead `src/components/Navbar.tsx`.
- [x] Acceptance: `/` and `/gallery` show 9 covers, 2-col from `sm`, 1-col mobile, click navigates.
- Verification: `npm run lint` and `npm run build` pass on 2026-10-29.

### Phase 4 — Collection feed + lightbox — done

Files: `src/pages/CollectionPage.tsx` (rewritten), `src/components/PhotoLightbox.component.tsx` (new), `src/components/ProgressiveImage.component.tsx`, `src/data/collections.photos.ts` (new).

- [x] Read slug via `useParams`, look up `COLLECTIONS` and `PHOTOS[slug]`; H1 = title uppercase centered; breadcrumb `Gallerie / {title}`.
- [x] Single-column feed `maxWidth="md"` (~900px), full-width image + `caption` centered below. Uses `ProgressiveImage` + `loading="lazy"`.
- [x] Lightbox: fullscreen Dialog dark + blur, img `contain` max 75vh, caption + EXIF placeholder, prev/next + Esc/arrows, mobile arrows below.
- [x] No Firestore query in `CollectionPage`; static data only.
- [x] All 9 collections captured from the live site: 89 photos total, favorite 24, with real CDN URLs, captions and ratios.
- Acceptance: `/gallery/01-favorite` shows 24 images with correct captions; lightbox keyboard works; MUI Dialog locks body scroll.

### Phase 5 — Polish

- [ ] Per-page `<title>` + meta description + OG (`ALESSANDRO TORRI — Fotografia di paesaggio`), `index.html` title no longer `%VITE_APP_SITE_TITLE%` placeholder.
- [ ] `robots.txt`, `sitemap.xml` in `public/`.
- [ ] Responsive audit 390/768/1280; touch lightbox; `React.lazy` for Gallery/Collection routes; images `loading=lazy` + width/height to avoid CLS.
- [ ] Error boundary around `<Outlet/>`; empty-collection state (`No photos yet`).
- Acceptance: Lighthouse mobile perf ≥85, no console errors, `npm run lint && npm run build` green.

### Phase 6 — Admin reconnect (DEFERRED, do not start)

Trigger: user says main site complete. Then: `ProtectedRoute` on `/admin`, wire `PhotoGallery` to `images: IImage[]` prop, Firestore `isCoverImage` → covers, Storage upload → replace CDN URLs. Tracked in issue #3; separate plan.

## 5. Verify Commands (run before every stop)

```bash
npm run lint
npm run build
# manual: npm run dev → check /, /gallery, /gallery/01-favorite on desktop + mobile width
```

CI runs the same lint/build on every push and PR (`.github/workflows/ci.yml`).

## 6. Resume Protocol

1. Read `AGENTS.md`, this file's `Status` table, and the last entry in [the log](/log.md).
2. Read `src/data/collections.data.ts` to see content progress.
3. Run verify commands, pick the first `in-progress`/`pending` phase (skip Phase 6).
4. After each session: flip statuses, append to [the log](/log.md) (newest first, ISO date), update the wiki per [The Usual Loop](/rules/workflow.md), commit per [Git Conventions](/rules/git-conventions.md), and open a draft PR.

## 7. Relevant Files Index

| File | Role in rebuild |
|------|-----------------|
| `AGENTS.md` | Canonical agent schema and read order |
| `.agents/skills/usual-loop/SKILL.md` | Loadable version of the loop |
| `docs/raw/` | Immutable sources |
| `docs/wiki/sources/`, `docs/wiki/decisions/`, `docs/wiki/reviews/` | Source summaries, decisions, audits |
| `src/data/collections.data.ts` | CDN covers + captions |
| `src/data/collections.photos.ts` | 89 static photos with captions and ratios |
| `src/pages/HomePage.tsx` | renders the cover grid |
| `src/pages/GalleryPage.tsx` | renders the cover grid |
| `src/pages/CollectionPage.tsx` | single-col feed + lightbox |
| `src/components/CollectionCover.component.tsx` | cover card |
| `src/components/CollectionGrid.component.tsx` | shared 9-cover grid for `/` and `/gallery` |
| `src/components/PhotoLightbox.component.tsx` | fullscreen photo lightbox |
| `src/components/ProgressiveImage.component.tsx` | progressive image loader |
| `src/layout/Navbar.layout.tsx` | triptych nav |
| `src/layout/Footer.layout.tsx` | back-to-top + copyright |
| `src/style/theme.ts` | tokens, no new CSS system |
| `index.html` | fonts + title/meta |
| `docs/wiki/concepts/gallery-system.md` | gallery pattern reference |
| `docs/wiki/concepts/design-system.md` | visual reference |

## 8. Out of Scope / Non-goals

- No Firebase migration or upload-pipeline rewrite, no About/Projects pages, no Tailwind/CSS Modules, no new deps without approval, no WebP pipeline yet.
- No new admin routes before issue #3; never expose admin data publicly.
- No redesign disguised as "modern reinterpretation" — [Decision 0003](/decisions/0003-exact-look-and-feel.md) locks visual parity.
