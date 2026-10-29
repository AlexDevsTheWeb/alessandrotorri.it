import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import type { CollectionCover as CollectionCoverData } from '../data/collections.data';
import ProgressiveImage from './ProgressiveImage.component';

interface CollectionCoverProps {
  collection: CollectionCoverData;
  index: number;
}

const CollectionCover: React.FC<CollectionCoverProps> = ({ collection, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.6 + index * 0.08 }}
  >
    <Box
      component={Link}
      to={`/gallery/${collection.slug}`}
      aria-label={collection.title}
      sx={{
        display: 'block',
        color: 'text.primary',
        textDecoration: 'none',
        '&:hover .collection-cover-media': {
          filter: 'brightness(0.65)',
          transform: 'scale(1.06)',
        },
        '&:hover .collection-cover-title': {
          opacity: 0.6,
        },
      }}
    >
      <Box
        className="collection-cover-media"
        sx={{
          transition: 'transform 0.6s ease, filter 0.6s ease',
          willChange: 'transform, filter',
        }}
      >
        <ProgressiveImage
          src={collection.cover}
          placeholder={collection.placeholder}
          alt={collection.title}
          ratio="16/9"
        />
      </Box>
      <Typography
        className="collection-cover-title"
        component="h2"
        variant="h6"
        align="center"
        sx={{
          mt: 2,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          transition: 'opacity 0.3s ease',
        }}
      >
        {collection.title}
      </Typography>
    </Box>
  </motion.div>
);

export default CollectionCover;
