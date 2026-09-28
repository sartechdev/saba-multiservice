import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatButton } from './components/layout/WhatsAppFloatButton';

// Shared Components
import { ScrollToTop } from './components/shared/ScrollToTop';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminProtectedRoute } from './components/shared/AdminProtectedRoute';

// Home se mantiene inmediato para carga ultrarrápida del primer render
import Home from './pages/Home';

// Lazy-loaded Public Pages
const ServicioTecnico = lazy(() => import('./pages/ServicioTecnico'));
const Catalogo = lazy(() => import('./pages/Catalogo'));
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle'));
const Nosotros = lazy(() => import('./pages/Nosotros'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Login = lazy(() => import('./pages/Login'));
const Registro = lazy(() => import('./pages/Registro'));
const MiCuenta = lazy(() => import('./pages/MiCuenta'));
const TerminosCondiciones = lazy(() => import('./pages/TerminosCondiciones'));
const PoliticasPrivacidad = lazy(() => import('./pages/PoliticasPrivacidad'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-loaded Admin Layout & Pages (aislados del bundle público de clientes)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMensajes = lazy(() => import('./pages/admin/AdminMensajes'));
const AdminCategorias = lazy(() => import('./pages/admin/AdminCategorias'));
const AdminProductos = lazy(() => import('./pages/admin/AdminProductos'));
const AdminMarcas = lazy(() => import('./pages/admin/AdminMarcas'));

import { pageTransition } from './lib/motionVariants';

// Indicador de carga ligero para transiciones lazy
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      width: '100%',
      padding: '40px 16px'
    }}
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        border: '3px solid var(--color-gray-light)',
        borderTop: '3px solid var(--color-red-primary)',
        borderRadius: '50%',
        animation: 'sabaSpinner 0.8s linear infinite'
      }}
    />
    <style>{`
      @keyframes sabaSpinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Page animation wrapper
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};


const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';
  const isNosotros = location.pathname === '/nosotros';
  const isHeroPage = isHome || isNosotros;

  return (
    <>
      {/* Hide standard Navbar on admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Reset window scroll on transition */}
      <ScrollToTop />

      <main className={isAdminRoute ? 'admin-main-container' : isHeroPage ? 'main-content-home' : 'main-content-page'}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              {/* Public Pages */}
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/servicio-tecnico" element={<PageWrapper><ServicioTecnico /></PageWrapper>} />
              <Route path="/productos" element={<PageWrapper><Catalogo /></PageWrapper>} />
              <Route path="/productos/:slug" element={<PageWrapper><ProductoDetalle /></PageWrapper>} />
              {/* Alias y redirecciones retrocompatibles */}
              <Route path="/catalogo" element={<Navigate to="/productos" replace />} />
              <Route path="/producto/:slug" element={<PageWrapper><ProductoDetalle /></PageWrapper>} />
              <Route path="/nosotros" element={<PageWrapper><Nosotros /></PageWrapper>} />
              <Route path="/contacto" element={<PageWrapper><Contacto /></PageWrapper>} />
              <Route path="/ingresar" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/registro" element={<PageWrapper><Registro /></PageWrapper>} />
              <Route path="/terminos-y-condiciones" element={<PageWrapper><TerminosCondiciones /></PageWrapper>} />
              <Route path="/politicas-de-privacidad" element={<PageWrapper><PoliticasPrivacidad /></PageWrapper>} />

              {/* Protected Client Pages */}
              <Route path="/mi-cuenta" element={
                <ProtectedRoute>
                  <PageWrapper><MiCuenta /></PageWrapper>
                </ProtectedRoute>
              } />

              {/* Admin Authentication */}
              <Route path="/admin/ingresar" element={<PageWrapper><AdminLogin /></PageWrapper>} />

              {/* Protected Admin Console Pages inside AdminLayout */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }>
                <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="mensajes" element={<PageWrapper><AdminMensajes /></PageWrapper>} />
                <Route path="categorias" element={<PageWrapper><AdminCategorias /></PageWrapper>} />
                <Route path="productos" element={<PageWrapper><AdminProductos /></PageWrapper>} />
                <Route path="marcas" element={<PageWrapper><AdminMarcas /></PageWrapper>} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Hide standard Footer on admin routes */}
      {!isAdminRoute && <Footer />}

      {/* WhatsApp float is always present but hides internally inside admin pages */}
      <WhatsAppFloatButton />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
