import React from 'react';
import './Button.css';

const Button = ({ type = 'button', label, className = '', onClick }) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
