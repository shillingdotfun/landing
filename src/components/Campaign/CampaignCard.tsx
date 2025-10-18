// src/components/campaigns/CampaignCard.tsx

import React, { useState } from 'react';
import { Campaign } from '../../types/campaign.types';
import { getRandomGradient } from '../../utils/constants';
import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import { useToasts } from '../../hooks/useToast';


interface CampaignCardProps {
  campaign: Campaign;
  onJoin: (campaignId: string) => Promise<{ success: boolean; error?: string }>;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onJoin }) => {
  const { addNotification } = useToasts();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleCardClick = () => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleJoin = async () => {
    setIsJoining(true);
    const result = await onJoin(campaign.id);
    setIsJoining(false);
    
    if (result.success) {
      setJoined(true);
      setTimeout(() => setJoined(false), 3000);
    } else {
      addNotification(result.error || 'Failed to join campaign', 'error');
    }
  };

  const gradient = getRandomGradient();
  const isCommunity = campaign.type === 'community';

  return (
    <div onClick={handleCardClick} className="bg-[#14141f] border border-[#2a2a35] p-6 transition-all hover:border-indigo-500 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 ${gradient}`} style={{ imageRendering: 'pixelated' }} />
        <div>
          <h3 className="text-[13px] text-gray-200 mb-2" >
            {campaign.projectName}
          </h3>
          <p className="text-[8px] text-gray-500" >
            {campaign.type === 'community' ? 'COMMUNITY' : 'KOL EXCLUSIVE'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 my-5 p-4 bg-indigo-500/5 border border-[#2a2a35]">
        <div className="flex flex-col gap-1">
          <div className="text-[7px] text-gray-500" >
            {isCommunity ? 'POOL' : 'BUDGET'}
          </div>
          <div className="text-[12px] text-gray-200" >
            {formatCurrency(campaign.budget)}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[7px] text-gray-500" >
            ENDS IN
          </div>
          <div className="text-[12px] text-gray-200" >
            {formatTimeRemaining(campaign.endsAt)}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[7px] text-gray-500" >
            {isCommunity ? 'ENGAGEMENT' : 'MIN KARMA'}
          </div>
          <div className="text-[12px] text-gray-200" >
            {isCommunity ? formatCurrency(campaign.totalEngagement) : campaign.minKarma?.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[7px] text-gray-500" >
            {isCommunity ? 'AVG REWARD' : 'SPOTS'}
          </div>
          <div className="text-[12px] text-gray-200" >
            {isCommunity 
              ? formatCurrency(campaign.averageReward || 0)
              : `${campaign.participantsCount}/${campaign.maxParticipants}`
            }
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2a35]">
        <span className="text-[8px] text-gray-500" >
          {isCommunity 
            ? `${campaign.participantsCount} PARTICIPANTS`
            : 'VERIFIED KOLS ONLY'
          }
        </span>
        <Button
          onClick={handleJoin}
          disabled={isJoining || joined}
          label={joined ? 'JOINED!' : isJoining ? 'JOINING...' : isCommunity ? 'JOIN' : 'APPLY'}
        />
      </div>
    </div>
  );
};
