// src/components/common/Loader.tsx
import React, { useState, useEffect } from 'react';

interface LoaderProps {
  loadingText?: string;
  className?: string;
  showDots?: boolean;
}

/**
 * Loader component
 */
const Loader: React.FC<LoaderProps> = ({ 
  loadingText,
  className = '',
  showDots = true
}) => {
  const [dotCount, setDotCount] = useState(1);
  const [increasing, setIncreasing] = useState(true);

  useEffect(() => {
    if (!showDots || !loadingText) return;

    const interval = setInterval(() => {
      setDotCount(prev => {
        if (increasing) {
          if (prev >= 3) {
            setIncreasing(false);
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev <= 1) {
            setIncreasing(true);
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 400); // Cambia cada 400ms

    return () => clearInterval(interval);
  }, [increasing, showDots, loadingText]);

  return (
    <div className='flex flex-row items-center justify-center absolute top-0 left-0 z-100 h-full w-full' style={{'background': 'rgba(0, 0, 0, 0.3)'}}>
      <div className={`flex flex-row items-center p-4 gap-2 shadow-lg bg-white rounded ${className}`}>
        {loadingText && (
          <span className='font-anek-latin uppercase'>
            {loadingText}
            {showDots && (
              <span className='inline-block w-6 text-left'>
                {'.'.repeat(dotCount)}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Loader;