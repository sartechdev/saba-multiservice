import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../lib/motionVariants';
import { Link } from 'react-router-dom';

import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import { REPAIR_SERVICES, TALLER_POLICIES } from '../data/serviciosConfig';
import servicioTecnicoBg from '../assets/wppSV.webp';
import '../styles/ServicioTecnico.css';

export const ServicioTecnico = () => {
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  const processSteps = [
    {
      number: '01',
      title: 'Ingreso presencial en mostrador',
      desc: 'Traé tu electrodoméstico a nuestro local en Catamarca 3420, Santa Fe. No necesitás turno previo.'
    },
    {
      number: '02',
      title: 'Diagnóstico técnico',
      desc: 'Nuestros técnicos revisan el artefacto dentro de las 24 a 48hs.'
    },
    {
      number: '03',
      title: 'Presupuesto sin cargo',
      desc: 'Te comunicamos por teléfono o WhatsApp el costo con repuestos y mano de obra. Si aceptás, reparamos. Si decidís no hacerlo, retirás sin cargo.'
    }
  ];

  return (
    <div className="service-landing-wrapper">
      <Helmet>
        <title>Servicio Técnico Oficial en Santa Fe | Saba Multiservice</title>
        <meta
          name="description"
          content="Reparación de Smart TV, microondas, hornos eléctricos, aspiradoras, lustraspiradoras, centrifugadoras y electrodomésticos en Santa Fe Capital. Presupuesto sin cargo y 90 días de garantía."
        />
        <link rel="canonical" href="https://www.saba-multiservice.com/servicio-tecnico" />
        <meta property="og:title" content="Servicio Técnico Oficial en Santa Fe | Saba Multiservice" />
        <meta property="og:description" content="Reparación especializada de Smart TV, microondas, centrifugadoras y electrodomésticos con presupuesto sin cargo y garantía escrita." />
        <meta property="og:url" content="https://www.saba-multiservice.com/servicio-tecnico" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.saba-multiservice.com/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Reparación de Smart TV, Microondas, Centrifugadoras y Pequeños Electrodomésticos",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Saba Multiservice",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Catamarca 3420",
                "addressLocality": "Santa Fe Capital",
                "addressRegion": "Santa Fe",
                "addressCountry": "AR"
              }
            },
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": "Santa Fe, Argentina"
            },
            "description": "Diagnóstico y presupuestos 100% sin cargo en mostrador. Reparación de Smart TV, microondas, hornos eléctricos, aspiradoras, lustraspiradoras, centrifugadoras, estufas, freidoras de aire, licuadoras y procesadoras con garantía de 90 días."
          })}
        </script>
      </Helmet>

      {/* ── 1. HERO Y PRESENTACIÓN ── */}
      <section className="service-hero">
        <div className="service-hero-bg-container">
          <img
            src={servicioTecnicoBg}
            alt="Servicio Técnico Saba Multiservice"
            className="service-hero-bg-img"
          />
          <div className="service-hero-bg-overlay" />
        </div>
        <div className="service-hero-bg-glow" />
        <div className="container">
          <motion.div
            className="service-hero-inner"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >

            <h1 className="service-hero-title">
              Diagnóstico profesional y presupuestos sin cargo en taller
            </h1>
            <p className="service-hero-desc">
              Especialistas en la reparación de televisores Smart TV, microondas, hornos eléctricos, aspiradoras, lustraspiradoras, centrifugadoras y electrodomésticos de cocina. Atención presencial en nuestro local con repuestos originales y 90 días de garantía.
            </p>
            <div className="service-hero-actions">
              <a href="#proceso-presupuesto" className="service-btn-primary">
                <span>¿Cómo ingresar tu equipo?</span>
                <span>↓</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. GAMA DE EQUIPOS ATENDIDOS ── */}
      <section className="service-types-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-eyebrow">Diagnóstico Profesional</span>
            <h2 className="section-heading">¿Qué equipos y fallas reparamos en nuestro local?</h2>
            <p className="section-subtext">
              Presupuestos 100% sin cargo en mostrador en Catamarca 3420. Contamos con repuestos garantizados para resolver las fallas más complejas.
            </p>
          </div>

          <div className="service-types-grid">
            {REPAIR_SERVICES.map((item, idx) => (
              <motion.div
                key={item.id}
                className="type-bento-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="type-icon-box">{item.icon}</div>
                <h3 className="type-card-title">{item.title}</h3>
                <p className="type-card-desc">{item.desc}</p>
                
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-black)', display: 'block', marginBottom: '6px' }}>
                    Fallas atendidas:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-gray-medium)', lineHeight: '1.45' }}>
                    {item.symptoms.slice(0, 4).map((sym, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '3px' }}>{sym}</li>
                    ))}
                  </ul>
                </div>

                {item.notaEspecial && (
                  <div style={{ marginTop: '10px', padding: '6px 10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '6px', fontSize: '0.75rem', color: '#856404' }}>
                    ℹ️ <strong>Importante:</strong> {item.notaEspecial}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INFORMES TÉCNICOS PARA ASEGURADORAS Y SINIESTROS ── */}
      <section className="service-insurance-section">
        <div className="container">
          <motion.div
            className="insurance-highlight-banner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="insurance-banner-info">
              <h3>¿Tu equipo sufrió daños por una tormenta o sobretensión?</h3>
              <p>
                Somos referentes en Santa Fe para la emisión de <strong>informes técnicos oficiales para aseguradoras de hogar</strong>. Evaluamos si la fuente o la placa principal sufrieron descargas por rayos o alteraciones de voltaje y redactamos el dictamen técnico oficial con desglose de repuestos para que gestiones tu reintegro.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWaModalOpen(true)}
              className="insurance-banner-cta"
            >
              <span>Consultar informe para seguro</span>
              <span>↗</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 4. PROCESO PRESENCIAL DE PRESUPUESTO Y CONSULTAS ── */}
      <section className="service-process-section" id="proceso-presupuesto">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-heading">¿Cómo es el proceso de diagnóstico y presupuesto?</h2>
            <p className="section-subtext">
              Al tratarse de reparaciones, los presupuestos se realizan exclusivamente con el equipo en nuestro taller.
            </p>
          </div>

          <div className="service-process-grid">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="service-process-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <div className="process-card-header">
                  <span className="process-step-num">{step.number}</span>
                  <span className="process-step-line" />
                </div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Respaldo Técnico Integrado: Presupuesto y Garantía */}
          <div className="guarantee-box">
            <div className="guarantee-grid">
              <div className="policy-card">
                <div className="policy-icon">📋</div>
                <div className="policy-content">
                  <h3>Presupuestos 100% Sin Cargo</h3>
                  <p>
                    Revisamos tu equipo sin costo. Si el presupuesto no se adapta a lo que buscás, podés retirar tu electrodoméstico sin cargo.
                  </p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-icon">🛡️</div>
                <div className="policy-content">
                  <h3>Garantía de 3 Meses</h3>
                  <p>
                    Todas nuestras reparaciones cuentan con una <strong>garantía por escrito de 90 días</strong> sobre el repuesto cambiado y la mano de obra realizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas duales de acción */}
          <motion.div
            className="service-action-banner-grid"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Tarjeta 1: Redirigir a la página de Contacto */}
            <div className="service-action-card action-contact">
              <div className="action-card-icon">📍</div>
              <div className="action-card-body">
                <span className="action-badge">Recepción de Equipos</span>
                <h3 className="action-title">¿Querés traer tu electrodoméstico hoy?</h3>
                <p className="action-text">
                  Visitá nuestra sección de contacto para conocer la ubicación exacta del taller en <strong>Catamarca 3420</strong>, ver el mapa interactivo y revisar nuestros horarios.
                </p>
                <Link to="/contacto" className="action-btn btn-primary-red">
                  <span>Ver ubicación, horarios y mapa</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: Consulta directa por WhatsApp */}
            <div className="service-action-card action-wa">
              <div className="action-card-icon">💬</div>
              <div className="action-card-body">
                <span className="action-badge">Asesoría Técnica</span>
                <h3 className="action-title">¿Tenés dudas antes de traer tu equipo?</h3>
                <p className="action-text">
                  Si necesitás consultar si recibimos un modelo específico de Smart TV, verificar stock de algún componente o despejar cualquier inquietud previa, escribile directamente a nuestros técnicos.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWaModalOpen(true)}
                  className="action-btn btn-whatsapp"
                  style={{ cursor: 'pointer', border: 'none' }}
                >
                  <span>Consultar inquietud por WhatsApp</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        title="Asesoría Técnica por WhatsApp"
        subtitle="Consulta previa sobre Servicio Técnico"
        customMessage="Hola Saba Multiservice! Tengo una consulta sobre una reparación o presupuesto antes de llevar mi equipo a su taller..."
      />
    </div>
  );
};

export default ServicioTecnico;
