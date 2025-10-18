// src/components/kols/KOLMiniCard.tsx

import React from 'react';
import { KOL } from '../../types/kol.types';
import { formatNumber } from '../../utils/formatters';


interface KOLMiniCardProps {
  kol: KOL;
}

export const KOLMiniCard: React.FC<KOLMiniCardProps> = ({ kol }) => {
  return (
    <div 
      className="flex items-center gap-3 p-3 bg-indigo-500/5 transition-all hover:bg-indigo-500/10 cursor-pointer"
      onClick={() => window.location.href = `/kols/${kol.username}`}
    >
      <div className={`text-[11px] ${kol.rank && kol.rank <= 3 ? 'text-amber-500' : 'text-gray-500'} min-w-[25px]`} >
        #{kol.rank}
      </div>
      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0" style={{ imageRendering: 'pixelated' }} />
      <div className="flex-1">
        <div className="text-[8px] text-gray-200 mb-1" >
          {kol.username.toUpperCase()}
        </div>
        <div className="text-[7px] text-indigo-500" >
          {formatNumber(kol.karmaPoints)} KARMA
        </div>
      </div>
    </div>
  );
};
