import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import type { CollectionCover as CollectionCoverData } from '../data/collections.data';
import ProgressiveImage from './ProgressiveImage.component';

interface CollectionCoverProps {
  collection: CollectionCoverData;
}

const CollectionCover: React.FC<CollectionCoverProps> = ({ collection }) => (
  <Box
    component={Link}
    to={`/gallery/${collection.slug}`}
    aria-label={collection.title}
    sx={{
      position: 'relative',
      display: 'block',
      overflow: 'hidden',
      color: 'text.primary',
      textDecoration: 'none',
      outline: 'none',
      '&:focus-visible': {
        outline: 'none',
      },
      '&:hover .collection-cover-media': {
        filter: 'brightness(0.86)',
      },
    }}
  >
    <Box className="collection-cover-media" sx={{ transition: 'filter 0.3s ease' }}>
      <ProgressiveImage
        src={collection.cover}
        placeholder={collection.placeholder}
        alt={collection.title}
        ratio="16/9"
      />
    </Box>
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.28) 38%, rgba(0, 0, 0, 0) 68%)',
        pointerEvents: 'none',
      }}
    />
    <Typography
      className="collection-cover-title"
      component="h2"
      variant="h6"
      sx={{
        position: 'absolute',
        right: 16,
        bottom: 14,
        left: 16,
        color: '#ffffff',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadow: '0 1px 8px rgba(0, 0, 0, 0.35)',
      }}
    >
      {collection.title}
    </Typography>
  </Box>
);

export default CollectionCover;
