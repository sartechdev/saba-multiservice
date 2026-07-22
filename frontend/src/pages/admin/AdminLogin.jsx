import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/Auth.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await signIn(email, password);
      if (signInError) {
        throw signInError;
      }

      // Verificamos el rol directamente en Supabase profiles para garantizar acceso
      const userId = data?.session?.user?.id || data?.user?.id;
      if (!userId) {
        throw new Error('No se pudo verificar la sesión de usuario.');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || profileData?.role !== 'admin') {
        // Desconectamos para evitar dejar la sesión normal abierta en zona admin
        await signOut();
        setError('Acceso denegado: Tu cuenta no tiene permisos de administrador para este panel. Si sos cliente de Saba Multiservice, ingresá por el acceso de clientes.');
        setLoading(false);
        return;
      }

      // Si es admin, redirigir al panel principal
      navigate('/admin');
    } catch (err) {
      console.error('Error al iniciar sesión de admin:', err);
      if (err.message?.includes('Email not confirmed')) {
        setError('Tu correo no ha sido confirmado en Supabase. Si sos el dueño, desactiva "Confirm email" en Supabase Auth -> Settings o verifica tu bandeja.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('El correo electrónico o la contraseña ingresados no coinciden con ningún usuario en Supabase.');
      } else {
        setError(err.message || 'Ocurrió un error al verificar los credenciales o al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ background: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Helmet>
        <title>Acceso Administrador | Panel Saba MS</title>
        <meta name="description" content="Acceso restringido para el personal administrativo y técnicos de Saba Multiservice." />
      </Helmet>

      <motion.div
        className="auth-card"
        style={{ borderTop: '4px solid var(--color-red-primary)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-card-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1A1A1A' }}>SABA</span>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#6B6B6B' }}>MS</span>
            <span style={{ background: 'var(--color-red-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textTransform: 'uppercase' }}>Consola Interna</span>
          </div>
          <h1 className="auth-title">Panel de Administración</h1>
          <p className="auth-subtitle">
            Ingreso de seguridad para gestión de presupuestos, órdenes de taller y catálogo de repuestos.
          </p>
        </div>

        {error && (
          <div className="auth-error-box" style={{ background: '#FFF5F5', borderColor: '#FEB2B2', color: '#9B2C2C', padding: '14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', gap: '10px' }}>
            <span>🔒</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="admin-email">Correo de administrador</label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sabamultiservice.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="admin-password">Contraseña de seguridad</label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="auth-input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn" style={{ background: 'var(--color-red-primary)', marginTop: '8px' }}>
            <span>{loading ? 'Verificando credenciales...' : 'Ingresar al Panel'}</span>
            <span>↗</span>
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #EAEAEA', paddingTop: '16px' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--color-gray-medium)', textDecoration: 'none' }}>
            ← Volver al sitio web de clientes
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
