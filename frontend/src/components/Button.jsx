import React from 'react';

const Button = ({ children, onClick, disabled, className = '', variant = 'primary', type = 'button' }) => {
  const variantClass = `btn-${variant}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;