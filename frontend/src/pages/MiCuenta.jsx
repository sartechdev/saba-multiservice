import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { QuoteStatusCard } from '../components/shared/QuoteStatusCard';
import '../styles/MiCuenta.css';

export default function MiCuenta() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState(null);

  // Estados de edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/ingresar');
      return;
    }

    if (profile?.role === 'admin') {
      navigate('/admin');
      return;
    }

    // Inicializamos datos de perfil
    setEditName(user.user_metadata?.full_name || '');
    setEditPhone(user.user_metadata?.phone || '');

    fetchUserQuotes();
  }, [user, profile, navigate]);

  const fetchUserQuotes = async () => {
    if (!user?.id) return;
    setLoadingQuotes(true);
    setErrorQuotes(null);

    try {
      // NUNCA solicitamos admin_notes (privadas del taller). Seleccionamos solo las columnas requeridas y la respuesta pública.
      const { data, error } = await supabase
        .from('quotes')
        .select('id, appliance_type, brand, issue_description, status, admin_response, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setQuotes(data || []);
    } catch (err) {
      console.error('Error al cargar consultas del usuario:', err);
      setErrorQuotes('No pudimos cargar tu historial de consultas en este momento.');
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editName,
          phone: editPhone
        }
      });

      if (error) throw error;
      setIsEditing(false);
    } catch (err) {
      console.error('Error guardando perfil:', err);
      alert('Ocurrió un error al actualizar tus datos de perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const fullName = user.user_metadata?.full_name || 'Usuario Saba';
  const phone = user.user_metadata?.phone || 'No registrado';
  const email = user.email || '';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="account-landing-wrapper">
      <Helmet>
        <title>Mi Cuenta y Estado de Consultas | Saba Multiservice</title>
      </Helmet>

      <div className="container">
        <div className="account-header">
          <span className="account-eyebrow">Portal de Clientes Saba</span>
          <h1 className="account-title">Hola, {fullName} 👋</h1>
        </div>

        <div className="account-main-grid">
          {/* Columna Izquierda: Tarjeta de Perfil del Cliente */}
          <div className="account-profile-card">
            <div className="profile-avatar-row">
              <div className="profile-avatar">{initial}</div>
              <div className="profile-identity">
                <h3>{fullName}</h3>
                <span>Cliente Registrado</span>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-info-list" style={{ gap: '14px' }}>
                <div className="profile-info-item">
                  <label className="profile-info-label">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="auth-input"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
                <div className="profile-info-item">
                  <label className="profile-info-label">Teléfono o WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="auth-input"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="submit" disabled={savingProfile} className="profile-save-btn">
                    {savingProfile ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="profile-edit-btn"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-label">Correo Electrónico</span>
                  <span className="profile-info-value">{email}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Teléfono de Contacto</span>
                  <span className="profile-info-value">{phone}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="profile-edit-btn"
                  style={{ marginTop: '8px' }}
                >
                  ✏️ Editar mis datos personales
                </button>
              </div>
            )}

            <button type="button" onClick={handleLogout} className="account-logout-btn">
              🚪 Cerrar sesión
            </button>
          </div>

          {/* Columna Derecha: Listado de Consultas y Presupuestos */}
          <div className="account-quotes-section">
            <div className="quotes-header">
              <h2>Mis Consultas Registradas</h2>
              <span className="quotes-count-badge">
                {quotes.length} {quotes.length === 1 ? 'consulta' : 'consultas'}
              </span>
            </div>

            {loadingQuotes ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
                ⏳ Cargando tu historial de consultas...
              </div>
            ) : errorQuotes ? (
              <div className="auth-error-box">
                <span>⚠️</span>
                <span>{errorQuotes}</span>
              </div>
            ) : quotes.length === 0 ? (
              <motion.div
                className="quotes-empty-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span className="empty-icon">📋</span>
                <h3 className="empty-title">No tenés consultas o presupuestos registrados aún</h3>
                <p className="empty-desc">
                  Si ya nos contactaste al mostrador o mandaste un mensaje desde nuestra sección de contacto iniciada tu sesión, aquí podrás ver el estado en tiempo real.
                </p>
                <Link to="/servicio-tecnico" className="empty-cta-btn">
                  <span>Conocer cómo traer mi equipo al taller</span>
                  <span>→</span>
                </Link>
              </motion.div>
            ) : (
              <div className="quotes-list-stack">
                {quotes.map((q, idx) => (
                  <QuoteStatusCard key={q.id || idx} quote={q} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
