// src/hooks/useCreateCampaign.ts

import { useState } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { CreateCampaignDTO, Campaign } from '../../types/campaign.types';

export const useCreateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async (data: CreateCampaignDTO): Promise<{ 
    success: boolean; 
    campaign?: Campaign; 
    error?: string 
  }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await campaignsService.create(data);
      
      return { 
        success: true, 
        campaign: response.data 
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create campaign';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    loading,
    error,
  };
};