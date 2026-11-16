---
type: Reference
title: Photo Storage and Backend Options
description: Whether Firebase is the right backend for a photography collection, what it costs at this scale, and the alternatives. Input for the backend decision, not a decision yet.
tags: [backend, storage, firebase, cloudflare, supabase, cloudinary, imgix, pricing, options]
status: draft
generated: { by: opencode-go/claude-haiku-5-5, at: 2026-11-07T00:00:00Z }
sources:
  - id: firebase-pricing
    resource: https://firebase.google.com/pricing
    title: Firebase pricing (read 2026-11)
  - id: firebase-billing
    resource: https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
    title: Firebase pricing plans (updated 2026-11-05)
  - id: r2-pricing
    resource: https://developers.cloudflare.com/r2/pricing/
    title: Cloudflare R2 pricing (updated 2026-10-30)
  - id: cloudinary-pricing
    resource: https://www.withorb.com/pricing-atlas/cloudinary
    title: Cloudinary pricing breakdown (captured 2026-09-18)
  - id: imgix-pricing
    resource: https://www.imgix.com/pricing
    title: imgix pricing plans
  - id: supabase-storage
    resource: https://socialanimal.dev/blog/cloudinary-alternatives-2026/
    title: Cloudinary alternatives comparison (Supabase Storage row, 2026-08)
---

# Photo Storage and Backend Options

> [!NOTE] Context
> The public site reads galleries from Firestore `galleries` and falls back to the static Adobe CDN dataset. Image bytes are **not** in Firebase: they are static files in `public/galleries/` deployed with the site ([Decision 0016](/decisions/0016-gallery-management.md), 2026-11-16). Firebase still provides auth and metadata only. This page remains the input for whether Firestore itself stays, and for any future image pipeline.

## Resolution (2026-11-16)

The storage question this page raised is answered for the photo bytes:

