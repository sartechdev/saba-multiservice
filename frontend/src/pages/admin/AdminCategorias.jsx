import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';

export default function AdminCategorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Estado del Modal de Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', parent_id: '' });
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado del Modal de Eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [linkedProductsCount, setLinkedProductsCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // Traer categorías y contar productos por cada categoría
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (catError) throw catError;

      // Traer conteo de productos por categoría
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('category_id');

      if (prodError && prodError.code !== 'PGRST116') {
        console.warn('Advertencia al cargar productos para conteo:', prodError.message);
      }

      const countsMap = {};
      if (prodData) {
        prodData.forEach(p => {
          countsMap[p.category_id] = (countsMap[p.category_id] || 0) + 1;
        });
      }

      const rawCats = (catData || []).map(c => ({
        ...c,
        productsCount: countsMap[c.id] || 0
      }));

      // Ordenar jerárquicamente en árbol N-niveles y calcular ancestros
      const buildTree = (allCats, parentId = null, depth = 0, ancestorIds = []) => {
        const result = [];
        const myChildren = allCats
          .filter(c => c.parent_id === parentId)
          .sort((a, b) => a.name.localeCompare(b.name));

        for (const child of myChildren) {
          const node = {
            ...child,
            depth,
            ancestors: ancestorIds
          };
          result.push(node);
          result.push(...buildTree(allCats, child.id, depth + 1, [...ancestorIds, child.id]));
        }
        return result;
      };

      const ordered = buildTree(rawCats, null, 0, []);
      // Añadir huérfanas al final por si existe alguna sin padre válido en la BD
      const orderedIds = new Set(ordered.map(c => c.id));
      const orphans = rawCats.filter(c => !orderedIds.has(c.id));
      if (orphans.length > 0) {
        orphans.forEach(o => ordered.push({ ...o, depth: 0, ancestors: [] }));
      }

      setCategories(ordered);
    } catch (err) {
      console.error('Error al obtener categorías:', err);
      setError('Ocurrió un error al cargar el listado de categorías.');
    } finally {
      setLoading(false);
    }
  };

  // Generador de slug simple y robusto
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (autoSlug) {
      setFormData({ ...formData, name: val, slug: generateSlug(val) });
    } else {
      setFormData({ ...formData, name: val });
    }
  };

  const handleSlugChange = (e) => {
    setAutoSlug(false);
    setFormData({ ...formData, slug: generateSlug(e.target.value) });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', parent_id: '' });
    setAutoSlug(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      parent_id: cat.parent_id || ''
    });
    setAutoSlug(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('El nombre y el slug son obligatorios.');
      return;
    }

    // Evitar que una categoría sea su propio padre o que cree un ciclo circular con sus descendientes
    if (editingCategory && formData.parent_id) {
      if (formData.parent_id === editingCategory.id) {
        alert('Una categoría no puede ser categoría padre de sí misma.');
        return;
      }
      const parentCandidate = categories.find(c => c.id === formData.parent_id);
      if (parentCandidate && parentCandidate.ancestors?.includes(editingCategory.id)) {
        alert('❌ Ciclo prohibido: No podés asignar como padre a una categoría que actualmente es una subcategoría hija o nieta de esta misma categoría.');
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null
      };
      if (formData.parent_id) {
        payload.parent_id = formData.parent_id;
      } else if (editingCategory && editingCategory.parent_id) {
        // Si estaba editando y le quitó el padre, mandamos null explicitly
        payload.parent_id = null;
      }

      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);

        if (updateError) throw updateError;
        setSuccessMsg(`Categoría "${payload.name}" actualizada con éxito.`);
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert([payload]);

        if (insertError) throw insertError;
        setSuccessMsg(`Categoría "${payload.name}" creada correctamente.`);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error guardando categoría en Supabase:', err);
      if (err.code === '23505' || err.message?.includes('slug') || err.message?.includes('unique')) {
        alert('❌ Error al guardar: el Slug ingresado ya está siendo utilizado por otra categoría.');
      } else {
        alert(`❌ Error arrojado por Supabase:\n\n${err.message || JSON.stringify(err)}\n\n(Código: ${err.code || 'N/A'}\nDetalles: ${err.details || err.hint || 'Ninguno'})`);
      }
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (cat) => {
    setCategoryToDelete(cat);
    setLinkedProductsCount(cat.productsCount || 0);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: delError } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (delError) throw delError;

      setSuccessMsg(`Categoría "${categoryToDelete.name}" eliminada.`);
      setDeleteModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert('No se pudo eliminar. Si tiene productos vinculados, por favor modifícalos o elimínalos primero.');
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
        <title>Gestión de Categorías | Saba Multiservice</title>
      </Helmet>

      {/* Cabecera superior */}
      <div className="admin-page-header">
        <div>
          <h1>Gestión de Categorías y Líneas</h1>
          <p>Organiza las divisiones del catálogo (Electrodomésticos, Repuestos, Accesorios, etc.).</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={openCreateModal} className="admin-btn-primary">
            <span>➕</span>
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#9B2C2C', padding: '14px', borderRadius: '8px', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#1B5E20', padding: '14px', borderRadius: '8px', fontWeight: 600 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* ── LISTADO DE CATEGORÍAS ── */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            Cargando categorías...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            No hay categorías registradas. Creá la primera para comenzar a cargar productos.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre de la Categoría</th>
                <th>Slug (URL amigable)</th>
                <th>Descripción / Línea</th>
                <th>Productos</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isSub = !!cat.parent_id;
                const parentCat = isSub ? categories.find(c => c.id === cat.parent_id) : null;
                return (
                  <tr key={cat.id} style={isSub ? { background: '#FAFAFA' } : {}}>
                    <td style={{ fontWeight: 700, fontSize: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: `${(cat.depth || 0) * 24}px`, flexWrap: 'wrap' }}>
                        {(cat.depth || 0) > 0 ? (
                          <>
                            <span style={{ color: 'var(--color-red-primary)', fontSize: '1.1rem', fontWeight: 800 }}>↳</span>
                            <span>{cat.name}</span>
                            <span style={{ fontSize: '0.72rem', background: '#E5E7EB', color: '#374151', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                              Nivel {cat.depth} (Hija de: {parentCat?.name || 'Padre'})
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.1rem' }}>📁</span>
                            <span>{cat.name}</span>
                            <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                              Categoría Padre
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td><code style={{ background: '#F0F0F0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{cat.slug}</code></td>
                    <td style={{ color: '#555', maxWidth: '300px' }}>{cat.description || 'Sin descripción'}</td>
                    <td>
                      <span style={{ fontWeight: 800, background: cat.productsCount > 0 ? '#E3F2FD' : '#F5F5F5', color: cat.productsCount > 0 ? '#1565C0' : '#888', padding: '4px 10px', borderRadius: '12px', fontSize: '0.82rem' }}>
                        {cat.productsCount} {cat.productsCount === 1 ? 'producto' : 'productos'}
                      </span>
                    </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(cat)} className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => openDeleteModal(cat)} className="admin-btn-danger">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL DE CREACIÓN / EDICIÓN ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header">
                <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="admin-modal-close">✖</button>
              </div>

              <form onSubmit={handleSave}>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label htmlFor="cat-name">Nombre visible *</label>
                    <input
                      id="cat-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="Ej: Repuestos de Lavarropas"
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="cat-slug">Slug único (para URLs y filtros) *</label>
                    <input
                      id="cat-slug"
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleSlugChange}
                      placeholder="ej: repuestos-de-lavarropas"
                      className="admin-form-input"
                    />
                    <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.8rem' }}>
                      Se genera automáticamente al escribir el nombre, pero puedes personalizarlo.
                    </small>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="cat-parent">Categoría Padre (Opcional)</label>
                    <select
                      id="cat-parent"
                      value={formData.parent_id}
                      onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                      className="admin-form-select"
                      style={{ fontWeight: 600 }}
                    >
                      <option value="">📁 — Es Categoría Padre / Principal (Dejar en blanco)</option>
                      {categories
                        .filter(c => !editingCategory || (c.id !== editingCategory.id && !c.ancestors?.includes(editingCategory.id)))
                        .map(c => {
                          const indent = '— '.repeat(c.depth || 0);
                          return (
                            <option key={c.id} value={c.id}>
                              {(c.depth || 0) > 0 ? `${indent}↳ ` : '📁 '}{c.name} {(c.depth || 0) > 0 ? `(Nivel ${c.depth})` : ''}
                            </option>
                          );
                        })}
                    </select>
                    <small style={{ color: 'var(--color-gray-medium)', fontSize: '0.8rem' }}>
                      Si seleccionás una categoría aquí, esta será una subcategoría hijo de la elegida.
                    </small>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="cat-desc">Descripción (opcional)</label>
                    <textarea
                      id="cat-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Breve detalle sobre los productos incluidos en esta línea..."
                      className="admin-form-textarea"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="admin-btn-primary">
                    <span>{saving ? 'Guardando...' : 'Guardar Categoría'}</span>
                    <span>💾</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL DE CONFIRMACIÓN DE BORRADO ── */}
      <AnimatePresence>
        {deleteModalOpen && categoryToDelete && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-content"
              style={{ maxWidth: '480px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header" style={{ borderBottomColor: '#FEB2B2', background: '#FFF5F5' }}>
                <h3 style={{ color: '#9B2C2C' }}>⚠️ Confirmar Eliminación</h3>
                <button onClick={() => setDeleteModalOpen(false)} className="admin-modal-close">✖</button>
              </div>

              <div className="admin-modal-body">
                <p style={{ fontSize: '1rem', margin: 0, color: 'var(--color-black)' }}>
                  ¿Estás seguro de que deseás eliminar la categoría <strong>"{categoryToDelete.name}"</strong>?
                </p>

                {linkedProductsCount > 0 ? (
                  <div style={{ background: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', padding: '14px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    🚨 <strong>¡Atención!</strong> Esta categoría tiene actualmente <strong>{linkedProductsCount} productos asociados</strong> en el catálogo. Si la eliminas, esos productos podrían perder su clasificación o la base de datos rechazará el borrado por seguridad relacional.
                  </div>
                ) : (
                  <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    ✅ Esta categoría no tiene productos asociados en este momento, es seguro eliminarla.
                  </div>
                )}
              </div>

              <div className="admin-modal-footer" style={{ background: '#FAFAFA' }}>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="admin-btn-secondary">
                  Cancelar
                </button>
                <button type="button" onClick={confirmDelete} disabled={deleting} className="admin-btn-danger" style={{ padding: '10px 18px', fontSize: '0.92rem' }}>
                  <span>{deleting ? 'Eliminando...' : 'Sí, Eliminar Categoría'}</span>
                  <span>🗑️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
