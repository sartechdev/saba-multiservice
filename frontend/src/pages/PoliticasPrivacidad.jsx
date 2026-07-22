import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/LegalPages.css';

const sections = [
  { id: 'compromiso', number: '1', title: 'Compromiso y Responsable del Tratamiento' },
  { id: 'recopilacion', number: '2', title: 'Datos Personales que Recopilamos y Métodos' },
  { id: 'finalidad', number: '3', title: 'Finalidad del Tratamiento de la Información' },
  { id: 'ley25326', number: '4', title: 'Protección de Datos bajo la Ley Nacional N° 25.326' },
  { id: 'confidencialidad', number: '5', title: 'Confidencialidad y No Comercialización a Terceros' },
  { id: 'derechos-arco', number: '6', title: 'Derechos ARCO (Acceso, Rectificación y Supresión)' },
  { id: 'cookies', number: '7', title: 'Uso de Cookies y Tecnologías de Sesión' },
  { id: 'modificaciones', number: '8', title: 'Modificaciones a esta Política de Privacidad' },
];

export default function PoliticasPrivacidad() {
  return (
    <div className="legal-page-wrapper">
      <Helmet>
        <title>Políticas de Privacidad y Protección de Datos | Saba Multiservice</title>
        <meta
          name="description"
          content="Políticas de privacidad y manejo confidencial de datos personales conforme a la Ley N° 25.326 en Saba Multiservice Santa Fe."
        />
      </Helmet>

      {/* ── HERO LEGAL ── */}
      <section className="legal-hero">
        <div className="legal-hero-glow" />
        <div className="container">
          <div className="legal-hero-content">
            <nav className="legal-breadcrumb">
              <Link to="/">Inicio</Link>
              <span>/</span>
              <span>Políticas de Privacidad</span>
            </nav>
            <h1 className="legal-title">Políticas de Privacidad</h1>
            <p className="legal-subtitle">
              Cómo protegemos, gestionamos y tratamos con estricta confidencialidad tus datos personales, de contacto y los detalles del historial de tus electrodomésticos.
            </p>
            <div className="legal-meta-row">
              <div className="legal-meta-item">
                <span>🛡️</span>
                <span>Cumplimiento Ley N° 25.326 (Protección de Datos Personales de Argentina)</span>
              </div>
              <div className="legal-meta-item">
                <span>🔒</span>
                <span>Conexión cifrada y base de datos segura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div className="container">
        <div className="legal-layout-grid">
          {/* Índice Lateral Sticky */}
          <aside className="legal-sidebar">
            <h3 className="legal-sidebar-title">Secciones de Privacidad</h3>
            <ul className="legal-toc-list">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="legal-toc-link">
                    <strong>{sec.number}.</strong> {sec.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="legal-sidebar-help">
              <p>¿Querés solicitar la actualización o baja de tus datos de nuestra base?</p>
              <a href="tel:+5493425011410" className="legal-sidebar-btn">
                <span>Llamar / Escribir a Soporte</span>
                <span>↗</span>
              </a>
            </div>
          </aside>

          {/* Artículo Contenido */}
          <motion.article
            className="legal-article"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Sección 1 */}
            <section id="compromiso" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">1</span>
                <h2 className="legal-section-heading">Compromiso y Responsable del Tratamiento</h2>
              </div>
              <p className="legal-paragraph">
                <strong>Saba Multiservice</strong>, con taller y domicilio legal en calle Catamarca 3420 de la Ciudad de Santa Fe de la Vera Cruz, Argentina, asume el compromiso inquebrantable de resguardar la privacidad, integridad y confidencialidad de la información personal aportada por nuestros clientes y por los usuarios que navegan o se registran en nuestro sitio web oficial.
              </p>
              <p className="legal-paragraph">
                Esta Política de Privacidad describe qué información obtenemos, cómo y por qué la utilizamos, y cuáles son los derechos que te asisten como titular de tus datos personales.
              </p>
            </section>

            {/* Sección 2 */}
            <section id="recopilacion" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">2</span>
                <h2 className="legal-section-heading">Datos Personales que Recopilamos y Métodos</h2>
              </div>
              <p className="legal-paragraph">
                Nuestra plataforma y nuestro sistema de recepción en mostrador recopilan únicamente la información estrictamente necesaria y proporcionada de forma voluntaria y explícita por el Usuario o Cliente a través de los siguientes medios:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Registro de Cuenta Digital:</strong> Nombre, Apellido, dirección de correo electrónico válida, número de teléfono celular/WhatsApp de contacto, y contraseña (almacenada mediante hash criptográfico irreversible en los servidores de autenticación).
                </li>
                <li>
                  <strong>Solicitudes de Presupuesto o Formularios de Contacto:</strong> Datos de identificación, teléfono celular, modelo/marca del electrodoméstico y descripción de la falla observada.
                </li>
                <li>
                  <strong>Ingreso Presencial de Equipos al Taller:</strong> Datos de contacto del titular para asociarlos a la Orden de Trabajo técnica.
                </li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section id="finalidad" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">3</span>
                <h2 className="legal-section-heading">Finalidad del Tratamiento de la Información</h2>
              </div>
              <p className="legal-paragraph">
                Los datos recabados son procesados de manera lícita, justa y transparente exclusivamente para las siguientes finalidades operativas:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Gestión Operativa y Técnica:</strong> Abrir órdenes de reparación, emitir comprobantes, asociar repuestos e historial técnico a cada electrodoméstico ingresado.
                </li>
                <li>
                  <strong>Notificaciones y Comunicación Directa:</strong> Informar por WhatsApp, correo electrónico o llamada telefónica sobre el estado del diagnóstico, finalización de presupuestos, o disponibilidad para retiro del equipo.
                </li>
                <li>
                  <strong>Perfil de Usuario ("Mi Cuenta"):</strong> Permitir al cliente consultar el historial de reparaciones y el seguimiento de sus órdenes en curso de forma autónoma.
                </li>
                <li>
                  <strong>Atención al Cliente:</strong> Responder dudas previas, consultas de catálogo o reclamos de garantía.
                </li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section id="ley25326" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">4</span>
                <h2 className="legal-section-heading">Protección de Datos conforme a la Ley Nacional N° 25.326</h2>
              </div>
              <p className="legal-paragraph">
                El tratamiento de datos personales realizado por Saba Multiservice se encuadra en todas sus partes dentro de lo preceptuado por la <strong>Ley de Protección de Datos Personales N° 25.326</strong> de la República Argentina y su decreto reglamentario N° 1558/2001.
              </p>
              <div className="legal-highlight-box info">
                <div className="legal-highlight-title">🔒 Seguridad en Infraestructura Cloud</div>
                <p className="legal-highlight-text">
                  Almacenamos y protegemos la base de datos de usuarios utilizando tecnologías de grado empresarial provistas por Supabase Cloud, aplicando cifrado en tránsito (SSL/TLS HTTPS) y en reposo, así como políticas de seguridad a nivel de filas (RLS - Row Level Security) para garantizar que ningún usuario pueda acceder a datos o historiales pertenecientes a otras cuentas.
                </p>
              </div>
            </section>

            {/* Sección 5 */}
            <section id="confidencialidad" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">5</span>
                <h2 className="legal-section-heading">Confidencialidad y No Comercialización a Terceros</h2>
              </div>
              <p className="legal-paragraph">
                En Saba Multiservice respetamos tu privacidad de forma estricta: <strong>NO vendemos, NO alquilamos, NO cedemos, ni compartimos con fines publicitarios, de marketing de terceros o comerciales</strong> la información de nuestros clientes con ninguna empresa u organización externa.
              </p>
              <p className="legal-paragraph">
                Tus datos de contacto solo podrán ser revelados en caso de mediar una orden judicial fehaciente o requerimiento formal de autoridad competente conforme a derecho en la República Argentina.
              </p>
            </section>

            {/* Sección 6 */}
            <section id="derechos-arco" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">6</span>
                <h2 className="legal-section-heading">Derechos ARCO (Acceso, Rectificación, Actualización y Supresión)</h2>
              </div>
              <p className="legal-paragraph">
                Conforme al Artículo 14, inciso 3 de la Ley N° 25.326, el titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto.
              </p>
              <p className="legal-paragraph">
                Asimismo, el Usuario puede en todo momento ejercer sus derechos de <strong>Acceso, Rectificación, Actualización o Supresión</strong> total de sus datos de nuestros registros de la siguiente manera:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Autogestión desde el Portal:</strong> Modificando su nombre y teléfono directamente desde la sección "Mi Cuenta".
                </li>
                <li>
                  <strong>Solicitud Directa al Taller:</strong> Comunicándose vía WhatsApp al número oficial <strong>+54 9 342 501-1410</strong> o acudiendo presencialmente a nuestro mostrador en Catamarca 3420 con su DNI para solicitar la desvinculación o baja definitiva de sus datos personales de nuestro sistema.
                </li>
              </ul>
              <div className="legal-highlight-box alert">
                <div className="legal-highlight-title">ℹ️ Agencia de Acceso a la Información Pública</div>
                <p className="legal-highlight-text">
                  Se informa que la Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
                </p>
              </div>
            </section>

            {/* Sección 7 */}
            <section id="cookies" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">7</span>
                <h2 className="legal-section-heading">Uso de Cookies y Tecnologías de Sesión</h2>
              </div>
              <p className="legal-paragraph">
                Nuestro portal web utiliza exclusivamente <strong>cookies técnicas y tokens de sesión seguros</strong> requeridos por el sistema de autenticación para mantener tu sesión iniciada de forma protegida mientras navegás por "Mi Cuenta" o gestionás tus consultas.
              </p>
              <p className="legal-paragraph">
                No utilizamos cookies de rastreo publicitario masivo ni técnicas invasivas de perfilado de comportamiento de terceros. Podés configurar o deshabilitar la recepción de cookies desde la configuración de tu navegador, aunque esto podría impedir el inicio de sesión en el área privada.
              </p>
            </section>

            {/* Sección 8 */}
            <section id="modificaciones" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">8</span>
                <h2 className="legal-section-heading">Modificaciones a esta Política de Privacidad</h2>
              </div>
              <p className="legal-paragraph">
                Saba Multiservice se reserva el derecho de modificar y actualizar en cualquier momento la presente Política de Privacidad para adecuarla a nuevas normativas legales, resoluciones de la Agencia de Acceso a la Información Pública o mejoras en nuestra operatoria digital. Las modificaciones entrarán en vigencia a partir de su publicación en esta misma sección del sitio web.
              </p>
            </section>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
