---
type: Source Summary
title: 2026-11-18 — Missing image preview for a GitHub-uploaded photo
description: Owner report that a newly uploaded photo appears in the admin catalog but its preview does not render, because discovery reads GitHub while the thumbnail reads the local checkout.
tags: [source, bug, admin, images, github, preview]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-11-18T00:00:00Z }
sources:
  - id: screenshot-upload
    resource: https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/public/galleries/Screenshot%202026-11-17%20alle%2016.30.20.png
    title: Uploaded photo in public/galleries/ on development
  - id: decision-0019
    resource: /decisions/0019-admin-image-preview-fallback.md
    title: Admin previews fall back to the GitHub raw URL
---

# 2026-11-18 — Missing image preview for a GitHub-uploaded photo

## What the owner reported

The owner added a new photo to the repository through the GitHub web UI and could not see the image preview in the admin: the catalog card was listed, but the thumbnail area stayed empty.

## Reproduction and evidence

- The upload lives at `public/galleries/Screenshot 2026-11-17 alle 16.30.20.png` on `development` (commit `7540eaf`, "Add files via upload"), 32 KB PNG.
- The working branch was `feat/image-catalog-and-layout`, which did not contain the file.
- GitHub discovery returns the file correctly, including `download_url = https://raw.githubusercontent.com/AlexDevsTheWeb/alessandrotorri.it/development/public/galleries/Screenshot%202026-11-17%20alle%2016.30.20.png` (verified: `200 image/png`).
- The card rendered `src="/galleries/Screenshot 2026-11-17 alle 16.30.20.png"`; the dev server answered `200 text/html` with `index.html` from the SPA fallback, so the browser could not decode an image.
- After merging `development` into the branch the local file exists and the thumbnail renders, which confirms the mismatch rather than a corrupt upload.

## Requirements extracted

1. A discovered repository file must preview even when it is not present in the running checkout.
2. The catalog page, the gallery editor and the gallery list must behave the same way.
3. The public site must keep loading only deployed assets so a missing deployment stays visible.
4. No token, no new dependency, no relaxation of the Firestore rules.

## Contradiction to note

The admin says "Sorgente: AlexDevsTheWeb/alessandrotorri.it · ramo development" while the preview used the local asset path. That mismatch between the discovery source and the preview source was invisible in the UI.

## Outcome

[Decision 0019](/decisions/0019-admin-image-preview-fallback.md) adds a shared `RepositoryImage` component with a one-shot fallback to the GitHub raw URL, and `CatalogEntry.remoteUrl` carries the remote source. See [Photo Management](/concepts/photo-management.md) and [Admin Dashboard](/concepts/admin-dashboard.md).
