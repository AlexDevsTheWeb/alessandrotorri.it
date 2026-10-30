import React from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import { usePageMeta } from '../hooks/usePageMeta';

const GalleryPage: React.FC = () => {
  usePageMeta({
    title: 'Gallerie — Alessandro Torri',
    description: 'Le nove collezioni di fotografia di paesaggio e lunga esposizione di Alessandro Torri.',
    path: '/gallery',
  });

  return <CollectionGrid />;
};

export default GalleryPage;
