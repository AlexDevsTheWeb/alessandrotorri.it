import { resolveGalleryImages } from '../data/galleries.mapper';
import type { PublicGallery } from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';

let cachedGalleries: PublicGallery[] | null = null;
let inFlight: Promise<PublicGallery[]> | null = null;

const fetchPublicGalleries = async (): Promise<PublicGallery[]> => {
  const [galleryService, imageService] = await Promise.all([
    import('./galleries.service'),
    import('./images.service'),
  ]);
  const [items, catalog] = await Promise.all([
    galleryService.fetchGalleries(),
    imageService.fetchImages().catch(() => [] as CatalogImage[]),
  ]);

  return items.map((gallery) => ({
    ...gallery,
    images: resolveGalleryImages(gallery, catalog),
  }));
};

export const loadPublicGalleries = (): Promise<PublicGallery[]> => {
  if (!inFlight) {
    inFlight = fetchPublicGalleries()
      .then((items) => {
        cachedGalleries = items;
        return items;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
};

export const getCachedPublicGalleries = (): PublicGallery[] | null => cachedGalleries;

export const clearPublicGalleriesCache = (): void => {
  cachedGalleries = null;
};
