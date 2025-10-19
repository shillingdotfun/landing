import React, { forwardRef } from 'react';
import ErrorPill from './ErrorPill';

// Props interface for the checkbox component
export interface GenericCheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hasError?: boolean;
  errorMessages?: Array<string>;
  customLabel?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  errorPosition?: boolean;
  switchSize?: 'small' | 'medium' | 'large'; // New prop for switch size
}

const GenericCheckboxInput = forwardRef<HTMLInputElement, GenericCheckboxInputProps>(({
  checked = false,
  onChange,
  label,
  hasError,
  errorMessages = [],
  customLabel,
  disabled,
  required = false,
  name,
  className,
  errorPosition = false,
  switchSize = 'medium',
  ...props
}, ref) => {
  
  // Size configuration for the switch
  const sizeConfig = {
    small: {
      switch: 'w-8 h-4',
      toggle: 'after:h-3 after:w-3 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-4'
    },
    medium: {
      switch: 'w-11 h-6',
      toggle: 'after:h-5 after:w-5 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-5'
    },
    large: {
      switch: 'w-14 h-7',
      toggle: 'after:h-6 after:w-6 after:top-[2px] after:left-[2px] peer-checked:after:translate-x-7'
    }
  };

  const currentSize = sizeConfig[switchSize];
  
  // Function to render label with required asterisk
  const renderLabel = () => {
    if (customLabel) {
      return customLabel;
    }
    if (label) {
      return (
        <span className="font-afacad font-semibold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      );
    }
    return null;
  };

  // Error messages rendering in "pill" style
  const renderErrorPills = () => {
    if (errorMessages.length > 0) {
      return (
        <div className="mt-1">
          {errorMessages.map((error, index) => (
            <ErrorPill key={index}>{error}</ErrorPill>
          ))}
        </div>
      );
    }
    return null;
  };

  // To maintain consistency with "required field" logic in other inputs
  const isInvalid = hasError || (required && !checked);

  return (
    <div className={`w-full mb-4 ${className}`}>
      {/* Errors above if errorPosition is true */}
      {errorPosition && (
        <div className="mb-1">
          {renderErrorPills()}
        </div>
      )}

      {/* Main switch container */}
      <div className="flex items-center gap-2">
        {/* Label on the left side */}
        {renderLabel()}
        
        {/* Switch Component */}
        <label className="relative inline-flex items-center cursor-pointer m-0 rounded-full text-white">
          <input
            ref={ref}
            id={name ?? ''}
            name={name}
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            {...props}
          />
          <div className={`
            ${currentSize.switch}
            ${isInvalid 
              ? 'bg-red-200 peer-checked:bg-red-500' 
              : 'bg-gray-200 peer-checked:bg-green-500'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-100' 
              : 'peer-focus:outline-none'
            }
            rounded-full peer 
            ${currentSize.toggle}
            peer-checked:after:border-white 
            after:content-[''] 
            after:absolute 
            after:bg-white 
            after:border-gray-300 
            after:border 
            after:rounded-full 
            after:transition-all
            transition-colors duration-200
          `}></div>
        </label>
      </div>

      {/* Errors below if errorPosition is false (default) */}
      {!errorPosition && renderErrorPills()}
    </div>
  );
});

export default GenericCheckboxInput;