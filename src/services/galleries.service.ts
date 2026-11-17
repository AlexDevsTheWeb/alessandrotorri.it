import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseData';
import type {
  Gallery,
  GalleryDraft,
  GalleryImage,
  GalleryLayoutConfig,
  GalleryOrder,
  GalleryPadding,
  ImageAspectRatio,
} from '../types/gallery.types';
import { logFirestoreFailure } from './firestore.service';

const GALLERIES = 'galleries';
const IMAGES = 'images';
const ADMINS = 'admins';

export const ASPECT_RATIOS: ImageAspectRatio[] = ['16:9', '3:2', '4:3', '1:1', 'auto'];
export const GALLERY_PADDINGS: GalleryPadding[] = ['none', 'small', 'medium', 'large'];

export const DEFAULT_LAYOUT_CONFIG: GalleryLayoutConfig = {
  aspectRatio: '3:2',
  padding: 'medium',
};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asTimestamp = (value: unknown): Timestamp | null =>
  value !== null && typeof value === 'object' && 'toDate' in value ? (value as Timestamp) : null;

const asAspectRatio = (value: unknown): ImageAspectRatio => {
  const candidate = asString(value).replace('/', ':');
  return ASPECT_RATIOS.includes(candidate as ImageAspectRatio)
    ? (candidate as ImageAspectRatio)
    : DEFAULT_LAYOUT_CONFIG.aspectRatio;
};

const asPadding = (value: unknown): GalleryPadding =>
  GALLERY_PADDINGS.includes(value as GalleryPadding)
    ? (value as GalleryPadding)
    : DEFAULT_LAYOUT_CONFIG.padding;

const normalizeLayoutConfig = (value: unknown): GalleryLayoutConfig => {
  const source = value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    aspectRatio: asAspectRatio(source.aspectRatio),
    padding: asPadding(source.padding),
  };
};

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
  const legacyImages = Array.isArray(data.images)
    ? [...data.images]
        .map(normalizeImage)
        .sort((a, b) => a.order - b.order)
        .map((image, index) => ({ ...image, order: index }))
    : [];

  return {
    id,
    name: asString(data.name),
    slug: asString(data.slug),
    description: asString(data.description),
    displayOrder: asNumber(data.displayOrder),
    isFeatured: data.isFeatured === true,
    featuredOrder: asNumber(data.featuredOrder),
    coverImageId: asString(data.coverImageId),
    coverImageUrl: asString(data.coverImageUrl),
    imageIds: Array.isArray(data.imageIds)
      ? data.imageIds.filter((value): value is string => typeof value === 'string')
      : [],
    layoutConfig: normalizeLayoutConfig(data.layoutConfig),
    legacyImages,
    createdAt: asTimestamp(data.createdAt),
    updatedAt: asTimestamp(data.updatedAt),
  };
};

export const toGalleryDraft = (gallery: Gallery): GalleryDraft => ({
  name: gallery.name,
  slug: gallery.slug,
  description: gallery.description,
  displayOrder: gallery.displayOrder,
  isFeatured: gallery.isFeatured,
  featuredOrder: gallery.featuredOrder,
  coverImageId: gallery.coverImageId,
  coverImageUrl: gallery.coverImageUrl,
  imageIds: [...gallery.imageIds],
  layoutConfig: { ...gallery.layoutConfig },
});

export const createEmptyDraft = (displayOrder = 0): GalleryDraft => ({
  name: '',
  slug: '',
  description: '',
  displayOrder,
  isFeatured: false,
  featuredOrder: 0,
  coverImageId: '',
  coverImageUrl: '',
  imageIds: [],
  layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
});

const buildGalleryPayload = (draft: GalleryDraft) => ({
  name: draft.name.trim(),
  slug: draft.slug.trim(),
  description: draft.description.trim(),
  displayOrder: Number.isFinite(draft.displayOrder) ? draft.displayOrder : 0,
  isFeatured: draft.isFeatured,
  featuredOrder: Number.isFinite(draft.featuredOrder) ? draft.featuredOrder : 0,
  coverImageId: draft.coverImageId.trim(),
  coverImageUrl: draft.coverImageUrl.trim(),
  imageIds: Array.from(new Set(draft.imageIds.filter((id) => id.trim().length > 0))),
  layoutConfig: {
    aspectRatio: draft.layoutConfig.aspectRatio,
    padding: draft.layoutConfig.padding,
  },
});

