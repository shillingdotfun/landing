// src/components/Campaign/CampaignStats.tsx

import React from 'react';
import { formatTimeRemaining, formatCurrency } from '../../utils/formatters';

interface CampaignStatsProps {
  isCommunity: boolean;
  alreadyFunded: number;
  budget: number;
  participantCount: number;
  distributedAmount: number;
  endsAt: string;
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({
  isCommunity,
  alreadyFunded,
  budget,
  participantCount,
  distributedAmount,
  endsAt,
}) => {
  return (
    <div className="grid grid-cols-4 gap-6 w-full mb-4">
      <div>
        <div className="text-xs mb-2">
          {isCommunity ? 'POOL' : 'BUDGET'}
        </div>
        <div className="text-xl text-indigo-400">
          {alreadyFunded.toFixed(2)}/{formatCurrency(budget, 'SOL')}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase mb-2">
          Participants
        </div>
        <div className="text-xl text-indigo-400">
          {participantCount}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase mb-2">
          Time Remaining
        </div>
        <div className="text-xl text-indigo-400">
          {formatTimeRemaining(endsAt)}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase mb-2">
          Rewards distributed
        </div>
        <div className="text-xl text-emerald-400">
          {formatCurrency(distributedAmount, 'SOL')}
        </div>
      </div>
    </div>
  );
};
