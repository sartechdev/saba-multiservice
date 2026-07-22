import React from 'react';
import '../../styles/Badge.css';

export const Badge = ({
  children,
  status = 'default',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`badge badge-${status} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
