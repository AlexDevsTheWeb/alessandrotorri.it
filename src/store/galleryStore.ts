import { create } from 'zustand';
import {
  createEmptyDraft,
  createGallery as createGalleryDocument,
  deleteGallery as deleteGalleryDocument,
  fetchGalleries,
  reorderGalleries as reorderGalleryDocuments,
  saveGallery as saveGalleryDocument,
} from '../services/galleries.service';
import type { Gallery, GalleryDraft, GalleryStatus } from '../types/gallery.types';

interface GalleryStore {
  galleries: Gallery[];
  status: GalleryStatus;
  error: string | null;
  fetchGalleries: () => Promise<void>;
  createGallery: (draft?: GalleryDraft) => Promise<string>;
  saveGallery: (id: string, draft: GalleryDraft) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
  reorderGalleries: (ids: string[]) => Promise<void>;
}

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : 'Errore sconosciuto';

const byDisplayOrder = (a: Gallery, b: Gallery): number =>
  a.displayOrder - b.displayOrder || a.name.localeCompare(b.name);

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  galleries: [],
  status: 'idle',
  error: null,

  fetchGalleries: async () => {
    set({ status: 'loading', error: null });
    try {
      const galleries = await fetchGalleries();
      set({ galleries: [...galleries].sort(byDisplayOrder), status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: messageOf(error) });
    }
  },

  createGallery: async (draft) => {
    set({ error: null });
    try {
      const id = await createGalleryDocument(draft ?? createEmptyDraft(get().galleries.length));
      await get().fetchGalleries();
      return id;
    } catch (error) {
      set({ error: messageOf(error) });
      throw error;
    }
  },

  saveGallery: async (id, draft) => {
    set({ error: null });
    try {
      await saveGalleryDocument(id, draft);
      await get().fetchGalleries();
    } catch (error) {
      set({ error: messageOf(error) });
      throw error;
    }
  },

  deleteGallery: async (id) => {
    set({ error: null });
    try {
      await deleteGalleryDocument(id);
      set((state) => ({ galleries: state.galleries.filter((gallery) => gallery.id !== id) }));
    } catch (error) {
      set({ error: messageOf(error) });
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
      set({ galleries: previous, error: messageOf(error) });
      throw error;
    }
  },
}));
