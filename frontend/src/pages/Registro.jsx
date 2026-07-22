import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Registro() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden. Por favor, verificá que sean iguales.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los Términos y Condiciones y las Políticas de Privacidad para continuar.');
      setLoading(false);
      return;
    }

    try {
      const cleanFirstName = firstName.trim();
      const cleanLastName = lastName.trim();
      const cleanFullName = `${cleanFirstName} ${cleanLastName}`.trim();

      const { error: signUpError } = await signUp(email, password, {
        data: {
          first_name: cleanFirstName,
          last_name: cleanLastName,
          full_name: cleanFullName,
          phone: phone.trim(),
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      navigate('/mi-cuenta');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      if (err.message?.includes('User already registered') || err.status === 422) {
        setError('Este correo electrónico ya se encuentra registrado en Saba.');
      } else {
        setError('Ocurrió un error al crear la cuenta. Por favor, intentá nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Helmet>
        <title>Registro de Cuenta | Saba Multiservice</title>
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
          <h1 className="auth-title">Creá tu Cuenta</h1>
          <p className="auth-subtitle">
            Registrate para hacer seguimiento del historial y estado de tus consultas técnicas.
          </p>
        </div>

        <div className="auth-optional-notice">
          ℹ️ <strong>Beneficio del registro:</strong> Crear una cuenta te permite hacer seguimiento online del historial y estado de tus consultas y reparaciones. Recordá que el registro es 100% opcional y voluntario: no necesitás una cuenta para concurrir con tu electrodoméstico a nuestro mostrador ni para pedir presupuesto presencial.
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-row">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="firstName">Nombre *</label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ej: Juan"
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="lastName">Apellido *</label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej: Pérez"
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="phone">Teléfono o WhatsApp *</label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 3425123456"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Correo electrónico *</label>
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

          <div className="auth-form-row">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password">Contraseña *</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la contraseña"
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-checkbox-group">
            <input
              id="acceptTerms"
              type="checkbox"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="acceptTerms">
              Declaro que he leído y acepto los{' '}
              <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer">
                Términos y Condiciones
              </Link>{' '}
              y las{' '}
              <Link to="/politicas-de-privacidad" target="_blank" rel="noopener noreferrer">
                Políticas de Privacidad
              </Link>{' '}
              de Saba Multiservice.
            </label>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            <span>{loading ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
            <span>→</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>¿Ya tenés una cuenta en Saba?</span>
          <Link to="/ingresar" className="auth-link">Iniciá sesión</Link>
        </div>
      </motion.div>
    </div>
  );
}
