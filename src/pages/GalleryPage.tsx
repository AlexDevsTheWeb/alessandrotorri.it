import React, { useMemo } from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import { COLLECTIONS } from '../data/collections.data';
import { galleryToCover } from '../data/galleries.mapper';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicGalleries } from '../hooks/usePublicGalleries';

const GalleryPage: React.FC = () => {
  const { galleries } = usePublicGalleries();
  const collections = useMemo(
    () => (galleries.length > 0 ? galleries.map(galleryToCover) : COLLECTIONS),
    [galleries],
  );

  usePageMeta({
    title: 'Gallerie — Alessandro Torri',
    description: 'Le nove collezioni di fotografia di paesaggio e lunga esposizione di Alessandro Torri.',
    path: '/gallery',
  });

  return <CollectionGrid collections={collections} />;
};

export default GalleryPage;
