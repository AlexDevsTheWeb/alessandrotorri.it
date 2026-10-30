import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import HomePage from './pages/HomePage';
import { ThemeProvider } from '@mui/material/styles';
import { useAuthStore } from './store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useThemeStore } from './store/themeStore';
import { lightTheme, darkTheme } from './style/theme';
import { CssBaseline } from '@mui/material';
import SharedLayout from './layout/Shared.layout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));

function App() {
  const { themeMode } = useThemeStore();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useAuthStore.setState({ user });
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:collectionName" element={<CollectionPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/collection/:collectionName" element={<CollectionDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
