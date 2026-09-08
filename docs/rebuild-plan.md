---
type: Plan
title: Rebuild Plan — Modern Reinterpretation of alessandrotorri.it
description: Stop/restart plan for rebuilding the live Adobe Portfolio site as a modern reinterpretation in this repo.
tags: [plan, rebuild, gallery, phases, resume]
generated: { by: agent:muse-spark, at: 2026-09-08T00:00:00Z }
status: active
sources:
  - id: live-site
    resource: https://alessandrotorri.it/
    title: Live Adobe Portfolio site (read 2026-09-08)
  - id: roadmap
    resource: /concepts/roadmap.md
    title: Original project roadmap (superseded for public-site work)
---

# Rebuild Plan — Modern Reinterpretation of alessandrotorri.it

> **Single source of truth to stop / restart work at any point.**
> Update `## Status` after every work session. See `## Resume Protocol` at the bottom.

## 0. Goal & Locked Decisions

Recreate https://alessandrotorri.it/ (owner's live Adobe Portfolio site) as a **modern reinterpretation** inside **this repo** (`/Users/abstract/CODE/personal/alessandrotorri.it`, React 19 + Vite + MUI 7 + Zustand + Firebase).

Decisions locked 2026-09-08:

1. **Scope:** work in current repository/project, modern reinterpretation (not pixel-clone, not fresh repo).
2. **Images:** reuse Adobe CDN URLs temporarily (`cdn.myportfolio.com/...`). No Firebase Storage migration yet.
3. **Admin:** deferred — build public site first, do `/admin` once main site is complete.
4. **Stack:** no new deps without approval. MUI only, `sx` prop, Zustand, React Router, framer-motion. See `concepts/tech-stack.md` and `rules/agent-rules.md`.

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
| 0 | Baseline & cleanup prep | pending | run lint/build, record errors |
| 1 | Data layer (CDN) | pending | `collections.data.ts` + 9 covers |
| 2 | Navbar + Footer + Shell | pending | match original structure |
| 3 | Gallery grid (`/` + `/gallery`) | pending | 2-col covers grid |
| 4 | Collection feed + lightbox | pending | single-col + captions + Dialog |
| 5 | Polish (SEO, responsive, perf) | pending | titles, OG, lazy, sitemap |
| 6 | Admin reconnect (DEFERRED) | deferred | do only after 0-5 done |

Update this table on every stop. Statuses: `pending | in-progress | done | deferred`.

### Phase 0 — Baseline (30 min)

- [ ] `npm run lint`, `npm run build` — paste output into session notes.
- [ ] Read `src/App.tsx`, `src/layout/*`, `src/pages/HomePage.tsx`, `src/pages/GalleryPage.tsx`, `src/pages/CollectionPage.tsx`, `src/components/PhotoGallery.component.tsx`, `src/components/ProgressiveImage.component.tsx`.
- [ ] No code change. Done when baseline errors listed.

### Phase 1 — Data layer

Files: NEW `src/data/collections.data.ts` (+ `src/data/collections.photos.ts` if large).

- [ ] Export `COLLECTIONS: CollectionCover[]` (9 entries, slug = `01-favorite`, `02-ultimi-lavori`, `07-francia`, `09-irlanda`, `03-italia`, `05-portogallo`, `08-uk`, `06-scozia`, `04-spagna`; title uppercase IT).
- [ ] Export `PHOTOS: Record<string, CollectionPhoto[]>` — favorite fully filled (24 rows, CDN URLs + captions above); others stub with cover repeated + `TODO scrape`.
- [ ] `npm run lint && npm run build` passes.
- Acceptance: `import { COLLECTIONS }` works from a test page; no Unsplash URLs remain in data.

### Phase 2 — Navbar + Footer + Shell

Files: `src/layout/Navbar.layout.tsx`, `src/layout/Footer.layout.tsx`, `src/layout/NavbarWrapper.layout.tsx`, `src/App.tsx` (routes only if needed).

- [ ] Navbar: left single link `GALLERIE → /gallery`; center `ALESSANDRO TORRI → /`; right Instagram (`http://instagram.com/alessandrotorriph`) + YouTube (`https://www.youtube.com/c/AlessandroTorri`) + theme toggle. Remove `/projects`, `/about`. Mobile: hamburger → same 3 items.
- [ ] Footer: `↑ Back to Top` anchor + `Copyright © Alessandro Torri {year}` centered + both socials.
- [ ] Keep `SharedLayout` outlet order. Keep dark/light toggle via `themeStore`.
- Acceptance: desktop + 390px mobile header matches original triptych; no dead routes in nav.

### Phase 3 — Gallery grid

Files: `src/pages/GalleryPage.tsx` (rewrite), `src/pages/HomePage.tsx` (make it re-export gallery grid or redirect to `/gallery`), `src/components/CollectionCover.component.tsx` (new, small).

