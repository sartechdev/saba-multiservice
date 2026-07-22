import React from 'react';
import '../../styles/Card.css';

export const Card = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  const isClickable = typeof onClick === 'function';
  return (
    <div
      className={`card ${isClickable ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
