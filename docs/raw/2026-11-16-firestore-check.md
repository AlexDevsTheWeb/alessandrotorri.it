We are experiencing a "Missing or insufficient permissions" error when attempting to create/save a gallery in the /admin section.

Please do the following:

1. Inspect `src/services/galleries.service.ts` and `src/stores/useGalleryStore.ts` to see exactly how Firestore writes (createGallery / setDoc / addDoc / writeBatch) are formatted and what payload is sent.
2. Add detailed console.error logs in `galleries.service.ts` when a Firestore call fails, printing the exact payload and error details to the browser console.
3. Review `firestore.rules` in the repository to make sure the schema validation (shape check) matches the actual object structure being written by `galleries.service.ts` (e.g. timestamps, array fields, displayOrder, slug format).
4. Provide a clear summary of why the write fails and fix any payload mismatch or rule discrepancy in the codebase.

---
