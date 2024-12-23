import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-secondary-800 shadow-sm rounded-lg p-6 transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
