import React from 'react';

/**
 * Reusable Button.
 *
 * variant: 'primary' | 'secondary' | 'outline'
 * fullWidth: stretches the button to its container's width
 * All other native <button> props (type, onClick, disabled...) pass through.
 */
function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  const variantClass = `btn--${variant}`;
  const widthClass = fullWidth ? 'btn--full' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${widthClass} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
