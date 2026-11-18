import type { Timestamp } from 'firebase/firestore';

export type ImageAspectRatio = '16:9' | '3:2' | '4:3' | '1:1' | 'auto';

export type GalleryPadding = 'none' | 'small' | 'medium' | 'large';

export interface GalleryLayoutConfig {
  aspectRatio: ImageAspectRatio;
  padding: GalleryPadding;
}

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
  isVisible: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  coverImageId: string;
  coverImageUrl: string;
  imageIds: string[];
  layoutConfig: GalleryLayoutConfig;
  legacyImages: GalleryImage[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface PublicGallery extends Gallery {
  images: GalleryImage[];
}

export interface GalleryOrder {
  id: string;
  displayOrder: number;
}

export type GalleryDraft = Omit<Gallery, 'id' | 'createdAt' | 'updatedAt' | 'legacyImages'>;

export type GalleryStatus = 'idle' | 'loading' | 'ready' | 'error';

export type AdminAccessStatus = 'idle' | 'checking' | 'admin' | 'not-admin' | 'error';

export type AdminSection = 'galleries' | 'images';
