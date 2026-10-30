import React from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import { usePageMeta } from '../hooks/usePageMeta';

const HomePage: React.FC = () => {
  usePageMeta();

  return <CollectionGrid />;
};

export default HomePage;
