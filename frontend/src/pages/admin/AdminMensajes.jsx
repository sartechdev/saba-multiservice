import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';
import '../../styles/AdminMensajes.css';

export default function AdminMensajes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal de Detalle / Edición
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editStatus, setEditStatus] = useState('sin_responder');
  const [editNotes, setEditNotes] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Bloquear scroll del fondo y escuchar tecla Escape cuando el modal esté abierto
  useEffect(() => {
    if (selectedQuote) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedQuote(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedQuote]);

  // Auto-ocultar mensaje de éxito después de 4 segundos
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setQuotes(data || []);
    } catch (err) {
      console.error('Error al obtener consultas en el panel admin:', err);
      setError('No pudimos cargar el listado de consultas de la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (quote) => {
    setSelectedQuote(quote);
    setEditStatus(quote.status === 'respondido' ? 'respondido' : 'sin_responder');
    setEditNotes(quote.admin_notes || '');
    setEditResponse(quote.admin_response || '');
    setSuccessMsg(null);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: updErr } = await supabase
        .from('quotes')
        .update({
          status: editStatus,
          admin_notes: editNotes.trim() || null,
          admin_response: editResponse.trim() || null
        })
        .eq('id', selectedQuote.id);

      if (updErr) throw updErr;

      setSuccessMsg(`Estado de la consulta #${selectedQuote.id} actualizado.`);
      setSelectedQuote(null);
      fetchQuotes();
    } catch (err) {
      console.error('Error actualizando consulta:', err);
      alert('Error al guardar los cambios de la consulta.');
    } finally {
      setSaving(false);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const isSinResponder = q.status !== 'respondido';
    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'sin_responder' && isSinResponder) ||
      (statusFilter === 'respondido' && q.status === 'respondido');
    const searchLow = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchLow ||
      (q.full_name && q.full_name.toLowerCase().includes(searchLow)) ||
      (q.phone && q.phone.toLowerCase().includes(searchLow)) ||
      (q.email && q.email.toLowerCase().includes(searchLow));
    return matchesStatus && matchesSearch;
  });

  // Generador de mensaje WhatsApp precompletado
  const getWhatsAppLink = (quote) => {
    if (!quote.phone || quote.phone === 'No especificado') return null;
    const cleanPhone = quote.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return null;

    const name = quote.full_name?.split(' ')[0] || 'Cliente';
    
    let baseMsg = `Hola ${name}! Te contactamos desde el taller de Saba Multiservice en relación a tu consulta ingresada en nuestra web.\n\n`;
    if (quote.issue_description) {
      baseMsg += `Nos dejaste esta consulta:\n_"${quote.issue_description}"_\n\n`;
    }
    baseMsg += `Te comentamos que...`;

    const msg = encodeURIComponent(baseMsg);
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  return (
    <motion.div
      className="admin-console-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Bandeja de Consultas | Saba Multiservice</title>
      </Helmet>

      {/* Cabecera superior */}
      <div className="admin-page-header">
        <div>
          <h1>Bandeja de Consultas y Presupuestos</h1>
          <p>Supervisá los mensajes entrantes, coordiná por WhatsApp y cargá diagnósticos internos.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchQuotes} disabled={loading} className="admin-btn-secondary">
            <span>🔄</span>
            <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-msg-alert-error">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="admin-msg-alert-success">
          ✅ {successMsg}
        </div>
      )}

      {/* ── FILTROS POR ESTADO Y BÚSQUEDA ── */}
      <div className="admin-filter-bar">
        <div className="admin-status-tabs">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`admin-status-tab ${statusFilter === 'todos' ? 'active' : ''}`}
          >
            Todas ({quotes.length})
          </button>
          <button
            onClick={() => setStatusFilter('sin_responder')}
            className={`admin-status-tab ${statusFilter === 'sin_responder' ? 'active admin-msg-status-filter-nuevo' : ''}`}
          >
            🚨 Sin responder ({quotes.filter(q => q.status !== 'respondido').length})
          </button>
          <button
            onClick={() => setStatusFilter('respondido')}
            className={`admin-status-tab ${statusFilter === 'respondido' ? 'active' : ''}`}
          >
            💬 Respondidas ({quotes.filter(q => q.status === 'respondido').length})
          </button>
        </div>

        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar cliente, teléfono o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── TABLA DE CONSULTAS ── */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-msg-table-loading">
            Cargando bandeja de entrada...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="admin-msg-table-empty">
            No se encontraron consultas o presupuestos para este filtro.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Cliente y Datos</th>
                <th>Estado</th>
                <th>Notas Privadas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => {
                const dateFormatted = new Date(quote.created_at).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const isSinResponder = quote.status !== 'respondido';
                const waUrl = getWhatsAppLink(quote);

                return (
                  <tr key={quote.id} className={isSinResponder ? 'admin-row-nuevo' : ''}>
                    <td data-label="Fecha Ingreso" className="admin-msg-date-cell">
                      <span className="admin-msg-date">{dateFormatted}</span>
                      {isSinResponder && <span className="admin-msg-badge-new">¡NUEVO!</span>}
                    </td>
                    <td data-label="Cliente y Datos">
                      <div className={`admin-msg-client-name ${isSinResponder ? 'is-new' : 'not-new'}`}>
                        {quote.full_name || 'Sin nombre ingresado'}
                      </div>
                      <div className="admin-msg-contact-info">
                        <div className="admin-msg-contact-line">
                          Registrado: <strong className={quote.user_id ? 'admin-msg-reg-yes' : 'admin-msg-reg-no'}>{quote.user_id ? 'SI' : 'NO'}</strong>
                        </div>
                        {quote.phone && quote.phone !== 'No especificado' && (
                          <div className="admin-msg-contact-line">
                            Celular: <strong>{quote.phone}</strong>
                          </div>
                        )}
                        {quote.email && (
                          <div className="admin-msg-contact-line">
                            Correo: <strong>{quote.email}</strong>
                          </div>
                        )}
                      </div>
                    </td>
                    <td data-label="Estado">
                      <span className={`admin-badge-status ${isSinResponder ? 'admin-badge-sin_responder' : 'admin-badge-respondido'}`}>
                        {isSinResponder ? 'Sin responder' : 'Respondido'}
                      </span>
                    </td>
                    <td data-label="Notas Privadas">
                      {quote.admin_notes ? (
                        <div className="admin-msg-notes-private">
                          🔒 {quote.admin_notes}
                        </div>
                      ) : (
                        <span className="admin-msg-notes-empty">Sin notas</span>
                      )}
                    </td>
                    <td data-label="Acciones">
                      <div className="admin-msg-actions">
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-secondary admin-msg-btn-wa"
                            title="Responder rápido al cliente por WhatsApp"
                          >
                            WhatsApp
                          </a>
                        )}
                        <button onClick={() => openDetailModal(quote)} className="admin-btn-primary admin-msg-btn-manage">
                          Gestionar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL DETALLE Y GESTIÓN DE CONSULTA ── */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="admin-modal-overlay" onClick={() => setSelectedQuote(null)}>
            <motion.div
              className="admin-modal-content admin-msg-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header admin-msg-modal-header">
                <div>
                  <span className="admin-msg-modal-title">
                    Consulta de: {selectedQuote.full_name || 'Cliente sin nombre'}
                  </span>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="admin-modal-close">✖</button>
              </div>

              <form onSubmit={handleSaveChanges}>
                <div className="admin-modal-body">
                  {/* Datos Clave de Contacto */}
                  <div className="admin-msg-modal-grid">
                    <div>
                      <div className="admin-msg-modal-label">Cliente</div>
                      <div className="admin-msg-modal-value">{selectedQuote.full_name || 'Sin nombre'}</div>
                      <div className="admin-msg-contact-line">
                        Registrado: <strong className={selectedQuote.user_id ? 'admin-msg-reg-yes' : 'admin-msg-reg-no'}>{selectedQuote.user_id ? 'SI' : 'NO'}</strong>
                      </div>
                    </div>
                    <div>
                      <div className="admin-msg-modal-label">Celular</div>
                      <div className="admin-msg-modal-value highlight">
                        {selectedQuote.phone || 'No especificado'}
                      </div>
                    </div>
                    {selectedQuote.email && (
                      <div className="admin-msg-modal-grid-span">
                        <div className="admin-msg-modal-label">Correo</div>
                        <div className="admin-msg-modal-value-sm">{selectedQuote.email}</div>
                      </div>
                    )}
                  </div>

                  {/* Detalle del Problema o Inquietud */}
                  <div className="admin-msg-modal-desc-container">
                    <label className="admin-msg-modal-desc-label">Detalle reportado por el cliente:</label>
                    <div className="admin-msg-modal-desc-box">
                      {selectedQuote.issue_description || 'No se ingresó una descripción detallada.'}
                    </div>
                  </div>



                  <hr className="admin-msg-modal-hr" />

                  {/* Selector de Estado Operativo */}
                  <div className="admin-form-group">
                    <label htmlFor="quote-status" className="admin-msg-modal-select-label">
                      Actualizar Estado del Mensaje *
                    </label>
                    <select
                      id="quote-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="admin-form-select admin-msg-modal-select"
                    >
                      <option value="sin_responder">🚨 Sin responder (Pendiente de respuesta)</option>
                      <option value="respondido">💬 Respondido (Respondido vía WhatsApp o respuesta web)</option>
                    </select>
                    <small className="admin-msg-modal-select-tip">
                      Tip: Una vez que te comuniques con el cliente o le envíes el presupuesto (vía WhatsApp o mensaje web), marcá el estado como "Respondido".
                    </small>
                  </div>

                  {/* Respuesta para el Cliente */}
                  <div className="admin-notes-box admin-msg-notes-box-public">
                    <div className="admin-notes-header admin-msg-notes-header-public">
                      <span>✉️</span>
                      <span>Respuesta Oficial para el Cliente (Visible en "Mi Cuenta")</span>
                    </div>
                    <textarea
                      value={editResponse}
                      onChange={(e) => setEditResponse(e.target.value)}
                      placeholder="Escribí acá el diagnóstico, costo de reparación, repuesto disponible o respuesta que el cliente leerá en su perfil..."
                      className="admin-notes-textarea admin-msg-textarea-public"
                    />
                    <div className="admin-msg-notes-tip-public">
                      Si el usuario tiene una cuenta registrada, podrá ver este texto en la tarjeta de su consulta dentro de la sección "Mi Cuenta".
                    </div>
                  </div>

                  {/* Notas Privadas del Taller */}
                  <div className="admin-notes-box">
                    <div className="admin-notes-header">
                      <span>🔒</span>
                      <span>Notas Internas del Taller — Privadas (No visibles para el cliente)</span>
                    </div>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Escribí acá el diagnóstico técnico, costo de mano de obra calculado, número de repuesto necesario, o acuerdos hablados en mostrador/celular con el cliente..."
                      className="admin-notes-textarea"
                    />
                    <div className="admin-msg-notes-tip-private">
                      Este campo está protegido por las políticas del servidor y nunca se muestra al cliente en "Mi Cuenta".
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer admin-msg-modal-footer">
                  {getWhatsAppLink(selectedQuote) ? (
                    <a
                      href={getWhatsAppLink(selectedQuote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-secondary admin-msg-btn-wa-modal"
                    >
                      💬 Chatear al WhatsApp del Cliente
                    </a>
                  ) : (
                    <span />
                  )}

                  <div className="admin-msg-btn-group">
                    <button type="button" onClick={() => setSelectedQuote(null)} className="admin-btn-secondary">
                      Cancelar
                    </button>
                    <button type="submit" disabled={saving} className="admin-btn-primary">
                      <span>{saving ? 'Guardando...' : 'Guardar y Actualizar'}</span>
                      <span>💾</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
