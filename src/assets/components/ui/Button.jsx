import React from "react";

const Button = ({ label, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;
