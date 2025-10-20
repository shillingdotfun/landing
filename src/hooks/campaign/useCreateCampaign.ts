// src/hooks/useCreateCampaign.ts

import { useState } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign, CreateCampaignDTO } from '../../types/campaign.types';
import { ApiResponse } from '../../types/api.types';

export const useCreateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse<Campaign>>();

  const createCampaign = async (data: CreateCampaignDTO): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await campaignsService.create(data);
      setResponse(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create campaign';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    loading,
    error,
    response,
  };
};