// src/types/activity.types.ts

export enum ActivityType {
  NEW_CAMPAIGN = 'new_campaign',
  TWEET = 'tweet',
  RETWEET = 'retweet',
  QUOTE = 'quote',
  REPLY = 'reply',
  LIKE = 'like',
  MILESTONE = 'milestone'
}

export interface Activity {
  id: string;
  type: ActivityType;
  campaignId: string;
  campaignName: string;
  kolId?: string;
  kolUsername?: string;
  
  // Content
  description: string;
  tweetId?: string;
  content?: string;
  
  // Metrics
  stats?: {
    likes?: number;
    retweets?: number;
    replies?: number;
    impressions?: number;
    earned?: number;
  };
  
  // Timestamps
  timestamp: string;
  createdAt: string;
}
