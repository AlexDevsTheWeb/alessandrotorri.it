import type { Timestamp } from 'firebase/firestore';
import type { ImageAspectRatio } from './gallery.types';

export interface CatalogImage {
  id: string;
  filename: string;
  path: string;
  title: string;
  description: string;
  alt: string;
  aspectRatio: ImageAspectRatio;
  galleryIds: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type CatalogImageDraft = Omit<CatalogImage, 'id' | 'createdAt' | 'updatedAt'>;

export type ImageStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface RepositoryImageFile {
  filename: string;
  path: string;
  suggestedId: string;
  downloadUrl: string;
}

export type ImageFilter = 'all' | 'new' | 'missing-title' | 'missing-description' | 'unassigned';

export interface CatalogEntry {
  filename: string;
  path: string;
  remoteUrl: string;
  image: CatalogImage | null;
  isFromRepository: boolean;
}
