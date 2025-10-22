// src/components/agent/buttons/ContentBlock.tsx
import React, { ReactNode } from 'react';

interface ContentBlockProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  titleClassName?: string;
  subTitleClassName?: string;
}

/**
 * Base block component
 * Pure UI component with no business logic
 */
const ContentBlock: React.FC<ContentBlockProps> = ({ 
  children,
  onClick,
  className = '',
  title = '',
  subtitle = '',
  isLoading = false,
  titleClassName = '',
  subTitleClassName = ''
}) => {

  return (
    <div className={`p-4 rounded-lg bg-[#3e2b56] ${className}`} onClick={onClick}>
      <div className="w-full flex flex-col justify-between items-left mb-6">
        <h3 className={`text-xl font-afacad uppercase font-bold flex flex-row gap-2 items-center ${titleClassName}`}>
          <span>{title}</span>
          {isLoading ? 'loading' : ''}
        </h3>
        <p className={`text-xs ${subTitleClassName}`}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default ContentBlock;
