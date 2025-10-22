// src/components/campaigns/CampaignGrid.tsx

import React, { useEffect, useState } from 'react';
import { useCampaigns } from '../../hooks/campaign/useCampaigns';
import { CampaignCard } from './CampaignCard';
import { ErrorMessage } from '../Common/ErrorMessage';
import { Spinner } from '../Common/Spinner';
import { Campaign } from '../../types/campaign.types';

interface CampaignGridProps {
  limit?: number;
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({ limit = 4 }) => {
  const { response, loading, error } = useCampaigns();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    if (response?.success && response.data) {
      setCampaigns(response.data)
    }
  }, [response])

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
      {displayCampaigns.map((campaign: Campaign) => (
        <CampaignCard 
          key={campaign.id} 
          campaign={campaign}
        />
      ))}
    </div>
  );
};
