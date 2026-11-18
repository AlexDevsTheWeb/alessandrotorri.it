import React, { useMemo } from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import PageLoader from '../components/PageLoader.component';
import { COLLECTIONS } from '../data/collections.data';
import { galleryToCover, sortFeaturedFirst } from '../data/galleries.mapper';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicGalleries } from '../hooks/usePublicGalleries';

const GalleryPage: React.FC = () => {
  const { galleries, isReady } = usePublicGalleries();
  const collections = useMemo(
    () =>
      sortFeaturedFirst(galleries.length > 0 ? galleries.map(galleryToCover) : COLLECTIONS),
    [galleries],
  );

  usePageMeta({
    title: 'Gallerie — Alessandro Torri',
    description: 'Le nove collezioni di fotografia di paesaggio e lunga esposizione di Alessandro Torri.',
    path: '/gallery',
  });

  if (!isReady) return <PageLoader />;

  return <CollectionGrid collections={collections} />;
};

export default GalleryPage;
