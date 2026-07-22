import React, { forwardRef } from 'react';
import '../../styles/Input.css';

export const TextArea = forwardRef(({
  label,
  error,
  id,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`form-input form-textarea ${error ? 'form-input-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
});

TextArea.displayName = 'TextArea';
