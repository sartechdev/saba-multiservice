import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn } = useAuth();
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

      // Verificamos si tiene rol admin para mandarlo directo a su panel
      const userId = data?.session?.user?.id || data?.user?.id;
      if (userId) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profData?.role === 'admin') {
          navigate('/admin');
          return;
        }
      }

      navigate('/mi-cuenta');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      // Mensajes de error legibles en español
      if (err.message?.includes('Email not confirmed')) {
        setError('Tu correo no ha sido confirmado en Supabase. Revisá tu bandeja de entrada o pedile al administrador que desactive la confirmación obligatoria en Supabase Auth.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('El correo electrónico o la contraseña no son correctos o el usuario no existe.');
      } else {
        setError(err.message || 'No pudimos iniciar sesión. Verificá tus datos e intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Helmet>
        <title>Ingresar a Mi Cuenta | Saba Multiservice</title>
      </Helmet>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-card-header">
          <Link to="/" className="auth-card-logo">
            <span className="saba">SABA</span> MULTISERVICE
          </Link>
          <h1 className="auth-title">Iniciá Sesión</h1>
          <p className="auth-subtitle">
            Accedé a tu cuenta para hacer seguimiento del estado de tus consultas y reparaciones en curso.
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: tuemail@ejemplo.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            <span>{loading ? 'Ingresando...' : 'Ingresar a mi cuenta'}</span>
            <span>→</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>¿Aún no tenés cuenta registrada?</span>
          <Link to="/registro" className="auth-link">Registrarme ahora</Link>
        </div>
      </motion.div>
    </div>
  );
}
