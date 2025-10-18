// src/components/agent/buttons/Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  label?: string;
  icon?: string | ReactNode;
  disabled?: boolean;
  className?: string;
  blinker?: boolean;
  isActive?: boolean;
}

/**
 * Base button component for agent actions
 * Pure UI component with no business logic
 */
const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  label, 
  icon,
  disabled = false,
  className = '',
  blinker = false,
  isActive = false,
}) => {
  const buttonClass = 'flex flex-row py-2 sm:px-5 px-4 gap-4 font-anek-latin uppercase text-xs justify-start items-center rounded-sm transition-colors bg-black relative shadow-xl';
  const isActiveClasses = 'bg-palette-primary !text-black';

  return (
    <button 
      className={`${buttonClass} ${disabled ? 'opacity-60 bg-slate-400 text-black cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-purple-600 text-white'} ${isActive ? isActiveClasses : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && typeof icon === 'string' && <i className={`fa-solid ${icon} min-w-[15px]`}></i>}
      {icon && typeof icon === 'object' && icon}
      {label && <span>{label}</span>}
      {blinker && 
        <span className="flex absolute rounded-full w-4 h-4 -top-2 -left-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      }
    </button>
  );
};

export default Button;
