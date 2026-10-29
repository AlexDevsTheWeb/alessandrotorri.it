import {
  Box,
  Container,
  Grid,
  Modal,
  Typography
} from '@mui/material';
import { collection, orderBy, query, where, type Query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import type { IImage } from '../types/image.types';

const CollectionPage: React.FC = () => {
  const { collectionName } = useParams<{ collectionName: string }>();
  const [snapshot, loading, error] = useCollection(
    query(
      collection(db, 'images'),
      where('collection', '==', collectionName),
      where('isVisible', '==', true),
      orderBy('order')
    ) as Query<IImage>
  );
  const images = useMemo(
    () => snapshot?.docs.map((document) => ({ ...document.data(), id: document.id })) ?? [],
    [snapshot]
  );

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpen = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
        {collectionName}
      </Typography>
      {loading && <Typography align="center">Loading images...</Typography>}
      {error && <Typography color="error" align="center">Error: {error.message}</Typography>}
      {images && (
        <Grid container spacing={4}>
          {images.map((image, index) => (
            <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleOpen(image.url)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
                    '& img': {
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    '&:hover img': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <img src={image.url} alt={image.name} />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedImage && <img src={selectedImage} alt="Enlarged view" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />}
        </Box>
      </Modal>
    </Container>
  );
};

export default CollectionPage;
