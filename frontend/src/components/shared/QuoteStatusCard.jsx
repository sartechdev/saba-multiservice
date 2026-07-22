import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/QuoteStatusCard.css';

export const QuoteStatusCard = ({ quote, index = 0 }) => {
  // Destructuramos estrictamente los campos permitidos. NUNCA extraemos ni renderizamos admin_notes.
  const {
    appliance_type,
    brand,
    issue_description,
    status = 'nuevo',
    admin_response,
    created_at
  } = quote || {};

  // Mapeo de estados a nombres legibles y clases CSS (Accesibilidad 35+)
  const getStatusConfig = (st) => {
    switch (st?.toLowerCase()) {
      case 'nuevo':
        return { label: 'Recibido (Pendiente de revisión)', className: 'status-nuevo' };
      case 'en_revision':
      case 'revision':
        return { label: 'En revisión técnica', className: 'status-revision' };
      case 'respondido':
        return { label: 'Presupuesto informado / Respondido', className: 'status-respondido' };
      case 'cerrado':
        return { label: 'Consulta finalizada / Cerrada', className: 'status-cerrado' };
      default:
        return { label: 'Recibido', className: 'status-nuevo' };
    }
  };

  const statusConfig = getStatusConfig(status);

  // Formateo legible de fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return dateString;
    }
  };

  const getIconForAppliance = (type) => {
    if (!type) return '📋';
    const t = type.toLowerCase();
    if (t.includes('tv') || t.includes('televisor') || t.includes('smart')) return '📺';
    if (t.includes('microondas') || t.includes('horno')) return '⚡';
    if (t.includes('ventilador') || t.includes('aspas')) return '🌀';
    if (t.includes('calefac') || t.includes('caloventor') || t.includes('estufa')) return '🔥';
    if (t.includes('audio') || t.includes('parlante') || t.includes('sonido')) return '🔊';
    if (t.includes('consulta') || t.includes('general')) return '💬';
    return '🔧';
  };

  return (
    <motion.div
      className="quote-status-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="quote-card-header">
        <div className="quote-card-type">
          <span>{getIconForAppliance(appliance_type)}</span>
          <span>{appliance_type || 'Consulta enviada'}</span>
          {brand && <span className="quote-card-brand">{brand}</span>}
        </div>
        <div className={`quote-status-badge ${statusConfig.className}`}>
          <span className="status-dot" />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      <div className="quote-card-body">
        <span className="quote-card-issue-title">Detalle de la solicitud / Falla reportada:</span>
        <p className="quote-card-issue-text">{issue_description || 'Sin descripción especificada.'}</p>
      </div>

      {admin_response && admin_response.trim() !== '' && (
        <div className="quote-card-admin-response">
          <div className="admin-response-header">
            <span className="admin-response-sender">Saba Multiservice</span>
            <span className="admin-response-tag">Respuesta Oficial</span>
          </div>
          <p className="admin-response-text">{admin_response}</p>
        </div>
      )}

      <div className="quote-card-footer">
        <span className="quote-card-date">Enviado el {formatDate(created_at)}</span>
      </div>
    </motion.div>
  );
};

export default QuoteStatusCard;
