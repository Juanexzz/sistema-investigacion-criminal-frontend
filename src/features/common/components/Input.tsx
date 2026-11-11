'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', showPasswordToggle = true, type, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || props.name || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const hasToggle = isPassword && showPasswordToggle;
    const effectiveType = hasToggle ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono tracking-wider text-papel-dark uppercase font-semibold"
          >
            {label}
            {props.required && <span className="text-evidencia ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full px-3 py-2 bg-grafito-dark border font-sans text-sm text-papel placeholder-papel-muted/60 transition-colors focus:outline-none focus:ring-1 ${
              error
                ? 'border-evidencia focus:border-evidencia focus:ring-evidencia'
                : 'border-grafito-light focus:border-alerta focus:ring-alerta'
            } disabled:opacity-50 disabled:cursor-not-allowed ${hasToggle ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {hasToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-papel-muted hover:text-papel transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-alerta cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="text-xs text-papel-muted font-sans">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-evidencia font-mono font-medium">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
