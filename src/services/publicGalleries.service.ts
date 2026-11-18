import { resolveGalleryImages } from '../data/galleries.mapper';
import type { Gallery, PublicGallery } from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';

export interface PublicGallerySnapshot {
  galleries: PublicGallery[];
  hasRemoteGalleries: boolean;
}

let cachedSnapshot: PublicGallerySnapshot | null = null;
let inFlight: Promise<PublicGallerySnapshot> | null = null;

export const selectPublicGalleries = (
  items: Gallery[],
  catalog: CatalogImage[],
): PublicGallerySnapshot => {
  const catalogById = new Map(catalog.map((image) => [image.id, image]));
  const galleries = items
    .filter((gallery) => gallery.isVisible)
    .map((gallery) => ({
      ...gallery,
      images: resolveGalleryImages(gallery, catalog).filter(
        (image) => catalogById.get(image.id)?.isVisible !== false,
      ),
    }))
    .filter((gallery) => gallery.images.length > 0);

  return { galleries, hasRemoteGalleries: items.length > 0 };
};

const fetchPublicGalleries = async (): Promise<PublicGallerySnapshot> => {
  const [galleryService, imageService] = await Promise.all([
    import('./galleries.service'),
    import('./images.service'),
  ]);
  const [items, catalog] = await Promise.all([
    galleryService.fetchGalleries(),
    imageService.fetchImages().catch(() => [] as CatalogImage[]),
  ]);

  return selectPublicGalleries(items, catalog);
};

export const loadPublicGalleries = (): Promise<PublicGallerySnapshot> => {
  if (!inFlight) {
    inFlight = fetchPublicGalleries()
      .then((snapshot) => {
        cachedSnapshot = snapshot;
        return snapshot;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
};

export const getCachedPublicGalleries = (): PublicGallerySnapshot | null => cachedSnapshot;

export const clearPublicGalleriesCache = (): void => {
  cachedSnapshot = null;
};
