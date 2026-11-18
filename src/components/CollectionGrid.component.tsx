import { Box, Container, Grid } from '@mui/material';
import React from 'react';
import { COLLECTIONS, type CollectionCover as CollectionCoverData } from '../data/collections.data';
import type { GalleryPadding } from '../types/gallery.types';
import CollectionCover from './CollectionCover.component';

const COVER_SPACING: Record<GalleryPadding, number> = {
  none: 0,
  small: 8,
  medium: 16,
  large: 24,
};

interface CollectionGridProps {
  collections?: CollectionCoverData[];
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections = COLLECTIONS }) => (
  <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
    <Grid container spacing={{ xs: 1, md: 2 }}>
      {collections.map((collection, index) => {
        const spacing = COVER_SPACING[collection.coverSpacing ?? 'none'];
        return (
          <Grid key={collection.slug} size={{ xs: 12, sm: collection.isFeatured ? 12 : 6 }}>
            <Box sx={{ p: `${spacing}px` }}>
              <CollectionCover collection={collection} priority={index === 0} />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Container>
);

export default CollectionGrid;
