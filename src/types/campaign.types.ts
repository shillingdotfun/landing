// src/types/campaign.types.ts

import { User } from "./user.types";

export interface CampaignType {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFunding {
  id: string;
  amountPaid: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export interface Participant extends User {
  joinedAt: string;
  totalTweets: number;
  engagementScore: number;
  earnedAmount: number;
}

export interface Campaign {
  id: string;
  campaignName: string;
  campaignCreatorUser: User;
  campaignDescription?: string;
  tokenContractAddress?: string;
  tokenSymbol: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // Budget
  budget: number;
  distributedAmount: number;
  funding: CampaignFunding[]
  
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
  participants: Participant[],
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
  tokenContractAddress?: string;
  tokenSymbol: string;
  campaignType: string;
  budget: number;
  keywords: string[];
  mentionAccount?: string;
  minKarma?: number;
  maxParticipants?: number;
  startsAt: string;
  endsAt: string;
}

export interface UpdateCampaignDTO {
  id: string;
  campaignName: string;
  campaignDescription?: string;
  tokenContractAddress?: string;
  tokenSymbol: string;
  campaignType: string;
  budget: number;
  keywords: string[];
  mentionAccount?: string;
  minKarma?: number;
  maxParticipants?: number;
  startsAt: string;
  endsAt: string;
}
