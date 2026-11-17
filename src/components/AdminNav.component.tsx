import { Button, Stack } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { AdminSection } from '../types/gallery.types';

interface AdminNavProps {
  onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLogout }) => {
  const { pathname } = useLocation();
  const section: AdminSection = pathname.startsWith('/admin/images') ? 'images' : 'galleries';

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button
        component={RouterLink}
        to="/admin"
        nativeButton={false}
        size="small"
        variant={section === 'galleries' ? 'contained' : 'text'}
      >
        Gallerie
      </Button>
      <Button
        component={RouterLink}
        to="/admin/images"
        nativeButton={false}
        size="small"
        variant={section === 'images' ? 'contained' : 'text'}
      >
        Immagini
      </Button>
      <Button component={RouterLink} to="/gallery" nativeButton={false} size="small">
        Vedi sito
      </Button>
      <Button size="small" onClick={onLogout}>
        Esci
      </Button>
    </Stack>
  );
};

export default AdminNav;
