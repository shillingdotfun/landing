// src/hooks/useCampaignDetail.ts

import { useState, useEffect } from 'react';
import { Activity } from '../../types/activity.types';
import { activityService } from '../../services/activity.service';
import { campaignsService } from '../../services/campaigns.service';
import { Campaign } from '../../types/campaign.types';

interface Participant {
  id: string;
  kolId: string;
  username: string;
  joinedAt: string;
  totalTweets: number;
  engagementScore: number;
  earnedAmount: number;
}

export const useCampaignDetail = (campaignId: string) => {
  const [campaign, setCampaign] = useState<Campaign>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaignData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaign details
      const campaignResponse = await campaignsService.getById(campaignId);
      setCampaign(campaignResponse.data);
      
      // Fetch participants
      const participantsResponse = await campaignsService.getParticipants(campaignId); // TODO: Extract
      setParticipants(participantsResponse.data ?? []);
      
      // Fetch activities
      const activitiesResponse = await activityService.getStream({ campaignId, perPage: 20 }); // TODO: Extract
      setActivities(activitiesResponse.data ?? []);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error loading campaign');
    } finally {
      setLoading(false);
    }
  };

  return {
    campaign,
    participants,
    activities,
    loading,
    error,
    refetch: fetchCampaignData,
  };
};