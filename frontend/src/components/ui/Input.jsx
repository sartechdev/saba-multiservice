import React, { forwardRef } from 'react';
import '../../styles/Input.css';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  id,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        id={id}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
