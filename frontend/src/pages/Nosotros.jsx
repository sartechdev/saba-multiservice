import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/motionVariants';
import { ReviewCard } from '../components/shared/ReviewCard';
import { REAL_REVIEWS } from '../data/reviewsData';
import frente2Img from '../assets/frente2.webp';
import caloventorImg from '../assets/caloventor.webp';
import controlesImg from '../assets/controles.webp';
import '../styles/Nosotros.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493425011410';

export default function Nosotros() {
  return (
    <div className="about-landing-wrapper">
      <Helmet>
        <title>Nosotros y Trayectoria en Santa Fe | Saba Multiservice</title>
        <meta
          name="description"
          content="Más de 30 años de trayectoria en reparación de electrodomésticos, 150+ reseñas reales 4.6★ e informes técnicos oficiales para aseguradoras en Santa Fe Capital."
        />
        <link rel="canonical" href="https://sabamultiservice.com.ar/nosotros" />
        <meta property="og:title" content="Sobre Saba Multiservice | 30 Años de Experiencia" />
        <meta property="og:description" content="Taller tradicional con tecnología digital y más de 30 años al servicio de Santa Fe en Catamarca 3420." />
        <meta property="og:url" content="https://sabamultiservice.com.ar/nosotros" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sabamultiservice.com.ar/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Nosotros y Trayectoria - Saba Multiservice",
            "url": "https://sabamultiservice.com.ar/nosotros",
            "description": "Historia y trayectoria técnica de Saba Multiservice en Santa Fe Capital."
          })}
        </script>
      </Helmet>

      {/* ── 1. HERO SUPERIOR DE HISTORIA & GALERÍA (MODO OSCURO) ── */}
      <section className="about-history-hero">
        <div className="about-hero-glow" />
        <div className="container">
          <motion.div
            className="history-grid"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {/* Columna Izquierda: Historia */}
            <div className="history-content">
              <h1 className="history-title">Un taller tradicional con tecnología digital moderna</h1>
              
              {/* // TODO: contenido real a confirmar con el cliente */}
              <p className="history-text">
                Desde nuestros comienzos en la ciudad de Santa Fe, Saba Multiservice nació con una premisa clara: brindar una solución técnica confiable frente a la cultura del descarte. A lo largo de más de dos décadas, hemos acompañado la evolución tecnológica desde los clásicos televisores de tubo y las primeras videocaseteras hasta los actuales Smart TV 4K, microondas digitales y electrónica de alta precisión.
              </p>
              <p className="history-text">
                Hoy en día, nuestro local en <strong>Catamarca 3420</strong> combina esa calidez del mostrador tradicional, donde te atiende directamente quien repara tu equipo, con instrumental digital avanzado para el diagnóstico de placas madre y bancos de pruebas especializados en línea blanca.
              </p>
              {/* // Nota interna: reseña histórica sujeta a expansión con anécdotas de los fundadores del comercio */}
            </div>

            {/* Columna Derecha: Fotos Reales del Local y Taller */}
            <div className="history-gallery-grid">
              <div className="gallery-real-card large">
                <img src={frente2Img} alt="Fachada y Mostrador Principal de Saba Multiservice en Catamarca 3420" className="gallery-card-img" />
                <div className="gallery-card-overlay">
                  <h4 className="gallery-card-title">Fachada y Mostrador Principal</h4>
                  <p className="gallery-card-subtitle">Catamarca 3420, Santa Fe Capital</p>
                </div>
              </div>

              <div className="gallery-real-card">
                <img src={caloventorImg} alt="Banco de Pruebas e instrumental de diagnóstico en laboratorio Saba" className="gallery-card-img" />
                <div className="gallery-card-overlay">
                  <h4 className="gallery-card-title">Banco de Pruebas</h4>
                  <p className="gallery-card-subtitle">Laboratorio e instrumental</p>
                </div>
              </div>

              <div className="gallery-real-card">
                <img src={controlesImg} alt="Stock de repuestos originales y controles en mostrador" className="gallery-card-img" />
                <div className="gallery-card-overlay">
                  <h4 className="gallery-card-title">Stock de Repuestos</h4>
                  <p className="gallery-card-subtitle">Componentes originales</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. ESTADÍSTICAS & CREDIBILIDAD ── */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            <motion.div
              className="about-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <div>
                <span className="stat-icon">⚡</span>
                <div className="stat-number">+30</div>
              </div>
              <div>
                <h3 className="stat-title">Años de Trayectoria</h3>
                <p className="stat-desc">Experiencia ininterrumpida diagnosticando circuitos y motores en Santa Fe.</p>
              </div>
            </motion.div>

            <motion.div
              className="about-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div>
                <span className="stat-icon">⭐</span>
                <div className="stat-number">4.6★</div>
              </div>
              <div>
                <h3 className="stat-title">Calificación en Google</h3>
                <p className="stat-desc">Promedio de satisfacción verificado por cientos de clientes en nuestro local.</p>
              </div>
            </motion.div>

            <motion.div
              className="about-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <span className="stat-icon">🛡️</span>
                <div className="stat-number" style={{ fontSize: '2.2rem', fontFamily: 'inherit', letterSpacing: '-0.5px' }}>Garantía</div>
              </div>
              <div>
                <h3 className="stat-title">Respaldo Escrito Oficial</h3>
                <p className="stat-desc">Todas nuestras reparaciones y repuestos instalados cuentan con garantía escrita en comprobante y prueba en mostrador.</p>
              </div>
            </motion.div>

            <motion.div
              className="about-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <span className="stat-icon">📄</span>
                <div className="stat-number">100%</div>
              </div>
              <div>
                <h3 className="stat-title">Informes para Seguros</h3>
                <p className="stat-desc">Emitimos dictámenes oficiales para reclamos de siniestros y aseguradoras.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. RESEÑAS AMPLIADAS DE CLIENTES ── */}
      <section className="about-reviews-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-heading">Opiniones verificadas en Google Maps</h2>
            <p className="section-subtext">
              La confianza en Santa Fe se construye día a día en el mostrador devolviendo equipos funcionando con garantía escrita.
            </p>
          </div>

          <div className="about-reviews-grid">
            {REAL_REVIEWS.slice(0, 9).map((rev, idx) => (
              <ReviewCard
                key={idx}
                name={rev.name}
                text={rev.text}
                rating={rev.rating}
                delay={idx * 0.08}
                animate={true}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
