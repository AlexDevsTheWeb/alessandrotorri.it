import { useEffect, useState } from 'react';
import {
  getCachedPublicGalleries,
  loadPublicGalleries,
} from '../services/publicGalleries.service';
import type { PublicGallery } from '../types/gallery.types';

interface PublicGalleries {
  galleries: PublicGallery[];
  isReady: boolean;
}

export const usePublicGalleries = (): PublicGalleries => {
  const [galleries, setGalleries] = useState<PublicGallery[]>(
    () => getCachedPublicGalleries() ?? [],
  );
  const [isReady, setIsReady] = useState(() => getCachedPublicGalleries() !== null);

  useEffect(() => {
    let active = true;

    loadPublicGalleries()
      .then((items) => {
        if (!active) return;
        setGalleries(items);
        setIsReady(true);
      })
      .catch(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { galleries, isReady };
};
