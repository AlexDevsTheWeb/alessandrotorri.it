import React, { useMemo } from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import { COLLECTIONS } from '../data/collections.data';
import { galleryToCover, sortFeaturedFirst } from '../data/galleries.mapper';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicGalleries } from '../hooks/usePublicGalleries';

const HomePage: React.FC = () => {
  const { galleries } = usePublicGalleries();
  const collections = useMemo(
    () =>
      sortFeaturedFirst(galleries.length > 0 ? galleries.map(galleryToCover) : COLLECTIONS),
    [galleries],
  );

  usePageMeta();

  return <CollectionGrid collections={collections} />;
};

export default HomePage;
