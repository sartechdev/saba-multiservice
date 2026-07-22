import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/ReviewCard.css';

// TODO: reemplazar por reseñas reales cargadas por el admin o capturas de Google
const StarIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'var(--color-gold)' : 'none'}
    stroke="var(--color-gold)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const ReviewCard = ({ name, text, rating = 5, delay = 0, animate = true }) => {
  return (
    <motion.div
      className="review-card"
      initial={animate ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
      whileInView={animate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={animate ? { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
    >
      <div className="review-card-stars">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>
      <p className="review-card-text">{text}</p>
      <p className="review-card-author">{name}</p>
    </motion.div>
  );
};
