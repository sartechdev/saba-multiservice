import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/motionVariants';
import { supabase } from '../lib/supabaseClient';

import { INITIAL_PRODUCTS } from '../data/productsData';
import { ProductCard } from '../components/shared/ProductCard';
import { WhatsAppModal } from '../components/shared/WhatsAppModal';
import '../styles/ProductoDetalle.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493425011410';

export const ProductoDetalle = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setSelectedImgIdx(0);
      try {
        // 1. Intentar buscar en Supabase por slug primero
        let found = null;
        let { data: dbData, error: dbError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('slug', slug)
          .maybeSingle();

        // Si no se encuentra por slug, intentar por id
        if (!dbData) {
          const { data: idData } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('id', slug)
            .maybeSingle();
          if (idData) dbData = idData;
        }

        if (!dbError && dbData) {
          found = {
            ...dbData,
            category_name: dbData.categories?.name || dbData.category_name || 'General'
          };
        }

        // 2. Si no está en Supabase, buscar en INITIAL_PRODUCTS
        if (!found) {
          found = INITIAL_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
        }

        setProduct(found);

        // 3. Buscar productos relacionados en Supabase (evitar borrados)
        if (found) {
          let related = [];
          
          if (found.category_id) {
            const { data: relatedCatData } = await supabase
              .from('products')
              .select('*, categories(name)')
              .eq('category_id', found.category_id)
              .neq('id', found.id)
              .limit(3);
              
            if (relatedCatData && relatedCatData.length > 0) {
              related = relatedCatData;
            }
          }
          
          if (related.length === 0) {
            const { data: relatedFallback } = await supabase
              .from('products')
              .select('*, categories(name)')
              .neq('id', found.id)
              .limit(3);
              
            if (relatedFallback) related = relatedFallback;
          }
          
          setRelatedProducts(
            related.map(p => ({
              ...p,
              category_name: p.categories?.name || p.category_name || 'General'
            }))
          );
        }

      } catch (err) {
        console.warn('[ProductoDetalle] Error buscando detalle:', err);
        const fallback = INITIAL_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
        setProduct(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Formateador de moneda ARS
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="product-detail-wrapper">
        <div className="container">
          <div className="product-detail-grid" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Cargando detalle del producto...</span>
          </div>
        </div>
      </div>
    );
  }

  // Estado No Encontrado
  if (!product) {
    return (
      <div className="product-detail-wrapper">
        <Helmet>
          <title>Producto no encontrado | Saba Multiservice</title>
        </Helmet>
        <div className="container">
          <div className="product-not-found-card">
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
            <h2 className="detail-title" style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Producto no disponible</h2>
            <p className="detail-desc-text" style={{ marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              El producto que intentás ver no fue encontrado o se encuentra temporalmente fuera de catálogo.
            </p>
            <Link to="/productos" className="detail-wa-btn" style={{ maxWidth: '280px', margin: '0 auto' }}>
              ← Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolver arreglo de imágenes
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (typeof product.images === 'string' ? [product.images] : []);

  const currentImage = imageList[selectedImgIdx] || imageList[0] || '';

  // CTA WhatsApp precompletado
  const waText = `Hola Saba Multiservice! Quiero consultar disponibilidad y precio sobre: ${product.name}${product.price && !product.price_on_request ? ` (Ref: ${formatPrice(product.price)})` : ''}`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="product-detail-wrapper">
      <Helmet>
        <title>{`${product.name} | Repuestos y Catálogo Saba Multiservice`}</title>
        <meta
          name="description"
          content={product.short_desc || product.description?.substring(0, 150) || `Consultá por ${product.name} con atención personalizada y repuestos garantizados en Santa Fe.`}
        />
        <link rel="canonical" href={`https://sabamultiservice.com.ar/producto/${product.slug || product.id}`} />
        <meta property="og:title" content={`${product.name} | Saba Multiservice`} />
        <meta property="og:description" content={product.short_desc || product.description?.substring(0, 150) || `Consultá por ${product.name} en Catamarca 3420, Santa Fe Capital.`} />
        <meta property="og:url" content={`https://sabamultiservice.com.ar/producto/${product.slug || product.id}`} />
        <meta property="og:type" content="product" />
        {currentImage && <meta property="og:image" content={currentImage} />}
        {!product.price_on_request && product.price && (
          <>
            <meta property="product:price:amount" content={product.price} />
            <meta property="product:price:currency" content="ARS" />
          </>
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": currentImage ? [currentImage] : [],
            "description": product.short_desc || product.description || product.name,
            "sku": product.sku || product.id,
            "brand": {
              "@type": "Brand",
              "name": product.brand || "Saba Multiservice"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://sabamultiservice.com.ar/producto/${product.slug || product.id}`,
              "priceCurrency": "ARS",
              "price": product.price && !product.price_on_request ? product.price : "0",
              "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Saba Multiservice"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="container">
        {/* Breadcrumbs */}
        <nav className="product-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="breadcrumbs-separator">/</span>
          <Link to="/productos">Catálogo</Link>
          <span className="breadcrumbs-separator">/</span>
          {product.category_name && (
            <>
              <span style={{ color: 'var(--color-gray-medium)' }}>{product.category_name}</span>
              <span className="breadcrumbs-separator">/</span>
            </>
          )}
          <span className="breadcrumbs-current">{product.name}</span>
        </nav>

        {/* Grid Principal del Producto */}
        <motion.div
          className="product-detail-grid"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >

          {/* Galería Visual */}
          <div className="product-gallery-box">
            <div className="gallery-main-frame">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.name} vista ${selectedImgIdx + 1}`}
                  className="gallery-main-img"
                />
              ) : (
                <div style={{ color: '#aaa', fontWeight: 600 }}>Sin Imagen Disponible</div>
              )}
            </div>

            {imageList.length > 1 && (
              <div className="gallery-thumbnails">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-thumb-btn ${selectedImgIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIdx(idx)}
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="gallery-thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información y CTA lateral */}
          <div className="product-info-panel">
            {product.category_name && (
              <span className="detail-category-badge">{product.category_name}</span>
            )}
            <h1 className="detail-title">{product.name}</h1>

            {/* Fila de Precio y Stock */}
            <div className="detail-price-box">
              {product.price_on_request || !product.price ? (
                <span className="detail-price-request-badge">Consultar precio</span>
              ) : (
                <span className="detail-price">{formatPrice(product.price)}</span>
              )}

              {product.stock_status && (
                <span className="detail-stock-badge">✓ {product.stock_status}</span>
              )}
            </div>

            {/* Descripción */}
            <div className="detail-desc-box">
              <h3 className="detail-desc-title">Descripción técnica</h3>
              <p className="detail-desc-text">
                {product.description || product.short_desc || 'Producto con garantía oficial y atención directa en nuestro mostrador.'}
              </p>
            </div>

            {/* Especificaciones */}
            {product.specs && Array.isArray(product.specs) && product.specs.length > 0 && (
              <div className="detail-specs-box">
                <h4 className="detail-specs-title">Especificaciones principales</h4>
                <ul className="detail-specs-list">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="detail-specs-item">
                      <span className="spec-check-icon">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Único CTA oficial del producto: WhatsApp */}
            <div className="detail-cta-wrapper">
              <button
                type="button"
                onClick={() => setIsWaModalOpen(true)}
                className="detail-wa-btn"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Consultar Stock y Disponibilidad</span>
              </button>
              <div className="detail-wa-note">
                ⚡ Respuesta inmediata de nuestro equipo técnico de mostrador
              </div>
            </div>
          </div>
        </motion.div>

        {/* Productos Relacionados */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="related-products-section">
            <h3 className="related-heading">Productos y repuestos relacionados</h3>
            <div className="related-grid">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id || rel.slug} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      <WhatsAppModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductoDetalle;
