import { useEffect, useState } from 'react';
import type { Gallery } from '../types/gallery.types';

interface PublicGalleries {
  galleries: Gallery[];
  isReady: boolean;
}

export const usePublicGalleries = (): PublicGalleries => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    import('../services/galleries.service')
      .then(({ fetchGalleries }) => fetchGalleries())
      .then((items) => {
        if (active) setGalleries(items);
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
