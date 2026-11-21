# Task Specification for OpenCode: Firebase Hosting & CI/CD Pipeline Resolution

## 1. Context & Diagnosis
During the initial deployment setup for `alessandrotorri.it`, running `firebase init` created duplicate GitHub Actions workflows (`.github/workflows/firebase-hosting-merge.yml`, `.github/workflows/firebase-hosting-pull-request.yml`) that conflict with the existing release workflows (`deploy.yml` and `ci.yml`). Furthermore, visiting `https://alessandrotorri-it.firebaseapp.com/` returns "Site not found" because:
1. The site target or channel configuration between Firebase Hosting and `firebase.json` was pointing to `public` instead of `dist`, or the `live` channel build artifact wasn't correctly published.
2. Multiple workflows running concurrently triggered secret mismatches or incomplete build uploads.

Your objective is to fix and clean up the entire CI/CD pipeline and Firebase configuration so that any push to `main` or tag `v1.0.0` builds cleanly and deploys automatically to Firebase Hosting without errors or 404s.

---

## 2. OpenCode Instructions & Task Breakdown

### Task 1: Consolidate & Clean Up GitHub Workflows
- Inspect `.github/workflows/`.
- Remove duplicate auto-generated workflows (e.g. `firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml`).
- Retain and standardize exactly two workflow files:
  1. `.github/workflows/ci.yml`: Runs on PRs targeting `development` or `main`.
     - Steps: `actions/checkout@v4`, `actions/setup-node@v4` (Node 22), `npm ci`, `npm run lint`, `tsc -b`, `npm run build`.
  2. `.github/workflows/deploy.yml`: Runs on `push` to `main` branch or tag `v*`.
     - Steps: `actions/checkout@v4`, `actions/setup-node@v4` (Node 22), `npm ci`, `npm run lint`, `tsc -b`, `npm run build`.
     - Firebase Hosting Deploy Step: Deploys `dist/` to the `live` channel using `FirebaseExtended/action-hosting-deploy@v0` or `w9jds/firebase-action@v2`.
     - Firestore Rules Deploy Step: Deploys `firestore.rules` using `w9jds/firebase-action@v2` or `firebase-tools` CLI step (`npx firebase-tools deploy --only firestore:rules --token ...` or via service account).

### Task 2: Audit `firebase.json` & `.firebaserc`
- Verify `firebase.json`:
  ```json
  {
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    "firestore": {
      "rules": "firestore.rules"
    }
  }
  ```
- Verify `.firebaserc`:
  ```json
  {
    "projects": {
      "default": "alessandrotorri-it"
    }
  }
  ```

### Task 3: Support Secret Fallbacks in `deploy.yml`
- In `deploy.yml`, configure the secret reference to accept either `FIREBASE_SERVICE_ACCOUNT` or `FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT`:
  ```yaml
  credentials: ${{ secrets.FIREBASE_SERVICE_ACCOUNT || secrets.FIREBASE_SERVICE_ACCOUNT_ALESSANDROTORRI_IT }}
  ```
- Ensure `projectId: alessandrotorri-it` and `channelId: live` are explicitly defined.

### Task 4: Verification & Quality Check
- Execute `npm run lint` -> Must pass.
- Execute `tsc -b` -> Must pass with 0 errors.
- Execute `npm run build` -> Must verify that `dist/index.html` and assets are generated properly.
- Verify that workflow YAML syntax is 100% valid.

---

## 3. Expected Output
1. Generate/update `IMPLEMENTATION_PLAN.md` with the workflow cleanup plan.
2. Commit the clean `.github/workflows/` and `firebase.json` configuration to `development`.
3. Provide a clear summary of all modified files.
