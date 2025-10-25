// src/hooks/useCampaigns.ts

import { useState, useEffect } from 'react';

import { campaignsService } from '../../services/campaigns.service';

import { Campaign } from '../../types/campaign.types';
import { ApiResponse } from '../../types/api.types';

import { useAuth } from '../useAuth';

export const useCampaigns = () => {
  const {isAuthenticated} = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse<Campaign[]>>();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
    } else {
      fetchPublicCampaigns();
    }
  }, [isAuthenticated]);

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

  const fetchPublicCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await campaignsService.getPublicActive();
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
