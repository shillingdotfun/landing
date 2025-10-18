// src/hooks/useCampaigns.ts

import { useState, useEffect } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign } from '../../types/campaign.types';


export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignsService.getActive();
      setCampaigns(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId: string) => {
    try {
      await campaignsService.join(campaignId);
      // Refresh campaigns
      await fetchCampaigns();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    joinCampaign,
  };
};
