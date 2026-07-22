import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ReviewCard } from '../components/shared/ReviewCard';
import { ProductCardMini } from '../components/shared/ProductCardMini';
import { MapEmbed } from '../components/shared/MapEmbed';
import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import heroImg from '../assets/wppHero.png';
import controlesImg from '../assets/controles.webp';
import { REAL_REVIEWS } from '../data/reviewsData';
import '../styles/Home.css';

// WhatsApp config
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493425011410';
const WA_HERO_MSG = encodeURIComponent(
  'Hola, quiero consultar por la reparación de un electrodoméstico.'
);

// ── PRECISION INLINE SVG ICONS (Ultra-light, architectural lines, ZERO emojis) ──
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const StarIconFilled = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ClockFastIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const WrenchToolIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const AwardBadgeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

// Category Icons
const TvIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
);

const MicrowaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="17" y1="8" x2="17" y2="8.01" />
    <line x1="17" y1="12" x2="17" y2="12.01" />
    <line x1="17" y1="16" x2="17" y2="16.01" />
    <path d="M6 12h7" />
  </svg>
);

const OvenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M6 8h12" />
    <circle cx="8" cy="14" r="2" />
    <circle cx="16" cy="14" r="2" />
  </svg>
);

const FanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-3 0-4.5-1.5-4.5-3.5S9 5 12 5s4.5 1.5 4.5 3.5-1.5 3.5-4.5 3.5z" />
    <path d="M12 12c0 3 1.5 4.5 3.5 4.5S19 15 19 12s-1.5-4.5-3.5-4.5-3.5 1.5-3.5 4.5z" />
    <path d="M12 12c3 0 4.5 1.5 4.5 3.5S15 19 12 19s-4.5-1.5-4.5-3.5 1.5-3.5 4.5-3.5z" />
    <path d="M12 12c0-3-1.5-4.5-3.5-4.5S5 9 5 12s1.5 4.5 3.5 4.5 3.5-1.5 3.5-4.5z" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const RemoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <circle cx="12" cy="7" r="1.5" />
    <line x1="10" y1="12" x2="10" y2="12.01" />
    <line x1="14" y1="12" x2="14" y2="12.01" />
    <line x1="10" y1="16" x2="10" y2="16.01" />
    <line x1="14" y1="16" x2="14" y2="16.01" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Animation variants (imported from centralized library)
import { fadeInUp as fadeUp, staggerContainer as stagger } from '../lib/motionVariants';


// ── Placeholder review data ──
const PLACEHOLDER_REVIEWS = [
  {
    name: 'Carlos M. Fernández',
    text: 'Excelente servicio técnico. Llevé un Smart TV LG que no daba imagen y en el día me diagnosticaron la falla de los LEDs. Presupuesto claro y con garantía.',
    rating: 5,
  },
  {
    name: 'Mariana González',
    text: 'Me arreglaron el horno eléctrico y un microondas. Lo mejor es que te dan el presupuesto totalmente sin compromiso. Muy honestos y amables.',
    rating: 5,
  },
  {
    name: 'Roberto D. Peralta',
    text: 'Hace más de 10 años que confío en Saba para arreglar las cosas de casa. El taller está sobre calle Catamarca y siempre responden rápido.',
    rating: 5,
  },
];

// ── Steps data ──
const STEPS = [
  {
    number: 1,
    title: 'Traé tu equipo al local',
    description: 'Recibimos tu electrodoméstico en Catamarca 3420 o coordinamos consulta inicial por WhatsApp.',
  },
  {
    number: 2,
    title: 'Diagnóstico sin cargo',
    description: 'Revisamos a fondo la falla técnica y emitimos un presupuesto 100% gratuito en el día.',
  },
  {
    number: 3,
    title: 'Reparación especializada',
    description: 'Aprobado el presupuesto, nuestros técnicos reparan el equipo con repuestos probados en el taller.',
  },
  {
    number: 4,
    title: 'Retirá con garantía escrita',
    description: 'Te llevás tu electrodoméstico funcionando perfecto y con certificado de garantía por 3 meses.',
  },
];

// ── Diferenciales data (high-impact dark section) ──
const DIFERENCIALES = [
  {
    icon: <ClockFastIcon />,
    title: 'Reparaciones rápidas en 24hs',
    text: 'Entendemos la urgencia del hogar. Gran parte de los ingresos se diagnostican y resuelven en el transcurso de 24 a 48 horas.',
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'Garantía técnica por escrito',
    text: 'Cada trabajo entregado cuenta con respaldo real y cobertura de 3 meses en mano de obra y repuestos reemplazados.',
  },
  {
    icon: <WrenchToolIcon />,
    title: 'Taller propio sin intermediarios',
    text: 'Contamos con instrumental electrónico de precisión en nuestro local. No tercerizamos diagnósticos ni envíos.',
  },
  {
    icon: <AwardBadgeIcon />,
    title: '+25 años de trayectoria',
    text: 'Más de dos décadas ininterrumpidas brindando soluciones confiables a familias y comercios de Santa Fe Capital.',
  },
];

