import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppModal } from '../shared/WhatsAppModal';
import '../../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493425011410';
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  return (
    <footer className="main-footer-container">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <span className="logo-saba">SABA</span>
            <span className="logo-ms">MULTISERVICE</span>
          </Link>
          <p className="footer-tagline">
            Servicio técnico oficial y multimarca de electrodomésticos en Santa Fe. Más de 25 años garantizando seguridad y confianza en tu hogar.
          </p>
          <div className="footer-details">
            <p><strong>Dirección:</strong> Catamarca 3420, Santa Fe de la Vera Cruz, Santa Fe, Argentina</p>
            <p>
              <strong>Teléfono / WhatsApp:</strong>{' '}
              <button
                type="button"
                onClick={() => setIsWaModalOpen(true)}
                className="footer-link-action"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                +54 9 342 501-1410
              </button>
            </p>
            <p><strong>Horarios:</strong> Lunes a Viernes de 9:00 a 18:00 hs y Sábados de 9:00 a 12:00 hs</p>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">Navegación</h4>
          <nav className="footer-links">
            <Link to="/">Inicio</Link>
            <Link to="/servicio-tecnico">Servicio Técnico</Link>
            <Link to="/productos">Catálogo de Productos</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link to="/politicas-de-privacidad">Políticas de Privacidad</Link>
          </nav>
        </div>

        {/* Redes y Garantía Column */}
        <div className="footer-col warranty-col">
          <h4 className="footer-heading">Nuestra Garantía</h4>
          <p className="warranty-text">
            Todas nuestras reparaciones cuentan con <strong>3 meses de garantía escrita</strong> y presupuestos sin cargo en el día.
          </p>
          <h4 className="footer-heading footer-sub-heading">Encontranos en</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=100077870645235" target="_blank" rel="noopener noreferrer" className="social-link-item">Facebook</a>
            <a href="https://www.instagram.com/sabamultiservice" target="_blank" rel="noopener noreferrer" className="social-link-item">Instagram</a>
            <a href="https://maps.app.goo.gl/k3M4vkiZHkRP2pdWA" target="_blank" rel="noopener noreferrer" className="social-link-item">Google Maps</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {currentYear} SABA Multiservice. Todos los derechos reservados.</p>
          <div className="footer-legal-links">
            <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
            <span>•</span>
            <Link to="/politicas-de-privacidad">Políticas de Privacidad</Link>
          </div>
          <p className="footer-dev-tag">Servicio Técnico Profesional Santa Fe</p>
        </div>
      </div>

      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        title="Atención por WhatsApp"
        subtitle="Saba Multiservice Santa Fe"
        customMessage="Hola Saba Multiservice! Quisiera realizar una consulta general."
      />
    </footer>
  );
};
