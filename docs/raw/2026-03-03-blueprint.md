# Photography Portfolio Project Blueprint

## Overview

This document outlines the plan and progress for a personal photography portfolio website. The goal is to create a modern, performant, and visually appealing site using React, Material-UI, Zustand, and Firebase.

## Core Technologies

*   **Frontend:** React (with Vite)
*   **UI Components:** Material-UI
*   **State Management:** Zustand
*   **Routing:** React Router DOM
*   **Backend & Storage:** Firebase (Authentication, Firestore, Storage)

## Implemented Features

*   **Project Setup:** Initialized with React, Vite, and essential dependencies.
*   **Authentication:** Secure login for the administrator.
*   **Image Management:**
    *   `Image` interface with properties: `id`, `name`, `url`, `metadata`, `collection`, `isFavorite`, `isLatestWork`, `isCoverImage`, and `order`.
    *   Image upload functionality.
*   **Collections:**
    *   Images are grouped into collections.
    *   `CollectionList` component on the admin dashboard to display all collections.
    *   `CollectionDetailPage` for viewing and managing images within a collection.
    *   Drag-and-drop reordering of images within a collection.
    *   Editing of image properties (name, metadata, favorite, latest work, cover image).
*   **Admin Dashboard:**
    *   Centralized location for managing site content.
    *   Includes image upload and collection management.

## Current Plan: UI/UX and Public-Facing Gallery

With the core admin functionality in place, the next focus is on the public-facing gallery and improving the overall user experience.

### Next Steps:

1.  **DONE:** Implement a "Cover Image" property for images.
2.  **DONE:** Create a `CollectionList` component for the admin dashboard.
3.  **DONE:** Create a `CollectionDetailPage` with drag-and-drop reordering.
4.  **NEXT:** Design and build the public-facing `GalleryPage` to display collections and images.
5.  **NEXT:** Create a public-facing `CollectionPage` to display the images of a specific collection.
6.  **NEXT:** Implement a visually appealing theme and layout for the entire site.
7.  **NEXT:** Ensure the site is fully responsive and accessible.
