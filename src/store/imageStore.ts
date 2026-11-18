import { create } from 'zustand';
import { assignImageToGallery, detachImageFromGallery } from '../services/galleries.service';
import { describeFirestoreError } from '../services/firestore.service';
import { clearPublicGalleriesCache } from '../services/publicGalleries.service';
import { fetchImages, indexImage, saveImage } from '../services/images.service';
import type {
  CatalogImage,
  CatalogImageDraft,
  ImageStatus,
  RepositoryImageFile,
} from '../types/image.types';

interface ImageStore {
  images: CatalogImage[];
  status: ImageStatus;
  error: string | null;
  fetchImages: () => Promise<void>;
  indexImage: (file: RepositoryImageFile) => Promise<string>;
  indexImages: (files: RepositoryImageFile[]) => Promise<number>;
  saveImage: (id: string, patch: Partial<CatalogImageDraft>) => Promise<void>;
  assignToGallery: (imageId: string, galleryId: string) => Promise<void>;
  unassignFromGallery: (imageId: string, galleryId: string) => Promise<void>;
}

const byFilename = (a: CatalogImage, b: CatalogImage): number =>
  a.filename.localeCompare(b.filename);

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  status: 'idle',
  error: null,

  fetchImages: async () => {
    set({ status: 'loading', error: null });
    try {
      const images = await fetchImages();
      set({ images: [...images].sort(byFilename), status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: describeFirestoreError(error) });
    }
  },

  indexImage: async (file) => {
    set({ error: null });
    try {
      const id = await indexImage(file);
      await get().fetchImages();
      return id;
    } catch (error) {
      set({ error: describeFirestoreError(error) });
      throw error;
    }
  },

  indexImages: async (files) => {
    set({ error: null });
    try {
      for (const file of files) {
        await indexImage(file);
      }
      return files.length;
    } catch (error) {
      set({ error: describeFirestoreError(error) });
      throw error;
    } finally {
      await get().fetchImages();
    }
  },

  saveImage: async (id, patch) => {
    set({ error: null });
    try {
      await saveImage(id, patch);
      clearPublicGalleriesCache();
      await get().fetchImages();
    } catch (error) {
      set({ error: describeFirestoreError(error) });
      throw error;
    }
  },

  assignToGallery: async (imageId, galleryId) => {
    set({ error: null });
    try {
      await assignImageToGallery(imageId, galleryId);
      clearPublicGalleriesCache();
      await get().fetchImages();
    } catch (error) {
      set({ error: describeFirestoreError(error) });
      throw error;
    }
  },

  unassignFromGallery: async (imageId, galleryId) => {
    set({ error: null });
    try {
      await detachImageFromGallery(imageId, galleryId);
      clearPublicGalleriesCache();
      await get().fetchImages();
    } catch (error) {
      set({ error: describeFirestoreError(error) });
      throw error;
    }
  },
}));
