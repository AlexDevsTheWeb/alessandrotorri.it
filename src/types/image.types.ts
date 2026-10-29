import type { Timestamp } from 'firebase/firestore';

export interface IImage {
  id: string;
  name: string;
  url: string;
  metadata: string;
  collection: string;
  isFavorite: boolean;
  isLatestWork: boolean;
  isCoverImage: boolean;
  isVisible: boolean;
  order: number;
  createdAt?: Timestamp | null;
}
