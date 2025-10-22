// src/hooks/useCampaigns.ts

import { useState } from 'react';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign } from '../../types/campaign.types';
import { ApiResponse } from '../../types/api.types';


export const useJoinCampaign = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<ApiResponse<Campaign[]>>();


    const joinCampaign = async (campaignId: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await campaignsService.join(campaignId);
            await setResponse(res);

        } catch (err: any) {
            setError(err.message || 'Error joining campaign');
        } finally {
            setLoading(false);
        }
    };

    return {
        response,
        loading,
        error,
        joinCampaign,
    };
};
