import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family-base)', color: 'var(--color-black)' }}>
        <h3>Cargando panel de administración...</h3>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/admin/ingresar" replace />;
  }

  return children;
};
