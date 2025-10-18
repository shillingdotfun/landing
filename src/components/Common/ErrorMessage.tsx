// src/components/common/ErrorMessage.tsx

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500 p-6 text-center">
      <p className="text-[10px] text-red-400" >
        ⚠️ {message}
      </p>
    </div>
  );
};
