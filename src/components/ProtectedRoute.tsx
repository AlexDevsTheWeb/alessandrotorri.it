import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageLoader from './PageLoader.component';

const ProtectedRoute: React.FC = () => {
  const { user, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return <PageLoader />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
