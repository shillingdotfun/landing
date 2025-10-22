// src/hooks/useCampaigns.ts

import { useState, useEffect } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign } from '../../types/campaign.types';
import { ApiResponse } from '../../types/api.types';


export const useCampaigns = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse<Campaign[]>>();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await campaignsService.getActive();
      setResponse(response);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    error,
    refetch: fetchCampaigns,
  };
};
