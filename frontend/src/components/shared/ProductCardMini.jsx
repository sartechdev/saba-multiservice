import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductCardMini.css';

export const ProductCardMini = ({ product }) => {
  const slug = product.slug || product.id || '';
  const imageUrl = product.images?.[0] || '/placeholder-product.webp';
  const hasPrice = product.price && !product.price_on_request;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/productos/${slug}`} className="product-card-mini">
      <div className="product-card-mini-img-wrapper">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card-mini-img"
          loading="lazy"
        />
      </div>
      <div className="product-card-mini-info">
        <h4 className="product-card-mini-name">{product.name}</h4>
        <p className="product-card-mini-price">
          {hasPrice ? formatPrice(product.price) : 'Consultar precio'}
        </p>
      </div>
    </Link>
  );
};
