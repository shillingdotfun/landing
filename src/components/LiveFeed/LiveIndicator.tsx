// src/components/activity/LiveIndicator.tsx

import React from 'react';

export const LiveIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      <span className="text-[7px] text-gray-500" >
        LIVE
      </span>
    </div>
  );
};
