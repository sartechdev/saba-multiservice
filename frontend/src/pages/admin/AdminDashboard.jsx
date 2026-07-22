import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    nuevos: 0,
    enRevision: 0,
    totalConsultas: 0,
    productos: 0,
    categorias: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Consultas y estadísticas
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('id, full_name, phone, appliance_type, status, created_at')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // 2. Conteo de productos
      const { count: productsCount, error: prodError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });

      if (prodError && prodError.code !== 'PGRST116') {
        console.warn('Error contando productos:', prodError.message);
      }

      // 3. Conteo de categorías
      const { count: catCount, error: catError } = await supabase
        .from('categories')
        .select('id', { count: 'exact', head: true });

      if (catError && catError.code !== 'PGRST116') {
        console.warn('Error contando categorías:', catError.message);
      }

      const nuevosCount = quotesData?.filter(q => q.status === 'nuevo').length || 0;
      const revisionCount = quotesData?.filter(q => q.status === 'en_revision').length || 0;

      setStats({
        nuevos: nuevosCount,
        enRevision: revisionCount,
        totalConsultas: quotesData?.length || 0,
        productos: productsCount || 0,
        categorias: catCount || 0,
      });

      setRecentQuotes(quotesData?.slice(0, 5) || []);
    } catch (err) {
      console.error('Error al cargar datos del dashboard admin:', err);
      setError('No pudimos cargar el resumen del sistema. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="admin-console-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Dashboard Administrador | Saba Multiservice</title>
      </Helmet>

      {/* Cabecera superior */}
      <div className="admin-page-header">
        <div>
          <h1>Panel Principal del Taller</h1>
          <p>Resumen general de actividad, consultas entrantes y control de inventario.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchDashboardData} disabled={loading} className="admin-btn-secondary">
            <span>🔄</span>
            <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
          <Link to="/admin/mensajes" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
            <span>📩</span>
            <span>Ver Bandeja ({stats.nuevos})</span>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#9B2C2C', padding: '14px', borderRadius: '8px', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── TARJETAS DE MÉTRICAS / RESUMEN ── */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card stat-highlight">
          <span className="admin-stat-label">🚨 Mensajes Nuevos Sin Responder</span>
          <span className="admin-stat-number">{loading ? '-' : stats.nuevos}</span>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)', margin: 0 }}>
            {stats.nuevos === 1 ? 'Requiere atención inmediata hoy' : stats.nuevos > 1 ? 'Consultas pendientes de revisión inicial' : '¡Excelente! Bandeja al día'}
          </p>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">⏳ Presupuestos en Revisión</span>
          <span className="admin-stat-number">{loading ? '-' : stats.enRevision}</span>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)', margin: 0 }}>
            Equipos en diagnóstico de técnicos
          </p>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">📦 Catálogo y Repuestos</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span className="admin-stat-number" style={{ fontSize: '1.8rem' }}>{loading ? '-' : stats.productos}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-medium)', fontWeight: 600 }}>en {loading ? '-' : stats.categorias} categorías</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)', margin: 0 }}>
            Inventario disponible para mostrador
          </p>
        </div>
      </div>

      {/* ── ACCESOS RÁPIDOS ── */}
      <div className="admin-quick-section">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-black)' }}>
          Acciones rápidas de gestión
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-medium)', margin: 0 }}>
          Ingresá directamente a los módulos operativos del sistema
        </p>

        <div className="admin-quick-grid">
          <Link to="/admin/mensajes" className="admin-quick-btn">
            <div className="admin-quick-btn-title">
              <span>📩</span>
              <span>Bandeja de Consultas</span>
            </div>
            <div className="admin-quick-btn-desc">
              Administrar los {stats.totalConsultas} presupuestos, cambiar estados y agregar notas internas.
            </div>
          </Link>

          <Link to="/admin/productos" className="admin-quick-btn">
            <div className="admin-quick-btn-title">
              <span>🛒</span>
              <span>Gestión de Productos</span>
            </div>
            <div className="admin-quick-btn-desc">
              Crear, modificar o retirar repuestos, accesorios o electrodomésticos, y subir fotos al Storage.
            </div>
          </Link>

          <Link to="/admin/categorias" className="admin-quick-btn">
            <div className="admin-quick-btn-title">
              <span>📁</span>
              <span>Líneas y Categorías</span>
            </div>
            <div className="admin-quick-btn-desc">
              Organizar las 3 líneas principales o añadir nuevas categorías al catálogo web del comercio.
            </div>
          </Link>

          <Link to="/admin/marcas" className="admin-quick-btn">
            <div className="admin-quick-btn-title">
              <span>🏷️</span>
              <span>Marcas Oficiales</span>
            </div>
            <div className="admin-quick-btn-desc">
              Crear, modificar o retirar marcas para clasificar repuestos y permitir el filtrado por marca.
            </div>
          </Link>
        </div>
      </div>

      {/* ── ÚLTIMAS CONSULTAS RECIBIDAS ── */}
      <div className="admin-table-container">
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            Últimas Consultas Recibidas en el Taller
          </h3>
          <Link to="/admin/mensajes" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-red-primary)', textDecoration: 'none' }}>
            Ver todas las consultas →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            Cargando historial reciente...
          </div>
        ) : recentQuotes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            No hay consultas registradas en la base de datos por el momento.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Teléfono / Contacto</th>
                <th>Tipo / Línea</th>
                <th>Estado actual</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => {
                const dateFormatted = new Date(quote.created_at).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const isNew = quote.status === 'nuevo';
                return (
                  <tr key={quote.id} className={isNew ? 'admin-row-nuevo' : ''}>
                    <td style={{ whiteSpace: 'nowrap', color: '#666' }}>{dateFormatted}</td>
                    <td style={{ fontWeight: 700 }}>{quote.full_name || 'Cliente sin nombre'}</td>
                    <td>
                      {quote.phone && quote.phone !== 'No especificado' ? (
                        <a href={`https://wa.me/${quote.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="phone-link">
                          💬 {quote.phone}
                        </a>
                      ) : (
                        <span style={{ color: '#888' }}>Sin teléfono</span>
                      )}
                    </td>
                    <td>{quote.appliance_type || 'General'}</td>
                    <td>
                      <span className={`admin-badge-status admin-badge-${quote.status || 'nuevo'}`}>
                        {quote.status?.replace('_', ' ') || 'nuevo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
