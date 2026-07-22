import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';

export default function AdminMarcas() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Estado del Modal de Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', display_order: 0, logo_url: '' });
  const [saving, setSaving] = useState(false);

  // Estado del Modal de Eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [linkedProductsCount, setLinkedProductsCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Traer marcas
      const { data: bData, error: bError } = await supabase
        .from('repair_brands')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (bError) throw bError;

      // 2. Traer conteo de productos por marca
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('brand_id, brand');

      if (prodError && prodError.code !== 'PGRST116') {
        console.warn('Advertencia al cargar productos para conteo por marca:', prodError.message);
      }

      const countsMap = {};
      if (prodData) {
        prodData.forEach(p => {
          if (p.brand_id) {
            countsMap[p.brand_id] = (countsMap[p.brand_id] || 0) + 1;
          } else if (p.brand) {
            // Contabilizar por coincidencia de nombre si no tenía el ID enlazado
            const matchedBrand = (bData || []).find(b => b.name.toLowerCase() === p.brand.toLowerCase());
            if (matchedBrand) {
              countsMap[matchedBrand.id] = (countsMap[matchedBrand.id] || 0) + 1;
            }
          }
        });
      }

      const formatted = (bData || []).map(b => ({
        ...b,
        productsCount: countsMap[b.id] || 0
      }));

      setBrands(formatted);
    } catch (err) {
      console.error('Error al obtener marcas:', err);
      setError('Ocurrió un error al cargar el listado de marcas.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBrand(null);
    const nextOrder = brands.length > 0 ? Math.max(...brands.map(b => b.display_order || 0)) + 1 : 1;
    setFormData({ name: '', display_order: nextOrder, logo_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBrand(b);
    setFormData({
      name: b.name || '',
      display_order: b.display_order ?? 0,
      logo_url: b.logo_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre de la marca es obligatorio.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name.trim(),
        display_order: parseInt(formData.display_order) || 0,
        logo_url: formData.logo_url.trim() || null
      };

      if (editingBrand) {
        const { error: updateError } = await supabase
          .from('repair_brands')
          .update(payload)
          .eq('id', editingBrand.id);

        if (updateError) throw updateError;
        setSuccessMsg(`Marca "${payload.name}" actualizada con éxito.`);
      } else {
        const { error: insertError } = await supabase
          .from('repair_brands')
          .insert([payload]);

        if (insertError) throw insertError;
        setSuccessMsg(`Marca "${payload.name}" creada correctamente.`);
      }

      setIsModalOpen(false);
      fetchBrands();
    } catch (err) {
      console.error('Error guardando marca en Supabase:', err);
      alert(`❌ Error al guardar marca en Supabase:\n\n${err.message || JSON.stringify(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (b) => {
    setBrandToDelete(b);
    setLinkedProductsCount(b.productsCount || 0);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: delError } = await supabase
        .from('repair_brands')
        .delete()
        .eq('id', brandToDelete.id);

      if (delError) throw delError;

      setSuccessMsg(`Marca "${brandToDelete.name}" eliminada.`);
      setDeleteModalOpen(false);
      fetchBrands();
    } catch (err) {
      console.error('Error al eliminar marca:', err);
      alert('No se pudo eliminar la marca. Error: ' + (err.message || 'Desconocido'));
    } finally {
      setDeleting(false);
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
        <title>Gestión de Marcas | Saba Multiservice</title>
      </Helmet>

      {/* Cabecera superior */}
      <div className="admin-page-header">
        <div>
          <h1>Gestión de Marcas Oficiales</h1>
          <p>Crea, edita o retira marcas para clasificar productos y permitir el filtrado en el catálogo web.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="admin-btn-primary"
        >
          <span>+</span> Nueva Marca
        </button>
      </div>

      {/* Mensajes de feedback */}
      {error && <div className="admin-msg-error">{error}</div>}
      {successMsg && <div className="admin-msg-success">{successMsg}</div>}

      {/* Listado / Tabla */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            ⏳ Cargando listado de marcas...
          </div>
        ) : brands.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Aún no hay marcas registradas.</p>
            <button type="button" onClick={openCreateModal} className="admin-btn-secondary">
              Crear la primera marca
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Orden</th>
                <th>Nombre de la Marca</th>
                <th>Logo (URL / Estado)</th>
                <th style={{ width: '160px' }}>Productos vinculados</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>
                    <span className="admin-badge-count" style={{ background: '#EEEEEA', color: '#444' }}>
                      #{b.display_order}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#111', fontSize: '0.98rem' }}>
                    {b.name}
                  </td>
                  <td>
                    {b.logo_url ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={b.logo_url} alt={b.name} style={{ height: '24px', maxWidth: '80px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Configurado</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>Solo texto / Sin logo</span>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge-count ${b.productsCount > 0 ? 'active' : ''}`}>
                      {b.productsCount} {b.productsCount === 1 ? 'producto' : 'productos'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-actions-group" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        className="admin-btn-action edit"
                        title="Editar marca"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(b)}
                        className="admin-btn-action delete"
                        title="Eliminar marca"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CREAR / EDITAR MARCA */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-card"
              style={{ maxWidth: '480px' }}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header">
                <h3>{editingBrand ? 'Editar Marca' : 'Nueva Marca'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="admin-modal-close">✖</button>
              </div>

              <form onSubmit={handleSave} className="admin-modal-form">
                <div className="admin-form-group">
                  <label htmlFor="brand-name">Nombre de la Marca *</label>
                  <input
                    id="brand-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Samsung, LG, Drean, Peabody..."
                    className="admin-form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="brand-order">Orden</label>
                    <input
                      id="brand-order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      placeholder="1"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="brand-logo">URL de Logo (Opcional)</label>
                    <input
                      id="brand-logo"
                      type="text"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://.../logo.png"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="admin-btn-primary">
                    {saving ? 'Guardando...' : editingBrand ? 'Guardar Cambios' : 'Crear Marca'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CONFIRMACIÓN DE BORRADO */}
      <AnimatePresence>
        {deleteModalOpen && brandToDelete && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-card"
              style={{ maxWidth: '440px' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="admin-modal-header" style={{ borderBottom: '1px solid #ffccd0', background: '#fff5f5' }}>
                <h3 style={{ color: '#C41E2B' }}>⚠️ Confirmar Eliminación</h3>
                <button onClick={() => setDeleteModalOpen(false)} className="admin-modal-close">✖</button>
              </div>

              <div style={{ padding: '24px', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '16px' }}>
                  ¿Estás seguro que deseás eliminar la marca <strong>"{brandToDelete.name}"</strong>?
                </p>

                {linkedProductsCount > 0 ? (
                  <div style={{ background: '#FFF3CD', borderLeft: '4px solid #FFC107', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem', color: '#664D03' }}>
                    <strong>Atención:</strong> Actualmente hay <strong>{linkedProductsCount} producto(s)</strong> vinculados a esta marca. Si la eliminas, esos productos no se borrarán, pero su marca pasará a estar sin especificar ("Genérico / Multimarca").
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Esta marca no tiene productos asignados actualmente, por lo que puede retirarse de manera limpia.
                  </p>
                )}

                <div className="admin-modal-actions" style={{ marginTop: '24px' }}>
                  <button type="button" onClick={() => setDeleteModalOpen(false)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="admin-btn-primary"
                    style={{ background: '#C41E2B' }}
                  >
                    {deleting ? 'Eliminando...' : 'Sí, Eliminar Marca'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
