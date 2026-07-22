import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../lib/motionVariants';
import { Link } from 'react-router-dom';

import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import servicioTecnicoBg from '../assets/servicio-tecnico.jpg';
import '../styles/ServicioTecnico.css';

export const ServicioTecnico = () => {
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  const applianceTypes = [
    {
      icon: '📺',
      title: 'TV y Smart TV',
      desc: 'Reparamos fuentes quemadas, reemplazamos tiras LED de pantalla oscura, solucionamos fallas de reinicio en Android/Google TV y problemas de sintonía.'
    },
    {
      icon: '⚡',
      title: 'Microondas y Hornos',
      desc: 'Cambio de magnetrón por falta de calentamiento, reparación de teclado o membrana táctil, placas electrónicas y platos giratorios.'
    },
    {
      icon: '🔥',
      title: 'Calefacción y Caloventores',
      desc: 'Mantenimiento de estufas halógenas, caloventores eléctricos, radiadores de aceite y termostatos de seguridad anticalentamiento.'
    },
    {
      icon: '🌀',
      title: 'Ventilación de Pie y Techo',
      desc: 'Cambio de bujes y rodamientos de motor frenado, bobinados, botoneras de velocidad y balanceo de aspas metálicas o plásticas.'
    },
    {
      icon: '☕',
      title: 'Pequeños Electro de Cocina',
      desc: 'Pavas eléctricas cortocircuitadas, licuadoras, procesadoras, tostadoras y freidoras sin aceite (Air Fryer).'
    },
    {
      icon: '🔊',
      title: 'Audio y Electrónica',
      desc: 'Equipos de sonido, parlantes Bluetooth con problemas de carga, amplificadores, controles remotos y fuentes universales.'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Ingreso presencial en mostrador',
      desc: 'Traé tu electrodoméstico a nuestro local en Catamarca 3420, Santa Fe. No necesitás turno previo; te entregamos una orden de ingreso oficial en el acto.'
    },
    {
      number: '02',
      title: 'Diagnóstico en laboratorio técnico',
      desc: 'Nuestros especialistas destapan el equipo, miden componentes en banco de pruebas y constatan la causa exacta de la falla con instrumental de alta precisión.'
    },
    {
      number: '03',
      title: 'Presupuesto informado y sin cargo',
      desc: 'Te comunicamos por teléfono o WhatsApp el costo con repuestos y mano de obra. Si aceptás, reparamos. Si decidís no hacerlo, retirás sin pagar un solo centavo.'
    }
  ];

  return (
    <div className="service-landing-wrapper">
      <Helmet>
        <title>Servicio Técnico Oficial de Electrodomésticos en Santa Fe | Saba Multiservice</title>
        <meta
          name="description"
          content="Reparación especializada de Smart TV, microondas, calefacción y electrodomésticos en Santa Fe. Diagnóstico sin cargo y garantía escrita en Catamarca 3420."
        />
        <link rel="canonical" href="https://sabamultiservice.com.ar/servicio-tecnico" />
        <meta property="og:title" content="Servicio Técnico Oficial en Santa Fe | Saba Multiservice" />
        <meta property="og:description" content="Reparación especializada de electrodomésticos y Smart TV con diagnóstico gratuito y garantía escrita." />
        <meta property="og:url" content="https://sabamultiservice.com.ar/servicio-tecnico" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sabamultiservice.com.ar/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Reparación de Electrodomésticos y Smart TV",
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
            "description": "Diagnóstico sin cargo, informes técnicos para aseguradoras y reparación con repuestos originales."
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
              Especialistas en la reparación de televisores Smart TV, microondas, equipos de audio y pequeños electrodomésticos. Atención presencial en nuestro local con repuestos originales y 90 días de garantía.
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
            <h2 className="section-heading">¿Qué equipos reparamos en laboratorio?</h2>
            <p className="section-subtext">
              Contamos con instrumental de banco de prueba y técnicos calificados para resolver fallas electrónicas complejas.
            </p>
          </div>

          <div className="service-types-grid">
            {applianceTypes.map((item, idx) => (
              <motion.div
                key={idx}
                className="service-type-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className="service-type-icon">{item.icon}</div>
                <h3 className="service-type-title">{item.title}</h3>
                <p className="service-type-desc">{item.desc}</p>
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
              Al tratarse de reparaciones electrónicas y mecánicas que requieren medición física con instrumental de laboratorio, los presupuestos se realizan exclusivamente con el equipo en nuestro taller.
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
                    Revisamos tu equipo en nuestro laboratorio sin costo. Si el presupuesto no se adapta a lo que buscás, podés retirar tu electrodoméstico sin abonar nada.
                  </p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-icon">🛡️</div>
                <div className="policy-content">
                  <h3>Garantía Escrita de 3 Meses</h3>
                  <p>
                    Todas nuestras reparaciones cuentan con una <strong>garantía oficial por escrito de 90 días corridos</strong> sobre el repuesto cambiado y la mano de obra realizada.
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
