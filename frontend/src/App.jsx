import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatButton } from './components/layout/WhatsAppFloatButton';
import { AdminLayout } from './components/layout/AdminLayout';

// Shared Components
import { ScrollToTop } from './components/shared/ScrollToTop';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AdminProtectedRoute } from './components/shared/AdminProtectedRoute';

// Pages
import Home from './pages/Home';
import ServicioTecnico from './pages/ServicioTecnico';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MiCuenta from './pages/MiCuenta';
import TerminosCondiciones from './pages/TerminosCondiciones';
import PoliticasPrivacidad from './pages/PoliticasPrivacidad';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMensajes from './pages/admin/AdminMensajes';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminProductos from './pages/admin/AdminProductos';
import AdminMarcas from './pages/admin/AdminMarcas';

import { pageTransition } from './lib/motionVariants';

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

  return (
    <>
      {/* Hide standard Navbar on admin routes */}
      {!isAdminRoute && <Navbar />}
      
      {/* Reset window scroll on transition */}
      <ScrollToTop />
      
      <main className={isAdminRoute ? 'admin-main-container' : isHome ? 'main-content-home' : 'main-content-page'}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Pages */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/servicio-tecnico" element={<PageWrapper><ServicioTecnico /></PageWrapper>} />
            <Route path="/productos" element={<PageWrapper><Catalogo /></PageWrapper>} />
            <Route path="/productos/:slug" element={<PageWrapper><ProductoDetalle /></PageWrapper>} />
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
