import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/motionVariants';
import { useAuth } from '../context/AuthContext';

import { supabase } from '../lib/supabaseClient';
import { MapEmbed } from '../components/shared/MapEmbed';
import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import '../styles/Contacto.css';

export default function Contacto() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [waModalConfig, setWaModalConfig] = useState({ isOpen: false, title: '', message: '' });

  const openWaModal = (title, message) => {
    setWaModalConfig({ isOpen: true, title, message });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.fullName.trim().length < 2) {
      setError('Por favor, ingresá un nombre completo con al menos 2 caracteres.');
      return;
    }

    if (formData.phone.trim().length < 6) {
      setError('Por favor, ingresá un número de teléfono o WhatsApp válido de al menos 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('quotes').insert([
        {
          user_id: user ? user.id : null,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim() || 'No especificado',
          email: formData.email ? formData.email.trim() : null,
          appliance_type: 'Consulta general',
          brand: 'Atención al Cliente',
          issue_description: formData.message.trim(),
          status: 'nuevo'
        }
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setFormData({ fullName: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Error enviando consulta de contacto:', err);
      const msg = err.message || err.error_description || '';
      if (msg.includes('row-level security') || msg.includes('policy')) {
        setError('No se pudo registrar la consulta por política de seguridad (verificá que el nombre tenga al menos 2 caracteres y el teléfono al menos 6 dígitos). También podes enviarnos tu consulta por WhatsApp.');
      } else {
        setError(`Ocurrió un error al enviar tu consulta (${msg || 'error en servidor'}). Por favor, intentá nuevamente o comunicate directamente por WhatsApp.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-landing-wrapper">
      <Helmet>
        <title>Contacto, Ubicación y Consultas Generales | Saba Multiservice</title>
        <meta
          name="description"
          content="Comunicate con Saba Multiservice. Local físico en Catamarca 3420, Santa Fe. Horarios de atención de mostrador, mapa y formulario de consultas rápidas."
        />
        <link rel="canonical" href="https://sabamultiservice.com.ar/contacto" />
        <meta property="og:title" content="Contacto y Ubicación en Santa Fe | Saba Multiservice" />
        <meta property="og:description" content="Atención de mostrador en Catamarca 3420, Santa Fe Capital. Consultas por WhatsApp y formulario online." />
        <meta property="og:url" content="https://sabamultiservice.com.ar/contacto" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sabamultiservice.com.ar/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contacto y Ubicación - Saba Multiservice",
            "url": "https://sabamultiservice.com.ar/contacto",
            "description": "Contacto directo, teléfono, mapa y horarios de atención de Saba Multiservice en Santa Fe."
          })}
        </script>
      </Helmet>

      {/* ── 1. SECCIÓN SUPERIOR: FORMULARIO PRINCIPAL Y MAPA EN VIVO ── */}
      <section className="contact-top-section">
        <div className="container">
          <div className="contact-top-header">
            <h1 className="contact-main-title">Escribinos tu consulta o acercate a nuestro local</h1>
          </div>

          <div className="contact-top-grid">
            {/* Columna Izquierda: Formulario */}
            <motion.div
              className="top-form-container"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >

              <h2 className="contact-form-title">Envíanos un mensaje rápido</h2>
              <p className="contact-form-subtitle">
                ¿Dudas administrativas, consultas sobre repuestos o inquietudes técnicas? Completá el formulario y nuestro equipo te responderá a la brevedad.
              </p>

              <div className="contact-tracking-notice">
                ℹ️ <strong>Importante:</strong> La respuesta se va a brindar por los medios de comunicación ingresados (teléfono/WhatsApp o email), pero para hacer un <strong>seguimiento detallado y online</strong> de tu consulta es recomendable <Link to="/registro">crear una cuenta</Link>.
              </div>

              {success ? (
                <div className="contact-success-banner">
                  <h4>¡Consulta enviada con éxito! 🎉</h4>
                  <p>
                    Recibimos tu mensaje en nuestra central de atención. Un asesor de mostrador se comunicará con vos muy pronto.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="contact-btn-action-back"
                  >
                    ← Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="general-contact-form">
                  {error && (
                    <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                      {error}
                    </div>
                  )}

                  <div className="form-group-full">
                    <label className="form-label">Nombre completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ej: Juan Pérez"
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group-full">
                      <label className="form-label">Teléfono o WhatsApp *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ej: 342 5123456"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ej: juan@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">Tu mensaje o inquietud *</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribí acá el detalle de tu consulta general..."
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="contact-submit-btn">
                    <span>{loading ? 'Enviando consulta...' : 'Enviar mensaje'}</span>
                    <span>→</span>
                  </button>
                </form>
              )}
            </motion.div>

            {/* Columna Derecha: Mapa en vivo + WhatsApp */}
            <motion.div
              className="top-map-container"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >

              <div className="map-frame">
                <MapEmbed height="100%" />
              </div>
              <button
                type="button"
                onClick={() => openWaModal('Atención en Mostrador', 'Hola Saba Multiservice! Tengo una consulta general sobre sus servicios...')}
                className="top-wa-btn"
                style={{ cursor: 'pointer', border: 'none', width: '100%' }}
              >
                <span>💬 Chatear con mostrador por WhatsApp</span>
                <span>↗</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. DATOS DEL LOCAL Y CANALES POR DEPARTAMENTO ── */}
      <section className="contact-compact-section">
        <div className="container">
          <div className="compact-section-header">
            <h2>Información del local y departamentos</h2>
            <p>Todo lo que necesitás saber para traer tu equipo o comunicarte de forma directa</p>
          </div>

          <div className="info-compact-grid">
            <div className="compact-card">
              <span className="compact-icon">🏢</span>
              <div>
                <h4>Dirección del Taller</h4>
                <p>
                  <strong>Catamarca 3420</strong>, Santa Fe Capital.<br />
                  Estacionamiento en puerta para carga ágil de equipos.
                </p>
                <a
                  href="https://maps.app.goo.gl/k3M4vkiZHkRP2pdWA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="compact-link"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            <div className="compact-card">
              <span className="compact-icon">🕒</span>
              <div>
                <h4>Horarios de Mostrador</h4>
                <p>
                  <strong>Lunes a Viernes:</strong> 09:00 a 18:00 hs (corrido)<br />
                  <strong>Sábados:</strong> 09:00 a 12:00 hs
                </p>
              </div>
            </div>

            <div className="compact-card">
              <span className="compact-icon">📱</span>
              <div>
                <h4>Teléfono y WhatsApp</h4>
                <p>
                  <strong>Contacto:</strong> <a href="tel:+5493425011410">+54 9 342 501-1410</a>
                </p>
              </div>
            </div>
          </div>

          {/* Canales Específicos por WhatsApp */}
          <div className="channels-compact-row">
            <button
              type="button"
              onClick={() => openWaModal('Servicio Técnico', 'Hola Saba Multiservice! Quería consultar sobre el ingreso de un electrodoméstico para servicio técnico...')}
              className="channel-chip-btn"
              style={{ cursor: 'pointer', border: 'none', textStyle: 'inherit' }}
            >
              <span>🛠️</span>
              <div>
                <strong>Servicio Técnico</strong>
                <span>Ingreso presencial de equipos</span>
              </div>
              <span className="chip-arrow">↗</span>
            </button>

            <button
              type="button"
              onClick={() => openWaModal('Repuestos & Catálogo', 'Hola Saba Multiservice! Estoy buscando un repuesto o accesorio específico del catálogo...')}
              className="channel-chip-btn"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              <span>📦</span>
              <div>
                <strong>Repuestos & Catálogo</strong>
                <span>Consultar stock en mostrador</span>
              </div>
              <span className="chip-arrow">↗</span>
            </button>

            <button
              type="button"
              onClick={() => openWaModal('Consultas Administrativas', 'Hola Saba Multiservice! Tengo una consulta administrativa sobre mi pedido o servicio...')}
              className="channel-chip-btn"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              <span>📋</span>
              <div>
                <strong>Consultas Administrativas</strong>
                <span>Atención e información general</span>
              </div>
              <span className="chip-arrow">↗</span>
            </button>
          </div>
        </div>
      </section>

      <WhatsAppModal
        isOpen={waModalConfig.isOpen}
        onClose={() => setWaModalConfig({ ...waModalConfig, isOpen: false })}
        title={waModalConfig.title}
        customMessage={waModalConfig.message}
      />
    </div>
  );
}

