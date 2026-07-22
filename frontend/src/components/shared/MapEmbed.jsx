import React from 'react';

export const MapEmbed = ({ height = '450px', className = '' }) => {
  return (
    <div
      className={`map-embed-wrapper ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        width: '100%',
        height: height,
        border: '1px solid #e0e0d8',
        boxShadow: 'var(--shadow-md)',
        background: '#f5f5f0'
      }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.908051756598!2d-60.7107775!3d-31.6363889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a9bf5e347719%3A0xc665181180eb0e47!2sCatamarca%203420%2C%20S3000%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1711111111111!5m2!1ses!2sar"
        title="Ubicación de Saba Multiservice en Google Maps - Catamarca 3420, Santa Fe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block'
        }}
      />
    </div>
  );
};

export default MapEmbed;
