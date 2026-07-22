import React from 'react';
import '../../styles/BrandLogo.css';

export const BrandLogo = ({ name, logoUrl }) => {
  return (
    <div className="brand-logo-item" title={name}>
      <img
        src={logoUrl}
        alt={`Logo de ${name}`}
        className="brand-logo-img"
        loading="lazy"
      />
    </div>
  );
};