- The owner chose repository assets over Firebase Storage, so there is no bucket, no Blaze requirement and no egress bill for images.
- Firebase keeps Google auth and the `galleries` metadata collection.
- What is still open: whether Firestore is the right long-term metadata store (versus a static manifest or another backend) and whether the owner later wants an image pipeline for responsive variants. Firebase 13 (issue #21) waits on that.


## What the portfolio needs

- About 100 photos now, each a few MB at full resolution, plus a few web sizes (600w and 1200w are already used).
- One admin account, Google sign-in, upload and reorder.
- Public delivery of photos to visitors. Bandwidth is the variable cost.
- Predictable cost, low maintenance, and an easy export if the service changes.

## Is Firebase the right fit?

**Where Firebase fits well**

- Auth, Firestore and Storage live in one console and one SDK. The admin is already written against them.
- Costs are near zero at this size. Firestore holds only metadata; the free quota (1 GiB stored, 50k reads a day) is far above a 100-photo portfolio.
- The admin's realtime Firestore queries and reorder batches work well.

**Where Firebase is weak for this use**

- **No image pipeline.** Storage serves the original file. Resizing, WebP/AVIF and srcset variants must be produced by us (upload script or Cloud Function, which needs Blaze). There is no delivery CDN with transforms.
- **Egress is the cost driver.** Storage downloads are $0.12/GB after the free allowance on Blaze. New buckets include 100 GB a month of downloads for free, then Cloud Storage rates apply.
- **Blaze is required.** Storage is not on the free Spark plan, so a billing account is mandatory. Legacy `*.appspot.com` buckets have different allowances from `*.firebasestorage.app` buckets.
- **Security depends on deployed rules.** The repository now has `firestore.rules` and `storage.rules` ([Decision 0014](/decisions/0014-admin-route-protection.md)), but they only take effect after deployment.
- **Grpc advisory history.** Firestore pinned a vulnerable gRPC version; we overrode it ([Decision 0013](/decisions/0013-grpc-js-override.md)). It is a reminder that the SDK tree is large.

## Cost comparison (list prices, read Nov 2026)

Assumption for the table: 5 GB of originals and derivatives stored, 40 GB of photo downloads a month (about 20k page views at 2 MB average). Only a rough order of magnitude; traffic is unknown.

| Option | Storage | Delivery | Transforms | Rough monthly cost at 40 GB out |
|--------|---------|----------|------------|-------------------------------|
| Firebase Storage (Blaze, new bucket) | $0.026/GB-mo after 5 GB free | $0.12/GB after 100 GB free | None (we pre-generate) | about $0 (inside the free allowances) |
| Cloudflare R2 (+ Workers for uploads) | $0.015/GB-mo after 10 GB free | Free, any volume | Cloudflare Images (separate) | about $0 (inside the free allowances) |
| Supabase Storage (Pro) | included in plan | 5 GB egress on free, Pro is $25/mo | Yes, on Pro | $25 base plan |
| Cloudinary (Plus) | credit-based | credit-based (1 GB = 1 credit) | Yes (1,000 transforms per credit) | $89/mo base plan |
| imgix (Starter) + R2/S3 storage | 2 credits/GB-mo | 1 credit/GB | Yes | $25/mo base plan + storage |

At 500 GB a month of downloads, Firebase Storage on a new bucket would cost about $48 a month in egress, while R2 would stay near zero.

## Alternatives

1. **Keep Firebase (status quo).** Keep Auth, Firestore and Storage. Pre-generate sizes in the upload step. Lowest effort, fine at this scale, weakest on egress and image delivery.
2. **Firebase Auth + Firestore, images on Cloudflare R2.** Keep the admin and metadata. Upload through a signed-URL flow (small Cloudflare Worker) into an R2 bucket with public read via a custom domain. Egress is free. Adds a second vendor and a Worker to maintain.
3. **Supabase (Postgres, Auth, Storage with transforms).** One vendor for auth, data and images, with on-the-fly image transforms on Pro. Requires rewriting the admin data layer and migrating Firestore data. Good if we want SQL.
4. **Headless CMS (Sanity, Contentful, or similar).** Built-in media library, editor UI and image CDN. Removes most admin code but adds a content model and a vendor dependency. The admin would no longer be ours.
5. **Image CDN on top of existing storage (imgix or Cloudinary).** Best transforms and responsive variants with little code. imgix (from $25/mo) connects to R2 or S3 and keeps the bytes in our bucket. Cloudinary (from $89/mo) also hosts the bytes but is more expensive for a portfolio.
6. **Static files in the repo or a bucket (no runtime backend).** Store photos and a JSON manifest in R2 or the repo; the admin becomes a local script. Cheapest and simplest runtime, but the owner loses the web admin.

## Recommendation for discussion

- Images: settled — static repository assets under `public/galleries/` ([Decision 0016](/decisions/0016-gallery-management.md)).
- Metadata: keep Firebase Auth and Firestore for now. They work, are cheap at this size, and are protected by rules.
- If the owner later wants on-the-fly responsive variants, revisit option 5 (imgix or Cloudflare Images on top of static files or R2) instead of a Storage bucket.
- Before changing the metadata store, confirm: expected traffic, whether a web admin stays, and whether a second vendor is acceptable.

> [!QUESTION] Open questions for the owner
> - Expected monthly visits and photo downloads?
> - Should Firestore stay as the metadata store, or should galleries eventually be a static manifest?
> - Is a responsive image pipeline wanted, and if so, which vendor?


## Links

- [Photo Management](/concepts/photo-management.md)
- [Firebase Backend](/concepts/firebase-backend.md)
- [Decision 0016 — Gallery management and static images](/decisions/0016-gallery-management.md)
- [Rebuild Plan](/rebuild-plan.md) — phase 6
- [Open items review](/reviews/2026-11-07-open-items.md)
- [Issue #21 — evaluate Firebase 13 after the backend decision](https://github.com/AlexDevsTheWeb/alessandrotorri.it/issues/21)
