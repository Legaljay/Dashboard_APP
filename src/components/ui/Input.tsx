import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {label}
        </label>
      )}
      <input
        className={`
          block
          w-full
          rounded-md
          border-secondary-300
          dark:border-secondary-700
          shadow-sm
          bg-white
          dark:bg-secondary-800
          text-secondary-900
          dark:text-secondary-100
          focus:border-primary-500
          focus:ring-primary-500
          sm:text-sm
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-colors
          duration-200
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
};
