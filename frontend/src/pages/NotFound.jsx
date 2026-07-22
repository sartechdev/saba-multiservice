import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '60vh' }}>
      <Helmet>
        <title>Página No Encontrada | Saba Multiservice</title>
        <meta name="description" content="La página solicitada no existe." />
      </Helmet>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>NotFound</h2>
        <p style={{ color: 'var(--color-gray-medium)', marginTop: '8px' }}>Página de NotFound (Placeholder)</p>
      </div>
    </div>
  );
}
