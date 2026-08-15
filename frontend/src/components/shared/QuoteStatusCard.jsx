import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/QuoteStatusCard.css';

export const QuoteStatusCard = ({ quote, index = 0 }) => {
  // Destructuramos estrictamente los campos permitidos. NUNCA extraemos ni renderizamos admin_notes.
  const {
    issue_description,
    status = 'sin_responder',
    admin_response,
    created_at
  } = quote || {};

  // Mapeo de los 2 únicos estados de consulta
  const getStatusConfig = (st) => {
    if (st?.toLowerCase() === 'respondido') {
      return { label: 'Respondido', className: 'status-respondido' };
    }
    return { label: 'Sin responder', className: 'status-sin-responder' };
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



  return (
    <motion.div
      className="quote-status-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="quote-card-header">
        <div className="quote-card-type">
          <span>📋</span>
          <span>Consulta enviada</span>
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
