import React, { forwardRef, useEffect, useState, useMemo } from 'react';
import ErrorPill from './ErrorPill';

export interface GenericTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  name?: string;
  containerClassName?: string;
}

const GenericTextArea = forwardRef<HTMLTextAreaElement, GenericTextAreaProps>(({
  value = '',
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
  rows = 4,
  maxLength,
  showCharCount = false,
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
    const isEmpty = !value || value.trim() === '';
    const shouldBeInvalid = hasError || (required && isEmpty);
    setIsInvalid(shouldBeInvalid);
  }, [hasError, required, value]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasErrors = useMemo(() => errorMessages.length > 0, [errorMessages]);
  
  const currentLength = useMemo(() => value.length, [value]);
  
  const characterCountInfo = useMemo(() => {
    if (!showCharCount || !maxLength) return null;
    
    const isNearLimit = currentLength > maxLength * 0.8;
    const isAtLimit = currentLength >= maxLength;
    
    return {
      isNearLimit,
      isAtLimit,
      display: `${currentLength}/${maxLength}`
    };
  }, [showCharCount, maxLength, currentLength]);

  const textareaClasses = useMemo(() => {
    const baseClasses = [
      'bg-input-light',
      'rounded-md',
      'resize-none',
      'placeholder:text-gray-400 placeholder:font-light placeholder:font-anek-latin placeholder:text-sm',
      'w-full px-4 py-2.5'
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
      <label htmlFor={name} className="block items-center flex flex-row mb-1 text-white">
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
        <div className="absolute top-2 left-2 pointer-events-none">
          {iconSource}
        </div>
      )}
      
      {/* Error icon */}
      {isInvalid && (
        <div className="absolute top-2 right-2 pointer-events-none">
          <span className="fa fa-warning text-red-500" />
        </div>
      )}
    </>
  );

  const renderCharacterCount = () => {
    if (!characterCountInfo) return null;

    const { isAtLimit, isNearLimit, display } = characterCountInfo;
    
    const countClasses = [
      'text-xs mt-1 text-right',
      isAtLimit ? 'text-red-500' : 
      isNearLimit ? 'text-palette-primary' : 
      'text-gray-500'
    ].join(' ');

    return (
      <div className={countClasses}>
        {display}
      </div>
    );
  };

  const renderTextarea = () => (
    <div className="relative">
      {renderIcons()}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        name={name}
        id={name}
        className={textareaClasses}
        {...props}
      />
      {renderCharacterCount()}
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
      
      {/* Error messages above textarea (if errorPosition is true) */}
      {errorPosition && (
        <div className="mb-1">
          {renderErrorMessages()}
        </div>
      )}
      
      {/* Textarea field */}
      {renderTextarea()}
      
      {/* Error messages below textarea (default position) */}
      {!errorPosition && renderErrorMessages()}
    </div>
  );
});

// Set display name for debugging
GenericTextArea.displayName = 'GenericTextArea';

export default GenericTextArea;