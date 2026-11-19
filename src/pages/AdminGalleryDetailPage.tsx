import { Alert, Box, Button, Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import GalleryEditor from '../components/GalleryEditor.component';
import PageLoader from '../components/PageLoader.component';
import { useGalleryStore } from '../store/galleryStore';
import { useImageStore } from '../store/imageStore';
import AdminNav from '../components/AdminNav.component';
import { useAuthStore } from '../store/authStore';

const AdminGalleryDetailPage: React.FC = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const { logout } = useAuthStore();
  const galleries = useGalleryStore((state) => state.galleries);
  const status = useGalleryStore((state) => state.status);
  const error = useGalleryStore((state) => state.error);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);
  const saveGallery = useGalleryStore((state) => state.saveGallery);
  const catalog = useImageStore((state) => state.images);
  const fetchImages = useImageStore((state) => state.fetchImages);

  useEffect(() => {
    void fetchGalleries();
    void fetchImages();
  }, [fetchGalleries, fetchImages]);

  const gallery = galleries.find((item) => item.id === galleryId);

  if (!gallery) {
    if (status === 'loading' || status === 'idle') {
      return <PageLoader />;
    }

    return (
      <Container maxWidth="lg" sx={{ my: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <AdminNav onLogout={() => void logout()} />
        <Typography variant="h2" component="h1" gutterBottom>
          {status === 'error' ? 'Gallerie non disponibili' : 'Galleria non trovata'}
        </Typography>
        {status === 'error' && error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}
        <Button component={RouterLink} to="/admin" nativeButton={false} sx={{ mt: 2 }}>
          Torna alle gallerie
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 4, md: 6 } }}>
        <AdminNav onLogout={() => void logout()} />
        <Button component={RouterLink} to="/admin" nativeButton={false} size="small" sx={{ mb: 2 }}>
          ← Tutte le gallerie
        </Button>
        <GalleryEditor
          key={gallery.id}
          gallery={gallery}
          galleries={galleries}
          catalog={catalog}
          onSave={(draft) => saveGallery(gallery.id, draft)}
        />
      </Box>
    </Container>
  );
};

export default AdminGalleryDetailPage;
