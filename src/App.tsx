import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import GalleryPage from './pages/GalleryPage';
import CollectionPage from './pages/CollectionPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import { ThemeProvider } from '@mui/material/styles';
import { useAuthStore } from './store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { lightTheme, darkTheme } from './style/theme';
import { CssBaseline } from '@mui/material';
import SharedLayout from './layout/Shared.layout';

function App() {
  const { themeMode } = useThemeStore();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        useAuthStore.setState({ user });
      } else {
        // User is signed out.
        useAuthStore.setState({ user: null });
      }
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
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/collection/:collectionName" element={<CollectionDetailPage />} />
            {/* </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
