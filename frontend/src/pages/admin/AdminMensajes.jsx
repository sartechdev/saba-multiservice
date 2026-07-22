import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';

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
  const [editStatus, setEditStatus] = useState('nuevo');
  const [editNotes, setEditNotes] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

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
    setEditStatus(quote.status || 'nuevo');
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
    const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
    const searchLow = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchLow ||
      (q.full_name && q.full_name.toLowerCase().includes(searchLow)) ||
      (q.phone && q.phone.toLowerCase().includes(searchLow)) ||
      (q.email && q.email.toLowerCase().includes(searchLow)) ||
      (q.appliance_type && q.appliance_type.toLowerCase().includes(searchLow));
    return matchesStatus && matchesSearch;
  });

  // Generador de mensaje WhatsApp precompletado
  const getWhatsAppLink = (quote) => {
    if (!quote.phone || quote.phone === 'No especificado') return null;
    const cleanPhone = quote.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return null;

    const name = quote.full_name?.split(' ')[0] || 'Cliente';
    const type = quote.appliance_type || 'consulta general';
    const msg = encodeURIComponent(`Hola ${name}! Te contactamos desde el taller de Saba Multiservice en relación a tu ${type} ingresada en nuestra web. Te comentamos que...`);
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
        <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#9B2C2C', padding: '14px', borderRadius: '8px', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#1B5E20', padding: '14px', borderRadius: '8px', fontWeight: 600 }}>
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
            onClick={() => setStatusFilter('nuevo')}
            className={`admin-status-tab ${statusFilter === 'nuevo' ? 'active' : ''}`}
            style={statusFilter === 'nuevo' ? { background: '#991B1B', borderColor: '#991B1B' } : {}}
          >
            🚨 Nuevas ({quotes.filter(q => q.status === 'nuevo').length})
          </button>
          <button
            onClick={() => setStatusFilter('en_revision')}
            className={`admin-status-tab ${statusFilter === 'en_revision' ? 'active' : ''}`}
          >
            ⏳ En Revisión ({quotes.filter(q => q.status === 'en_revision').length})
          </button>
          <button
            onClick={() => setStatusFilter('respondido')}
            className={`admin-status-tab ${statusFilter === 'respondido' ? 'active' : ''}`}
          >
            💬 Respondidas ({quotes.filter(q => q.status === 'respondido').length})
          </button>
          <button
            onClick={() => setStatusFilter('cerrado')}
            className={`admin-status-tab ${statusFilter === 'cerrado' ? 'active' : ''}`}
          >
            ✔️ Cerradas ({quotes.filter(q => q.status === 'cerrado').length})
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
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            Cargando bandeja de entrada...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            No se encontraron consultas o presupuestos para este filtro.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Cliente y Datos</th>
                <th>Equipo / Asunto</th>
                <th>Estado</th>
                <th>Notas Privadas</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
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
                const isNew = quote.status === 'nuevo';
                const waUrl = getWhatsAppLink(quote);

                return (
                  <tr key={quote.id} className={isNew ? 'admin-row-nuevo' : ''}>
                    <td style={{ whiteSpace: 'nowrap', color: '#666', fontSize: '0.85rem' }}>{dateFormatted}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: isNew ? '#991B1B' : 'var(--color-black)' }}>
                        {quote.full_name || 'Sin nombre ingresado'}
                        {isNew && <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: '#FEE2E2', color: '#991B1B', padding: '1px 5px', borderRadius: '4px' }}>¡NUEVO!</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#555', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                        {quote.phone && quote.phone !== 'No especificado' && <span>📱 {quote.phone}</span>}
                        {quote.email && <span>📧 {quote.email}</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{quote.appliance_type || 'Consulta general'}</div>
                      {quote.brand && <div style={{ fontSize: '0.8rem', color: '#666' }}>Marca/Detalle: {quote.brand}</div>}
                    </td>
                    <td>
                      <span className={`admin-badge-status admin-badge-${quote.status || 'nuevo'}`}>
                        {quote.status?.replace('_', ' ') || 'nuevo'}
                      </span>
                    </td>
                    <td>
                      {quote.admin_notes ? (
                        <div style={{ fontSize: '0.8rem', background: '#FFFBEB', color: '#B45309', padding: '4px 8px', borderRadius: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #FCD34D' }}>
                          🔒 {quote.admin_notes}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#AAA' }}>Sin notas</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#E8F5E9', borderColor: '#A5D6A7', color: '#1B5E20', textDecoration: 'none', fontWeight: 700 }}
                            title="Responder rápido al cliente por WhatsApp"
                          >
                            WhatsApp
                          </a>
                        )}
                        <button onClick={() => openDetailModal(quote)} className="admin-btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
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
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-content"
              style={{ maxWidth: '680px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header" style={{ background: '#F9F9F8' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>
                    Consulta / Presupuesto #{selectedQuote.id}
                  </span>
                  <h3 style={{ marginTop: '2px' }}>Gestión de Asunto: {selectedQuote.appliance_type || 'General'}</h3>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="admin-modal-close">✖</button>
              </div>

              <form onSubmit={handleSaveChanges}>
                <div className="admin-modal-body">
                  {/* Datos Clave de Contacto */}
                  <div style={{ background: '#F8F8F8', border: '1px solid #E2E2E2', borderRadius: '8px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Cliente</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{selectedQuote.full_name || 'Sin nombre'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Teléfono / WhatsApp</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-red-primary)' }}>
                        {selectedQuote.phone || 'No especificado'}
                      </div>
                    </div>
                    {selectedQuote.email && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Correo electrónico</div>
                        <div style={{ fontWeight: 600 }}>{selectedQuote.email}</div>
                      </div>
                    )}
                  </div>

                  {/* Detalle del Problema o Inquietud */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>Detalle reportado por el cliente:</label>
                    <div style={{ background: '#FFF', border: '1px solid #D1D1D1', borderRadius: '6px', padding: '14px', fontSize: '0.95rem', lineHeight: '1.6', color: '#222', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                      {selectedQuote.issue_description || 'No se ingresó una descripción detallada.'}
                    </div>
                  </div>

                  {/* Foto adjunta si existe */}
                  {selectedQuote.image_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>Foto adjunta por el cliente al consultar:</label>
                      <div style={{ border: '1px solid #E2E2E2', borderRadius: '8px', overflow: 'hidden', maxHeight: '240px', background: '#F5F5F5', textAlign: 'center' }}>
                        <a href={selectedQuote.image_url} target="_blank" rel="noopener noreferrer" title="Hacé clic para ver en tamaño original">
                          <img src={selectedQuote.image_url} alt="Adjunto cliente" style={{ maxHeight: '240px', objectFit: 'contain' }} />
                        </a>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#666' }}>Hacé clic sobre la imagen para abrirla en pantalla completa.</span>
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '8px 0' }} />

                  {/* Selector de Estado Operativo */}
                  <div className="admin-form-group">
                    <label htmlFor="quote-status" style={{ fontSize: '0.95rem', color: 'var(--color-red-primary)' }}>
                      Actualizar Estado Operativo de la Consulta *
                    </label>
                    <select
                      id="quote-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="admin-form-select"
                      style={{ fontWeight: 700, fontSize: '1rem', border: '2px solid var(--color-black)' }}
                    >
                      <option value="nuevo">🚨 Nuevo (Recién ingresado, sin diagnóstico o respuesta)</option>
                      <option value="en_revision">⏳ En Revisión (Equipo en taller / Cotizando repuestos)</option>
                      <option value="respondido">💬 Respondido / Presupuesto Enviado (Por WhatsApp o email)</option>
                      <option value="cerrado">✔️ Cerrado / Finalizado (Reparación entregada o desestimada)</option>
                    </select>
                    <small style={{ color: '#666', fontSize: '0.82rem' }}>
                      Tip: Muchas respuestas se envían por WhatsApp. No olvides cambiar aquí el estado a "Respondido" o "Cerrado" para mantener al día el historial web del cliente.
                    </small>
                  </div>

                  {/* Respuesta para el Cliente */}
                  <div className="admin-notes-box" style={{ background: '#FAF8F5', borderColor: '#E5E0D8' }}>
                    <div className="admin-notes-header" style={{ color: '#333333' }}>
                      <span>✉️</span>
                      <span>Respuesta Oficial para el Cliente (Visible en "Mi Cuenta")</span>
                    </div>
                    <textarea
                      value={editResponse}
                      onChange={(e) => setEditResponse(e.target.value)}
                      placeholder="Escribí acá el diagnóstico, costo de reparación, repuesto disponible o respuesta que el cliente leerá en su perfil..."
                      className="admin-notes-textarea"
                      style={{ borderColor: '#D6D0C4', background: '#FFFFFF' }}
                    />
                    <div style={{ fontSize: '0.78rem', color: '#555555', marginTop: '6px' }}>
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
                    <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '6px' }}>
                      Este campo está protegido por las políticas del servidor y nunca se muestra al cliente en "Mi Cuenta".
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer" style={{ justifyContent: 'space-between' }}>
                  {getWhatsAppLink(selectedQuote) ? (
                    <a
                      href={getWhatsAppLink(selectedQuote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-secondary"
                      style={{ background: '#2F9E44', borderColor: '#2F9E44', color: '#FFF', textDecoration: 'none', fontWeight: 700 }}
                    >
                      💬 Chatear al WhatsApp del Cliente
                    </a>
                  ) : (
                    <span />
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
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
