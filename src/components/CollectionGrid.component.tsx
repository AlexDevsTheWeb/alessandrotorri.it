import { Container, Grid } from '@mui/material';
import React from 'react';
import { COLLECTIONS } from '../data/collections.data';
import CollectionCover from './CollectionCover.component';

const CollectionGrid: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
    <Grid container spacing={{ xs: 4, md: 6 }}>
      {COLLECTIONS.map((collection) => (
        <Grid key={collection.slug} size={{ xs: 12, sm: 6 }}>
          <CollectionCover collection={collection} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default CollectionGrid;
