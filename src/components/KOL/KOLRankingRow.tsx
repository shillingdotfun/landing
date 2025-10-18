// src/components/kols/KOLRankingRow.tsx

import React from 'react';
import { FaFire } from "react-icons/fa6";

import { getSuccessRateColor } from '../../utils/constants';
import { formatNumber, formatCurrency, formatPercentage } from '../../utils/formatters';

import { KOL } from '../../types/kol.types';

interface KOLRankingRowProps {
  kol: KOL;
}

export const KOLRankingRow: React.FC<KOLRankingRowProps> = ({ kol }) => {
  const successRateColor = getSuccessRateColor(kol.successRate);

  return (
    <div 
      className="grid grid-cols-[80px_1fr_100px_100px_100px_100px_110px_110px_100px] gap-3 px-6 py-5 items-center border-b border-[#2a2a35] transition-all hover:bg-indigo-500/5 cursor-pointer"
      onClick={() => window.location.href = `/kols/${kol.username}`}
    >
      <div className="flex justify-center">
        <span className={`text-base ${kol.rank && kol.rank <= 3 ? 'text-amber-500' : 'text-gray-500'}`} >
          #{kol.rank}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0" 
          style={{ imageRendering: 'pixelated' }} 
        />
        <div>
          <div className="text-[11px] text-gray-200 mb-1" >
            {kol.username.toUpperCase()}
          </div>
          <div className="text-[7px] text-gray-500" >
            LEVEL {kol.level} {kol.verified && '· VERIFIED'}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] text-gray-400" >
          {formatNumber(kol.karmaPoints)}
        </span>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] text-gray-400" >
          {kol.totalCampaigns}
        </span>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] text-gray-400" >
          {formatNumber(kol.totalReach)}
        </span>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] text-gray-400" >
          {formatCurrency(kol.totalEarnings)}
        </span>
      </div>

      <div className="flex justify-center">
        <span className={`text-[11px] ${successRateColor}`} >
          {formatPercentage(kol.successRate, 0)}
        </span>
      </div>

      <div className="flex justify-center">
        <span className="text-[11px] text-gray-400" >
          {formatPercentage(kol.averageEngagement)}
        </span>
      </div>

      <div className="flex justify-center">
        <span className={`text-[11px] ${kol.currentStreak > 5 ? 'text-amber-500' : 'text-gray-400'}`} >
          {kol.currentStreak > 5 ? (
            <span className='flex flex-row items-center gap-1'>
              {kol.currentStreak} <FaFire/>
            </span>
          ) : (
            kol.currentStreak
          )}
        </span>
      </div>
    </div>
  );
};