const touchImagesInBatch = (imageIds: string[], galleryId: string, batch: ReturnType<typeof writeBatch>) => {
  imageIds.forEach((imageId) => {
    batch.update(doc(db, IMAGES, imageId), {
      galleryIds: arrayUnion(galleryId),
      updatedAt: serverTimestamp(),
    });
  });
};

export const fetchGalleries = async (): Promise<Gallery[]> => {
  try {
    const snapshot = await getDocs(query(collection(db, GALLERIES), orderBy('displayOrder')));
    return snapshot.docs.map((document) => normalizeGallery(document.id, document.data()));
  } catch (error) {
    logFirestoreFailure('galleries', 'fetch', GALLERIES, null, error);
    throw error;
  }
};

export const checkAdminAccess = async (uid: string): Promise<boolean> => {
  try {
    const snapshot = await getDoc(doc(db, ADMINS, uid));
    return snapshot.exists();
  } catch (error) {
    logFirestoreFailure('galleries', 'check-admin', `${ADMINS}/${uid}`, null, error);
    throw error;
  }
};

export const createGallery = async (draft: GalleryDraft): Promise<string> => {
  const payload = buildGalleryPayload(draft);
  const reference = doc(collection(db, GALLERIES));
  const batch = writeBatch(db);

  batch.set(reference, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  touchImagesInBatch(payload.imageIds, reference.id, batch);

  try {
    await batch.commit();
    return reference.id;
  } catch (error) {
    logFirestoreFailure(
      'galleries',
      'create',
      GALLERIES,
      { ...payload, createdAt: '<serverTimestamp>', updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
};

export const saveGallery = async (
  id: string,
  draft: GalleryDraft,
  previousImageIds: string[] = [],
): Promise<void> => {
  const payload = buildGalleryPayload(draft);
  const added = payload.imageIds.filter((imageId) => !previousImageIds.includes(imageId));
  const removed = previousImageIds.filter((imageId) => !payload.imageIds.includes(imageId));
  const batch = writeBatch(db);

  batch.update(doc(db, GALLERIES, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
  touchImagesInBatch(added, id, batch);
  removed.forEach((imageId) => {
    batch.update(doc(db, IMAGES, imageId), {
      galleryIds: arrayRemove(id),
      updatedAt: serverTimestamp(),
    });
  });

  try {
    await batch.commit();
  } catch (error) {
    logFirestoreFailure(
      'galleries',
      'update',
      `${GALLERIES}/${id}`,
      { ...payload, updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
};

const detachGalleryFromImages = async (id: string): Promise<void> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, IMAGES), where('galleryIds', 'array-contains', id)),
    );
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
      batch.update(document.ref, { galleryIds: arrayRemove(id), updatedAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (error) {
    logFirestoreFailure('galleries', 'detach-images', `${GALLERIES}/${id}`, null, error);
  }
};

export const deleteGallery = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, GALLERIES, id));
  } catch (error) {
    logFirestoreFailure('galleries', 'delete', `${GALLERIES}/${id}`, null, error);
    throw error;
  }

  await detachGalleryFromImages(id);
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
      'galleries',
      'reorder',
      GALLERIES,
      { orders, updatedAt: '<serverTimestamp>' },
      error,
    );
    throw error;
  }
};

export const assignImageToGallery = async (imageId: string, galleryId: string): Promise<void> => {
  const batch = writeBatch(db);
  batch.update(doc(db, IMAGES, imageId), {
    galleryIds: arrayUnion(galleryId),
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, GALLERIES, galleryId), {
    imageIds: arrayUnion(imageId),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    logFirestoreFailure('galleries', 'assign-image', `${GALLERIES}/${galleryId}`, { imageId }, error);
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
  if (!Number.isFinite(draft.featuredOrder)) return "L'ordine in evidenza deve essere un numero.";
  if (draft.coverImageId && !draft.imageIds.includes(draft.coverImageId)) {
    return 'La copertina scelta non è tra le immagini della galleria.';
  }
  return null;
};
