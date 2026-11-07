import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import type { CollectionCover as CollectionCoverData } from '../data/collections.data';
import ProgressiveImage from './ProgressiveImage.component';

interface CollectionCoverProps {
  collection: CollectionCoverData;
  priority?: boolean;
}

const CollectionCover: React.FC<CollectionCoverProps> = ({ collection, priority = false }) => (
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
      cursor: 'pointer',
      outline: 'none',
      '&:focus-visible': {
        outline: 'none',
      },
      '&:hover .collection-cover-media, &:focus-visible .collection-cover-media': {
        filter: 'brightness(0.86)',
      },
      '&:hover .collection-cover-overlay, &:focus-visible .collection-cover-overlay': {
        opacity: 1,
      },
      '&:hover .collection-cover-title, &:focus-visible .collection-cover-title': {
        opacity: 1,
        transform: 'translate(-50%, -50%)',
      },
    }}
  >
    <Box className="collection-cover-media" sx={{ transition: 'filter 0.3s ease' }}>
      <ProgressiveImage
        src={collection.cover}
        placeholder={collection.placeholder}
        alt={collection.title}
        ratio="4/3"
        priority={priority}
      />
    </Box>
    <Box
      className="collection-cover-overlay"
      sx={{
        position: 'absolute',
        inset: 0,
        opacity: 0,
        background:
          'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 55%, rgba(0, 0, 0, 0.45) 100%)',
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }}
    />
    <Typography
      className="collection-cover-title"
      component="h2"
      variant="h6"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'calc(100% - 32px)',
        color: '#ffffff',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadow: '0 1px 8px rgba(0, 0, 0, 0.35)',
        opacity: 0,
        transform: 'translate(-50%, calc(-50% + 14px))',
        transition: 'transform 0.35s ease, opacity 0.35s ease',
        pointerEvents: 'none',
      }}
    >
      {collection.title}
    </Typography>
  </Box>
);

export default CollectionCover;
