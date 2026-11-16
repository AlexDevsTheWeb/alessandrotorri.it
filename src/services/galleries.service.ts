import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
const ADMINS = 'admins';

interface FirestoreFailure {
  code: string;
  message: string;
}

const describeFirestoreFailure = (error: unknown): FirestoreFailure => {
  const candidate = error as { code?: unknown; message?: unknown };
  return {
    code: typeof candidate?.code === 'string' ? candidate.code : 'unknown',
    message:
      typeof candidate?.message === 'string'
        ? candidate.message
        : error instanceof Error
          ? error.message
          : String(error),
  };
};

const logFirestoreFailure = (
  operation: string,
  path: string,
  payload: unknown,
  error: unknown,
): void => {
  const failure = describeFirestoreFailure(error);
  console.error(`[galleries] ${operation} failed (${failure.code})`, {
    path,
    payload,
    code: failure.code,
    message: failure.message,
    error,
  });
};

export const describeGalleryError = (error: unknown): string => {
  const { code, message } = describeFirestoreFailure(error);
  if (code === 'permission-denied') {
    return 'Permesso negato da Firestore. Verifica che le regole siano pubblicate (firebase deploy --only firestore:rules) e che il tuo UID sia in admins/{uid}. Dettagli nella console del browser.';
  }
  if (code === 'unavailable') {
    return 'Firestore non raggiungibile. Controlla la connessione e riprova.';
  }
  if (code === 'failed-precondition') {
    return 'Operazione rifiutata: controlla gli indici Firestore richiesti.';
  }
  return message;
};

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
  try {
    const snapshot = await getDocs(query(collection(db, GALLERIES), orderBy('displayOrder')));
    return snapshot.docs.map((document) => normalizeGallery(document.id, document.data()));
  } catch (error) {
    logFirestoreFailure('fetch', GALLERIES, null, error);
    throw error;
  }
};

export const checkAdminAccess = async (uid: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(doc(db, ADMINS, uid));
    return snapshot.exists();
  } catch (error) {
    logFirestoreFailure('check-admin', `${ADMINS}/${uid}`, null, error);
    throw error;
  }
};

export const createGallery = async (draft: GalleryDraft): Promise<string> => {
  const payload = buildGalleryPayload(draft);

  try {
    const reference = await addDoc(collection(db, GALLERIES), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return reference.id;
  } catch (error) {
    logFirestoreFailure(
      'create',
      GALLERIES,
      { ...payload, createdAt: '<serverTimestamp>', updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
};

export const saveGallery = async (id: string, draft: GalleryDraft): Promise<void> => {
  const payload = buildGalleryPayload(draft);

  try {
    await updateDoc(doc(db, GALLERIES, id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    logFirestoreFailure(
      'update',
      `${GALLERIES}/${id}`,
      { ...payload, updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
};

export const deleteGallery = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, GALLERIES, id));
  } catch (error) {
    logFirestoreFailure('delete', `${GALLERIES}/${id}`, null, error);
    throw error;
  }
};

export const reorderGalleries = async (orders: GalleryOrder[]): Promise<void> => {
  const batch = writeBatch(db);
  orders.forEach(({ id, displayOrder }) => {
    batch.update(doc(db, GALLERIES, id), { displayOrder, updatedAt: serverTimestamp() });
  });

  try {
    await batch.commit();
  } catch (error) {
    logFirestoreFailure(
      'reorder',
      GALLERIES,
      { orders, updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
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

