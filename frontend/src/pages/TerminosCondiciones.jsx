import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/LegalPages.css';

const sections = [
  { id: 'alcance', number: '1', title: 'Introducción y Alcance de los Términos' },
  { id: 'presupuestos', number: '2', title: 'Servicio de Diagnóstico y Presupuestos Presenciales' },
  { id: 'plazos', number: '3', title: 'Plazos legales de Retiro y Abandono de Equipos' },
  { id: 'garantia', number: '4', title: 'Garantía Oficial sobre Reparaciones (90 Días)' },
  { id: 'informes', number: '5', title: 'Informes Técnicos para Compañías de Seguros' },
  { id: 'catalogo', number: '6', title: 'Catálogo Digital, Disponibilidad y Precios' },
  { id: 'jurisdiccion', number: '7', title: 'Jurisdicción Legal y Ley Aplicable' },
];

export default function TerminosCondiciones() {
  return (
    <div className="legal-page-wrapper">
      <Helmet>
        <title>Términos y Condiciones del Servicio | Saba Multiservice Santa Fe</title>
        <meta
          name="description"
          content="Términos legales y condiciones de contratación del servicio técnico oficial, presupuestos sin cargo y garantías escritas en Saba Multiservice."
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
              <span>Términos y Condiciones</span>
            </nav>
            <h1 className="legal-title">Términos y Condiciones Generales</h1>
            <p className="legal-subtitle">
              Reglas e información legal aplicable al uso de nuestro sitio web y a la contratación de servicios de reparación o consulta electrónica en nuestro taller especializado.
            </p>
            <div className="legal-meta-row">
              <div className="legal-meta-item">
                <span>📍</span>
                <span>Saba Multiservice - Catamarca 3420, Santa Fe (S3000)</span>
              </div>
              <div className="legal-meta-item">
                <span>📅</span>
                <span>Última actualización: Julio 2026</span>
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
            <h3 className="legal-sidebar-title">Índice del Documento</h3>
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
              <p>¿No encontrás la respuesta a tu inquietud técnica o sobre garantías?</p>
              <Link to="/contacto" className="legal-sidebar-btn">
                <span>Consultar a un técnico</span>
                <span>↗</span>
              </Link>
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
            <section id="alcance" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">1</span>
                <h2 className="legal-section-heading">Introducción y Alcance de los Términos</h2>
              </div>
              <p className="legal-paragraph">
                Los presentes Términos y Condiciones regulan la relación comercial, técnica y contractual entre <strong>Saba Multiservice</strong> (en adelante, "el Taller" o "Saba"), sito en calle Catamarca 3420 de la ciudad de Santa Fe de la Vera Cruz, y cualquier persona humana o jurídica (en adelante, "el Cliente" o "el Usuario") que utilice el sitio web oficial o ingrese electrodomésticos para su evaluación y reparación.
              </p>
              <p className="legal-paragraph">
                Al solicitar un turno presencial, requerir un presupuesto, o registrarse en nuestra plataforma electrónica, el Cliente declara haber leído, comprendido y aceptado en su totalidad las estipulaciones que se detallan a continuación.
              </p>
            </section>

            {/* Sección 2 */}
            <section id="presupuestos" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">2</span>
                <h2 className="legal-section-heading">Servicio de Diagnóstico y Presupuestos Presenciales</h2>
              </div>
              <p className="legal-paragraph">
                Debido a la alta complejidad de los circuitos electrónicos de Smart TVs, hornos microondas, hornos eléctricos y electrodomésticos de línea blanca o de cocina, todo diagnóstico y emisión de presupuesto requiere indefectiblemente el examen físico e instrumental del equipo en nuestro laboratorio técnico.
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Presupuestos 100% Sin Cargo:</strong> La revisión electrónica inicial y la determinación de fallas y costos en nuestro local son completamente gratuitas y no generan ninguna obligación de compra o contratación por parte del Cliente.
                </li>
                <li>
                  <strong>Derecho de Rechazo:</strong> Si el Cliente decide no aceptar el costo de reparación presupuestado, podrá retirar su electrodoméstico exactamente en el mismo estado en que fue ingresado sin abonar absolutamente ningún monto en concepto de revisión, desarme o depósito inicial.
                </li>
                <li>
                  <strong>Orden de Ingreso:</strong> Al momento de dejar el equipo, se le entregará al Cliente una Orden de Reparación o Comprobante de Ingreso en formato impreso o digital, el cual será exigible de manera obligatoria al momento de retirar el producto del local.
                </li>
              </ul>
              <div className="legal-highlight-box info">
                <div className="legal-highlight-title">ℹ️ Cotizaciones Previa Consulta</div>
                <p className="legal-highlight-text">
                  Las cotizaciones brindadas por vía telefónica o WhatsApp antes de ver el equipo tienen carácter únicamente orientativo, estando su valor final condicionado a la medición interna de componentes defectuosos.
                </p>
              </div>
            </section>

            {/* Sección 3 */}
            <section id="plazos" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">3</span>
                <h2 className="legal-section-heading">Plazos Legales de Retiro y Abandono de Equipos</h2>
              </div>
              <p className="legal-paragraph">
                Una vez emitido y comunicado el diagnóstico o concluida la reparación (sea esta aprobada o rechazada), el Cliente será notificado por los medios de contacto declarados (WhatsApp, llamada telefónica o correo electrónico).
              </p>
              <div className="legal-highlight-box alert">
                <div className="legal-highlight-title">⚠️ Plazo Máximo de Retiro: 60 Días Corridos</div>
                <p className="legal-highlight-text">
                  El Cliente dispone de un plazo improrrogable de <strong>60 (sesenta) días corridos</strong> contados a partir de la fecha de notificación fehaciente para retirar su electrodoméstico del taller.
                </p>
              </div>
              <p className="legal-paragraph">
                Transcurrido dicho plazo de 60 días sin que el Cliente proceda al retiro y cancelación de los importes adeudados (en caso de reparación aprobada), y conforme a lo estipulado en los <strong>Artículos 2524, 2525 y concordantes del Código Civil y Comercial de la Nación</strong> respecto al abandono de cosas muebles, se considerará que el propietario ha hecho abandono voluntario de los derechos sobre el bien.
              </p>
              <p className="legal-paragraph">
                En tal supuesto, Saba Multiservice quedará facultado para disponer del electrodoméstico, proceder a su desarme para reciclaje de partes funcionales o su disposición final, a fin de cubrir y compensar los gastos de almacenaje, custodia, depósito y labor técnica realizada, sin derecho a reclamo o indemnización alguna por parte del depositante.
              </p>
            </section>

            {/* Sección 4 */}
            <section id="garantia" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">4</span>
                <h2 className="legal-section-heading">Garantía Oficial sobre Reparaciones (90 Días)</h2>
              </div>
              <p className="legal-paragraph">
                En Saba Multiservice respaldamos nuestra mano de obra e instrumental con una <strong>Garantía Oficial por Escrito de 90 (noventa) días corridos (3 meses)</strong> a partir de la fecha exacta de entrega y retiro del equipo reparado.
              </p>
              <p className="legal-paragraph">
                <strong>Alcance de la Garantía:</strong> La cobertura aplica de forma exclusiva y excluyente sobre la falla específica que motivó la reparación original, cubriendo la mano de obra realizada y los componentes electrónicos o repuestos exactos que fueron reemplazados en dicho servicio.
              </p>
              <p className="legal-paragraph">
                <strong>Exclusiones de la Garantía:</strong> La garantía quedará nula y sin efecto en los siguientes casos:
              </p>
              <ul className="legal-list">
                <li>Rotura, desprendimiento o adulteración de la faja o sello de garantía colocado por el Taller.</li>
                <li>Fallas provocadas por sobretensiones eléctricas extremas, caídas de rayo, o desperfectos en la red de suministro eléctrico exterior domiciliario.</li>
                <li>Daños físicos por caídas, golpes, maltrato o uso inadecuado del electrodoméstico.</li>
                <li>Ingreso o derrame de líquidos sobre placas electrónicas o motores en zonas no diseñadas para tal fin.</li>
                <li>Apertura, manipulación, o intento de reparación posterior por parte del propio usuario o técnicos de terceros no autorizados por Saba.</li>
                <li>Aparición de fallas independientes o en bloques funcionales del equipo ajenos a la reparación original efectuada.</li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section id="informes" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">5</span>
                <h2 className="legal-section-heading">Informes Técnicos para Compañías de Seguros</h2>
              </div>
              <p className="legal-paragraph">
                Saba Multiservice se encuentra habilitado para la inspección y emisión de <strong>Informes Técnicos Oficiales</strong> y presupuestos formales destinados a la tramitación de reintegros ante compañías de seguros (siniestros por baja/alta tensión, descargas atmosféricas o inundaciones).
              </p>
              <p className="legal-paragraph">
                A diferencia del presupuesto presencial estándar de reparación (que es gratuito), la confección y firma del certificado técnico formal con membrete para presentarse ante aseguradoras implica una labor administrativa pericial y posee un arancel fijo independiente. Dicho arancel se informará de antemano y podrá ser descontado o contemplado en caso de que el cliente autorice la reparación posterior en nuestro establecimiento una vez liquidado el siniestro.
              </p>
            </section>

            {/* Sección 6 */}
            <section id="catalogo" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">6</span>
                <h2 className="legal-section-heading">Catálogo Digital, Disponibilidad y Precios</h2>
              </div>
              <p className="legal-paragraph">
                La exhibición de productos, repuestos, accesorios o electrodomésticos reacondicionados/nuevos dentro de la sección "Catálogo de Productos" en nuestro portal web tiene un propósito informativo y de consulta y está sujeta a variación permanente de stock y divisas.
              </p>
              <p className="legal-paragraph">
                Los precios publicados u orientativos pueden ser actualizados sin previo aviso. La confirmación final de compra, reserva o precio se concretará de manera presencial en mostrador o a través de nuestro canal verificado de WhatsApp antes de procesarse el pago.
              </p>
            </section>

            {/* Sección 7 */}
            <section id="jurisdiccion" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">7</span>
                <h2 className="legal-section-heading">Jurisdicción Legal y Ley Aplicable</h2>
              </div>
              <p className="legal-paragraph">
                Los presentes Términos y Condiciones se rigen e interpretan bajo las leyes imperantes en la República Argentina. Ante cualquier controversia, reclamo o litigio derivado de la prestación de servicios técnicos, compra de repuestos o interpretación de estas cláusulas, las partes renuncian expresamente a cualquier otro fuero que pudiera corresponderles y se someten a la jurisdicción y competencia de los <strong>Tribunales Ordinarios de la Ciudad de Santa Fe de la Vera Cruz</strong>, Provincia de Santa Fe.
              </p>
            </section>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