- [ ] `GalleryPage`: `Container maxWidth lg`, no `H2 Explore the Collections`; grid `xs:1 sm:2` (`Masonry` NOT needed here — plain `Grid`), `16:9` covers from `COLLECTIONS`, title below centered uppercase, `Link → /gallery/:slug`, framer-motion stagger `0.6s + i*0.08`.
- [ ] `HomePage`: render same `<GalleryPage/>` content (or `<Navigate to="/gallery"/>` — decide once, document). Remove Unsplash hero + commented Firestore blocks + `height:3000px` hack (`HomePage.tsx:81`).
- [ ] Delete dead `src/components/Navbar.tsx` if still present; clean `App.css`/`index.css` Vite boilerplate only if it conflicts.
- Acceptance: `/` and `/gallery` show 9 covers, 2-col ≥768px, 1-col mobile, click navigates.

### Phase 4 — Collection feed + lightbox

Files: `src/pages/CollectionPage.tsx` (rewrite), reuse `src/components/ProgressiveImage.component.tsx`, reuse Dialog pattern from `src/components/PhotoGallery.component.tsx:126-211`.

- [ ] Read slug via `useParams`, lookup `PHOTOS[slug]`; H1 = title uppercase centered; breadcrumb `Gallerie / {title}`.
- [ ] Single-column feed `maxWidth md (~900px)`, full-width image + `caption` centered below. Use `ProgressiveImage` (blur-up) + `loading="lazy"`.
- [ ] Lightbox: fullscreen Dialog dark + blur, img `contain maxHeight 75vh`, caption + EXIF placeholder, prev/next + Esc/arrows, mobile arrows below.
- [ ] Do NOT query Firestore yet — prop/data-file only. Keep existing Firestore code path commented or behind flag, document which.
- Acceptance: `/gallery/01-favorite` shows 24 images with correct captions; lightbox keyboard works; no modal scroll leak.

### Phase 5 — Polish

- [ ] Per-page `<title>` + meta description + OG (`ALESSANDRO TORRI — Fotografia di paesaggio`), `index.html` title no longer `%VITE_APP_SITE_TITLE%` placeholder.
- [ ] `robots.txt`, `sitemap.xml` in `public/`.
- [ ] Responsive audit 390/768/1280; touch lightbox; `React.lazy` for Gallery/Collection routes; images `loading=lazy` + width/height to avoid CLS.
- [ ] Error boundary around `<Outlet/>`; empty-collection state (`No photos yet`).
- Acceptance: Lighthouse mobile perf ≥85, no console errors, `npm run lint && npm run build` green.

### Phase 6 — Admin reconnect (DEFERRED, do not start)

Trigger: user says main site complete. Then: `ProtectedRoute` on `/admin`, wire `PhotoGallery` to `images: IImage[]` prop, Firestore `isCoverImage` → covers, Storage upload → replace CDN URLs. Separate plan.

## 5. Verify Commands (run before every stop)

```bash
npm run lint
npm run build
# manual: npm run dev → check /, /gallery, /gallery/01-favorite on desktop + mobile width
```

## 6. Resume Protocol

1. Read this file's `Status` table + `docs/log.md` last entry.
2. Read `src/data/collections.data.ts` (if exists) to see content progress.
3. Run verify commands, pick first `in-progress`/`pending` phase (skip Phase 6).
4. After each session: flip statuses, append to `docs/log.md` (`## YYYY-MM-DD — what changed, next step`), commit per `rules/git-conventions.md` (`feat:`, `fix:`, `chore:`).

## 7. Relevant Files Index

| File | Role in rebuild |
|------|-----------------|
| `src/data/collections.data.ts` (new) | CDN covers + captions |
| `src/pages/HomePage.tsx` | becomes cover grid entry |
| `src/pages/GalleryPage.tsx` | 9-cover grid |
| `src/pages/CollectionPage.tsx` | single-col feed + lightbox |
| `src/components/CollectionCover.component.tsx` (new) | cover card |
| `src/components/PhotoGallery.component.tsx` | Dialog/keyboard pattern donor |
| `src/components/ProgressiveImage.component.tsx` | blur-up loader |
| `src/layout/Navbar.layout.tsx` | triptych nav |
| `src/layout/Footer.layout.tsx` | back-to-top + copyright |
| `src/style/theme.ts` | tokens, no new CSS system |
| `index.html` | fonts + title/meta |
| `docs/concepts/roadmap.md` | old phased plan (superseded by this file for public site) |
| `docs/concepts/gallery-system.md` | gallery pattern reference |
| `docs/concepts/design-system.md` | visual reference |

## 8. Out of Scope / Non-goals

- No Firebase migration, no upload pipeline, no auth fixes, no About/Projects pages, no Tailwind/CSS Modules, no new deps, no WebP pipeline yet.
