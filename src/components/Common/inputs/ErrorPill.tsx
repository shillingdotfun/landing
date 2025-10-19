import React from 'react';


export interface ErrorPillProps {
  children: React.ReactNode;
  className?: string;
}

const ErrorPill: React.FC<ErrorPillProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`text-sm text-red-500 mt-1 ${className}`}>
    {children}
  </div>
);

// Set display name for debugging
ErrorPill.displayName = 'ErrorPill';

export default ErrorPill;