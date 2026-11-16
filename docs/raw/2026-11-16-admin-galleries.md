# Task Specification for OpenCode: PR #23 Review & Dynamic Gallery Management Implementation

## 1. Project Context & Objectives
You are acting as the lead AI coding agent for the repository `AlexDevsTheWeb/alessandrotorri.it`, a high-performance landscape photography portfolio built with **React 19**, **Vite 7**, **TypeScript**, **MUI v7**, **Zustand**, **framer-motion**, and **Firebase** (Auth, Firestore, Hosting).

The user is refactoring their website to eliminate third-party cloud subscription fees while maintaining an administrative area to manage photo galleries dynamically.

Your mission is twofold:
1. **Analyze PR #23** (`https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23`) to determine merge and branch update requirements before starting new feature development.
2. **Design and implement the Admin Gallery Management System** using GitHub repository-based image storage (`public/galleries/`) and Firestore-backed gallery metadata.

---

## 2. Preliminary Task: PR #23 Analysis & Synchronization
Before writing any code for the new feature:
- Inspect PR #23: `https://github.com/AlexDevsTheWeb/alessandrotorri.it/pull/23`.
- Analyze the diff and state of PR #23 against the `main` branch.
- Determine whether PR #23 contains pending infrastructure, documentation, or admin fixes that must be merged first.
- Recommend whether to merge PR #23 into `main` and pull the latest changes into the local working branch before starting implementation.

---

## 3. Architecture Specification: Image Storage
- **Storage Strategy**: All optimized photography files (WebP/JPEG, ~1600px long edge) will be stored directly inside the repository in a single directory: `public/galleries/`.
- **Deployment**: Static assets inside `public/` are deployed automatically to Firebase Hosting via the existing GitHub Actions CI/CD pipeline.
- **Image References**: Image URLs in Firestore will reference static web paths (e.g., `/galleries/filename.webp`).

---

## 4. Feature Specification: Admin Gallery Management
Implement/extend the Protected Admin Panel (`/admin` route guarded by Firebase Auth & Zustand state) to allow complete management of photo galleries.

### 4.1 Required Functionality

#### A. Gallery CRUD & Reordering
- **Create Gallery**: Form to create a new gallery with Title/Name, Description, Cover Image, and Initial Display Order.
- **Edit Gallery**: Interface to update name, description, cover image, and list of associated images.
- **Gallery Sequence/Order**: Allow setting and modifying the display order of each gallery relative to other galleries (e.g., drag-and-drop or explicit numerical sequence/up-down controls).

#### B. Image Assignment, Preview & Ordering within Gallery
- **Image URL & Description**: For each image in a gallery, specify:
  - Image URL path (pointing to static repo asset in `public/galleries/`).
  - Image Title / Caption.
  - Image Alt text / Description.
- **Live Image Preview**: Display visual thumbnails next to each image entry input so the photographer can visually verify the asset.
- **Image Reordering within Gallery**: Provide intuitive controls (drag-and-drop or position indices) to arrange the display sequence of images inside a single gallery.

### 4.2 Data & Code Architecture Requirements
- **TypeScript Definitions**: Update or create interfaces for `Gallery`, `GalleryItem` / `ImageItem`, and `GalleryOrder`.
- **Firestore Schema**: Define the Firestore collection structure for `galleries` (document fields: `id`, `name`, `description`, `displayOrder`, `coverImageUrl`, `images: ImageItem[]`, `createdAt`, `updatedAt`).
- **Zustand State Management**: Extend/implement gallery store hooks (`useGalleryStore`) for fetching, creating, updating, and reordering galleries.
- **MUI v7 UI Components**: Build sleek, accessible admin components conforming to the site's dark/landscape photography aesthetic.
- **Firestore Security Rules**: Ensure `firestore.rules` enforces admin-only write permissions while allowing public read access.

---

## 5. Expected Output & Workflow Rules
1. **Phase 1: Implementation Plan**:
   - First, generate a comprehensive `IMPLEMENTATION_PLAN.md` file covering your PR #23 assessment, Firestore schema design, component hierarchy, and file modification plan.
   - Pause for user confirmation of the plan.
2. **Phase 2: Execution**:
   - Once approved, execute code modifications cleanly.
   - Run typechecking (`tsc --noEmit`), linting, and build validation (`npm run build`).
   - Summarize all changes and PR state upon completion.
