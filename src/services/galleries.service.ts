import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseData';
import type { Gallery, GalleryDraft, GalleryImage, GalleryOrder } from '../types/gallery.types';

const GALLERIES = 'galleries';

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asTimestamp = (value: unknown): Timestamp | null =>
  value !== null && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : null;

const normalizeImage = (value: unknown, index: number): GalleryImage => {
  const source = value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  return {
    id: asString(source.id, `image-${index}`),
    url: asString(source.url),
    title: asString(source.title),
    alt: asString(source.alt),
    ratio: asString(source.ratio, '3/2'),
    order: index,
  };
};

export const normalizeGallery = (id: string, data: DocumentData): Gallery => {
  const images = Array.isArray(data.images) ? data.images : [];

  return {
    id,
    name: asString(data.name),
    slug: asString(data.slug),
    description: asString(data.description),
    displayOrder: asNumber(data.displayOrder),
    coverImageUrl: asString(data.coverImageUrl),
    images: [...images]
      .map(normalizeImage)
      .sort((a, b) => a.order - b.order)
      .map((image, index) => ({ ...image, order: index })),
    createdAt: asTimestamp(data.createdAt),
    updatedAt: asTimestamp(data.updatedAt),
  };
};

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toGalleryDraft = (gallery: Gallery): GalleryDraft => ({
  name: gallery.name,
  slug: gallery.slug,
  description: gallery.description,
  displayOrder: gallery.displayOrder,
  coverImageUrl: gallery.coverImageUrl,
  images: gallery.images.map((image, index) => ({ ...image, order: index })),
});

export const createEmptyDraft = (displayOrder = 0): GalleryDraft => ({
  name: '',
  slug: '',
  description: '',
  displayOrder,
  coverImageUrl: '',
  images: [],
});

const buildGalleryPayload = (draft: GalleryDraft) => ({
  name: draft.name.trim(),
  slug: draft.slug.trim(),
  description: draft.description.trim(),
  displayOrder: Number.isFinite(draft.displayOrder) ? draft.displayOrder : 0,
  coverImageUrl: draft.coverImageUrl.trim(),
  images: draft.images.map((image, index) => ({
    id: image.id,
    url: image.url.trim(),
    title: image.title.trim(),
    alt: image.alt.trim(),
    ratio: image.ratio.trim() || '3/2',
    order: index,
  })),
});

export const fetchGalleries = async (): Promise<Gallery[]> => {
  const snapshot = await getDocs(query(collection(db, GALLERIES), orderBy('displayOrder')));
  return snapshot.docs.map((document) => normalizeGallery(document.id, document.data()));
};

export const createGallery = async (draft: GalleryDraft): Promise<string> => {
  const reference = await addDoc(collection(db, GALLERIES), {
    ...buildGalleryPayload(draft),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
};

export const saveGallery = async (id: string, draft: GalleryDraft): Promise<void> => {
  await updateDoc(doc(db, GALLERIES, id), {
    ...buildGalleryPayload(draft),
    updatedAt: serverTimestamp(),
  });
};

export const deleteGallery = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, GALLERIES, id));
};

export const reorderGalleries = async (orders: GalleryOrder[]): Promise<void> => {
  const batch = writeBatch(db);
  orders.forEach(({ id, displayOrder }) => {
    batch.update(doc(db, GALLERIES, id), { displayOrder, updatedAt: serverTimestamp() });
  });
  await batch.commit();
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateGalleryDraft = (
  draft: GalleryDraft,
  galleries: Gallery[],
  currentId?: string,
): string | null => {
  if (!draft.name.trim()) return 'Il nome della galleria è obbligatorio.';
  if (!SLUG_PATTERN.test(draft.slug.trim())) {
    return 'Lo slug può contenere solo lettere minuscole, numeri e trattini.';
  }
  const duplicate = galleries.some(
    (gallery) => gallery.id !== currentId && gallery.slug === draft.slug.trim(),
  );
  if (duplicate) return 'Esiste già una galleria con questo slug.';
  if (!Number.isFinite(draft.displayOrder)) return "L'ordine deve essere un numero.";
  if (draft.images.some((image) => !image.url.trim())) {
    return "Ogni immagine deve avere un percorso o un URL.";
  }
  return null;
};

