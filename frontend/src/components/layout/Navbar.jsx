import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Navbar.css';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check state on load or route change
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicio Técnico', path: '/servicio-tecnico' },
    { name: 'Catálogo', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <header className={`main-header ${isHome && !isScrolled ? 'header-hero-transparent' : 'header-glass-scrolled'}`}>
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-ms">SABA</span>
          <span className="logo-saba">MULTISERVICE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}
          
          {/* User Account / Login button */}
          {user ? (
            <div className="user-nav-actions">
              <Link to={profile?.role === 'admin' ? '/admin' : '/mi-cuenta'} className="account-link">
                {profile?.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'} {profile?.role === 'admin' && <span className="admin-pill">Admin</span>}
              </Link>
              <button onClick={handleSignOut} className="nav-logout-btn">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/ingresar" className="nav-login-btn">
              Ingresar
            </Link>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          className={`hamburger ${isOpen ? 'hamburger-active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú de navegación"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <nav className="mobile-nav">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}

              {user ? (
                <div className="mobile-user-actions">
                  <Link
                    to={profile?.role === 'admin' ? '/admin' : '/mi-cuenta'}
                    className="mobile-nav-link mobile-account-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {profile?.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'} {profile?.role === 'admin' && <span className="admin-pill">Admin</span>}
                  </Link>
                  <button onClick={handleSignOut} className="mobile-logout-btn">
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/ingresar"
                  className="mobile-login-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Ingresar
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
