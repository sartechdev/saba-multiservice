import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family-base)', color: 'var(--color-black)' }}>
        <h3>Cargando sesión...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/ingresar" replace />;
  }

  return children;
};
