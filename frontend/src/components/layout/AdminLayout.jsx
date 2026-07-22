import React, { useState } from 'react';
import { NavLink, useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/AdminLayout.css';

export const AdminLayout = () => {
  const { profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', end: true },
    { name: 'Mensajes / Consultas', path: '/admin/mensajes' },
    { name: 'Categorías', path: '/admin/categorias' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Marcas / Líneas', path: '/admin/marcas' },
  ];

  return (
    <div className="admin-layout">
      {/* Top Navbar for mobile header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button
            className="admin-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Alternar menú"
          >
            &#9776;
          </button>
          <Link to="/" className="admin-logo">
            <span className="logo-saba">SABA</span>
            <span className="logo-ms">MS</span>
            <span className="admin-badge">Panel Admin</span>
          </Link>
        </div>
        <div className="admin-header-right">
          <span className="admin-user-name">Hola, {profile?.full_name || 'Admin'}</span>
          <button onClick={handleSignOut} className="admin-header-logout-btn">
            Salir
          </button>
        </div>
      </header>

      <div className="admin-content-container">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'admin-sidebar-open' : ''}`}>
          <nav className="admin-sidebar-nav">
            <div className="admin-sidebar-section">
              <span className="admin-section-label">Gestión</span>
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            
            <div className="admin-sidebar-section admin-sidebar-footer-section">
              <span className="admin-section-label">Sistema</span>
              <Link to="/" className="admin-nav-link text-muted">
                Volver al Sitio
              </Link>
              <button onClick={handleSignOut} className="admin-sidebar-logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div className="admin-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
