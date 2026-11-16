import type { Timestamp } from 'firebase/firestore';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  alt: string;
  ratio: string;
  order: number;
}

export interface Gallery {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  coverImageUrl: string;
  images: GalleryImage[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface GalleryOrder {
  id: string;
  displayOrder: number;
}

export type GalleryDraft = Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>;

export type GalleryImageDraft = Omit<GalleryImage, 'id' | 'order'>;

export type GalleryStatus = 'idle' | 'loading' | 'ready' | 'error';
