// src/types/campaign.types.ts

export enum CampaignType {
  COMMUNITY = 'community',
  KOL_EXCLUSIVE = 'kol_exclusive'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export interface Campaign {
  id: string;
  campaignName: string;
  campaignDescription?: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // Budget
  budget: number;
  distributedAmount: number;
  
  // Requirements
  minKarma?: number;
  maxParticipants?: number;
  
  // Tracking
  keywords: string[];
  mentionAccount?: string;
  
  // Metrics
  totalTweets: number;
  totalEngagement: number;
  totalImpressions: number;
  participantsCount: number;
  
  // Dates
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  
  // Computed
  remainingTime?: string;
  progressPercentage?: number;
  averageReward?: number;
}

export interface CreateCampaignDTO {
  campaignName: string;
  campaignDescription?: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  type: CampaignType;
  budget?: number;
  keywords: string[];
  mentionAccount?: string;
  minKarma?: number;
  maxParticipants?: number;
  startsAt: string;
  endsAt: string;
}