// ── Multimarca Static Tags ──
const MULTIMARCA_LIST = [
  'Samsung', 'LG', 'Whirlpool', 'Philips', 'Drean', 'Noblex', 
  'Peabody', 'BGH', 'Ultracomb', 'Liliana', 'Philco', 'TCL', 
  'Sony', 'Motorola', 'Atma', 'Electrolux', 'Hitachi', 'Sanyo', 'Patrick', 'Longvie'
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('available', true)
          .order('created_at', { ascending: false })
          .limit(4);
        if (!error && data) setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Saba Multiservice | Servicio Técnico Oficial y Repuestos en Santa Fe Capital</title>
        <meta
          name="description"
          content="Servicio técnico especializado en reparación de Smart TV, microondas y línea blanca en Santa Fe Capital. Venta de repuestos originales con garantía escrita. +25 años de trayectoria."
        />
        <link rel="canonical" href="https://sabamultiservice.com.ar/" />
        <meta property="og:title" content="Saba Multiservice | Servicio Técnico Oficial en Santa Fe" />
        <meta property="og:description" content="Reparaciones especializadas con diagnóstico sin cargo y garantía escrita por 3 meses en Catamarca 3420, Santa Fe." />
        <meta property="og:url" content="https://sabamultiservice.com.ar/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sabamultiservice.com.ar/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Saba Multiservice",
            "url": "https://sabamultiservice.com.ar/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://sabamultiservice.com.ar/catalogo?buscar={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>


      {/* ── 1. HERO (Full-Viewport Immersive — "Taller de Precisión") ── */}
      <section className="hero-section">
        {/* Animated background image with slow zoom */}
        <motion.img
          src={heroImg}
          alt="Frente del local Saba Multiservice en Catamarca 3420, Santa Fe"
          className="hero-bg-image"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="hero-overlay" />
        {/* Ambient brand glow */}
        <div className="hero-ambient-glow" />

        <div className="hero-inner">
          {/* ── Left Content (Right side is 100% free for background image) ── */}
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            }}
          >
            {/* Brand Title */}
            <motion.div
              className="hero-brand-top"
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="hero-brand-name-wrapper">
                <span className="hero-brand-name">SABA MULTISERVICE</span>
              </div>
            </motion.div>

            {/* Headline — Qué hace el comercio */}
            <motion.h1
              className="hero-headline"
              variants={{
                hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            >
              Reparamos tu electrodoméstico con{' '}
              <span className="hero-headline-accent">presupuesto sin cargo</span> y garantía
              escrita
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="hero-subtitle"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              Taller electrónico especializado. Más de 25 años devolviendo la vida a televisores,
              hornos, microondas y pequeños electrodomésticos en el día.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-ctas"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link to="/servicio-tecnico" className="hero-cta-primary">
                <span>Contactanos</span>
                <span className="cta-arrow">↗</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsWaModalOpen(true)}
                className="hero-cta-whatsapp"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <WhatsAppIcon />
                <span>Consultar por WhatsApp</span>
              </button>
            </motion.div>

            {/* Stats Row integrated below CTAs on the left side to leave right side free */}
            <motion.div
              className="hero-stats-row"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Stat 1: Trayectoria */}
              <div className="hero-stat-card">
                <div className="hero-stat-icon">
                  <AwardBadgeIcon />
                </div>
                <div className="hero-stat-text">
                  <h4>+25 Años</h4>
                  <p>Trayectoria ininterrumpida</p>
                </div>
              </div>

              {/* Stat 2: Garantía */}
              <div className="hero-stat-card">
                <div className="hero-stat-icon">
                  <ShieldCheckIcon />
                </div>
                <div className="hero-stat-text">
                  <h4>3 Meses Garantía</h4>
                  <p>Respaldo por escrito</p>
                </div>
              </div>

              {/* Stat 3: Rating */}
              <div className="hero-stat-card">
                <div className="hero-stat-icon">
                  <StarIconFilled />
                </div>
                <div className="hero-stat-text">
                  <h4>4.6 ★ Google</h4>
                  <p>+150 opiniones verificadas</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span>Descubrí más</span>
          <div className="hero-scroll-line" />
        </motion.div>
      </section>

      {/* ── 2. CÓMO FUNCIONA (Connected Architectural Timeline) ── */}
      <section className="steps-section">
        <div className="container">
          <motion.h2
            className="home-section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            Cómo trabajamos en nuestro taller
          </motion.h2>
          <motion.p
            className="home-section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Un proceso técnico claro, transparente y sin letra chica. Vos tenés el control total antes de cualquier reparación.
          </motion.p>

          <motion.div
            className="steps-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="step-card"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="step-number-badge">0{step.number}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="steps-trust-banner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="steps-trust-icon">✓</div>
            <div>
              <strong>Compromiso:</strong> Si por cualquier motivo decidís no realizar la reparación una vez emitido el diagnóstico, te devolvemos tu electrodoméstico exactamente como ingresó, sin cobrarte un solo centavo de revisión.
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. DIFERENCIALES (HIGH-IMPACT OLED DARK BLOCK) ── */}
      <section className="diferenciales-section">
        <div className="diferenciales-bg-glow" />
        <div className="container">
          <motion.div
            className="diferenciales-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <h2 className="diferenciales-title">Calidad técnica y honestidad comercial</h2>
            <p className="diferenciales-subtitle">
              No somos un servicio de intermediación ni derivamos trabajos. Operamos con laboratorio propio y repuestos originales de primera marca.
            </p>
          </motion.div>

          <motion.div
            className="diferenciales-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {DIFERENCIALES.map((d, i) => (
              <motion.div
                key={d.title}
                className="diferencial-card"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div className="diferencial-icon-box">{d.icon}</div>
                <div className="diferencial-content">
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. QUÉ REPARAMOS (ASYMMETRICAL BENTO GRID w/ CONTROLES.WEBP) ── */}
      <section className="bento-section">
        <div className="container">
          <motion.h2
            className="home-section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            Especialidades de nuestro laboratorio
          </motion.h2>
          <motion.p
            className="home-section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Solucionamos fallas complejas en placas main, fuentes de alimentación, sistemas de calentamiento y motores.
          </motion.p>

          <motion.div
            className="bento-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {/* Featured Bento Card spanning 2 cols using controles.webp */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="bento-card bento-card-featured">
              <img src={controlesImg} alt="Venta y reparación de controles remotos en Saba" className="bento-featured-bg" />
              <div className="bento-featured-gradient" />
              <div className="bento-content">
                <div className="bento-icon-wrapper">
                  <RemoteIcon />
                </div>
                <h3 className="bento-title">Controles Remotos y Accesorios</h3>
                <p className="bento-desc">
                  Contamos con el mayor stock de controles remotos originales y alternativos para todas las marcas de Smart TV, aires acondicionados y sistemas de audio. Además, cables, soportes y periféricos para PC y celular.
                </p>
                <Link to="/productos" className="bento-action">
                  <span>Explorar inventario en local</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>

            {/* Smart TV Card */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <Link to="/servicio-tecnico" className="bento-card" style={{ height: '100%' }}>
                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    <TvIcon />
                  </div>
                  <h3 className="bento-title">Televisores y Smart TV</h3>
                  <p className="bento-desc">
                    Cambio de tiras LED, reparación de placas main, fuentes y problemas de firmware en pantallas LCD y LED de 24" a 75".
                  </p>
                </div>
                <span className="bento-action mt-4">Consultar reparación →</span>
              </Link>
            </motion.div>

            {/* Microondas Card */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <Link to="/servicio-tecnico" className="bento-card" style={{ height: '100%' }}>
                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    <MicrowaveIcon />
                  </div>
                  <h3 className="bento-title">Microondas y Hornos</h3>
                  <p className="bento-desc">
                    Reemplazo de magnetrones, membranas táctiles, platos giratorios, transformadores de alta tensión y termostatos.
                  </p>
                </div>
                <span className="bento-action mt-4">Consultar reparación →</span>
              </Link>
            </motion.div>

            {/* Hornos eléctricos & Calefacción */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
              <Link to="/servicio-tecnico" className="bento-card" style={{ height: '100%' }}>
                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    <OvenIcon />
                  </div>
                  <h3 className="bento-title">Calefacción y Climatización</h3>
                  <p className="bento-desc">
                    Reparación de caloventores, estufas halógenas, paneles cerámicos, ventiladores de pie y de pared.
                  </p>
                </div>
                <span className="bento-action mt-4">Consultar reparación →</span>
              </Link>
            </motion.div>

            {/* Ventiladores y Pequeños Electro */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5, delay: 0.25 }}>
              <Link to="/servicio-tecnico" className="bento-card" style={{ height: '100%' }}>
                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    <FanIcon />
                  </div>
                  <h3 className="bento-title">Pequeños Electrodomésticos</h3>
                  <p className="bento-desc">
                    Arreglo de licuadoras, procesadoras, planchas, pavas eléctricas, freidoras y artefactos de cocina en general.
                  </p>
                </div>
                <span className="bento-action mt-4">Consultar reparación →</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. MARCAS QUE REPARAMOS (Sleek Static Pills) ── */}
      <section className="brands-section">
        <div className="container">
          <div className="brands-header">
            <motion.h2
              className="home-section-title"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Especialistas multimarca
            </motion.h2>
            <motion.p
              className="home-section-subtitle"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Reparamos todas las líneas de electrodomésticos nacionales e importadas con instrumental de precisión.
            </motion.p>
          </div>

          <motion.div
            className="multimarca-static-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="multimarca-pills-wrapper">
              {MULTIMARCA_LIST.map((name, i) => (
                <span key={i} className="multimarca-pill">
                  {name}
                </span>
              ))}
              <span className="multimarca-pill multimarca-pill-more">+ y muchas más</span>
            </div>
            <p className="multimarca-note">
              ¿Tu equipo es de otra marca o modelo discontinuado? Consultanos por WhatsApp o acercalo a nuestro taller en Catamarca 3420 para evaluación técnica en el día.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 6. PRUEBA SOCIAL / RESEÑAS (Marquee Infinito Animado) ── */}
      <section className="reviews-section">
        <div className="container">
          <motion.div
            className="reviews-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="reviews-stat-badge">
              <span className="reviews-rating-number">4.6</span>
              <div className="reviews-rating-details">
                <div className="reviews-rating-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIconFilled key={i} />
                  ))}
                </div>
                <span className="reviews-count-text">Basado en opiniones verificadas en Google Maps</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee de ancho completo fuera del container para mejor efecto inmersivo */}
        <div className="reviews-marquee-container">
          <div className="reviews-marquee-track">
            {/* Duplicamos la lista para lograr un loop infinito perfecto en CSS */}
            {[...REAL_REVIEWS, ...REAL_REVIEWS].map((review, i) => (
              <ReviewCard
                key={i}
                name={review.name}
                text={review.text}
                rating={review.rating}
                animate={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PREVIEW DE CATÁLOGO (jerarquía menor) ── */}
      <section className="catalog-section">
        <div className="container">
          <div className="catalog-header">
            <div>
              <motion.h2
                className="home-section-title"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
                Productos en mostrador
              </motion.h2>
              <p className="home-section-subtitle mb-0">
                Selección de electrodomésticos, repuestos y accesorios disponibles para retiro en local.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to="/productos" className="catalog-link">
                <span>Ver vitrina completa</span>
                <span>→</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="catalog-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {loadingProducts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f2f2ee',
                    borderRadius: 'var(--radius-md)',
                    minHeight: 220,
                  }}
                />
              ))
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <ProductCardMini product={product} />
                </motion.div>
              ))
            ) : (
              <p style={{ color: 'var(--color-gray-medium)', gridColumn: '1 / -1' }}>
                Próximamente publicaremos el inventario actualizado en esta sección.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── 8. COBERTURA Y CONTACTO (Hardware Split Layout) ── */}
      <section className="coverage-section">
        <div className="container">
          <motion.h2
            className="home-section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            Nuestro local en Santa Fe
          </motion.h2>
          <motion.p
            className="home-section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Acercate a nuestro mostrador para atención personalizada e ingreso rápido de equipos.
          </motion.p>

          <motion.div
            className="coverage-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div
              className="coverage-map-outer"
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >
              <div className="coverage-map-inner" style={{ border: 0, padding: 0, height: '100%', minHeight: '380px' }}>
                <MapEmbed height="100%" />
              </div>
            </motion.div>

            <motion.div
              className="coverage-info"
              variants={fadeUp}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <div className="coverage-detail-item">
                <div className="coverage-icon-box">
                  <MapPinIcon />
                </div>
                <div>
                  <h4>Dirección comercial</h4>
                  <p>Catamarca 3420, Santa Fe de la Vera Cruz, Santa Fe, Argentina</p>
                </div>
              </div>

              <div className="coverage-detail-item">
                <div className="coverage-icon-box">
                  <ClockIcon />
                </div>
                <div>
                  <h4>Horarios de atención de mostrador</h4>
                  <p>Lunes a Viernes de 9:00 a 18:00 hs y Sábados de 9:00 a 12:00 hs</p>
                </div>
              </div>

              <div className="coverage-detail-item">
                <div className="coverage-icon-box">
                  <PhoneIcon />
                </div>
                <div>
                  <h4>Teléfono celular y WhatsApp</h4>
                  <p>
                    <a href="tel:+5493425011410" style={{ color: 'var(--color-black)', fontWeight: 600 }}>
                      +54 9 342 501-1410
                    </a>
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsWaModalOpen(true)}
                  className="hero-cta-whatsapp"
                  style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                >
                  <WhatsAppIcon />
                  <span>Enviar mensaje por WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        title="Consultas e Informes"
        subtitle="Saba Multiservice - Santa Fe"
        customMessage="Hola Saba Multiservice! Quisiera realizar una consulta general."
      />
    </>
  );
}
