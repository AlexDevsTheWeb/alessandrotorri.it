import { create } from 'zustand';
import {
  checkAdminAccess as checkAdminAccessDocument,
  createEmptyDraft,
  createGallery as createGalleryDocument,
  deleteGallery as deleteGalleryDocument,
  describeGalleryError,
  fetchGalleries,
  reorderGalleries as reorderGalleryDocuments,
  saveGallery as saveGalleryDocument,
} from '../services/galleries.service';
import type {
  AdminAccessStatus,
  Gallery,
  GalleryDraft,
  GalleryStatus,
} from '../types/gallery.types';

interface GalleryStore {
  galleries: Gallery[];
  status: GalleryStatus;
  error: string | null;
  adminStatus: AdminAccessStatus;
  fetchGalleries: () => Promise<void>;
  checkAdminAccess: (uid: string) => Promise<void>;
  createGallery: (draft?: GalleryDraft) => Promise<string>;
  saveGallery: (id: string, draft: GalleryDraft) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
  reorderGalleries: (ids: string[]) => Promise<void>;
}

const byDisplayOrder = (a: Gallery, b: Gallery): number =>
  a.displayOrder - b.displayOrder || a.name.localeCompare(b.name);

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  galleries: [],
  status: 'idle',
  error: null,
  adminStatus: 'idle',

  fetchGalleries: async () => {
    set({ status: 'loading', error: null });
    try {
      const galleries = await fetchGalleries();
      set({ galleries: [...galleries].sort(byDisplayOrder), status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: describeGalleryError(error) });
    }
  },

  checkAdminAccess: async (uid) => {
    set({ adminStatus: 'checking' });
    try {
      const isAdmin = await checkAdminAccessDocument(uid);
      set({ adminStatus: isAdmin ? 'admin' : 'not-admin' });
    } catch {
      set({ adminStatus: 'error' });
    }
  },

  createGallery: async (draft) => {
    set({ error: null });
    try {
      const id = await createGalleryDocument(draft ?? createEmptyDraft(get().galleries.length));
      await get().fetchGalleries();
      return id;
    } catch (error) {
      set({ error: describeGalleryError(error) });
      throw error;
    }
  },

  saveGallery: async (id, draft) => {
    set({ error: null });
    try {
      await saveGalleryDocument(id, draft);
      await get().fetchGalleries();
    } catch (error) {
      set({ error: describeGalleryError(error) });
      throw error;
    }
  },

  deleteGallery: async (id) => {
    set({ error: null });
    try {
      await deleteGalleryDocument(id);
      set((state) => ({ galleries: state.galleries.filter((gallery) => gallery.id !== id) }));
    } catch (error) {
      set({ error: describeGalleryError(error) });
      throw error;
    }
  },

  reorderGalleries: async (ids) => {
    const previous = get().galleries;
    const ordered = ids
      .map((id) => previous.find((gallery) => gallery.id === id))
      .filter((gallery): gallery is Gallery => Boolean(gallery));
    if (ordered.length !== previous.length) return;

    const next = ordered.map((gallery, index) => ({ ...gallery, displayOrder: index }));
    set({ galleries: next, error: null });

    try {
      await reorderGalleryDocuments(
        next.map(({ id, displayOrder }) => ({ id, displayOrder })),
      );
    } catch (error) {
      set({ galleries: previous, error: describeGalleryError(error) });
      throw error;
    }
  },
}));
