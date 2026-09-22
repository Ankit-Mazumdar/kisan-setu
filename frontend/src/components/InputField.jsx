import React from 'react';

/**
 * Reusable form input with label, error message, and required indicator.
 * Used across FarmerRegister and FarmerLogin so form styling stays consistent.
 */
function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
}) {
  const inputId = `field-${name}`;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-input--error' : ''}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className="form-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default InputField;
