import { Container, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import CollectionGrid from '../components/CollectionGrid.component';
import PageLoader from '../components/PageLoader.component';
import { COLLECTIONS } from '../data/collections.data';
import { galleryToCover, sortFeaturedFirst } from '../data/galleries.mapper';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicGalleries } from '../hooks/usePublicGalleries';

const HomePage: React.FC = () => {
  const { galleries, isReady, hasRemoteGalleries } = usePublicGalleries();
  const collections = useMemo(
    () =>
      sortFeaturedFirst(
        hasRemoteGalleries ? galleries.map(galleryToCover) : COLLECTIONS,
      ),
    [galleries, hasRemoteGalleries],
  );

  usePageMeta();

  if (!isReady) return <PageLoader />;

  if (collections.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography color="text.secondary">Nessuna galleria pubblicata.</Typography>
      </Container>
    );
  }

  return <CollectionGrid collections={collections} />;
};

export default HomePage;
