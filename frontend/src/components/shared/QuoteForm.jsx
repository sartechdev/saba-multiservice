import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/QuoteForm.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493425011410';

export const QuoteForm = ({ initialAppliance = '' }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      applianceType: initialAppliance || 'TV y Smart TV',
      brand: '',
      issueDescription: ''
    }
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setErrorMessage('');
    if (data.fullName?.trim().length < 2) {
      setErrorMessage('Por favor, ingresá un nombre completo con al menos 2 caracteres.');
      return;
    }
    if (data.phone?.trim().length < 6) {
      setErrorMessage('Por favor, ingresá un número de teléfono o WhatsApp válido de al menos 6 dígitos.');
      return;
    }

    setIsSubmitting(true);
    let photoUrl = null;

    try {
      // 1. Intentar subir foto a Supabase Storage si se seleccionó archivo
      if (selectedFile) {
        try {
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const filePath = `quotes/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('quote-photos')
            .upload(filePath, selectedFile);

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('quote-photos')
              .getPublicUrl(filePath);
            photoUrl = publicUrlData?.publicUrl || null;
          }
        } catch (err) {
          console.warn('[QuoteForm] No se pudo subir la foto (puede no estar configurado el bucket quote-photos):', err);
        }
      }

      // 2. Insertar solicitud en tabla quotes
      const quotePayload = {
        user_id: user ? user.id : null,
        full_name: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email ? data.email.trim() : null,
        appliance_type: data.applianceType,
        brand: data.brand ? data.brand.trim() : null,
        issue_description: data.issueDescription.trim(),
        photo_url: photoUrl,
        status: 'nuevo'
      };

      const { error: dbError } = await supabase
        .from('quotes')
        .insert([quotePayload]);

      if (dbError) {
        throw dbError;
      }

      // Éxito comprobado en DB
      setSubmittedData(data);
      setIsSuccess(true);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('[QuoteForm] Error al guardar cotización:', error);
      setSubmittedData(data);
      const msg = error.message || error.error_description || '';
      if (msg.includes('row-level security') || msg.includes('policy')) {
        setErrorMessage('No pudimos registrar la consulta por política de seguridad (verificá que el nombre tenga al menos 2 caracteres y el teléfono al menos 6 dígitos). También podes enviarnos tu consulta por WhatsApp.');
      } else {
        setErrorMessage(`No pudimos registrar tu consulta automáticamente en el servidor (${msg || 'error en base de datos'}), pero no te quedes sin respuesta. Podes enviarnos tu consulta por WhatsApp haciendo clic en el botón de abajo.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generar mensaje precompletado de WhatsApp en caso de error o alternativa
  const getWaUrl = (data) => {
    if (!data) return `https://wa.me/${WHATSAPP_NUMBER}`;
    const text = `*Hola Saba Multiservice! Solicito presupuesto:*
- *Nombre:* ${data.fullName}
- *Teléfono:* ${data.phone}
${data.email ? `- *Email:* ${data.email}\n` : ''}- *Equipo:* ${data.applianceType} ${data.brand ? `(${data.brand})` : ''}
- *Falla:* ${data.issueDescription}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="quote-form-container">
      <div className="quote-form-header">
        <h3 className="quote-form-title">Solicitar Presupuesto Sin Cargo</h3>
        <p className="quote-form-subtitle">
          Completá el formulario y nuestro equipo técnico te contactará en el día. Recordá que si el presupuesto no te convence, te devolvemos el equipo sin costo.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            className="quote-success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="quote-success-icon-wrap">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="quote-success-title">¡Recibimos tu consulta con éxito!</h4>
            <p className="quote-success-text">
              Ya registramos la solicitud para tu <strong>{submittedData?.applianceType}</strong>. Un técnico especializado revisará tu consulta y se comunicará al número <strong>{submittedData?.phone}</strong> a la brevedad.
            </p>

            <div className="quote-success-cta-box">
              {user ? (
                <>
                  <h5 className="quote-success-cta-title">Seguí el estado desde tu cuenta</h5>
                  <p className="quote-success-cta-desc">
                    Tu consulta quedó asociada a tu sesión. Podes revisar el historial y estado técnico desde tu panel privado.
                  </p>
                  <Link to="/mi-cuenta" className="quote-success-btn-secondary">
                    Ver mis consultas en Mi Cuenta →
                  </Link>
                </>
              ) : (
                <>
                  <h5 className="quote-success-cta-title">¿Querés seguir el estado de tu reparación?</h5>
                  <p className="quote-success-cta-desc">
                    Creá una cuenta gratis para poder ver el avance de tu consulta y el diagnóstico técnico cuando quieras.
                  </p>
                  <Link to="/registro" className="quote-success-btn-secondary">
                    Crear cuenta gratis ahora →
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="quote-reset-btn"
              onClick={() => setIsSuccess(false)}
            >
              Solicitar presupuesto para otro equipo
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            noValidate
          >
            {errorMessage && (
              <div className="quote-error-banner">
                <div className="quote-error-banner-title">Hubo un inconveniente en el servidor</div>
                <div className="quote-error-banner-text">{errorMessage}</div>
                <a
                  href={getWaUrl(submittedData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quote-error-wa-btn"
                >
                  Enviar consulta directamente por WhatsApp →
                </a>
              </div>
            )}

            <div className="quote-form-grid quote-form-grid-2cols">
              {/* Nombre Completo */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  <span>Nombre completo</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  placeholder="Ej: Carlos Gómez"
                  {...register('fullName', {
                    required: 'El nombre completo es obligatorio',
                    minLength: { value: 3, message: 'Ingresá al menos 3 letras' }
                  })}
                />
                {errors.fullName && (
                  <span className="form-error-msg">⚠️ {errors.fullName.message}</span>
                )}
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  <span>Teléfono / WhatsApp</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="Ej: 342 5123456"
                  {...register('phone', {
                    required: 'El teléfono es obligatorio para poder contactarte',
                    pattern: {
                      value: /^[0-9+() -]{6,20}$/,
                      message: 'Ingresá un número de teléfono válido'
                    }
                  })}
                />
                {errors.phone && (
                  <span className="form-error-msg">⚠️ {errors.phone.message}</span>
                )}
              </div>

              {/* Email (Opcional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <span>Correo electrónico</span>
                  <span className="form-label-optional">(Opcional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Ej: tuemail@correo.com"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ingresá un correo electrónico válido'
                    }
                  })}
                />
                {errors.email && (
                  <span className="form-error-msg">⚠️ {errors.email.message}</span>
                )}
              </div>

              {/* Tipo de Electrodoméstico */}
              <div className="form-group">
                <label className="form-label" htmlFor="applianceType">
                  <span>Tipo de equipo</span>
                </label>
                <select
                  id="applianceType"
                  className="form-select"
                  {...register('applianceType', { required: 'Seleccioná el tipo de equipo' })}
                >
                  <option value="TV y Smart TV">TV / Smart TV / LED</option>
                  <option value="Microondas y Hornos">Microondas / Horno Eléctrico</option>
                  <option value="Calefacción y Caloventores">Calefacción / Caloventor / Estufa</option>
                  <option value="Ventilación">Ventilador de Pie / Industrial / Techo</option>
                  <option value="Pequeños Electrodomésticos de Cocina">Pequeños Electrodomésticos de Cocina</option>
                  <option value="Audio y Electrónica">Audio / Electrónica General</option>
                  <option value="Otro Equipo">Otro (Especificar en descripción)</option>
                </select>
              </div>

              {/* Marca */}
              <div className="form-group">
                <label className="form-label" htmlFor="brand">
                  <span>Marca del equipo</span>
                  <span className="form-label-optional">(Opcional)</span>
                </label>
                <input
                  id="brand"
                  type="text"
                  className="form-input"
                  placeholder="Ej: Samsung, LG, Philips, Liliana..."
                  {...register('brand')}
                />
              </div>

              {/* Foto / Adjunto (Opcional) */}
              <div className="form-group">
                <label className="form-label">
                  <span>Foto del problema o etiqueta</span>
                  <span className="form-label-optional">(Opcional)</span>
                </label>
                <div className="file-upload-zone" onClick={() => document.getElementById('photoInput').click()}>
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    className="file-upload-input"
                    onChange={handleFileChange}
                  />
                  <div className="file-upload-label">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {selectedFile ? (
                      <span className="selected-file">📁 {selectedFile.name}</span>
                    ) : (
                      <span>Hacé clic para adjuntar una foto del equipo o etiqueta</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción de la Falla */}
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label" htmlFor="issueDescription">
                <span>Descripción detallada de la falla</span>
              </label>
              <textarea
                id="issueDescription"
                className="form-textarea"
                placeholder="Explicá brevemente qué problema tiene o qué síntoma presenta (ej: No enciende, hace ruido extraño al girar, no calienta, no responde el control remoto...)"
                {...register('issueDescription', {
                  required: 'Por favor, describí qué problema tiene el equipo',
                  minLength: { value: 10, message: 'Ingresá al menos 10 caracteres para que el técnico entienda el problema' }
                })}
              />
              {errors.issueDescription && (
                <span className="form-error-msg">⚠️ {errors.issueDescription.message}</span>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              className="quote-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm" />
                  <span>Registrando solicitud...</span>
                </>
              ) : (
                <>
                  <span>Enviar solicitud de presupuesto gratis</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
