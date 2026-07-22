import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleUp } from '../lib/motionVariants';
import { supabase } from '../lib/supabaseClient';
import { CATEGORIES as INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/productsData';

import { ProductCard } from '../components/shared/ProductCard';
import controlesImg from '../assets/controles.webp';
import '../styles/Catalogo.css';

export const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedBrand, setSelectedBrand] = useState('todas');
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [includeOnRequest, setIncludeOnRequest] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);


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

  useEffect(() => {
    const fetchCatalogData = async () => {
      setIsLoading(true);
      try {
        // 1. Obtener categorías de Supabase si existen
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!catError && catData && catData.length > 0) {
          const rawCatList = catData.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.id,
            parent_id: c.parent_id || null
          }));
          const tree = buildTree(rawCatList, null, 0, []);
          const orderedIds = new Set(tree.map(c => c.id));
          rawCatList.filter(c => !orderedIds.has(c.id)).forEach(o => tree.push({ ...o, depth: 0, ancestors: [] }));
          setCategories(tree);
        } else {
          setCategories(buildTree(INITIAL_CATEGORIES, null, 0, []));
        }

        // 2. Obtener marcas de Supabase
        const { data: brandsData } = await supabase
          .from('repair_brands')
          .select('*')
          .order('name', { ascending: true });
        if (brandsData) setBrands(brandsData);

        // 3. Obtener productos de Supabase
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .order('created_at', { ascending: false });

        if (!prodError && prodData && prodData.length > 0) {
          const normalized = prodData.map(p => ({
            ...p,
            slug: p.slug || p.id,
            category_name: p.categories?.name || p.category_name || 'General'
          }));
          setProducts(normalized);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (err) {
        console.warn('[Catalogo] Usando datos locales por error o falta en DB:', err);
        setProducts(INITIAL_PRODUCTS);
        setCategories(buildTree(INITIAL_CATEGORIES, null, 0, []));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogData();
  }, []);

  // Helper recursivo para obtener todos los IDs descendientes (hijas, nietas, etc.)
  const getDescendantIds = (catId, allCats) => {
    const ids = [catId];
    const children = allCats.filter(c => c.parent_id === catId);
    for (const ch of children) {
      ids.push(...getDescendantIds(ch.id, allCats));
    }
    return ids;
  };

  // Filtrado general (Categoría + Precio + Búsqueda)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Filtro Categoría jerárquico recursivo
      let matchesCategory = true;
      if (selectedCategory !== 'todos') {
        const descIds = getDescendantIds(selectedCategory, categories);
        matchesCategory =
          descIds.includes(product.category_id) ||
          (product.category_name && product.category_name.toLowerCase().includes(selectedCategory.toLowerCase()));
      }

      // 2. Filtro Marca
      let matchesBrand = true;
      if (selectedBrand !== 'todas') {
        matchesBrand =
          product.brand_id === selectedBrand ||
          product.brand === selectedBrand ||
          (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());
      }

      // 3. Filtro Precio (mínimo / máximo)
      let matchesPrice = true;
      const isRequest = product.price_on_request || !product.price || Number(product.price) === 0;
      if (isRequest) {
        if (!includeOnRequest) matchesPrice = false;
      } else {
        const priceNum = Number(product.price) || 0;
        if (minPrice !== '' && !isNaN(minPrice) && priceNum < Number(minPrice)) matchesPrice = false;
        if (maxPrice !== '' && !isNaN(maxPrice) && priceNum > Number(maxPrice)) matchesPrice = false;
      }

      // 4. Filtro Búsqueda rápida
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.short_desc && product.short_desc.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query));

      return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, categories, minPrice, maxPrice, includeOnRequest, searchQuery]);

  const toggleExpand = (catId) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat.id);
    if (cat.id !== 'todos') {
      setExpandedCats(prev => new Set([...prev, cat.id, ...(cat.ancestors || [])]));
    }
  };

  // Conteo de filtros activos para indicador en móvil y botón reset
  const countActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'todos') count++;
    if (selectedBrand !== 'todas') count++;
    if (minPrice !== '' || maxPrice !== '' || !includeOnRequest) count++;
    return count;
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, includeOnRequest]);

  // Renderizador recursivo de nodos del árbol de categorías
  const renderCategoryNodes = (parentId = null, currentDepth = 0) => {
    const nodes = categories.filter(c => c.parent_id === parentId);
    if (nodes.length === 0) return null;

    return (
      <ul className="catalog-tree-list">
        {nodes.map(cat => {
          const hasChildren = categories.some(c => c.parent_id === cat.id);
          const isSelected = selectedCategory === cat.id;
          const isExpanded = expandedCats.has(cat.id);
          const descIds = getDescendantIds(cat.id, categories);
          const count = products.filter(p => descIds.includes(p.category_id)).length;

          return (
            <li key={cat.id} className="catalog-tree-item">
              <div className={`catalog-tree-row ${isSelected ? 'selected' : ''}`}>
                <button
                  type="button"
                  className="catalog-tree-label-btn"
                  onClick={() => handleSelectCategory(cat)}
                >
                  <span className="catalog-tree-icon">
                    {currentDepth === 0 ? '📁' : '↳'}
                  </span>
                  <span className="catalog-tree-name">{cat.name}</span>
                  {count > 0 && <span className="catalog-tree-count">{count}</span>}
                </button>

                {hasChildren && (
                  <button
                    type="button"
                    className="catalog-tree-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(cat.id);
                    }}
                    aria-label="Expandir/Contraer subcategorías"
                  >
                    <motion.span
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ display: 'inline-block' }}
                    >
                      ▸
                    </motion.span>
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {hasChildren && isExpanded && (
                  <motion.div
                    key={`tree-sub-${cat.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="catalog-tree-sub">
                      {renderCategoryNodes(cat.id, currentDepth + 1)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    );
  };

  // Contenido de filtros reutilizable entre Sidebar de Escritorio y Drawer Móvil
  const renderSidebarFilterContent = () => (
    <div className="catalog-sidebar-card">
      <div className="catalog-sidebar-section">
        <div className="catalog-sidebar-title-row">
          <span className="catalog-sidebar-title">📁 Categorías</span>
          {selectedCategory !== 'todos' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className="catalog-sidebar-reset-btn"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="catalog-tree-container">
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`catalog-tree-row ${selectedCategory === 'todos' ? 'selected' : ''}`}
            style={{ padding: '8px 10px', border: 'none', background: selectedCategory === 'todos' ? 'var(--color-red-primary)' : 'transparent', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: selectedCategory === 'todos' ? '#fff' : 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="catalog-tree-icon">✨</span>
              <span>Todos los productos</span>
            </div>
            <span className="catalog-tree-count" style={{ background: selectedCategory === 'todos' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)', color: 'inherit' }}>
              {products.length}
            </span>
          </button>
          {renderCategoryNodes(null, 0)}
        </div>
      </div>

      <div className="catalog-sidebar-divider" />

      <div className="catalog-sidebar-section">
        <div className="catalog-sidebar-title-row">
          <span className="catalog-sidebar-title">🏷️ Marca / Línea</span>
          {selectedBrand !== 'todas' && (
            <button
              type="button"
              onClick={() => setSelectedBrand('todas')}
              className="catalog-sidebar-reset-btn"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="catalog-tree-container" style={{ padding: '4px 0' }}>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="catalog-filter-select"
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e2dd', background: '#fff', color: '#222', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="todas">Todas las marcas ({products.length})</option>
            {brands.map(b => {
              const count = products.filter(p => p.brand_id === b.id || p.brand === b.name || p.brand?.toLowerCase() === b.name.toLowerCase()).length;
              return (
                <option key={b.id} value={b.id}>
                  {b.name} {count > 0 ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="catalog-sidebar-divider" />

      <div className="catalog-sidebar-section">
        <div className="catalog-sidebar-title-row">
          <span className="catalog-sidebar-title">Rango de Precio</span>
          {(minPrice !== '' || maxPrice !== '' || !includeOnRequest) && (
            <button
              type="button"
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setIncludeOnRequest(true);
              }}
              className="catalog-sidebar-reset-btn"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="catalog-price-filter-box">
          <div className="catalog-price-inputs-row">
            <div className="catalog-price-field">
              <label htmlFor="price-min">Mínimo ($)</label>
              <input
                id="price-min"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="catalog-price-input"
              />
            </div>
            <span className="catalog-price-sep">—</span>
            <div className="catalog-price-field">
              <label htmlFor="price-max">Máximo ($)</label>
              <input
                id="price-max"
                type="number"
                placeholder="Sin tope"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="catalog-price-input"
              />
            </div>
          </div>
          <label className="catalog-price-checkbox-label">
            <input
              type="checkbox"
              checked={includeOnRequest}
              onChange={(e) => setIncludeOnRequest(e.target.checked)}
            />
            <span>Incluir repuestos con "Consultar precio"</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="catalog-wrapper">
      <Helmet>
        <title>Catálogo de Productos y Repuestos Originales | Saba Multiservice</title>
        <meta
          name="description"
          content="Explorá nuestro catálogo con electrodomésticos nuevos, repuestos originales y accesorios para Smart TV, microondas y línea blanca en Santa Fe. Consultas en el acto."
        />
        <link rel="canonical" href="https://sabamultiservice.com.ar/catalogo" />
        <meta property="og:title" content="Catálogo de Repuestos y Productos | Saba Multiservice" />
        <meta property="og:description" content="Repuestos de línea blanca para técnicos y particulares, controles remotos y accesorios en Santa Fe Capital." />
        <meta property="og:url" content="https://sabamultiservice.com.ar/catalogo" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sabamultiservice.com.ar/og.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Catálogo de Productos y Accesorios - Saba Multiservice",
            "url": "https://sabamultiservice.com.ar/catalogo",
            "description": "Catálogo online de repuestos, electrodomésticos y controles remotos de Saba Multiservice."
          })}
        </script>
      </Helmet>

      {/* ── 1. HEADER DEL CATÁLOGO ── */}
      <section className="catalog-page-header">
        <div className="catalog-hero-bg-container">
          <img
            src={controlesImg}
            alt="Controles remotos y repuestos Saba Multiservice"
            className="catalog-hero-bg-img"
          />
          <div className="catalog-hero-bg-overlay" />
        </div>
        <div className="catalog-page-header-glow" />
        <div className="container">
          <motion.div
            className="catalog-page-header-content"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >

            <h1 className="catalog-title">Catálogo de Productos y Accesorios</h1>
            <p className="catalog-subtitle">
              Disponemos de electrodomésticos de última generación, repuestos de línea blanca para técnicos/particulares y accesorios para tu Smart TV y PC. Consultá disponibilidad y precio en el acto por WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. SECCIÓN PRINCIPAL (GRID 2 COLUMNAS RESPONSIVE) ── */}
      <section className="catalog-content-section">
        <div className="container">
          {/* Barra Superior para Móvil/Tablet */}
          <div className="catalog-mobile-topbar">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="catalog-mobile-filter-btn"
            >
              ⚙️ Categorías y Filtros {countActiveFilters > 0 ? `(${countActiveFilters})` : ''}
            </button>
            <div className="catalog-search-box" style={{ flex: 1 }}>
              <input
                type="text"
                className="catalog-search-input"
                placeholder="Buscar repuesto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="catalog-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="catalog-main-layout">
            {/* COLUMNA IZQUIERDA: SIDEBAR DESKTOP */}
            <aside className="catalog-desktop-sidebar">
              {renderSidebarFilterContent()}
            </aside>

            {/* COLUMNA DERECHA: RESULTADOS Y PRODUCTOS */}
            <div className="catalog-main-content">
              {/* Controles superiores Desktop */}
              <div className="catalog-topbar-controls">
                <div className="catalog-results-info">
                  <span>
                    {isLoading
                      ? 'Cargando catálogo...'
                      : `Mostrando ${filteredProducts.length} producto${filteredProducts.length === 1 ? '' : 's'}`}
                  </span>
                  {(selectedCategory !== 'todos' || selectedBrand !== 'todas' || minPrice !== '' || maxPrice !== '' || searchQuery) && (
                    <span style={{ marginLeft: '12px', fontSize: '0.85rem' }}>
                      Filtros activos{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('todos');
                          setSelectedBrand('todas');
                          setMinPrice('');
                          setMaxPrice('');
                          setIncludeOnRequest(true);
                          setSearchQuery('');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-red-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        (Limpiar todo)
                      </button>
                    </span>
                  )}
                </div>

                <div className="catalog-search-box catalog-desktop-search">
                  <svg className="catalog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="catalog-search-input"
                    placeholder="Buscar por nombre, código o repuesto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="catalog-search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Limpiar búsqueda"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Estado Cargando */}
              {isLoading ? (
                <div className="catalog-products-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="catalog-skeleton-card">
                      <div className="skeleton-img-placeholder" />
                      <div className="skeleton-line short" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line short" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                /* Grid de Productos */
                <motion.div
                  key={selectedCategory + searchQuery + minPrice + maxPrice + includeOnRequest}
                  className="catalog-products-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id || product.slug} product={product} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Estado Vacío Amigable */
                <motion.div
                  className="catalog-empty-card"
                  variants={scaleUp}
                  initial="hidden"
                  animate="visible"
                >

                  <div className="catalog-empty-icon">🔍</div>
                  <h3 className="catalog-empty-title">No encontramos productos</h3>
                  <p className="catalog-empty-text">
                    No hay productos que coincidan exactamente con tu filtro actual (Categoría, Rango de Precio o Búsqueda). Intentá ajustar los filtros o consultanos directamente por WhatsApp.
                  </p>
                  <button
                    type="button"
                    className="catalog-empty-btn"
                    onClick={() => {
                      setSelectedCategory('todos');
                      setMinPrice('');
                      setMaxPrice('');
                      setIncludeOnRequest(true);
                      setSearchQuery('');
                    }}
                  >
                    Ver todo el catálogo disponible
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DRAWER / MODAL RESPONSIVE EN MÓVIL ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div
            className="catalog-mobile-modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileFilterOpen(false);
            }}
          >
            <motion.div

              className="catalog-mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="catalog-mobile-drawer-header">
                <h3>⚙️ Filtros de Catálogo</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="catalog-mobile-drawer-close"
                >
                  ✕
                </button>
              </div>
              <div className="catalog-mobile-drawer-body">
                {renderSidebarFilterContent()}
              </div>
              <div className="catalog-mobile-drawer-footer">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="catalog-mobile-apply-btn"
                >
                  Ver {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalogo;
