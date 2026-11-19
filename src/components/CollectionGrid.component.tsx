import { Box, Container, Divider, Grid } from '@mui/material';
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

const BANNER_HEIGHT = { xs: 240, sm: 320, md: 420 };

interface CollectionGridProps {
  collections?: CollectionCoverData[];
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections = COLLECTIONS }) => {
  const featured = collections.filter((collection) => collection.isFeatured);
  const rest = collections.filter((collection) => !collection.isFeatured);
  const showDivider = featured.length > 0 && rest.length > 0;
  const singleFeatured = featured.length === 1;

  const renderCollection = (
    collection: CollectionCoverData,
    index: number,
    isBanner = false,
  ) => {
    const spacing = COVER_SPACING[collection.coverSpacing ?? 'none'];
    return (
      <Grid key={collection.slug} size={{ xs: 12, sm: isBanner ? 12 : 6 }}>
        <Box
          sx={{
            p: `${spacing}px`,
            height: isBanner ? BANNER_HEIGHT : undefined,
          }}
        >
          <CollectionCover collection={collection} priority={index === 0} banner={isBanner} />
        </Box>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Grid container spacing={{ xs: 1, md: 2 }}>
        {featured.map((collection, index) =>
          renderCollection(collection, index, singleFeatured),
        )}
        {showDivider && (
          <Grid size={12}>
            <Divider
              textAlign="center"
              sx={{
                my: { xs: 2, md: 3 },
                fontSize: '0.7rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                '&::before, &::after': {
                  borderTop: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              LUOGHI
            </Divider>
          </Grid>
        )}
        {rest.map((collection, index) =>
          renderCollection(collection, featured.length + index),
        )}
      </Grid>
    </Container>
  );
};

export default CollectionGrid;
