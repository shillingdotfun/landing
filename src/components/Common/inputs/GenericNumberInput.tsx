import React, { forwardRef, useEffect, useState, useMemo } from 'react';
import ErrorPill from './ErrorPill';

export interface GenericNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  name?: string;
  min?: number;
  max?:number;
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}

const GenericNumberInput = forwardRef<HTMLInputElement, GenericNumberInputProps>(({
  value,
  min,
  max,
  step,
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
  ...props
}, ref) => {

  // ============================================================================
  // STATE & EFFECTS
  // ============================================================================

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  // Validation logic
  useEffect(() => {
    //const isEmpty = value === undefined || value === null;
    //const isZero = value === 0;
    
    // For number inputs, we consider it empty if it's undefined/null
    // Zero is a valid value, so we don't treat it as empty
    const shouldBeInvalid = hasError /*&|| (required & isEmpty && !isZero)*/;
    setIsInvalid(shouldBeInvalid);
  }, [hasError, required, value]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasErrors = useMemo(() => errorMessages.length > 0, [errorMessages]);
  
  const inputClasses = useMemo(() => {
    const baseClasses = [
      'rounded-lg',
      'bg-purple-100',
      'resize-none',
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
      disabled ? 'bg-slate-300 text-gray-500 !cursor-not-allowed' : '',
      
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
        type="number"
        value={value ?? ''}
        name={name}
        id={name}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        inputMode='decimal'
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
GenericNumberInput.displayName = 'GenericNumberInput';

export default GenericNumberInput;