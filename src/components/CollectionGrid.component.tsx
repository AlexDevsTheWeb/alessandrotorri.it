import { Container, Grid } from '@mui/material';
import React from 'react';
import { COLLECTIONS, type CollectionCover as CollectionCoverData } from '../data/collections.data';
import CollectionCover from './CollectionCover.component';

interface CollectionGridProps {
  collections?: CollectionCoverData[];
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections = COLLECTIONS }) => (
  <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
    <Grid container spacing={{ xs: 1, md: 2 }}>
      {collections.map((collection, index) => (
        <Grid key={collection.slug} size={{ xs: 12, sm: collection.isFeatured ? 12 : 6 }}>
          <CollectionCover collection={collection} priority={index === 0} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default CollectionGrid;
