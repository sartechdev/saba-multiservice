import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/AdminConsole.css';

export default function AdminProductos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('todos');

  // Estado Modal Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    brand_id: '',
    brand: '',
    price: '',
    price_on_request: false,
    stock_status: 'Inmediato en local',
    short_desc: '',
    description: '',
    featured: false,
    images: []
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  // Estado Modal Borrar
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Categorías
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (catError) throw catError;
      const rawCatList = catData || [];

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

      const catList = buildTree(rawCatList, null, 0, []);
      const orderedIds = new Set(catList.map(c => c.id));
      rawCatList.filter(c => !orderedIds.has(c.id)).forEach(o => catList.push({ ...o, depth: 0, ancestors: [] }));

      setCategories(catList);

      const catMap = {};
      catList.forEach(c => {
        catMap[c.id] = c;
      });

      // 2. Marcas (`repair_brands`)
      const { data: brandData } = await supabase
        .from('repair_brands')
        .select('*')
        .order('name', { ascending: true });
      setBrands(brandData || []);

      // 3. Productos
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      const formatted = (prodData || []).map(p => {
        const cat = catMap[p.category_id];
        let fullCatName = p.categories?.name || p.category_name || 'Sin Categoría';
        if (cat && cat.parent_id && catMap[cat.parent_id]) {
          fullCatName = `${catMap[cat.parent_id].name} ↳ ${cat.name}`;
        }
        return {
          ...p,
          category_name: fullCatName
        };
      });

      setProducts(formatted);
    } catch (err) {
      console.error('Error al obtener productos/categorías:', err);
      setError('Ocurrió un error al cargar el inventario.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setNewImageFiles(prev => [...prev, ...files]);

    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImagePreview = (index) => {
    const itemToRemove = imagePreviews[index];
    if (itemToRemove.isNew) {
      setNewImageFiles(prev => prev.filter(f => f !== itemToRemove.file));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    const defaultCat = categories[0]?.id || '';
    setFormData({
      name: '',
      slug: '',
      category_id: defaultCat,
      brand_id: '',
      brand: '',
      price: '',
      price_on_request: false,
      stock_status: 'Inmediato en local',
      short_desc: '',
      description: '',
      featured: false,
      images: []
    });
    setAutoSlug(true);
    setNewImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    const existingImages = Array.isArray(prod.images) ? prod.images : (prod.images ? [prod.images] : []);
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      category_id: prod.category_id || (categories[0]?.id || ''),
      brand_id: prod.brand_id || '',
      brand: prod.brand || '',
      price: prod.price || '',
      price_on_request: !!prod.price_on_request,
      stock_status: prod.stock_status || 'Inmediato en local',
      short_desc: prod.short_desc || '',
      description: prod.description || '',
      featured: !!prod.featured,
      images: existingImages
    });
    setAutoSlug(false);
    setNewImageFiles([]);
    setImagePreviews(existingImages.map(url => ({ url, isNew: false })));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category_id) {
      alert('El nombre del producto y la categoría son obligatorios.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Subir nuevas fotos a Supabase Storage (`product-images`)
      const uploadedUrls = [];
      for (const file of newImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadErr) {
          console.warn('Error subiendo imagen al storage, se omitirá o lanzará error:', uploadErr.message);
          throw new Error(`Error al subir imagen (${file.name}): ${uploadErr.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      // Combinar imágenes existentes mantenidas + nuevas URLs
      const finalImages = [
        ...imagePreviews.filter(p => !p.isNew).map(p => p.url),
        ...uploadedUrls
      ];

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        category_id: formData.category_id,
        brand_id: formData.brand_id || null,
        brand: formData.brand || null,
        price: formData.price_on_request ? null : (parseFloat(formData.price) || 0),
        price_on_request: formData.price_on_request,
        stock_status: formData.stock_status,
        short_desc: formData.short_desc.trim() || null,
        description: formData.description.trim() || null,
        featured: formData.featured,
        images: finalImages
      };

      if (editingProduct) {
        const { error: updErr } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);

        if (updErr) throw updErr;
        setSuccessMsg(`Producto "${payload.name}" actualizado con éxito.`);
      } else {
        const { error: insErr } = await supabase
          .from('products')
          .insert([payload]);

        if (insErr) throw insErr;
        setSuccessMsg(`Producto "${payload.name}" creado en el inventario.`);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error guardando producto:', err);
      alert(err.message || 'Error al guardar producto. Verificá si el slug ya existe.');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (prod) => {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: delErr } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (delErr) throw delErr;

      setSuccessMsg(`Producto "${productToDelete.name}" eliminado del sistema.`);
      setDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('No se pudo eliminar el producto.');
    } finally {
      setDeleting(false);
    }
  };

  // Helper para obtener todos los IDs descendientes (hijas, nietas, etc.) de una categoría
  const getDescendantIds = (catId, allCats) => {
    const ids = [catId];
    const children = allCats.filter(c => c.parent_id === catId);
    for (const ch of children) {
      ids.push(...getDescendantIds(ch.id, allCats));
    }
    return ids;
  };

  const filteredProducts = products.filter(p => {
    const descIds = selectedCategoryFilter === 'todos' ? [] : getDescendantIds(selectedCategoryFilter, categories);
    const matchesCategory = selectedCategoryFilter === 'todos' || descIds.includes(p.category_id);
    const matchesSearch = !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return 'A consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      className="admin-console-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Gestión de Productos | Saba Multiservice</title>
      </Helmet>

      {/* Cabecera superior */}
      <div className="admin-page-header">
        <div>
          <h1>Catálogo y Control de Productos</h1>
          <p>Cargá electrodomésticos, repuestos y accesorios con fotos al Storage oficial.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={openCreateModal} className="admin-btn-primary">
            <span>➕</span>
            <span>Nuevo Producto</span>
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

      {/* ── BARRA DE FILTROS Y BÚSQUEDA ── */}
      <div className="admin-filter-bar">
        <div className="admin-status-tabs">
          <button
            onClick={() => setSelectedCategoryFilter('todos')}
            className={`admin-status-tab ${selectedCategoryFilter === 'todos' ? 'active' : ''}`}
          >
            Todos ({products.length})
          </button>
          {categories.map(cat => {
            const descIds = getDescendantIds(cat.id, categories);
            const count = products.filter(p => descIds.includes(p.category_id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`admin-status-tab ${selectedCategoryFilter === cat.id ? 'active' : ''}`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── LISTADO DE PRODUCTOS ── */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            Cargando inventario...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
            No se encontraron productos con los filtros actuales.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre y Slug</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Disponibilidad</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => {
                const mainImg = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : (typeof prod.images === 'string' ? prod.images : null);
                return (
                  <tr key={prod.id}>
                    <td style={{ width: '70px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E5E5' }}>
                        {mainImg ? (
                          <img src={mainImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.2rem' }}>📦</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{prod.name}</div>
                      <code style={{ fontSize: '0.78rem', color: '#666' }}>{prod.slug}</code>
                      {prod.featured && <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>★ Destacado</span>}
                    </td>
                    <td>
                      <span style={{ background: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
                        {prod.category_name}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: prod.price_on_request ? 'var(--color-red-primary)' : 'var(--color-black)' }}>
                      {prod.price_on_request ? 'Precio a consultar' : formatPrice(prod.price)}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: prod.stock_status?.includes('Inmediato') || prod.stock_status?.includes('stock') ? '#D1FAE5' : '#FEF3C7',
                        color: prod.stock_status?.includes('Inmediato') || prod.stock_status?.includes('stock') ? '#065F46' : '#92400E'
                      }}>
                        {prod.stock_status || 'Inmediato'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => openEditModal(prod)} className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                          ✏️ Editar
                        </button>
                        <button onClick={() => openDeleteModal(prod)} className="admin-btn-danger">
                          🗑️
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

      {/* ── MODAL CREAR / EDITAR PRODUCTO ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-content"
              style={{ maxWidth: '740px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="admin-modal-header">
                <h3>{editingProduct ? 'Editar Producto' : 'Cargar Nuevo Producto'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="admin-modal-close">✖</button>
              </div>

              <form onSubmit={handleSave}>
                <div className="admin-modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                    <div className="admin-form-group">
                      <label htmlFor="prod-name">Nombre del producto *</label>
                      <input
                        id="prod-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Ej: Termostato para Caloventor 16A"
                        className="admin-form-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="prod-cat">Categoría *</label>
                      <select
                        id="prod-cat"
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="admin-form-select"
                      >
                        <option value="" disabled>Seleccionar línea / subcategoría...</option>
                        {categories.map(c => {
                          const indent = '— '.repeat(c.depth || 0);
                          return (
                            <option key={c.id} value={c.id}>
                              {(c.depth || 0) > 0 ? `${indent}↳ ` : '📁 '}{c.name} {(c.depth || 0) > 0 ? `(Nivel ${c.depth})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                    <div className="admin-form-group">
                      <label htmlFor="prod-brand">Marca / Línea del Producto (Opcional)</label>
                      <select
                        id="prod-brand"
                        value={formData.brand_id}
                        onChange={(e) => {
                          const selected = brands.find(b => b.id === e.target.value);
                          setFormData({
                            ...formData,
                            brand_id: e.target.value,
                            brand: selected ? selected.name : null
                          });
                        }}
                        className="admin-form-select"
                      >
                        <option value="">— Genérico / Multimarca / Sin especificar —</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="admin-form-group">
                      <label htmlFor="prod-slug">Slug único (URL amigable) *</label>
                      <input
                        id="prod-slug"
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => { setAutoSlug(false); setFormData({ ...formData, slug: generateSlug(e.target.value) }); }}
                        placeholder="ej: termostato-caloventor-16a"
                        className="admin-form-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="prod-stock">Disponibilidad en mostrador</label>
                      <select
                        id="prod-stock"
                        value={formData.stock_status}
                        onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                        className="admin-form-select"
                      >
                        <option value="Inmediato en local">✅ Inmediato en local</option>
                        <option value="A consultar stock">⏳ A consultar stock</option>
                        <option value="Por pedido / 48hs">📦 Por pedido / 48hs</option>
                        <option value="Agotado temporalmente">❌ Agotado temporalmente</option>
                      </select>
                    </div>
                  </div>

                  {/* Precio & Toggle */}
                  <div style={{ background: '#F8F8F8', border: '1px solid #E2E2E2', padding: '14px', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                    <label className="admin-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.price_on_request}
                        onChange={(e) => setFormData({ ...formData, price_on_request: e.target.checked })}
                      />
                      <span>🏷️ Precio a consultar por WhatsApp (oculta precio numérico)</span>
                    </label>

                    {!formData.price_on_request && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700 }}>$</span>
                        <input
                          type="number"
                          placeholder="Ej: 48500"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="admin-form-input"
                          style={{ width: '150px' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Destacado Toggle */}
                  <label className="admin-form-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>★ Mostrar en sección "Productos Destacados" de la página de inicio o catálogo</span>
                  </label>

                  <div className="admin-form-group">
                    <label htmlFor="prod-short">Descripción breve (subtítulo para cards)</label>
                    <input
                      id="prod-short"
                      type="text"
                      value={formData.short_desc}
                      onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                      placeholder="Ej: Repuesto universal original con garantía de 6 meses..."
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="prod-desc">Descripción completa detallada</label>
                    <textarea
                      id="prod-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Especificaciones técnicas, compatibilidad con marcas, instrucciones..."
                      className="admin-form-textarea"
                      rows={4}
                    />
                  </div>

                  {/* Upload Storage y Preview */}
                  <div className="admin-form-group">
                    <label>Imágenes del Producto (Supabase Storage: `product-images`)</label>
                    <div className="admin-image-upload-box" onClick={() => document.getElementById('file-upload-input').click()}>
                      <div style={{ fontSize: '1.8rem' }}>📸</div>
                      <div style={{ fontWeight: 700, margin: '6px 0 2px' }}>Hacé clic aquí para seleccionar imágenes desde tu computadora o celular</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-medium)' }}>Archivos JPG, PNG o WEBP. Puedes subir varias fotos a la vez.</div>
                      <input
                        id="file-upload-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {imagePreviews.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, margin: '10px 0 6px' }}>Fotos seleccionadas ({imagePreviews.length}):</div>
                        <div className="admin-image-preview-container">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="admin-image-preview-item">
                              <img src={preview.url} alt={`preview-${index}`} />
                              <button
                                type="button"
                                onClick={() => removeImagePreview(index)}
                                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.75rem' }}
                                title="Quitar imagen"
                              >
                                ✖
                              </button>
                              {preview.isNew && (
                                <span style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', background: 'var(--color-red-primary)', color: '#fff', fontSize: '0.65rem', textAlign: 'center', fontWeight: 800 }}>
                                  Nueva
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="admin-btn-primary">
                    <span>{saving ? 'Subiendo y Guardando...' : 'Guardar Producto'}</span>
                    <span>💾</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL BORRAR PRODUCTO ── */}
      <AnimatePresence>
        {deleteModalOpen && productToDelete && (
          <div className="admin-modal-overlay">
            <motion.div
              className="admin-modal-content"
              style={{ maxWidth: '460px' }}
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
                <p style={{ fontSize: '1rem', margin: 0 }}>
                  ¿Estás seguro de que deseás retirar el producto <strong>"{productToDelete.name}"</strong> del catálogo?
                </p>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-gray-medium)' }}>
                  Esta acción no se puede deshacer y el producto dejará de estar visible en la web pública para los clientes de forma inmediata.
                </div>
              </div>

              <div className="admin-modal-footer" style={{ background: '#FAFAFA' }}>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="admin-btn-secondary">
                  Cancelar
                </button>
                <button type="button" onClick={confirmDelete} disabled={deleting} className="admin-btn-danger" style={{ padding: '10px 18px', fontSize: '0.92rem' }}>
                  <span>{deleting ? 'Eliminando...' : 'Sí, Eliminar Producto'}</span>
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
