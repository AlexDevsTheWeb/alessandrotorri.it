import { useEffect, useState } from 'react';
import {
  getCachedPublicGalleries,
  loadPublicGalleries,
} from '../services/publicGalleries.service';
import type { PublicGallery } from '../types/gallery.types';

interface PublicGalleries {
  galleries: PublicGallery[];
  isReady: boolean;
  hasRemoteGalleries: boolean;
}

export const usePublicGalleries = (): PublicGalleries => {
  const cached = getCachedPublicGalleries();
  const [galleries, setGalleries] = useState<PublicGallery[]>(() => cached?.galleries ?? []);
  const [hasRemoteGalleries, setHasRemoteGalleries] = useState(
    () => cached?.hasRemoteGalleries ?? false,
  );
  const [isReady, setIsReady] = useState(() => cached !== null);

  useEffect(() => {
    let active = true;

    loadPublicGalleries()
      .then((snapshot) => {
        if (!active) return;
        setGalleries(snapshot.galleries);
        setHasRemoteGalleries(snapshot.hasRemoteGalleries);
        setIsReady(true);
      })
      .catch(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { galleries, isReady, hasRemoteGalleries };
};
