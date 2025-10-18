// src/components/campaigns/CampaignGrid.tsx

import React from 'react';
import { useCampaigns } from '../../hooks/campaign/useCampaigns';
import { CampaignCard } from './CampaignCard';
import { ErrorMessage } from '../Common/ErrorMessage';
import { Spinner } from '../Common/Spinner';

interface CampaignGridProps {
  limit?: number;
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({ limit = 4 }) => {
  const { campaigns, loading, error, joinCampaign } = useCampaigns();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const displayCampaigns = campaigns.slice(0, limit);

  return (
    <div className="grid grid-cols-3 gap-5">
      {displayCampaigns.map(campaign => (
        <CampaignCard 
          key={campaign.id} 
          campaign={campaign}
          onJoin={joinCampaign}
        />
      ))}
    </div>
  );
};
