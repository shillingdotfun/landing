// src/components/campaigns/CampaignCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Campaign } from '../../types/campaign.types';

import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';

import Button from '../Common/Button';
import ContentBlock from '../Common/layouts/ContentBlock';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleJoin = async () => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const isCommunity = campaign.type.name === 'community';

  return (
    <ContentBlock
      onClick={handleCardClick} 
      title={campaign.campaignName} 
      subtitle={campaign.type.name === 'community' ? 'Community' : 'KOL Exclusive'} 
      className="border border-transparent hover:border-purple-100 transition-all hover:-translate-y-1 cursor-pointer"
    >
      <div className="grid grid-cols-3 gap-2 my-2 p-2 bg-purple-100 text-[#3e2b56] rounded">
        <div className="flex flex-col gap-1">
          <div className="text-xs" >
            {isCommunity ? 'POOL' : 'BUDGET'}
          </div>
          <div className="text-sm text-green-600 font-bold" >
            {formatCurrency(campaign.budget)}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs">
            ENDS IN
          </div>
          <div className="text-sm">
            {formatTimeRemaining(campaign.endsAt)}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs" >
            {isCommunity ? 'AVG REWARD' : 'SPOTS'}
          </div>
          <div className="text-sm text-green-600 font-bold" >
            {isCommunity 
              ? `${formatCurrency(campaign.budget / campaign.participantsCount)} SOL` 
              : `${campaign.participantsCount}/${campaign.maxParticipants}`
            }
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-[#2a2a35]">
        <span className="text-xs" >
          {isCommunity 
            ? `${campaign.participantsCount} Shillers`
            : 'VERIFIED KOLS ONLY'
          }
        </span>
        <Button
          onClick={handleJoin}
          label={'Join'}
        />
      </div>
    </ContentBlock>
  );
};
