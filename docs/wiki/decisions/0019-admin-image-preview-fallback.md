---
type: Decision
title: "0019 — Admin previews fall back to the GitHub raw URL"
description: Admin image previews try the served repository path first and retry through raw.githubusercontent.com when the file is not in the current checkout, instead of showing a broken thumbnail.
tags: [decision, admin, images, github, preview, repository]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: image-preview-report
    resource: /sources/2026-11-18-image-preview.md
    title: 2026-11-18 — Missing image preview for a GitHub-uploaded photo
  - id: decision-0018
    resource: /decisions/0018-image-catalog-and-layout.md
    title: Master image catalog, GitHub discovery and per-gallery layout controls
---

# 0019 — Admin previews fall back to the GitHub raw URL

## Context

[Decision 0018](/decisions/0018-image-catalog-and-layout.md) made the admin discover files by reading `public/galleries/` through the GitHub contents API, while previews render the catalog path `/galleries/<file>` from whatever checkout or deployment is serving the app. Those two sources can disagree:

- the file was uploaded to `development` while the owner works on another branch;
- the file exists on GitHub but was not pulled into the local checkout;
- the deployed build predates the upload.

On 2026-11-18 the owner uploaded `Screenshot 2026-11-17 alle 16.30.20.png` through the GitHub web UI on `development` while the working branch was `feat/image-catalog-and-layout`. `/admin/images` listed the file correctly, but the thumbnail requested `/galleries/Screenshot 2026-11-17 alle 16.30.20.png`; Vite's history fallback answered with `index.html` and no image decoded. The discovery response already contained the file's `download_url`, but the preview ignored it.

## Decision

1. **Local first, remote fallback.** A shared `RepositoryImage` component renders the served path; if the browser reports an image error, it retries once with the GitHub raw URL and hides the image if that also fails.
2. **One URL builder.** `repositoryImageUrl(filename)` and `repositoryImageFallback(path)` in `src/services/githubImages.service.ts` derive `https://raw.githubusercontent.com/<repo>/<branch>/public/galleries/<file>` from `VITE_GITHUB_REPO` / `VITE_GITHUB_BRANCH`; repository entries also reuse the `download_url` returned by the contents API.
3. **`CatalogEntry.remoteUrl` carries the fallback.** Repository entries take `download_url`; catalog-only entries derive it from `path`.
4. **Applied to every admin preview:** `ImageCatalogCard`, `GalleryImageList`, `GalleryList` and the `GalleryFields` cover preview. Public pages keep rendering only the deployed path.
5. **No token, no new dependency.** `raw.githubusercontent.com` is read-only and outside the API rate limit.

## Consequences

Positive:

- The admin previews what discovery reports even when the checkout lags behind `development` or the build is older than the upload.
- A photo committed but not pulled is visible, editable and assignable without a manual merge first.
- Public rendering is untouched: a genuinely missing deployed asset still fails instead of silently loading from GitHub.

Negative:

- A file missing from the checkout costs one failed request per preview before the fallback image loads.
- The admin now depends on `raw.githubusercontent.com` for those fallbacks; if it is blocked, the thumbnail is hidden and only the filename remains.
- Names are URL-encoded when building the raw URL; stored catalog paths stay raw.

## Alternatives rejected

- **Always preview from GitHub.** Rejected: network-bound, slower for local files, and it would hide deployment mistakes on the public site.
- **Require a pull/merge before previewing.** Rejected: manual, and it does not cover a deployed admin or a file added on another branch.
- **Use `download_url` only for unindexed files.** Rejected: indexed cards lose their preview as soon as the checkout is behind.

## Links

- [Source summary](/sources/2026-11-18-image-preview.md)
- [Photo Management](/concepts/photo-management.md)
- [Admin Dashboard](/concepts/admin-dashboard.md)
- [Decision 0018](/decisions/0018-image-catalog-and-layout.md)
