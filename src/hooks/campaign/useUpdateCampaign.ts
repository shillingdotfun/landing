// src/hooks/useUpdateCampaign.ts

import { useState } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign, UpdateCampaignDTO } from '../../types/campaign.types';
import { ApiResponse } from '../../types/api.types';
import { CAMPAIGN_CONSTANTS } from '../../utils/constants';

export const useUpdateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse<Campaign>>();

  const updateCampaign = async (id: string, data: UpdateCampaignDTO): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await campaignsService.update(id, data);
      setResponse(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update campaign';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInitialFormData = (): UpdateCampaignDTO => ({
    id: '',
    campaignName: '',
    campaignDescription: undefined,
    tokenSymbol: '',
    tokenContractAddress: undefined,
    campaignType: 'community',
    budget: 0,
    maxParticipants: 0,
    keywords: [],
    mentionAccount: undefined,
    startsAt: new Date().toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + CAMPAIGN_CONSTANTS.DEFAULT_CAMPAIGN_DURATION_DAYS * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
  });

  return {
    handler: updateCampaign,
    initialFormDataHandler: getInitialFormData, 
    loading,
    error,
    response,
  };
};