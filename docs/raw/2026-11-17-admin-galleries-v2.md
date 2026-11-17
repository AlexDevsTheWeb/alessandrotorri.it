# Task Specification for OpenCode: Image Catalog, GitHub API Sync & Dynamic Gallery Layout System

## 1. Project Context & Objectives
You are the lead AI coding agent for `AlexDevsTheWeb/alessandrotorri.it`, a high-performance landscape photography portfolio built with **React 19**, **Vite 7**, **TypeScript**, **MUI v7**, **Zustand**, **framer-motion**, and **Firebase** (Auth, Firestore, Hosting).

Following our initial release of basic dynamic galleries, we are now expanding the Admin Panel and Frontend to support:
1. **Master Image Catalog & Direct Photo Management** in Firestore.
2. **GitHub REST API Integration** to discover repo photos (`public/galleries/`) and filter unindexed/incomplete photos.
3. **Flexible Gallery Assignment & Cover Designation**.
4. **Featured / Hero Galleries** (full-width 2-column span at the top of Homepage).
5. **Layout Customization & Visual Controls** (Aspect ratio, padding/gap selectors, `object-fit: cover` centering).
6. **Firestore Schema & Rules Update** to support the updated architecture seamlessly.

---

## 2. Architecture & Data Model (Firestore)

### 2.1 `images` Collection (Master Image Catalog)
Each document ID is the sanitized filename (or UUID):
- `id`: `string`
- `filename`: `string` (e.g. `italia-dolomiti-01.webp`)
- `path`: `string` (e.g. `/galleries/italia-dolomiti-01.webp`)
- `title`: `string`
- `description`: `string`
- `alt`: `string`
- `aspectRatio`: `'16:9' | '3:2' | '4:3' | '1:1' | 'auto'`
- `galleryIds`: `string[]` (IDs of galleries containing this image)
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

### 2.2 `galleries` Collection (Updated Schema)
- `id`: `string`
- `name`: `string`
- `slug`: `string`
- `description`: `string`
- `displayOrder`: `number`
- `isFeatured`: `boolean` (if true, pins to top of homepage spanning full 2 columns)
- `featuredOrder`: `number` (ordering among featured galleries)
- `coverImageId`: `string` (ID/URL of selected cover photo)
- `coverImageUrl`: `string`
- `imageIds`: `string[]` (ordered array of image IDs)
- `layoutConfig`:
  - `aspectRatio`: `'16:9' | '3:2' | '4:3' | '1:1' | 'auto'` (default: `'3:2'`)
  - `padding`: `'none' | 'small' | 'medium' | 'large'` (default: `'medium'`)
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

---

## 3. GitHub REST API Integration & Filtered Admin Views

### 3.1 GitHub Contents Discovery
- Integrate GitHub REST API (`GET /repos/AlexDevsTheWeb/alessandrotorri.it/contents/public/galleries`).
- Fetch all image files in `public/galleries/`.
- Cross-reference GitHub file list with Firestore `images` collection.

### 3.2 Admin Image Manager (`/admin/images`)
Create a dedicated Image Management tab/page in `/admin`:
- **Filtering Toolbar**:
  - *All Photos*
  - *New / Unindexed* (present in GitHub repo, not yet saved in Firestore)
  - *Missing Title* (`!title || title.trim() === ''`)
  - *Missing Description* (`!description || description.trim() === ''`)
  - *Unassigned* (`!galleryIds || galleryIds.length === 0`)
- **Batch & Quick Edit**: Edit title, description, alt text, and assign to gallery directly from the photo card.
- **Gallery Assignment Select**:
  - Dropdown select to choose an existing gallery.
  - Option "+ Create New Gallery" to open a quick modal to create a gallery and immediately assign the photo.

---

## 4. Cover Designation & Featured Galleries

### 4.1 Gallery Cover Photo
- In Gallery Detail Editor (`/admin/gallery/:id`), allow selecting any contained image as the **Cover Photo**.
- Highlights the cover photo in the admin UI and sets `coverImageId` & `coverImageUrl` on the gallery document.

### 4.2 Featured / Hero Galleries on Homepage
- Add toggle `isFeatured` in Gallery Editor.
- Featured galleries are displayed prominently at the top of the Homepage grid, spanning **both columns** (full-width banner format).
- Non-featured galleries continue in the standard 2-column grid below.

---

## 5. Visual Layout Customization & Experiments

### 5.1 Admin Controls & Public Rendering
- Add a layout experiment control bar in Admin and/or Gallery view:
  - **Aspect Ratio Selector**: `16:9`, `3:2`, `4:3`, `1:1`, `natural`
  - **Grid Padding / Gap Selector**: `none` (0px), `small` (8px), `medium` (16px), `large` (24px)
- **Image Styling Rule**:
  - ALL gallery cover images and grid item photos MUST strictly use:
    ```css
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
    ```
  - Ensures clean cropping and centering within container boundaries without stretching, letterboxing, or layout shifts.

---

## 6. Firestore Security Rules & Validation Update
Update `firestore.rules` to accommodate both `images` and `galleries` collections:
- `match /images/{imageId}`:
  - `allow read: if true;`
  - `allow write: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));`
- Update `match /galleries/{galleryId}` write rule to allow `isFeatured`, `coverImageId`, `coverImageUrl`, `layoutConfig`, and `imageIds`.

---

## 7. Workflow & Deliverables
1. **IMPLEMENTATION_PLAN.md**: OpenCode must first update `IMPLEMENTATION_PLAN.md` with:
   - Updated Firestore Schema & Security Rules.
   - GitHub API integration design.
   - Admin UI route structure (`/admin/galleries` vs `/admin/images`).
   - Component updates for Homepage hero/featured grid and layout experiment selectors.
2. **Execution & Validation**:
   - Run `npm run lint` and `npm run build` to verify zero TypeScript or bundle errors.
   - Document verification steps and commit changes cleanly.
