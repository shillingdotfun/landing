import React, { forwardRef, useEffect, useState, useMemo } from 'react';
import ErrorPill from './ErrorPill';

export interface GenericDateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string; // ISO string format from Laravel (e.g., "2024-01-15T14:30:00.000Z")
  name?: string;
  onChange?: (isoString: string) => void; // Returns ISO string for Laravel
  placeholder?: string;
  iconSource?: React.ReactNode;
  label?: string;
  hasError?: boolean;
  errorMessages?: Array<string>;
  customLabel?: React.ReactNode;
  plain?: boolean;
  disabled?: boolean;
  errorPosition?: boolean;
  required?: boolean;
  containerClassName?: string;
  minDate?: string; // ISO string
  maxDate?: string; // ISO string
}

const GenericDateInput = forwardRef<HTMLInputElement, GenericDateInputProps>(({
  value,
  onChange,
  placeholder,
  iconSource,
  label,
  hasError = false,
  errorMessages = [],
  customLabel,
  plain = false,
  disabled = false,
  errorPosition = false,
  required = false,
  className = '',
  name,
  containerClassName = '',
  minDate,
  maxDate,
  ...props
}, ref) => {

  // ============================================================================
  // STATE & EFFECTS
  // ============================================================================

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  // Validation logic
  useEffect(() => {
    const isEmpty = !value || value === '';
    const shouldBeInvalid = hasError || (required && isEmpty);
    setIsInvalid(shouldBeInvalid);
  }, [hasError, required, value]);

  // ============================================================================
  // DATE CONVERSION HELPERS
  // ============================================================================

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
  const toDatetimeLocal = (isoString?: string): string => {
    if (!isoString) return '';
    
    try {
      const date = new Date(isoString);
      // Format to YYYY-MM-DDTHH:MM (datetime-local format)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  };

  // Convert datetime-local format to ISO string for Laravel
  const toISOString = (datetimeLocal: string): string => {
    if (!datetimeLocal) return '';
    
    try {
      // datetime-local format: YYYY-MM-DDTHH:MM
      // We need to add seconds and convert to ISO
      const date = new Date(datetimeLocal);
      return date.toISOString();
    } catch (error) {
      console.error('Error converting to ISO:', error);
      return '';
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const datetimeLocalValue = e.target.value;
    if (onChange) {
      const isoString = toISOString(datetimeLocalValue);
      onChange(isoString);
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasErrors = useMemo(() => errorMessages.length > 0, [errorMessages]);
  
  const inputClasses = useMemo(() => {
    const baseClasses = [
      'rounded-lg',
      'resize-none',
      'bg-purple-100',
      'text-[#3e2b56]',
      'placeholder:text-gray-400 placeholder:font-light placeholder:text-sm',
      'w-full px-4 py-2'
    ];

    const conditionalClasses = [
      // Validation styling
      isInvalid 
        ? '!bg-red-100 placeholder:text-red-400 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      
      // Icon spacing
      iconSource ? 'pl-10' : '',
      
      // Disabled state
      disabled ? 'bg-slate-100 text-gray-500 cursor-not-allowed' : '',
      
      // Border and shadow
      plain ? '' : 'border shadow-md',
      
      // Custom classes
      className
    ];

    return [...baseClasses, ...conditionalClasses]
      .filter(Boolean)
      .join(' ');
  }, [isInvalid, iconSource, disabled, plain, className]);

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderLabel = () => {
    if (customLabel) return customLabel;
    
    if (!label) return null;

    return (
      <label htmlFor={name ?? ''} className="block items-center flex flex-row mb-1 text-sm">
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  };

  const renderErrorMessages = () => {
    if (!hasErrors) return null;

    return (
      <div className="flex flex-col">
        {errorMessages.map((error, index) => (
          <ErrorPill key={index}>{error}</ErrorPill>
        ))}
      </div>
    );
  };

  const renderIcons = () => (
    <>
      {/* Left icon */}
      {iconSource && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {iconSource}
        </div>
      )}
      
      {/* Error icon */}
      {isInvalid && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="fa fa-warning text-red-500" />
        </div>
      )}
    </>
  );

  const renderInput = () => (
    <div className="relative">
      {renderIcons()}
      <input
        ref={ref}
        type="datetime-local"
        value={toDatetimeLocal(value)}
        name={name}
        id={name}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={toDatetimeLocal(minDate)}
        max={toDatetimeLocal(maxDate)}
        className={inputClasses}
        {...props}
      />
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={`w-full mb-4 ${containerClassName}`}>
      {/* Label section */}
      {(label || customLabel) && (
        <div className="flex flex-row justify-between items-center">
          {renderLabel()}
        </div>
      )}
      
      {/* Error messages above input (if errorPosition is true) */}
      {errorPosition && (
        <div className="mb-1">
          {renderErrorMessages()}
        </div>
      )}
      
      {/* Input field */}
      {renderInput()}
      
      {/* Error messages below input (default position) */}
      {!errorPosition && renderErrorMessages()}
    </div>
  );
});

// Set display name for debugging
GenericDateInput.displayName = 'GenericDateInput';

export default GenericDateInput;