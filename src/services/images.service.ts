import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseData';
import type { ImageAspectRatio } from '../types/gallery.types';
import type {
  CatalogImage,
  CatalogImageDraft,
  RepositoryImageFile,
} from '../types/image.types';
import { logFirestoreFailure } from './firestore.service';
const ASPECT_RATIOS = ['16:9', '3:2', '4:3', '1:1', 'auto'];
import { slugify } from './slug.service';

const IMAGES = 'images';

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asTimestamp = (value: unknown): Timestamp | null =>
  value !== null && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : null;

const asAspectRatio = (value: unknown): ImageAspectRatio => {
  const candidate = asString(value, 'auto').replace('/', ':');
  return ASPECT_RATIOS.includes(candidate as ImageAspectRatio)
    ? (candidate as ImageAspectRatio)
    : 'auto';
};

export const imageIdFromFilename = (filename: string): string =>
  slugify(filename.replace(/\.[^.]+$/, '')) || slugify(filename);

export const imagePathFromFilename = (filename: string): string => `/galleries/${filename}`;

const SUPPORTED_IMAGE_PATTERN = /\.(webp|jpe?g|png|avif)$/i;

export const isSupportedImageFile = (filename: string): boolean =>
  SUPPORTED_IMAGE_PATTERN.test(filename);

export const normalizeCatalogImage = (id: string, data: DocumentData): CatalogImage => ({
  id,
  filename: asString(data.filename),
  path: asString(data.path),
  title: asString(data.title),
  description: asString(data.description),
  alt: asString(data.alt),
  aspectRatio: asAspectRatio(data.aspectRatio),
  galleryIds: Array.isArray(data.galleryIds)
    ? data.galleryIds.filter((value): value is string => typeof value === 'string')
    : [],
  createdAt: asTimestamp(data.createdAt),
  updatedAt: asTimestamp(data.updatedAt),
});

export const fetchImages = async (): Promise<CatalogImage[]> => {
  try {
    const snapshot = await getDocs(query(collection(db, IMAGES), orderBy('filename')));
    return snapshot.docs
      .map((document) => normalizeCatalogImage(document.id, document.data()))
      .filter((image) => image.filename.trim().length > 0 && image.path.trim().length > 0);
  } catch (error) {
    logFirestoreFailure('images', 'fetch', IMAGES, null, error);
    throw error;
  }
};

export const indexImage = async (file: RepositoryImageFile): Promise<string> => {
  const id = file.suggestedId || imageIdFromFilename(file.filename);
  const reference = doc(db, IMAGES, id);

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (snapshot.exists()) return;
      transaction.set(reference, {
        filename: file.filename,
        path: file.path,
        title: '',
        description: '',
        alt: '',
        aspectRatio: 'auto',
        galleryIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    return id;
  } catch (error) {
    logFirestoreFailure('images', 'index', `${IMAGES}/${id}`, { filename: file.filename }, error);
    throw error;
  }
};

const buildImagePayload = (patch: Partial<CatalogImageDraft>) => {
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.filename !== undefined) payload.filename = patch.filename.trim();
  if (patch.path !== undefined) payload.path = patch.path.trim();
  if (patch.title !== undefined) payload.title = patch.title.trim();
  if (patch.description !== undefined) payload.description = patch.description.trim();
  if (patch.alt !== undefined) payload.alt = patch.alt.trim();
  if (patch.aspectRatio !== undefined) payload.aspectRatio = patch.aspectRatio;
  if (patch.galleryIds !== undefined) {
    payload.galleryIds = Array.from(new Set(patch.galleryIds.filter((id) => id.trim().length > 0)));
  }
  return payload;
};

export const saveImage = async (
  id: string,
  patch: Partial<CatalogImageDraft>,
): Promise<void> => {
  const payload = buildImagePayload(patch);

  try {
    await updateDoc(doc(db, IMAGES, id), payload);
  } catch (error) {
    logFirestoreFailure('images', 'update', `${IMAGES}/${id}`, payload, error);
    throw error;
  }
};
