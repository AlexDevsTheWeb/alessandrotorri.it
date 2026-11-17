import { useEffect, useState } from 'react';
import { resolveGalleryImages } from '../data/galleries.mapper';
import type { PublicGallery } from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';

interface PublicGalleries {
  galleries: PublicGallery[];
  isReady: boolean;
}

export const usePublicGalleries = (): PublicGalleries => {
  const [galleries, setGalleries] = useState<PublicGallery[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([import('../services/galleries.service'), import('../services/images.service')])
      .then(async ([galleryService, imageService]) => {
        const [items, catalog] = await Promise.all([
          galleryService.fetchGalleries(),
          imageService.fetchImages().catch(() => [] as CatalogImage[]),
        ]);
        if (!active) return;
        setGalleries(
          items.map((gallery) => ({
            ...gallery,
            images: resolveGalleryImages(gallery, catalog),
          })),
        );
      })
      .catch(() => {
        if (active) setGalleries([]);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { galleries, isReady };
};
